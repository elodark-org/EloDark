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

    const email = parseNonEmptyString(payload.email, { maxLength: 255 })?.toLowerCase();
    const password = parseNonEmptyString(payload.password, { maxLength: 255 });

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
    }

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

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    logger.error("Erro de login", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
