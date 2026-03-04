import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const newPassword = parseNonEmptyString(payload.newPassword, { minLength: 6, maxLength: 255 });

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, código e nova senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o usuário
    const [user] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (!user) {
      return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
    }

    // Busca o código mais recente, válido e não utilizado
    const [resetRecord] = await sql`
      SELECT id, expires_at
      FROM password_reset_codes
      WHERE user_id = ${user.id}
        AND code = ${code}
        AND used = false
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!resetRecord) {
      return NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });
    }

    // Atualiza a senha e marca o código como utilizado
    const hash = await bcrypt.hash(newPassword, 12);

    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${user.id}`;
    await sql`UPDATE password_reset_codes SET used = true WHERE id = ${resetRecord.id}`;

    logger.info("Senha redefinida com sucesso", { userId: user.id });

    return NextResponse.json({ message: "Senha redefinida com sucesso." });
  } catch (err) {
    logger.error("Erro ao redefinir senha", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
