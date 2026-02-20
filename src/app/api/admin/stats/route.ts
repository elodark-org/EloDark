import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/admin/stats — Dashboard stats
export async function GET(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const [usersCount] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`;
    const [boostersCount] = await sql`SELECT COUNT(*) as count FROM boosters WHERE active = true`;
    const [ordersCount] = await sql`SELECT COUNT(*) as count FROM orders`;
    const [pendingCount] = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`;
    const [revenue] = await sql`SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE status = 'completed'`;

    return NextResponse.json({
      stats: {
        users: parseInt(usersCount.count),
        boosters: parseInt(boostersCount.count),
        orders: parseInt(ordersCount.count),
        pending: parseInt(pendingCount.count),
        revenue: parseFloat(revenue.total),
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
