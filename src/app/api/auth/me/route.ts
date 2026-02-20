import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const result = requireAuth(req);
  if (!isUser(result)) return result;

  try {
    const [user] = await sql`
      SELECT id, name, email, role, created_at FROM users WHERE id = ${result.id}
    `;
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
