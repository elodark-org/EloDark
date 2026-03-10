import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { verifyToken } from "@/lib/auth";
import { calculatePrice } from "@/lib/pricing";
import {
  isPlainObject,
  isValidServiceType,
  parseOptionalString,
  sanitizeConfig,
  VALID_SERVICE_TYPES,
} from "@/lib/validation";

// POST /api/checkout/create-session — cria pedido no banco e retorna order_id para a página de PIX
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const serviceType = payload.service_type;
    const config = sanitizeConfig(payload.config);

    if (!serviceType) {
      return NextResponse.json({ error: "service_type é obrigatório" }, { status: 400 });
    }

    if (!isValidServiceType(serviceType)) {
      return NextResponse.json(
        { error: `Serviço inválido. Use: ${VALID_SERVICE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const price = calculatePrice(serviceType, config);
    if (price === null || price <= 0) {
      return NextResponse.json(
        { error: "Configuração de serviço inválida. Verifique o jogo, ranks e opções selecionados." },
        { status: 400 }
      );
    }

    const serviceNames: Record<(typeof VALID_SERVICE_TYPES)[number], string> = {
      "elo-boost": "Elo Boost",
      "duo-boost": "Duo Boost",
      "md5": "MD5 (Partidas de Colocação)",
      "vitorias": "Vitórias",
      "coach": "Coach",
    };

    const currentRank = parseOptionalString(config.current_rank, { maxLength: 50 });
    const desiredRank = parseOptionalString(config.desired_rank, { maxLength: 50 });
    const game = parseOptionalString(config.game, { maxLength: 50 });
    const itemName = currentRank && desiredRank
      ? `EloDark — ${serviceNames[serviceType]}: ${currentRank} → ${desiredRank}`
      : game
        ? `EloDark — ${serviceNames[serviceType]} (${game})`
        : `EloDark — ${serviceNames[serviceType]}`;

    // Vincula ao usuário logado se houver token válido
    const authUser = verifyToken(req);
    const userId = authUser?.id ?? null;

    const [order] = await sql`
      INSERT INTO orders (user_id, service_type, config, price, status)
      VALUES (${userId}, ${serviceType}, ${JSON.stringify({ ...config, item_name: itemName })}, ${price}, 'pending')
      RETURNING id
    `;

    logger.info("Pedido criado, aguardando pagamento PIX", { orderId: order.id, price });

    return NextResponse.json({
      order_id: order.id,
      amount: price,
      url: `/checkout/pix?order_id=${order.id}`,
    });
  } catch (err) {
    logger.error("Erro ao criar pedido", err);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
