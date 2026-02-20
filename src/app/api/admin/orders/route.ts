import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/admin/orders — List all orders
export async function GET(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders;

    if (status) {
      orders = await sql`
        SELECT o.*, u.name as user_name, u.email as user_email,
               b.game_name as booster_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN boosters b ON b.id = o.booster_id
        WHERE o.status = ${status}
        ORDER BY o.created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT o.*, u.name as user_name, u.email as user_email,
               b.game_name as booster_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN boosters b ON b.id = o.booster_id
        ORDER BY o.created_at DESC
      `;
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("List orders error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
