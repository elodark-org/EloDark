import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// POST /api/checkout/create-session
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado. Defina STRIPE_SECRET_KEY no .env" }, { status: 500 });
    }

    const { service_type, config, price } = await req.json();

    if (!service_type || !price) {
      return NextResponse.json({ error: "service_type e price são obrigatórios" }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 50000) {
      return NextResponse.json({ error: "Preço inválido. Deve ser entre R$ 0,01 e R$ 50.000,00" }, { status: 400 });
    }

    const serviceNames: Record<string, string> = {
      "elo-boost": "Elo Boost",
      "duo-boost": "Duo Boost",
      "md10": "MD10 (Placement)",
      "wins": "Vitórias",
      "coach": "Coach",
    };

    const [order] = await sql`
      INSERT INTO orders (user_id, service_type, config, price, status)
      VALUES (${user.id}, ${service_type}, ${JSON.stringify(config || {})}, ${price}, 'pending')
      RETURNING *
    `;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "brl",
          product_data: {
            name: `EloDark - ${serviceNames[service_type] || service_type}`,
            description: config?.description || `Serviço de ${serviceNames[service_type]} para League of Legends`,
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
        service_type,
      },
      customer_email: user.email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, order_id: order.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
