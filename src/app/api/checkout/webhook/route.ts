import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";

// POST /api/checkout/webhook — Stripe webhook (payment confirmation)
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error("STRIPE_WEBHOOK_SECRET não configurado. Webhook rejeitado.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("Erro de assinatura no webhook Stripe", err);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = parsePositiveInt(session.metadata?.order_id);

    if (orderId !== null && session.payment_status === "paid") {
      try {
        // Buscar pedido no banco para validar o valor
        const [order] = await sql`
          SELECT id, price, status FROM orders WHERE id = ${orderId}
        `;

        if (!order) {
          logger.error("Webhook: pedido não encontrado", { orderId });
          return NextResponse.json({ received: true }); // retorna 200 para Stripe não reenviar
        }

        // Validar valor pago (Stripe envia em centavos)
        const paidAmountCents = session.amount_total ?? 0;
        const expectedAmountCents = Math.round(parseFloat(order.price) * 100);
        const diff = Math.abs(paidAmountCents - expectedAmountCents);

        if (diff > 1) { // tolerancia de 1 centavo para arredondamento
          logger.error("Webhook: valor pago diverge do pedido", {
            orderId,
            paidAmountCents,
            expectedAmountCents,
          });
          // Marcar como suspeito em vez de ativar
          await sql`
            UPDATE orders SET status = 'cancelled', notes = ${'FRAUDE: valor pago (' + (paidAmountCents / 100).toFixed(2) + ') difere do pedido (' + (expectedAmountCents / 100).toFixed(2) + ')'}, updated_at = NOW()
            WHERE id = ${orderId} AND status = 'pending'
          `;
          return NextResponse.json({ received: true });
        }

        // Valor confere — ativar pedido
        await sql`
          UPDATE orders SET status = 'active', updated_at = NOW()
          WHERE id = ${orderId} AND status = 'pending'
        `;
        logger.info("Pedido pago confirmado via Stripe", { orderId, amountBRL: paidAmountCents / 100 });
      } catch (err) {
        logger.error("Falha ao atualizar pedido após webhook Stripe", err, { orderId });
        return NextResponse.json({ error: "Falha ao processar webhook" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
