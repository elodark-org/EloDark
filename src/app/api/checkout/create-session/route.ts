import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  isValidServiceType,
  parseOptionalString,
  parsePrice,
  sanitizeConfig,
  VALID_SERVICE_TYPES,
} from "@/lib/validation";

// POST /api/checkout/create-session
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado. Defina STRIPE_SECRET_KEY no .env" }, { status: 500 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const serviceType = payload.service_type;
    const config = sanitizeConfig(payload.config);
    const price = parsePrice(payload.price);
    const description = parseOptionalString(config.description, { maxLength: 500 });

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

    const serviceNames: Record<(typeof VALID_SERVICE_TYPES)[number], string> = {
      "elo-boost": "Elo Boost",
      "duo-boost": "Duo Boost",
      "md10": "MD10 (Placement)",
      "wins": "Vitórias",
      "coach": "Coach",
    };

    const [order] = await sql`
      INSERT INTO orders (user_id, service_type, config, price, status)
      VALUES (${user.id}, ${serviceType}, ${JSON.stringify(config)}, ${price}, 'pending')
      RETURNING *
    `;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "brl",
          product_data: {
            name: `EloDark - ${serviceNames[serviceType]}`,
            description:
              description ||
              `Serviço de ${serviceNames[serviceType]} para League of Legends`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/checkout/success?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        order_id: order.id.toString(),
        user_id: user.id.toString(),
        service_type: serviceType,
      },
      customer_email: user.email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, order_id: order.id });
  } catch (err) {
    logger.error("Erro ao criar sessão Stripe", err, { userId: user.id });
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
