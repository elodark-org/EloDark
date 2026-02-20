import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

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
    console.error("List withdrawals error:", err);
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

    const { amount, pix_key, pix_type } = await req.json();

    if (!amount || !pix_key || !pix_type) {
      return NextResponse.json({ error: "amount, pix_key e pix_type são obrigatórios" }, { status: 400 });
    }

    const validPixTypes = ["cpf", "email", "phone", "random"];
    if (!validPixTypes.includes(pix_type)) {
      return NextResponse.json({ error: `pix_type inválido. Use: ${validPixTypes.join(", ")}` }, { status: 400 });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
    }

    // Calculate available balance
    const [earned] = await sql`
      SELECT COALESCE(SUM(price * 0.40), 0) as total
      FROM orders WHERE booster_id = ${booster.id} AND status = 'completed'
    `;
    const [withdrawn] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM withdrawals WHERE booster_id = ${booster.id} AND status IN ('approved', 'pending')
    `;

    const available = parseFloat(earned.total) - parseFloat(withdrawn.total);
    if (numAmount > available) {
      return NextResponse.json({ error: `Saldo insuficiente. Disponível: R$ ${available.toFixed(2)}` }, { status: 400 });
    }

    const [withdrawal] = await sql`
      INSERT INTO withdrawals (booster_id, amount, pix_key, pix_type)
      VALUES (${booster.id}, ${numAmount}, ${pix_key}, ${pix_type})
      RETURNING *
    `;

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (err) {
    console.error("Create withdrawal error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
