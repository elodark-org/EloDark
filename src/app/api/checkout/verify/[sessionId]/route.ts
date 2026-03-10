import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOrderStatus, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";
import { sendOrderConfirmation } from "@/lib/email";

// GET /api/checkout/verify/:orderId — verifica status do pagamento PagBank
export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const orderId = parsePositiveInt(sessionId);
    if (!orderId) {
      return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
    }

    const [order] = await sql`SELECT id, status, price, config, service_type FROM orders WHERE id = ${orderId}`;
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const config = typeof order.config === "string" ? JSON.parse(order.config) : order.config;
    const pagbankOrderId = config?.pagbank_order_id;

    if (["active", "in_progress", "completed"].includes(order.status)) {
      return NextResponse.json({
        payment_status: "paid",
        order_id: orderId,
        customer_email: config?.customer_email ?? null,
      });
    }

    if (!pagbankOrderId) {
      return NextResponse.json({ payment_status: "pending", order_id: orderId });
    }

    const pagbankOrder = await getOrderStatus(pagbankOrderId);

    if (isPaid(pagbankOrder)) {
      if (order.status === "pending") {
        await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId} AND status = 'pending'`;
        logger.info("Pedido ativado via polling PagBank", { orderId });

        const customerEmail = config?.customer_email;
        if (customerEmail) {
          sendOrderConfirmation(customerEmail, {
            orderId,
            serviceType: order.service_type,
            price: order.price,
            config,
          });
        }
      }

      return NextResponse.json({
        payment_status: "paid",
        order_id: orderId,
        customer_email: config?.customer_email ?? null,
      });
    }

    return NextResponse.json({ payment_status: "pending", order_id: orderId });
  } catch (err) {
    logger.error("Erro ao verificar pagamento", err);
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
