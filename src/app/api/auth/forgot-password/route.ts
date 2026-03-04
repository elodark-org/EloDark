import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parseNonEmptyString } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/email";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const email = parseNonEmptyString(payload.email, { maxLength: 255 })?.toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Busca o usuário (responde OK mesmo se não encontrado, evitando enumeração de emails)
    const [user] = await sql`SELECT id, name, email FROM users WHERE email = ${email}`;

    if (user) {
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Invalida códigos anteriores do usuário e insere o novo
      await sql`
        UPDATE password_reset_codes
        SET used = true
        WHERE user_id = ${user.id} AND used = false
      `;

      await sql`
        INSERT INTO password_reset_codes (user_id, code, expires_at)
        VALUES (${user.id}, ${code}, ${expiresAt})
      `;

      // Fire-and-forget: não bloqueia a resposta
      sendPasswordResetEmail(user.email, user.name, code);
    }

    logger.info("Solicitação de reset de senha processada", { email });

    // Sempre retorna 200 para não revelar se o email existe
    return NextResponse.json({
      message: "Se o email estiver cadastrado, você receberá um código em breve.",
    });
  } catch (err) {
    logger.error("Erro ao processar forgot-password", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
