import { Resend } from "resend";
import { logger } from "./logger";

const FROM_EMAIL = "EloDark <noreply@elodark.com>";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

// ── Helpers ──────────────────────────────────────────────

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `R$ ${num.toFixed(2).replace(".", ",")}`;
}

const SERVICE_NAMES: Record<string, string> = {
  "elo-boost": "Elo Boost",
  "duo-boost": "Duo Boost",
  "md10": "MD10 (Placement)",
  "wins": "Vitórias",
  "coach": "Coach",
};

// ── Email Templates ──────────────────────────────────────

export async function sendVerificationEmail(to: string, name: string, code: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend não configurado, email de verificação não enviado", { to });
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Confirme seu cadastro — EloDark",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #6c63ff; margin-bottom: 8px;">Confirme seu cadastro 🎮</h1>
          <p style="color: #ffffffa0; font-size: 16px;">Olá <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #ffffffa0; font-size: 16px;">Use o código abaixo para confirmar seu cadastro na EloDark. Ele expira em <strong style="color: #fff;">15 minutos</strong>.</p>
          <div style="background: #ffffff08; border: 1px solid #6c63ff40; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #6c63ff; margin: 0;">${code}</p>
          </div>
          <p style="color: #ffffff40; font-size: 13px;">Se você não tentou se cadastrar, ignore este email.</p>
          <hr style="border: none; border-top: 1px solid #ffffff10; margin: 24px 0;" />
          <p style="color: #ffffff30; font-size: 12px; text-align: center;">© EloDark — Boosting profissional</p>
        </div>
      `,
    });
    logger.info("Email de verificação de cadastro enviado", { to });
  } catch (err) {
    logger.error("Erro ao enviar email de verificação", err, { to });
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend não configurado, email de boas-vindas não enviado", { to });
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Bem-vindo à EloDark! 🎮",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #6c63ff; margin-bottom: 8px;">Bem-vindo à EloDark!</h1>
          <p style="color: #ffffffa0; font-size: 16px;">Olá <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #ffffffa0; font-size: 16px;">Sua conta foi criada com sucesso. Agora você pode contratar serviços de boost com os melhores jogadores do Brasil.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="https://elodark.com/games" style="background: linear-gradient(135deg, #6c63ff, #00d4ff); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">Ver Jogos Disponíveis</a>
          </div>
          <p style="color: #ffffff40; font-size: 13px;">Se precisar de ajuda, responda este email ou acesse nosso suporte.</p>
          <hr style="border: none; border-top: 1px solid #ffffff10; margin: 24px 0;" />
          <p style="color: #ffffff30; font-size: 12px; text-align: center;">© EloDark — Boosting profissional</p>
        </div>
      `,
    });
    logger.info("Email de boas-vindas enviado", { to });
  } catch (err) {
    logger.error("Erro ao enviar email de boas-vindas", err, { to });
  }
}

