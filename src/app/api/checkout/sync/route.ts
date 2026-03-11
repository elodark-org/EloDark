import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getOrder, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";

// POST /api/checkout/sync — Sync all pending orders with PagBank
export async function POST(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    // Buscar pedidos pendentes que têm pagbank_order_id no config
    const pendingOrders = await sql`
      SELECT id, price, config
      FROM orders
      WHERE status = 'pending'
        AND config->>'pagbank_order_id' IS NOT NULL
      LIMIT 50
    `;

    let synced = 0;
    for (const order of pendingOrders) {
      try {
        const config =
          typeof order.config === "string" ? JSON.parse(order.config) : order.config ?? {};
        const pagbankOrderId: string | undefined = config?.pagbank_order_id;
        if (!pagbankOrderId) continue;

        const pagbankOrder = await getOrder(pagbankOrderId);
        if (isPaid(pagbankOrder)) {
          await sql`
            UPDATE orders SET status = 'active', updated_at = NOW()
            WHERE id = ${order.id} AND status = 'pending'
          `;
          synced++;
          logger.info("Pedido sincronizado via PagBank", { orderId: order.id, pagbankOrderId });
        }
      } catch (err) {
        logger.error("Erro ao sincronizar pedido", err, { orderId: order.id });
      }
    }

    return NextResponse.json({ message: `${synced} pedido(s) sincronizado(s)`, synced });
  } catch (err) {
    logger.error("Erro ao sincronizar pedidos com PagBank", err, { userId: user.id });
    return NextResponse.json({ error: "Erro ao sincronizar" }, { status: 500 });
  }
}
