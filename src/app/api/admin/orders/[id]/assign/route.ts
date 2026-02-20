import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT /api/admin/orders/:id/assign — Assign booster to order
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const { booster_id } = await req.json();

    if (!booster_id) return NextResponse.json({ error: "booster_id é obrigatório" }, { status: 400 });

    const [booster] = await sql`SELECT id FROM boosters WHERE id = ${booster_id} AND active = true`;
    if (!booster) return NextResponse.json({ error: "Booster não encontrado ou inativo" }, { status: 404 });

    const [order] = await sql`
      UPDATE orders SET
        booster_id = ${booster_id},
        status = 'in_progress',
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Assign order error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
