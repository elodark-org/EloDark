import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parseNonEmptyString } from "@/lib/validation";

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

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${hash}, 'user')
      RETURNING id, name, email, role, created_at
    `;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error("JWT_SECRET não configurado");
      return NextResponse.json({ error: "Erro de configuração do servidor" }, { status: 500 });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (err) {
    logger.error("Erro de registro", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
