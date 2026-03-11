import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOrder, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";
import { sendOrderConfirmation } from "@/lib/email";

// GET /api/checkout/verify/:orderId — no auth required (guest checkout)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: orderIdStr } = await params;
    const orderId = parsePositiveInt(orderIdStr);
    if (orderId === null) {
      return NextResponse.json({ error: "orderId inválido" }, { status: 400 });
    }

    const [order] = await sql`
      SELECT id, status, price, config FROM orders WHERE id = ${orderId}
    `;
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Se já foi ativado, retorna imediatamente
    if (order.status !== "pending") {
      const config =
        typeof order.config === "string" ? JSON.parse(order.config) : order.config ?? {};
      return NextResponse.json({
        payment_status: "paid",
        order_id: orderId,
        customer_email: config.customer_email ?? null,
      });
    }

    // Extrair pagbank_order_id do config (qualquer formato)
    const config =
      typeof order.config === "string" ? JSON.parse(order.config) : order.config ?? {};
    const pagbankOrderId: string | undefined =
      config?.pagbank_order_id ?? config?.Pagbank_order_id;

    if (!pagbankOrderId) {
      return NextResponse.json({ payment_status: "pending", order_id: orderId });
    }

    // Consultar PagBank
    const pagbankOrder = await getOrder(pagbankOrderId);

    if (isPaid(pagbankOrder)) {
      // Ativar pedido
      await sql`
        UPDATE orders SET status = 'active', updated_at = NOW()
        WHERE id = ${orderId} AND status = 'pending'
      `;
      logger.info("Pedido ativado via polling PagBank", { orderId, pagbankOrderId });

      // Email de confirmação
      const customerEmail = config.customer_email;
      if (customerEmail) {
        sendOrderConfirmation(customerEmail, {
          orderId,
          serviceType: order.service_type ?? "",
          price: order.price,
          config,
        }).catch(() => {});
      }

      return NextResponse.json({
        payment_status: "paid",
        order_id: orderId,
        customer_email: customerEmail ?? null,
      });
    }

    return NextResponse.json({ payment_status: "pending", order_id: orderId });
  } catch (err) {
    logger.error("Erro ao verificar pagamento PagBank", err);
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
