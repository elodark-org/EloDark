import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

// POST /api/checkout/webhook — Stripe webhook (payment confirmation)
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET não configurado. Webhook rejeitado.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook error:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId && session.payment_status === "paid") {
      await sql`
        UPDATE orders SET status = 'active', updated_at = NOW()
        WHERE id = ${orderId} AND status = 'pending'
      `;
      console.log(`✅ Pedido #${orderId} pago com sucesso via Stripe`);
    }
  }

  return NextResponse.json({ received: true });
}
