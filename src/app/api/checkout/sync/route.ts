import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// POST /api/checkout/sync — Sync all pending orders with Stripe
export async function POST(req: NextRequest) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });

    const sessions = await stripe.checkout.sessions.list({ limit: 50 });

    let synced = 0;
    for (const session of sessions.data) {
      if (session.payment_status === "paid" && session.metadata?.order_id) {
        const orderId = session.metadata.order_id;
        const [order] = await sql`SELECT status FROM orders WHERE id = ${orderId}`;
        if (order && order.status === "pending") {
          await sql`UPDATE orders SET status = 'active', updated_at = NOW() WHERE id = ${orderId}`;
          synced++;
          console.log(`✅ Pedido #${orderId} sincronizado`);
        }
      }
    }

    return NextResponse.json({ message: `${synced} pedido(s) sincronizado(s)`, synced });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Erro ao sincronizar" }, { status: 500 });
  }
}
