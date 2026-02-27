import Stripe from "stripe";

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Detecta se está em ambiente sandbox (teste) ou produção
 * @returns true se estiver em sandbox (chave começa com sk_test_)
 */
export function isStripeSandbox(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return true; // Assume sandbox por segurança
  return key.startsWith("sk_test_");
}

/**
 * Retorna os métodos de pagamento disponíveis baseado no ambiente
 * Sandbox (teste) suporta apenas 'card'
 * Produção suporta 'card', 'boleto' e 'pix'
 */
export function getPaymentMethodTypes(): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  return isStripeSandbox() ? ["card"] : ["card", "boleto", "pix"];
}
