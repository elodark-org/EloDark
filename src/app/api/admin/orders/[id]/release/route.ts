import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT /api/admin/orders/:id/release — Release order for boosters
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const [order] = await sql`SELECT status FROM orders WHERE id = ${id}`;
    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    if (order.status !== "active") {
      return NextResponse.json({ error: "Só pedidos pagos (active) podem ser liberados para boosters" }, { status: 400 });
    }

    const [updated] = await sql`
      UPDATE orders SET status = 'available', booster_id = NULL, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    console.log(`📢 Pedido #${id} liberado para boosters`);
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error("Release order error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
