import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parsePositiveInt } from "@/lib/validation";

// PUT /api/admin/orders/:id/assign — Assign booster to order
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

    const boosterId = parsePositiveInt(payload.booster_id);
    if (!boosterId) {
      return NextResponse.json({ error: "booster_id é obrigatório" }, { status: 400 });
    }

    const [booster] = await sql`SELECT id FROM boosters WHERE id = ${boosterId} AND active = true`;
    if (!booster) return NextResponse.json({ error: "Booster não encontrado ou inativo" }, { status: 404 });

    const [order] = await sql`
      UPDATE orders SET
        booster_id = ${boosterId},
        status = 'in_progress',
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    logger.error("Erro admin ao atribuir booster ao pedido", err, {
      userId: user.id,
    });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
