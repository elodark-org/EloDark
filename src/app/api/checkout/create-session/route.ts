import { NextRequest, NextResponse } from "next/server";
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

// POST /api/checkout/create-session — guest checkout, no auth required
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const serviceType = payload.service_type;
    const config = sanitizeConfig(payload.config);
    const price = parsePrice(payload.price);
    const customerEmail = parseOptionalString(payload.customer_email, { maxLength: 255 });
    const customerName = parseOptionalString(payload.customer_name, { maxLength: 100 });

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

    // Build a human-readable description from config
    const currentRank = parseOptionalString(config.current_rank, { maxLength: 50 });
    const desiredRank = parseOptionalString(config.desired_rank, { maxLength: 50 });
    const game = parseOptionalString(config.game, { maxLength: 50 });
    const productDescription = currentRank && desiredRank
      ? `${currentRank} → ${desiredRank}`
      : game
        ? `Serviço para ${game}`
        : `Serviço de ${serviceNames[serviceType]}`;

    // Create order in DB (no user_id for guest)
    const [order] = await sql`
      INSERT INTO orders (service_type, config, price, status)
      VALUES (${serviceType}, ${JSON.stringify(config)}, ${price}, 'pending')
      RETURNING id
    `;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto", "pix"],
      line_items: [{
        price_data: {
          currency: "brl",
          product_data: {
            name: `EloDark — ${serviceNames[serviceType]}`,
            description: productDescription,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?game=${encodeURIComponent(String(config.game || "league-of-legends"))}`,
      metadata: {
        order_id: order.id.toString(),
        service_type: serviceType,
      },
      locale: "pt-BR",
      custom_text: {
        submit: { message: "Ao finalizar, um booster será atribuído ao seu pedido em breve." },
      },
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      payment_intent_data: {
        description: `EloDark — ${serviceNames[serviceType]} — Pedido #${order.id}`,
        statement_descriptor: "ELODARK BOOST",
      },
    });

    // Store stripe session id on the order
    await sql`UPDATE orders SET config = config || ${JSON.stringify({ stripe_session_id: session.id })} WHERE id = ${order.id}`;

    return NextResponse.json({ sessionId: session.id, url: session.url, order_id: order.id });
  } catch (err) {
    logger.error("Erro ao criar sessão Stripe", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
