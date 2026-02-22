import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isPlainObject, parsePositiveInt } from "@/lib/validation";

// PUT /api/admin/orders/:id/approve — Admin approves or rejects completed order
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireRole(req, "admin");
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

    const { action } = payload;
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Ação inválida. Use 'approve' ou 'reject'" }, { status: 400 });
    }

    // Verify order exists and is awaiting_approval
    const [existing] = await sql`SELECT id, status, user_id FROM orders WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    if (existing.status !== "awaiting_approval") {
      return NextResponse.json({ error: "Este pedido não está aguardando aprovação" }, { status: 400 });
    }

    if (action === "approve") {
      const [order] = await sql`
        UPDATE orders SET
          status = 'completed',
          admin_approved = true,
          admin_approved_by = ${user.id},
          admin_approved_at = NOW(),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      // Send system message
      await sql`
        INSERT INTO messages (order_id, user_id, content, is_system)
        VALUES (${id}, ${user.id}, 'O serviço foi aprovado pelo administrador. Pedido concluído com sucesso!', true)
      `;

      logger.info("Admin aprovou conclusão do pedido", { orderId: id, adminId: user.id });
      return NextResponse.json({ order });
    } else {
      // Reject — set back to in_progress
      const [order] = await sql`
        UPDATE orders SET
          status = 'in_progress',
          completion_image_url = NULL,
          admin_approved = false,
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      // Send system message
      await sql`
        INSERT INTO messages (order_id, user_id, content, is_system)
        VALUES (${id}, ${user.id}, 'O administrador rejeitou o comprovante de conclusão. O pedido voltou para "em andamento". Por favor, envie um novo comprovante.', true)
      `;

      logger.info("Admin rejeitou conclusão do pedido", { orderId: id, adminId: user.id });
      return NextResponse.json({ order });
    }
  } catch (err) {
    logger.error("Erro ao aprovar/rejeitar pedido", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
