import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOrderStatus, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";

// POST /api/checkout/webhook — Notificações do PagBank
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const pagbankOrderId: string = body?.id ?? body?.order?.id;
    if (!pagbankOrderId) {
      logger.warn("Webhook PagBank sem order ID", { body });
      return NextResponse.json({ received: true });
    }

    const [order] = await sql`
      SELECT id, status, price
      FROM orders
      WHERE config->>'pagbank_order_id' = ${pagbankOrderId}
      LIMIT 1
    `;

    if (!order || order.status !== "pending") {
      return NextResponse.json({ received: true });
    }

    const pagbankOrder = await getOrderStatus(pagbankOrderId);

    if (isPaid(pagbankOrder)) {
      const paidCharge = pagbankOrder.charges?.find((c) => c.status === "PAID");
      const paidAmountCents = paidCharge?.amount?.value ?? 0;
      const expectedAmountCents = Math.round(parseFloat(order.price) * 100);

      if (Math.abs(paidAmountCents - expectedAmountCents) > 1) {
        logger.error("Webhook PagBank: valor divergente", { orderId: order.id, paidAmountCents, expectedAmountCents });
        await sql`UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = ${order.id} AND status = 'pending'`;
        return NextResponse.json({ received: true });
      }

      await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${order.id} AND status = 'pending'`;
      logger.info("Pedido ativado via webhook PagBank", { orderId: order.id });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("Erro no webhook PagBank", err);
    return NextResponse.json({ received: true });
  }
}
