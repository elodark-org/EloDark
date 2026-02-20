import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// POST /api/orders — Create order
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const { service_type, config, price } = await req.json();

    if (!service_type || !price) {
      return NextResponse.json({ error: "service_type e price são obrigatórios" }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 50000) {
      return NextResponse.json({ error: "Preço inválido. Deve ser entre R$ 0,01 e R$ 50.000,00" }, { status: 400 });
    }

    const validServices = ["elo-boost", "duo-boost", "md10", "wins", "coach"];
    if (!validServices.includes(service_type)) {
      return NextResponse.json({ error: `Serviço inválido. Use: ${validServices.join(", ")}` }, { status: 400 });
    }

    const [order] = await sql`
      INSERT INTO orders (user_id, service_type, config, price)
      VALUES (${user.id}, ${service_type}, ${JSON.stringify(config || {})}, ${price})
      RETURNING *
    `;

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// GET /api/orders — List orders for current user (or booster's assigned orders)
export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    let orders;

    if (user.role === "booster") {
      const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
      if (!booster) return NextResponse.json({ orders: [] });

      orders = await sql`
        SELECT o.*, u.name as user_name
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        WHERE o.booster_id = ${booster.id}
        ORDER BY o.created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT o.*, b.game_name as booster_name
        FROM orders o
        LEFT JOIN boosters b ON b.id = o.booster_id
        WHERE o.user_id = ${user.id}
        ORDER BY o.created_at DESC
      `;
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("List orders error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
