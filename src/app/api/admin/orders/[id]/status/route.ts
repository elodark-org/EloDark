import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parsePositiveInt } from "@/lib/validation";

// PUT /api/admin/orders/:id/status — Update order status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const status = payload.status;

    const validStatuses = ["pending", "active", "available", "in_progress", "completed", "cancelled"];
    if (typeof status !== "string" || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status inválido. Use: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const [order] = await sql`
      UPDATE orders SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    logger.error("Erro admin ao atualizar status do pedido", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
