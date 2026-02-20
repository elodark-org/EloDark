import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/booster/wallet — Wallet summary for authenticated booster
export async function GET(req: NextRequest) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
    if (!booster) {
      return NextResponse.json({ error: "Perfil de booster não encontrado" }, { status: 400 });
    }

    // Total earned = 40% of completed orders price
    const [earned] = await sql`
      SELECT COALESCE(SUM(price * 0.40), 0) as total
      FROM orders
      WHERE booster_id = ${booster.id} AND status = 'completed'
    `;

    // Total already withdrawn (approved)
    const [withdrawn] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM withdrawals
      WHERE booster_id = ${booster.id} AND status = 'approved'
    `;

    // Pending withdrawals
    const [pending] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM withdrawals
      WHERE booster_id = ${booster.id} AND status = 'pending'
    `;

    const totalEarned = parseFloat(earned.total);
    const totalWithdrawn = parseFloat(withdrawn.total);
    const pendingWithdrawals = parseFloat(pending.total);

    return NextResponse.json({
      total_earned: totalEarned,
      available_balance: totalEarned - totalWithdrawn - pendingWithdrawals,
      pending_withdrawals: pendingWithdrawals,
    });
  } catch (err) {
    console.error("Wallet error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
