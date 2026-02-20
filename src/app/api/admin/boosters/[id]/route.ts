import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseBoundedNumber,
  parseNonNegativeInt,
  parseOptionalString,
  parsePositiveInt,
} from "@/lib/validation";

// PUT /api/admin/boosters/:id — Update booster
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de booster inválido" }, { status: 400 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const gameName =
      payload.game_name === undefined
        ? undefined
        : parseOptionalString(payload.game_name, { maxLength: 100 });
    const rank =
      payload.rank === undefined
        ? undefined
        : parseOptionalString(payload.rank, { maxLength: 50 });
    const winRate =
      payload.win_rate === undefined
        ? undefined
        : parseBoundedNumber(payload.win_rate, 0, 100);
    const gamesPlayed =
      payload.games_played === undefined
        ? undefined
        : parseNonNegativeInt(payload.games_played);
    const avatarEmoji =
      payload.avatar_emoji === undefined
        ? undefined
        : parseOptionalString(payload.avatar_emoji, { maxLength: 10 });
    const active =
      payload.active === undefined
        ? undefined
        : typeof payload.active === "boolean"
          ? payload.active
          : null;

    if (
      (payload.game_name !== undefined && gameName === null) ||
      (payload.rank !== undefined && rank === null) ||
      (payload.win_rate !== undefined && winRate === null) ||
      (payload.games_played !== undefined && gamesPlayed === null) ||
      (payload.avatar_emoji !== undefined && avatarEmoji === null) ||
      (payload.active !== undefined && active === null)
    ) {
      return NextResponse.json(
        { error: "Um ou mais campos possuem formato inválido" },
        { status: 400 }
      );
    }

    const [booster] = await sql`
      UPDATE boosters SET
        game_name = COALESCE(${gameName ?? null}, game_name),
        rank = COALESCE(${rank ?? null}, rank),
        win_rate = COALESCE(${winRate ?? null}, win_rate),
        games_played = COALESCE(${gamesPlayed ?? null}, games_played),
        avatar_emoji = COALESCE(${avatarEmoji ?? null}, avatar_emoji),
        active = COALESCE(${active ?? null}, active)
      WHERE id = ${id}
      RETURNING *
    `;

    if (!booster) return NextResponse.json({ error: "Booster não encontrado" }, { status: 404 });
    return NextResponse.json({ booster });
  } catch (err) {
    logger.error("Erro admin ao atualizar booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE /api/admin/boosters/:id — Delete booster
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de booster inválido" }, { status: 400 });
    }

    const [booster] = await sql`SELECT user_id FROM boosters WHERE id = ${id}`;
    if (!booster) return NextResponse.json({ error: "Booster não encontrado" }, { status: 404 });

    await sql`
      WITH del_booster AS (
        DELETE FROM boosters WHERE id = ${id}
      )
      DELETE FROM users WHERE id = ${booster.user_id}
    `;

    return NextResponse.json({ message: "Booster removido com sucesso" });
  } catch (err) {
    logger.error("Erro admin ao remover booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