export async function sendOrderConfirmation(
  to: string,
  data: { orderId: number; serviceType: string; price: number | string; config: Record<string, unknown> }
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend não configurado, confirmação de pedido não enviada", { to, orderId: data.orderId });
    return;
  }

  const serviceName = SERVICE_NAMES[data.serviceType] || data.serviceType;
  const currentRank = data.config.current_rank as string | undefined;
  const desiredRank = data.config.desired_rank as string | undefined;
  const rankInfo = currentRank && desiredRank ? `${currentRank} → ${desiredRank}` : "";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido #${data.orderId} confirmado — EloDark`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #6c63ff; margin-bottom: 8px;">Pagamento Confirmado! ✅</h1>
          <p style="color: #ffffffa0; font-size: 16px;">Seu pedido foi recebido e estamos atribuindo um booster.</p>
          <div style="background: #ffffff08; border: 1px solid #ffffff10; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Pedido:</strong> #${data.orderId}</p>
            <p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Serviço:</strong> ${serviceName}</p>
            ${rankInfo ? `<p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Rank:</strong> ${rankInfo}</p>` : ""}
            <p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Valor:</strong> ${formatPrice(data.price)}</p>
          </div>
          <div style="margin: 32px 0; text-align: center;">
            <a href="https://elodark.com/dashboard/orders/${data.orderId}" style="background: linear-gradient(135deg, #6c63ff, #00d4ff); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">Acompanhar Pedido</a>
          </div>
          <p style="color: #ffffff40; font-size: 13px;">Você receberá uma notificação quando um booster for atribuído ao seu pedido.</p>
          <hr style="border: none; border-top: 1px solid #ffffff10; margin: 24px 0;" />
          <p style="color: #ffffff30; font-size: 12px; text-align: center;">© EloDark — Boosting profissional</p>
        </div>
      `,
    });
    logger.info("Email de confirmação de pedido enviado", { to, orderId: data.orderId });
  } catch (err) {
    logger.error("Erro ao enviar email de confirmação", err, { to, orderId: data.orderId });
  }
}

export async function sendPasswordResetEmail(to: string, name: string, code: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend não configurado, email de reset não enviado", { to });
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Código de Redefinição de Senha — EloDark",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #6c63ff; margin-bottom: 8px;">Redefinir Senha 🔐</h1>
          <p style="color: #ffffffa0; font-size: 16px;">Olá <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #ffffffa0; font-size: 16px;">Use o código abaixo para redefinir sua senha. Ele expira em <strong style="color: #fff;">15 minutos</strong>.</p>
          <div style="background: #ffffff08; border: 1px solid #6c63ff40; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #6c63ff; margin: 0;">${code}</p>
          </div>
          <p style="color: #ffffff40; font-size: 13px;">Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanece a mesma.</p>
          <hr style="border: none; border-top: 1px solid #ffffff10; margin: 24px 0;" />
          <p style="color: #ffffff30; font-size: 12px; text-align: center;">© EloDark — Boosting profissional</p>
        </div>
      `,
    });
    logger.info("Email de reset de senha enviado", { to });
  } catch (err) {
    logger.error("Erro ao enviar email de reset de senha", err, { to });
  }
}

export async function sendOrderStatusUpdate(
  to: string,
  data: { orderId: number; status: string; serviceName?: string }
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend não configurado, atualização de status não enviada", { to, orderId: data.orderId });
    return;
  }

  const statusMessages: Record<string, { title: string; message: string }> = {
    in_progress: {
      title: "Booster Atribuído! 🎮",
      message: "Um booster foi atribuído ao seu pedido e o serviço já está em andamento.",
    },
    completed: {
      title: "Pedido Concluído! 🏆",
      message: "Seu boost foi finalizado com sucesso. Confira o resultado!",
    },
    cancelled: {
      title: "Pedido Cancelado",
      message: "Seu pedido foi cancelado. Se tiver dúvidas, entre em contato conosco.",
    },
  };

  const info = statusMessages[data.status];
  if (!info) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido #${data.orderId} — ${info.title} — EloDark`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #6c63ff; margin-bottom: 8px;">${info.title}</h1>
          <p style="color: #ffffffa0; font-size: 16px;">${info.message}</p>
          <div style="background: #ffffff08; border: 1px solid #ffffff10; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Pedido:</strong> #${data.orderId}</p>
            ${data.serviceName ? `<p style="margin: 4px 0; color: #ffffffa0;"><strong style="color: #fff;">Serviço:</strong> ${data.serviceName}</p>` : ""}
          </div>
          <div style="margin: 32px 0; text-align: center;">
            <a href="https://elodark.com/dashboard/orders/${data.orderId}" style="background: linear-gradient(135deg, #6c63ff, #00d4ff); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">Ver Pedido</a>
          </div>
          <hr style="border: none; border-top: 1px solid #ffffff10; margin: 24px 0;" />
          <p style="color: #ffffff30; font-size: 12px; text-align: center;">© EloDark — Boosting profissional</p>
        </div>
      `,
    });
    logger.info("Email de atualização de status enviado", { to, orderId: data.orderId, status: data.status });
  } catch (err) {
    logger.error("Erro ao enviar email de status", err, { to, orderId: data.orderId });
  }
}
