const PAGBANK_API = "https://api.pagseguro.com";

function getToken(): string {
  const token = process.env.PAGBANK_TOKEN;
  if (!token) throw new Error("PAGBANK_TOKEN não configurado");
  return token;
}

export interface PagBankQrCode {
  id: string;
  text: string;
  expiration_date: string;
  links: Array<{ rel: string; href: string; media: string; type: string }>;
}

export interface PagBankOrderResponse {
  id: string;
  reference_id: string;
  qr_codes: PagBankQrCode[];
}

export interface PagBankOrderStatus {
  id: string;
  reference_id: string;
  charges: Array<{
    id: string;
    status: string; // AUTHORIZED, PAID, IN_ANALYSIS, DECLINED, CANCELLED, REFUNDED
    amount: { value: number; currency: string };
  }>;
}

export async function createPixOrder(params: {
  referenceId: string;
  customerName: string;
  customerEmail: string;
  customerTaxId: string; // CPF sem pontuação
  itemName: string;
  amountCents: number;
  expiresAt: string; // ISO 8601 com fuso: "2024-12-31T23:59:59-03:00"
  notificationUrl: string;
}): Promise<PagBankOrderResponse> {
  const body = {
    reference_id: params.referenceId,
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      tax_id: params.customerTaxId.replace(/\D/g, ""),
    },
    items: [
      {
        name: params.itemName,
        quantity: 1,
        unit_amount: params.amountCents,
      },
    ],
    qr_codes: [
      {
        amount: { value: params.amountCents },
        expiration_date: params.expiresAt,
      },
    ],
    notification_urls: [params.notificationUrl],
  };

  const res = await fetch(`${PAGBANK_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PagBank createOrder ${res.status}: ${err}`);
  }

  return res.json();
}

export async function getOrderStatus(pagbankOrderId: string): Promise<PagBankOrderStatus> {
  const res = await fetch(`${PAGBANK_API}/orders/${pagbankOrderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PagBank getOrder ${res.status}: ${err}`);
  }

  return res.json();
}

export function isPaid(order: PagBankOrderStatus): boolean {
  // PagBank PIX pode retornar PAID ou AUTHORIZED após pagamento confirmado
  return order.charges?.some((c) => c.status === "PAID" || c.status === "AUTHORIZED") ?? false;
}
