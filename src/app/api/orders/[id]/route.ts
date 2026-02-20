import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/orders/:id — Get single order
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const [order] = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email,
             b.game_name as booster_name, b.rank as booster_rank
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN boosters b ON b.id = o.booster_id
      WHERE o.id = ${id}
    `;

    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    if (user.role === "user" && order.user_id !== user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    if (user.role === "booster") {
      const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
      if (!booster || order.booster_id !== booster.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
