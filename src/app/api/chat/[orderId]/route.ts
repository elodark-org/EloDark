import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/chat/:orderId — List messages for an order
export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const { orderId } = await params;

    const [order] = await sql`SELECT user_id, booster_id FROM orders WHERE id = ${orderId}`;
    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    // Check access
    let hasAccess = user.role === "admin" || user.id === order.user_id;

    if (!hasAccess && user.role === "booster") {
      const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
      if (booster && booster.id === order.booster_id) hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const messages = await sql`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM messages m
      LEFT JOIN users u ON u.id = m.user_id
      WHERE m.order_id = ${orderId}
      ORDER BY m.created_at ASC
    `;

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Chat list error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/chat/:orderId — Send a message
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const { orderId } = await params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    const [order] = await sql`SELECT user_id, booster_id, status FROM orders WHERE id = ${orderId}`;
    if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    // Check if user is participant
    let isParticipant = user.role === "admin" || user.id === order.user_id;

    if (!isParticipant && user.role === "booster") {
      const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
      if (booster && booster.id === order.booster_id) isParticipant = true;
    }

    if (!isParticipant) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const [message] = await sql`
      INSERT INTO messages (order_id, user_id, content)
      VALUES (${orderId}, ${user.id}, ${content})
      RETURNING *
    `;

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("Chat send error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
