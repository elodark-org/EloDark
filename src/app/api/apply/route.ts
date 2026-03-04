import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, game, nick, rank, proof_link, discord } = body as Record<string, string>;

    if (!name || !email || !game || !nick || !rank || !discord) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    logger.info("Candidatura de booster recebida", { name, email, game, nick, rank, discord });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Erro ao processar candidatura", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
