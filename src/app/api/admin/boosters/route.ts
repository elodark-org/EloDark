import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseBoundedNumber,
  parseNonEmptyString,
  parseNonNegativeInt,
  parseOptionalString,
} from "@/lib/validation";

// POST /api/admin/boosters — Create booster (creates user + booster profile)
export async function POST(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const name = parseNonEmptyString(payload.name, { minLength: 2, maxLength: 100 });
    const email = parseNonEmptyString(payload.email, { maxLength: 255 })?.toLowerCase();
    const password = parseNonEmptyString(payload.password, { minLength: 6, maxLength: 255 });
    const gameName = parseOptionalString(payload.game_name, { maxLength: 100 }) ?? "";
    const rank = parseNonEmptyString(payload.rank, { maxLength: 50 });
    const winRateParsed =
      payload.win_rate === undefined
        ? 0
        : parseBoundedNumber(payload.win_rate, 0, 100);
    const gamesPlayedParsed =
      payload.games_played === undefined
        ? 0
        : parseNonNegativeInt(payload.games_played);
    const avatarEmojiParsed =
      payload.avatar_emoji === undefined
        ? "🎮"
        : parseOptionalString(payload.avatar_emoji, { maxLength: 10 });

    if (!name || !email || !password || !rank) {
      return NextResponse.json({ error: "name, email, password e rank são obrigatórios" }, { status: 400 });
    }
    if (
      winRateParsed === null ||
      gamesPlayedParsed === null ||
      avatarEmojiParsed === null
    ) {
      return NextResponse.json(
        { error: "win_rate, games_played ou avatar_emoji inválidos" },
        { status: 400 }
      );
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    const [result] = await sql`
      WITH new_user AS (
        INSERT INTO users (name, email, password_hash, role)
        VALUES (${name}, ${email}, ${hash}, 'booster')
        RETURNING id, name, email, role
      ),
      new_booster AS (
        INSERT INTO boosters (user_id, game_name, rank, win_rate, games_played, avatar_emoji)
        SELECT id, ${gameName}, ${rank}, ${winRateParsed}, ${gamesPlayedParsed}, ${avatarEmojiParsed}
        FROM new_user
        RETURNING *
      )
      SELECT
        new_user.id as user_id, new_user.name, new_user.email, new_user.role,
        new_booster.id as booster_id, new_booster.game_name, new_booster.rank,
        new_booster.win_rate, new_booster.games_played, new_booster.avatar_emoji, new_booster.active
      FROM new_user, new_booster
    `;

    const newUser = { id: result.user_id, name: result.name, email: result.email, role: result.role };
    const booster = {
      id: result.booster_id, user_id: result.user_id, game_name: result.game_name,
      rank: result.rank, win_rate: result.win_rate, games_played: result.games_played,
      avatar_emoji: result.avatar_emoji, active: result.active,
    };

    return NextResponse.json({ user: newUser, booster }, { status: 201 });
  } catch (err) {
    logger.error("Erro admin ao criar booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// GET /api/admin/boosters — List all boosters
export async function GET(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const boosters = await sql`
      SELECT b.*, u.name, u.email, u.created_at as user_created_at
      FROM boosters b
      JOIN users u ON u.id = b.user_id
      ORDER BY b.created_at DESC
    `;
    return NextResponse.json({ boosters });
  } catch (err) {
    logger.error("Erro admin ao listar boosters", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
