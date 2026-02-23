import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { parsePositiveInt } from "@/lib/validation";

// GET /api/checkout/verify/:sessionId — no auth required (guest checkout)
export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
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
      const [order] = await sql`SELECT status FROM orders WHERE id = ${orderId}`;
      if (order && order.status === "pending") {
        await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId}`;
        logger.info("Pedido ativado após pagamento confirmado", { orderId });
      }
    }

    return NextResponse.json({
      payment_status: session.payment_status,
      status: session.status,
      order_id: orderId,
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    logger.error("Erro ao verificar sessão de checkout", err);
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
