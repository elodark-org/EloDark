import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";

// POST /api/orders/:id/claim — Booster claims an available order
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "booster");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
    }

    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
    if (!booster) return NextResponse.json({ error: "Perfil de booster não encontrado" }, { status: 400 });

    const [order] = await sql`
      UPDATE orders SET
        booster_id = ${booster.id},
        status = 'in_progress',
        updated_at = NOW()
      WHERE id = ${id} AND status = 'available'
      RETURNING *
    `;

    if (!order) {
      return NextResponse.json({ error: "Este pedido não está mais disponível" }, { status: 409 });
    }

    logger.info("Pedido reivindicado por booster", { boosterId: booster.id, orderId: id });
    return NextResponse.json({ order });
  } catch (err) {
    logger.error("Erro ao reivindicar pedido", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
