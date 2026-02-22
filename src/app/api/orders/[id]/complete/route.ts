import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parsePositiveInt } from "@/lib/validation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// POST /api/orders/:id/complete — Booster completes order with proof image
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "booster");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de pedido inválido" }, { status: 400 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const { image } = payload;
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Imagem de comprovante é obrigatória (base64 data URL)" }, { status: 400 });
    }

    // Validate mime type
    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    if (!mimeMatch || !ALLOWED_MIME_TYPES.includes(mimeMatch[1])) {
      return NextResponse.json({ error: "Tipo de imagem inválido. Use PNG, JPG ou JPEG" }, { status: 400 });
    }

    // Validate size (base64 is ~33% larger than raw)
    const base64Data = image.split(",")[1];
    if (!base64Data) {
      return NextResponse.json({ error: "Dados da imagem inválidos" }, { status: 400 });
    }
    const estimatedSize = (base64Data.length * 3) / 4;
    if (estimatedSize > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Imagem muito grande. Máximo: 5MB" }, { status: 400 });
    }

    // Verify booster owns this order and it's in_progress
    const [booster] = await sql`SELECT id FROM boosters WHERE user_id = ${user.id}`;
    if (!booster) {
      return NextResponse.json({ error: "Perfil de booster não encontrado" }, { status: 400 });
    }

    const [existing] = await sql`SELECT id, booster_id, status FROM orders WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    if (existing.booster_id !== booster.id) {
      return NextResponse.json({ error: "Você não está atribuído a este pedido" }, { status: 403 });
    }
    if (existing.status !== "in_progress") {
      return NextResponse.json({ error: "Apenas pedidos em andamento podem ser concluídos" }, { status: 400 });
    }

    // Update order with image and set to awaiting_approval
    const [order] = await sql`
      UPDATE orders SET
        status = 'awaiting_approval',
        completion_image_url = ${image},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Send system message to chat
    await sql`
      INSERT INTO messages (order_id, user_id, content, is_system)
      VALUES (${id}, ${user.id}, 'O booster enviou o comprovante de conclusão do serviço. Aguardando aprovação do administrador.', true)
    `;

    logger.info("Booster completou pedido com comprovante", { orderId: id, boosterId: booster.id });
    return NextResponse.json({ order });
  } catch (err) {
    logger.error("Erro ao completar pedido com comprovante", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
