import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// GET /api/checkout/verify/:sessionId
export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });

    const { sessionId } = await params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id;

    if (session.payment_status === "paid" && orderId) {
      const [order] = await sql`SELECT status, user_id FROM orders WHERE id = ${orderId}`;
      if (order && order.user_id !== user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      if (order && order.status === "pending") {
        await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId} AND user_id = ${user.id}`;
        console.log(`✅ Pedido #${orderId} sincronizado como pago via verify`);
      }
    }

    return NextResponse.json({
      payment_status: session.payment_status,
      status: session.status,
      order_id: orderId,
    });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
