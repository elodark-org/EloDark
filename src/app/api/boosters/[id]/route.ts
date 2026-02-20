import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";

// GET /api/boosters/:id — Single booster profile
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de booster inválido" }, { status: 400 });
    }

    const [booster] = await sql`
      SELECT b.id, b.game_name, b.rank, b.win_rate, b.games_played, b.avatar_emoji,
             u.name, b.created_at
      FROM boosters b
      JOIN users u ON u.id = b.user_id
      WHERE b.id = ${id} AND b.active = true
    `;
    if (!booster) return NextResponse.json({ error: "Booster não encontrado" }, { status: 404 });
    return NextResponse.json({ booster });
  } catch (err) {
    logger.error("Erro ao buscar booster", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
