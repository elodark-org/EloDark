import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// POST /api/orders/:id/claim — Booster claims an available order
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;

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

    console.log(`🎮 Booster #${booster.id} pegou o pedido #${id}`);
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Claim order error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
