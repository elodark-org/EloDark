import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";

// GET /api/checkout/verify/:sessionId
export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });

    const { sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId inválido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = parsePositiveInt(session.metadata?.order_id);

    if (session.payment_status === "paid" && orderId !== null) {
      const [order] = await sql`SELECT status, user_id FROM orders WHERE id = ${orderId}`;
      if (order && order.user_id !== user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      if (order && order.status === "pending") {
        await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId} AND user_id = ${user.id}`;
        logger.info("Pedido sincronizado como pago via verify", {
          orderId,
          userId: user.id,
        });
      }
    }

    return NextResponse.json({
      payment_status: session.payment_status,
      status: session.status,
      order_id: orderId,
    });
  } catch (err) {
    logger.error("Erro ao verificar sessão de checkout", err, { userId: user.id });
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
