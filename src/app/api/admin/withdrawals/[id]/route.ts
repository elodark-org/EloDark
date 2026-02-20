import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseOptionalString,
  parsePositiveInt,
} from "@/lib/validation";

// PUT /api/admin/withdrawals/[id] — Approve or reject a withdrawal
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id: rawId } = await params;
    const id = parsePositiveInt(rawId);
    if (!id) {
      return NextResponse.json({ error: "ID de saque inválido" }, { status: 400 });
    }

    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const status = payload.status;
    const adminNotes = parseOptionalString(payload.admin_notes, {
      maxLength: 2000,
    });

    if (typeof status !== "string" || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "status deve ser 'approved' ou 'rejected'" }, { status: 400 });
    }

    const [existing] = await sql`SELECT id, status FROM withdrawals WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ error: "Saque não encontrado" }, { status: 404 });
    }
    if (existing.status !== "pending") {
      return NextResponse.json({ error: "Este saque já foi processado" }, { status: 400 });
    }

    const [withdrawal] = await sql`
      UPDATE withdrawals
      SET status = ${status}, admin_notes = ${adminNotes}, processed_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ withdrawal });
  } catch (err) {
    logger.error("Erro admin ao processar saque", err, { userId: user.id });
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
