import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseNonNegativeInt,
  parseOptionalString,
  parsePositiveInt,
  parseRating,
} from "@/lib/validation";

// GET /api/reviews — Public list of reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parsePositiveInt(searchParams.get("limit"));
    const offsetParam = parseNonNegativeInt(searchParams.get("offset"));
    const limit = Math.min(limitParam ?? 20, 100);
    const offset = offsetParam ?? 0;

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

    return NextResponse.json({ reviews, total: Number(count ?? 0) });
  } catch (err) {
    logger.error("Erro ao listar reviews", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/reviews — Create review (must have completed order)
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!isUser(user)) return user;

  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const orderId = parsePositiveInt(payload.order_id);
    const rating = parseRating(payload.rating);
    const text = parseOptionalString(payload.text, { maxLength: 2000 });

    if (!orderId || !rating) {
      return NextResponse.json({ error: "order_id e rating são obrigatórios" }, { status: 400 });
    }

    const [order] = await sql`
      SELECT id FROM orders
      WHERE id = ${orderId} AND user_id = ${user.id} AND status = 'completed'
    `;
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado ou ainda não foi concluído" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM reviews WHERE order_id = ${orderId}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este pedido já foi avaliado" }, { status: 409 });
    }

    const [review] = await sql`
      INSERT INTO reviews (user_id, order_id, rating, text)
      VALUES (${user.id}, ${orderId}, ${rating}, ${text})
      RETURNING *
    `;

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    logger.error("Erro ao criar review", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
