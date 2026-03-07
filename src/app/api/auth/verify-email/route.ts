import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parseNonEmptyString } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const email = parseNonEmptyString(payload.email, { maxLength: 255 })?.toLowerCase();
    const code = parseNonEmptyString(payload.code, { minLength: 6, maxLength: 6 });

    if (!email || !code) {
      return NextResponse.json({ error: "Email e código são obrigatórios" }, { status: 400 });
    }

    // Busca o registro pendente válido
    const [pending] = await sql`
      SELECT id, name, email, password_hash
      FROM pending_registrations
      WHERE email = ${email}
        AND code = ${code}
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!pending) {
      return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
    }

    // Dupla checagem: garante que o email ainda não foi cadastrado
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      await sql`DELETE FROM pending_registrations WHERE email = ${email}`;
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    // Cria o usuário e remove o registro pendente
    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${pending.name}, ${pending.email}, ${pending.password_hash}, 'user')
      RETURNING id, name, email, role, created_at
    `;

    await sql`DELETE FROM pending_registrations WHERE email = ${email}`;

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    logger.info("Conta criada após verificação de email", { userId: user.id, email });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (err) {
    logger.error("Erro ao verificar email", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
