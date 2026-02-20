import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT /api/orders/:id/status — Booster updates order status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const { status, notes } = await req.json();

    const validStatuses = ["in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status inválido. Booster pode usar: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    if (user.role === "booster") {
      const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
      const [order] = await sql`SELECT booster_id FROM orders WHERE id = ${id}`;
      if (!order || !booster || order.booster_id !== booster.id) {
        return NextResponse.json({ error: "Você não está atribuído a este pedido" }, { status: 403 });
      }
    }

    const [order] = await sql`
      UPDATE orders SET
        status = ${status},
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Update order status error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
