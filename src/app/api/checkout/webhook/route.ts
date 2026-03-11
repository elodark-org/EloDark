import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOrder, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";

// POST /api/checkout/webhook — PagBank notification (payment confirmation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // PagBank envia { id: "ORDE_..." } ou { reference_id: "...", charges: [...] }
    const pagbankOrderId: string | undefined = body?.id ?? body?.reference_id;

    if (!pagbankOrderId) {
      logger.error("Webhook PagBank: payload sem id", { body });
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    // Buscar pedido no banco pelo pagbank_order_id
    const [order] = await sql`
      SELECT id, status, price
      FROM orders
      WHERE config->>'pagbank_order_id' = ${pagbankOrderId}
      LIMIT 1
    `;

    if (!order) {
      // Pode ser notificação de outro recurso — retorna 200 para o PagBank não reenviar
      logger.info("Webhook PagBank: pedido não encontrado para", { pagbankOrderId });
      return NextResponse.json({ received: true });
    }

    if (order.status !== "pending") {
      // Já processado
      return NextResponse.json({ received: true });
    }

    // Consultar status atualizado na API PagBank
    const pagbankOrder = await getOrder(pagbankOrderId);

    if (!isPaid(pagbankOrder)) {
      return NextResponse.json({ received: true });
    }

    // Validar valor pago
    const charge = pagbankOrder.charges?.[0] as unknown as { amount?: { value?: number } } | undefined;
    const paidCents = charge?.amount?.value ?? 0;
    const expectedCents = Math.round(parseFloat(String(order.price)) * 100);
    const diff = Math.abs(paidCents - expectedCents);

    if (paidCents > 0 && diff > 1) {
      logger.error("Webhook PagBank: valor pago diverge", {
        orderId: order.id,
        paidCents,
        expectedCents,
      });
      await sql`
        UPDATE orders
        SET status = 'cancelled',
            updated_at = NOW()
        WHERE id = ${order.id} AND status = 'pending'
      `;
      return NextResponse.json({ received: true });
    }

    // Ativar pedido
    await sql`
      UPDATE orders SET status = 'active', updated_at = NOW()
      WHERE id = ${order.id} AND status = 'pending'
    `;
    logger.info("Pedido ativado via webhook PagBank", {
      orderId: order.id,
      pagbankOrderId,
      amountBRL: paidCents / 100,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("Erro ao processar webhook PagBank", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
