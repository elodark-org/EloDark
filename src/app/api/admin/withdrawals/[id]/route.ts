import { NextRequest, NextResponse } from "next/server";
import { requireRole, isUser } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT /api/admin/withdrawals/[id] — Approve or reject a withdrawal
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireRole(req, "admin");
  if (!isUser(user)) return user;

  try {
    const { id } = await params;
    const { status, admin_notes } = await req.json();

    if (!status || !["approved", "rejected"].includes(status)) {
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
      SET status = ${status}, admin_notes = ${admin_notes || null}, processed_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ withdrawal });
  } catch (err) {
    console.error("Admin withdrawal action error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
