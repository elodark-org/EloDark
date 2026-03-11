// PagBank API client (PIX payments)

const PAGBANK_BASE_URL =
  process.env.PAGBANK_ENV === "sandbox"
    ? "https://sandbox.api.pagseguro.com"
    : "https://api.pagseguro.com";

function getToken(): string {
  const token = process.env.PAGBANK_TOKEN;
  if (!token) throw new Error("PAGBANK_TOKEN não configurado");
  return token;
}

async function pagbankFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`${PAGBANK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
  });
  return res;
}

export interface PagBankQrCode {
  id: string;
  text: string;
  expiration_date: string;
  links: { rel: string; href: string; media: string }[];
}

export interface PagBankCharge {
  id: string;
  status: string; // WAITING | PAID | DECLINED | CANCELED
  payment_method: {
    type: string;
    pix?: { qr_codes?: PagBankQrCode[] };
  };
}

export interface PagBankOrder {
  id: string;
  reference_id: string;
  status: string; // WAITING | PAID | DECLINED | CANCELED
  charges: PagBankCharge[];
}

export interface CreatePixOrderParams {
  orderId: number;
  amountCents: number; // valor em centavos
  description: string;
  customerName: string;
  customerEmail: string;
  notificationUrl: string;
  expiresInMinutes?: number; // padrão: 30
}

export async function createPixOrder(params: CreatePixOrderParams): Promise<PagBankOrder> {
  const {
    orderId,
    amountCents,
    description,
    customerName,
    customerEmail,
    notificationUrl,
    expiresInMinutes = 30,
  } = params;

  const expirationDate = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

  const body = {
    reference_id: `elodark-${orderId}`,
    customer: {
      name: customerName || "Cliente EloDark",
      email: customerEmail || "cliente@elodark.com",
    },
    items: [
      {
        reference_id: `order-${orderId}`,
        name: description.slice(0, 64),
        quantity: 1,
        unit_amount: amountCents,
      },
    ],
    notification_urls: [notificationUrl],
    charges: [
      {
        reference_id: `charge-${orderId}`,
        description: description.slice(0, 64),
        amount: {
          value: amountCents,
          currency: "BRL",
        },
        payment_method: {
          type: "PIX",
          installments: 1,
          capture: true,
          pix: {
            expiration_date: expirationDate,
          },
        },
      },
    ],
  };

  const res = await pagbankFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PagBank create order error ${res.status}: ${text}`);
  }

  return res.json() as Promise<PagBankOrder>;
}

export async function getOrder(pagbankOrderId: string): Promise<PagBankOrder> {
  const res = await pagbankFetch(`/orders/${pagbankOrderId}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PagBank get order error ${res.status}: ${text}`);
  }
  return res.json() as Promise<PagBankOrder>;
}

/** Retorna o QR code text (copia-e-cola) e a URL da imagem PNG */
export function extractPixData(order: PagBankOrder): {
  qrCodeText: string | null;
  qrCodeImageUrl: string | null;
  expirationDate: string | null;
  chargeId: string | null;
} {
  const charge = order.charges?.[0];
  if (!charge) return { qrCodeText: null, qrCodeImageUrl: null, expirationDate: null, chargeId: null };

  const qrCode = charge.payment_method?.pix?.qr_codes?.[0];
  if (!qrCode) return { qrCodeText: null, qrCodeImageUrl: null, expirationDate: null, chargeId: charge.id };

  const pngLink = qrCode.links?.find((l) => l.rel === "QRCODE.PNG" || l.media === "image/png");

  return {
    qrCodeText: qrCode.text ?? null,
    qrCodeImageUrl: pngLink?.href ?? null,
    expirationDate: qrCode.expiration_date ?? null,
    chargeId: charge.id,
  };
}

/** Verifica se o pedido PagBank está pago */
export function isPaid(order: PagBankOrder): boolean {
  return (
    order.charges?.some((c) => c.status === "PAID") === true ||
    order.status === "PAID"
  );
}
