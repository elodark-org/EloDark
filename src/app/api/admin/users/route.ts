import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";

// GET /api/admin/users — List all users
export async function GET(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const users = await sql`
      SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC
    `;
    return NextResponse.json({ users });
  } catch (err) {
    logger.error("Erro admin ao listar usuários", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
