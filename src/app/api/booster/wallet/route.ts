import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";

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

    const totalEarned = Number(earned.total ?? 0);
    const totalWithdrawn = Number(withdrawn.total ?? 0);
    const pendingWithdrawals = Number(pending.total ?? 0);

    return NextResponse.json({
      total_earned: totalEarned,
      available_balance: totalEarned - totalWithdrawn - pendingWithdrawals,
      pending_withdrawals: pendingWithdrawals,
    });
  } catch (err) {
    logger.error("Erro ao carregar carteira do booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
