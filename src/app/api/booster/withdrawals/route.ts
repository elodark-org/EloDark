import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseBoundedNumber,
  parseNonEmptyString,
} from "@/lib/validation";

// GET /api/booster/withdrawals — List booster's withdrawals
export async function GET(req: NextRequest) {
  const user = requireRole(req, "booster", "admin");
  if (!isUser(user)) return user;

  try {
    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
    if (!booster) {
      return NextResponse.json({ error: "Perfil de booster não encontrado" }, { status: 400 });
    }

    const withdrawals = await sql`
      SELECT * FROM withdrawals
      WHERE booster_id = ${booster.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ withdrawals });
  } catch (err) {
    logger.error("Erro ao listar saques do booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/booster/withdrawals — Request a withdrawal
export async function POST(req: NextRequest) {
  const user = requireRole(req, "booster");
  if (!isUser(user)) return user;

  try {
    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
    if (!booster) {
      return NextResponse.json({ error: "Perfil de booster não encontrado" }, { status: 400 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const amount = parseBoundedNumber(payload.amount, 0.01, 1000000);
    const pixKey = parseNonEmptyString(payload.pix_key, { maxLength: 255 });
    const pixType = payload.pix_type;

    if (amount === null || !pixKey || !pixType) {
      return NextResponse.json({ error: "amount, pix_key e pix_type são obrigatórios" }, { status: 400 });
    }

    const validPixTypes = ["cpf", "email", "phone", "random"];
    if (typeof pixType !== "string" || !validPixTypes.includes(pixType)) {
      return NextResponse.json({ error: `pix_type inválido. Use: ${validPixTypes.join(", ")}` }, { status: 400 });
    }

    // Calculate available balance
    const [earned] = await sql`
      SELECT COALESCE(SUM(price * 0.60), 0) as total
      FROM orders WHERE booster_id = ${booster.id} AND status = 'completed' AND admin_approved = true
    `;
    const [withdrawn] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM withdrawals WHERE booster_id = ${booster.id} AND status IN ('approved', 'pending')
    `;

    const available = Number(earned.total ?? 0) - Number(withdrawn.total ?? 0);
    if (amount > available) {
      return NextResponse.json({ error: `Saldo insuficiente. Disponível: R$ ${available.toFixed(2)}` }, { status: 400 });
    }

    const [withdrawal] = await sql`
      INSERT INTO withdrawals (booster_id, amount, pix_key, pix_type)
      VALUES (${booster.id}, ${amount}, ${pixKey}, ${pixType})
      RETURNING *
    `;

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (err) {
    logger.error("Erro ao criar saque do booster", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
