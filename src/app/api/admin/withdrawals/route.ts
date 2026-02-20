import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";

// GET /api/admin/withdrawals — List all withdrawals (admin)
export async function GET(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let withdrawals;
    if (status) {
      withdrawals = await sql`
        SELECT w.*, b.game_name as booster_name, u.name as user_name
        FROM withdrawals w
        JOIN boosters b ON b.id = w.booster_id
        JOIN users u ON u.id = b.user_id
        WHERE w.status = ${status}
        ORDER BY w.created_at DESC
      `;
    } else {
      withdrawals = await sql`
        SELECT w.*, b.game_name as booster_name, u.name as user_name
        FROM withdrawals w
        JOIN boosters b ON b.id = w.booster_id
        JOIN users u ON u.id = b.user_id
        ORDER BY w.created_at DESC
      `;
    }

    return NextResponse.json({ withdrawals });
  } catch (err) {
    logger.error("Erro admin ao listar saques", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
