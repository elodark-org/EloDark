import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT /api/admin/boosters/:id — Update booster
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const { game_name, rank, win_rate, games_played, avatar_emoji, active } = await req.json();

    const [booster] = await sql`
      UPDATE boosters SET
        game_name = COALESCE(${game_name}, game_name),
        rank = COALESCE(${rank}, rank),
        win_rate = COALESCE(${win_rate}, win_rate),
        games_played = COALESCE(${games_played}, games_played),
        avatar_emoji = COALESCE(${avatar_emoji}, avatar_emoji),
        active = COALESCE(${active}, active)
      WHERE id = ${id}
      RETURNING *
    `;

    if (!booster) return NextResponse.json({ error: "Booster não encontrado" }, { status: 404 });
    return NextResponse.json({ booster });
  } catch (err) {
    console.error("Update booster error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE /api/admin/boosters/:id — Delete booster
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;

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
    console.error("Delete booster error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
