import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createPixOrder, extractPixData } from "@/lib/pagbank";
import { logger } from "@/lib/logger";
import { calculatePrice } from "@/lib/pricing";
import {
  isPlainObject,
  isValidServiceType,
  parseOptionalString,
  sanitizeConfig,
  VALID_SERVICE_TYPES,
} from "@/lib/validation";

// POST /api/checkout/create-session — guest checkout, no auth required
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const serviceType = payload.service_type;
    const config = sanitizeConfig(payload.config);
    const customerEmail = parseOptionalString(payload.customer_email, { maxLength: 255 }) ?? "cliente@elodark.com";
    const customerName = parseOptionalString(payload.customer_name, { maxLength: 100 }) ?? "Cliente EloDark";

    if (!serviceType) {
      return NextResponse.json({ error: "service_type é obrigatório" }, { status: 400 });
    }

    if (!isValidServiceType(serviceType)) {
      return NextResponse.json(
        { error: `Serviço inválido. Use: ${VALID_SERVICE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Preço calculado inteiramente no servidor — valor do cliente é ignorado
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

    // Criar pedido no banco
    const [order] = await sql`
      INSERT INTO orders (service_type, config, price, status)
      VALUES (${serviceType}, ${JSON.stringify(config)}, ${price}, 'pending')
      RETURNING id
    `;

    const amountCents = Math.round(price * 100);
    const currentRank = parseOptionalString(config.current_rank, { maxLength: 50 });
    const desiredRank = parseOptionalString(config.desired_rank, { maxLength: 50 });
    const description = currentRank && desiredRank
      ? `EloDark ${serviceNames[serviceType]} ${currentRank}→${desiredRank}`
      : `EloDark ${serviceNames[serviceType]} #${order.id}`;

    const origin = req.headers.get("origin") || "https://elodark.com";
    const notificationUrl = `${origin}/api/checkout/webhook`;

    // Criar pedido PIX no PagBank
    const pagbankOrder = await createPixOrder({
      orderId: order.id,
      amountCents,
      description,
      customerName,
      customerEmail,
      notificationUrl,
      expiresInMinutes: 30,
    });

    const { qrCodeText, qrCodeImageUrl, expirationDate, chargeId } = extractPixData(pagbankOrder);

    // Salvar dados do PagBank no config do pedido (objeto limpo)
    const mergedConfig = {
      ...config,
      pagbank_order_id: pagbankOrder.id,
      pagbank_charge_id: chargeId,
      qr_code_text: qrCodeText,
      qr_code_image: qrCodeImageUrl,
      pix_expires_at: expirationDate,
      customer_email: customerEmail,
      customer_name: customerName,
    };
    await sql`UPDATE orders SET config = ${JSON.stringify(mergedConfig)}::jsonb WHERE id = ${order.id}`;

    logger.info("Pedido PIX criado no PagBank", {
      orderId: order.id,
      pagbankOrderId: pagbankOrder.id,
      amountBRL: price,
    });

    return NextResponse.json({
      order_id: order.id,
      pagbank_order_id: pagbankOrder.id,
      pix_code: qrCodeText,
      pix_image: qrCodeImageUrl,
      expires_at: expirationDate,
      amount: price,
    });
  } catch (err) {
    logger.error("Erro ao criar sessão de pagamento PIX", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
