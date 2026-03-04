import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parseNonEmptyString } from "@/lib/validation";
import { sendVerificationEmail } from "@/lib/email";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const name = parseNonEmptyString(payload.name, { minLength: 2, maxLength: 100 });
    const email = parseNonEmptyString(payload.email, { maxLength: 255 })?.toLowerCase();
    const password = parseNonEmptyString(payload.password, { minLength: 6, maxLength: 255 });

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    // Verifica se o email já está em uso por uma conta confirmada
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Invalida registros pendentes anteriores para este email
    await sql`DELETE FROM pending_registrations WHERE email = ${email}`;

    await sql`
      INSERT INTO pending_registrations (name, email, password_hash, code, expires_at)
      VALUES (${name}, ${email}, ${hash}, ${code}, ${expiresAt})
    `;

    // Fire-and-forget: não bloqueia a resposta
    sendVerificationEmail(email, name, code);

    logger.info("Registro pendente criado, código enviado por email", { email });

    return NextResponse.json(
      { message: "Código de verificação enviado para o email informado." },
      { status: 200 }
    );
  } catch (err) {
    logger.error("Erro de registro", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
