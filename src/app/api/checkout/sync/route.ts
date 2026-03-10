import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getOrderStatus, isPaid } from "@/lib/pagbank";
import { logger } from "@/lib/logger";

// POST /api/checkout/sync — Sincroniza pedidos pendentes com PagBank (admin)
export async function POST(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const pendingOrders = await sql`
      SELECT id, price, config
      FROM orders
      WHERE status = 'pending'
        AND config->>'pagbank_order_id' IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 50
    `;

    let synced = 0;
    for (const order of pendingOrders) {
      try {
        const config = typeof order.config === "string" ? JSON.parse(order.config) : order.config;
        const pagbankOrderId = config?.pagbank_order_id;
        if (!pagbankOrderId) continue;

        const pagbankOrder = await getOrderStatus(pagbankOrderId);
        if (isPaid(pagbankOrder)) {
          await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${order.id} AND status = 'pending'`;
          synced++;
          logger.info("Pedido sincronizado com PagBank", { orderId: order.id });
        }
      } catch (e) {
        logger.warn("Falha ao sincronizar pedido", { orderId: order.id, error: e });
      }
    }

    return NextResponse.json({ message: `${synced} pedido(s) sincronizado(s)`, synced });
  } catch (err) {
    logger.error("Erro ao sincronizar pedidos com PagBank", err, { userId: user.id });
    return NextResponse.json({ error: "Erro ao sincronizar" }, { status: 500 });
  }
}
