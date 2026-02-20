import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET /api/reviews — Public list of reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20") || 20, 1), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0") || 0, 0);

    const reviews = await sql`
      SELECT r.id, r.rating, r.text, r.created_at,
             u.name as user_name,
             o.service_type
      FROM reviews r
      LEFT JOIN users u ON u.id = r.user_id
      LEFT JOIN orders o ON o.id = r.order_id
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ count }] = await sql`SELECT COUNT(*) as count FROM reviews`;

    return NextResponse.json({ reviews, total: parseInt(count) });
  } catch (err) {
    console.error("List reviews error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/reviews — Create review (must have completed order)
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const { order_id, rating, text } = await req.json();

    if (!order_id || !rating) {
      return NextResponse.json({ error: "order_id e rating são obrigatórios" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating deve ser entre 1 e 5" }, { status: 400 });
    }

    const [order] = await sql`
      SELECT id FROM orders
      WHERE id = ${order_id} AND user_id = ${user.id} AND status = 'completed'
    `;
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado ou ainda não foi concluído" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM reviews WHERE order_id = ${order_id}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este pedido já foi avaliado" }, { status: 409 });
    }

    const [review] = await sql`
      INSERT INTO reviews (user_id, order_id, rating, text)
      VALUES (${user.id}, ${order_id}, ${rating}, ${text || null})
      RETURNING *
    `;

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("Create review error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
