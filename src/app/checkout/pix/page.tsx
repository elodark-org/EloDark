"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";

const POLL_INTERVAL_MS = 5000;

function PixContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const pixCode = searchParams.get("pix_code");
  const pixImage = searchParams.get("pix_image");
  const expiresAt = searchParams.get("expires_at");

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"waiting" | "paid" | "expired" | "error">("waiting");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Contagem regressiva
  useEffect(() => {
    if (!expiresAt) return;
    const expiry = new Date(expiresAt).getTime();

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) setStatus("expired");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // Polling
  useEffect(() => {
    if (!orderId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/verify/${orderId}`);
        const data = await res.json();
        if (data.payment_status === "paid") {
          setStatus("paid");
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => router.push(`/checkout/success?order_id=${orderId}`), 1500);
        }
      } catch {
        // silencia erros de rede, continua polling
      }
    };

    poll(); // verificação imediata
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, router]);

  function handleCopy() {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  if (!orderId || !pixCode) {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <Icon name="error" className="text-red-400" size={40} filled />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-red-400">Link inválido</h1>
          <p className="text-white/50 text-sm">Dados do PIX não encontrados. Tente novamente.</p>
        </div>
        <a
          href="/boost/league-of-legends"
          className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
        >
          Tentar Novamente
        </a>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <Icon name="check_circle" className="text-green-400" size={52} filled />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black mb-2 text-green-400">Pagamento Confirmado!</h1>
          <p className="text-white/60 text-sm">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
          <Icon name="timer_off" className="text-orange-400" size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-orange-400">PIX Expirado</h1>
          <p className="text-white/50 text-sm">O QR Code expirou. Crie um novo pedido para continuar.</p>
        </div>
        <a
          href="/boost/league-of-legends"
          className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
        >
          Novo Pedido
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Aguardando Pagamento
        </div>
        <h1 className="text-3xl font-black mb-2">Pague via PIX</h1>
        <p className="text-white/50 text-sm">
          Escaneie o QR Code ou copie o código abaixo. O pagamento é confirmado automaticamente.
        </p>
      </div>

      {/* Timer */}
      {timeLeft !== null && (
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Icon name="timer" size={16} />
          <span>Expira em <strong className={timeLeft < 120 ? "text-orange-400" : "text-white"}>{formatTime(timeLeft)}</strong></span>
        </div>
      )}

      {/* QR Code */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 w-full flex flex-col items-center gap-4">
        {pixImage ? (
          <Image
            src={pixImage}
            alt="QR Code PIX"
            width={220}
            height={220}
            className="rounded-xl bg-white p-2"
            unoptimized
          />
        ) : (
          <div className="w-[220px] h-[220px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Icon name="qr_code_2" className="text-white/30" size={80} />
          </div>
        )}

        <p className="text-xs text-white/40">Pedido <strong className="text-white/70">#{orderId}</strong></p>
      </div>

      {/* Copia e cola */}
      <div className="w-full glass-card rounded-2xl border border-white/10 p-4 space-y-3">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-left">Pix Copia e Cola</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-xs text-white/70 bg-white/5 rounded-lg px-3 py-2.5 truncate font-mono">
            {pixCode}
          </code>
          <button
            onClick={handleCopy}
            className={`shrink-0 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              copied
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5"><Icon name="check" size={14} />Copiado!</span>
            ) : (
              <span className="flex items-center gap-1.5"><Icon name="content_copy" size={14} />Copiar</span>
            )}
          </button>
        </div>
      </div>

      {/* Instrução */}
      <div className="w-full glass-card rounded-2xl border border-white/5 p-5 space-y-3">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest text-left">Como pagar</h3>
        {[
          { icon: "smartphone", label: "Abra seu banco", desc: "Acesse o app do seu banco ou carteira digital." },
          { icon: "qr_code_scanner", label: "Escaneie o QR Code", desc: "Ou cole o código PIX no campo indicado." },
          { icon: "check_circle", label: "Confirme o pagamento", desc: "Seu pedido é ativado automaticamente após a confirmação." },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name={step.icon} className="text-primary" size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">{step.label}</p>
              <p className="text-xs text-white/40">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suporte */}
      <a
        href="https://wa.me/5515998594085"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-white/30 hover:text-green-400 transition-colors flex items-center gap-1.5"
      >
        <Icon name="support_agent" size={14} />
        Precisa de ajuda? Fale com nosso suporte no WhatsApp
      </a>
    </div>
  );
}

export default function PixPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
              <Icon name="qr_code_2" className="text-primary" size={40} />
            </div>
          }
        >
          <PixContent />
        </Suspense>
      </main>
    </div>
  );
}
