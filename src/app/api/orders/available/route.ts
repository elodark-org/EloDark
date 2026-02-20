import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";

// GET /api/orders/available — List orders available for boosters to claim
export async function GET(req: NextRequest) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const orders = await sql`
      SELECT o.id, o.service_type, o.config, o.price, o.status, o.created_at,
             u.name as user_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.status = 'available'
      ORDER BY o.created_at ASC
    `;
    return NextResponse.json({ orders });
  } catch (err) {
    logger.error("Erro ao listar pedidos disponíveis", err, {
      userId: user.id,
      role: user.role,
    });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
