import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";

// GET /api/boosters — Public list of active boosters
export async function GET() {
  try {
    const boosters = await sql`
      SELECT b.id, b.game_name, b.rank, b.win_rate, b.games_played, b.avatar_emoji
      FROM boosters b
      WHERE b.active = true
      ORDER BY b.win_rate DESC
    `;
    return NextResponse.json({ boosters });
  } catch (err) {
    logger.error("Erro ao listar boosters públicos", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
