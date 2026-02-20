import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  isValidServiceType,
  parsePrice,
  sanitizeConfig,
  VALID_SERVICE_TYPES,
} from "@/lib/validation";

// POST /api/orders — Create order
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const serviceType = payload.service_type;
    const price = parsePrice(payload.price);
    const config = sanitizeConfig(payload.config);

    if (!serviceType || price === null) {
      return NextResponse.json({ error: "service_type e price são obrigatórios" }, { status: 400 });
    }

    if (!isValidServiceType(serviceType)) {
      return NextResponse.json(
        { error: `Serviço inválido. Use: ${VALID_SERVICE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (price <= 0 || price > 50000) {
      return NextResponse.json({ error: "Preço inválido. Deve ser entre R$ 0,01 e R$ 50.000,00" }, { status: 400 });
    }

    const [order] = await sql`
      INSERT INTO orders (user_id, service_type, config, price)
      VALUES (${user.id}, ${serviceType}, ${JSON.stringify(config)}, ${price})
      RETURNING *
    `;

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    logger.error("Erro ao criar pedido", err, { userId: user.id });
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
    logger.error("Erro ao listar pedidos", err, {
      userId: user.id,
      role: user.role,
    });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
