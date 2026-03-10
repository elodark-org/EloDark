import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createPixOrder } from "@/lib/pagbank";
import { logger } from "@/lib/logger";
import {
  isPlainObject,
  parseNonEmptyString,
  parsePositiveInt,
} from "@/lib/validation";

// POST /api/checkout/pix-generate — gera ordem PIX no PagBank para um pedido existente
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!isPlainObject(payload)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const orderId = parsePositiveInt(payload.order_id);
    const customerName = parseNonEmptyString(payload.name, { minLength: 2, maxLength: 100 });
    const customerEmail = parseNonEmptyString(payload.email, { maxLength: 255 });
    const cpf = parseNonEmptyString(payload.cpf, { minLength: 11, maxLength: 14 });

    if (!orderId || !customerName || !customerEmail || !cpf) {
      return NextResponse.json({ error: "order_id, name, email e cpf são obrigatórios" }, { status: 400 });
    }

    const cpfClean = cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    }

    // Busca o pedido no banco
    const [order] = await sql`SELECT id, price, status, config FROM orders WHERE id = ${orderId}`;
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Pedido já foi processado" }, { status: 409 });
    }

    // Verifica se já tem um pagbank_order_id (evita duplicata)
    const existingConfig = typeof order.config === "string" ? JSON.parse(order.config) : order.config;
    if (existingConfig?.pagbank_order_id) {
      return NextResponse.json({
        pagbank_order_id: existingConfig.pagbank_order_id,
        qr_code_text: existingConfig.qr_code_text,
        qr_code_image: existingConfig.qr_code_image,
        amount: parseFloat(order.price),
        expires_at: existingConfig.pix_expires_at,
      });
    }

    const amountCents = Math.round(parseFloat(order.price) * 100);
    const itemName = existingConfig?.item_name ?? "EloDark — Serviço de Boost";

    // Expira em 3 minutos
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

    const origin = req.headers.get("origin") || "https://elodark.com";
    const notificationUrl = `${origin}/api/checkout/webhook`;

    const pagbankOrder = await createPixOrder({
      referenceId: `elodark-${orderId}`,
      customerName,
      customerEmail,
      customerTaxId: cpfClean,
      itemName,
      amountCents,
      expiresAt,
      notificationUrl,
    });

    const qrCode = pagbankOrder.qr_codes?.[0];
    if (!qrCode) {
      throw new Error("PagBank não retornou QR code");
    }

    const qrCodeImage = qrCode.links?.find((l) => l.rel === "QRCODE.PNG")?.href ?? null;

    // Salva dados do PagBank no config do pedido
    await sql`
      UPDATE orders
      SET config = config || ${JSON.stringify({
        pagbank_order_id: pagbankOrder.id,
        qr_code_text: qrCode.text,
        qr_code_image: qrCodeImage,
        pix_expires_at: qrCode.expiration_date,
        customer_email: customerEmail,
        customer_name: customerName,
      })}
      WHERE id = ${orderId}
    `;

    logger.info("PIX gerado com sucesso", { orderId, pagbankOrderId: pagbankOrder.id });

    return NextResponse.json({
      pagbank_order_id: pagbankOrder.id,
      qr_code_text: qrCode.text,
      qr_code_image: qrCodeImage,
      amount: parseFloat(order.price),
      expires_at: qrCode.expiration_date,
    });
  } catch (err) {
    logger.error("Erro ao gerar PIX", err);

    // Tenta extrair mensagem de erro do PagBank
    if (err instanceof Error) {
      const match = err.message.match(/PagBank createOrder \d+: (.+)/);
      if (match) {
        try {
          const pagbankError = JSON.parse(match[1]) as { error_messages?: { code: string; description: string }[] };
          const firstError = pagbankError.error_messages?.[0];
          if (firstError) {
            const friendlyMessages: Record<string, string> = {
              "40002": "O email informado não pode ser o mesmo da conta PagBank. Use um email diferente.",
              "40001": "Dados do comprador inválidos. Verifique nome, email e CPF.",
              "40003": "CPF inválido. Verifique o número informado.",
            };
            const friendly = friendlyMessages[firstError.code] ?? firstError.description;
            return NextResponse.json({ error: friendly }, { status: 400 });
          }
        } catch {
          // JSON parse falhou, usa mensagem genérica
        }
      }
    }

    return NextResponse.json({ error: "Erro ao gerar pagamento PIX. Tente novamente." }, { status: 500 });
  }
}
