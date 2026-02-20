import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/orders/available — List orders available for boosters to claim
export async function GET(req: NextRequest) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const orders = await sql`
      SELECT o.id, o.service_type, o.config, o.price, o.created_at,
             u.name as user_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.status = 'available'
      ORDER BY o.created_at ASC
    `;
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Available orders error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
