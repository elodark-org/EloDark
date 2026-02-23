"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";

type VerifyResult =
  | { state: "loading" }
  | { state: "success"; orderId: number | null; customerEmail: string | null }
  | { state: "error"; message: string };

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<VerifyResult>({ state: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setResult({ state: "error", message: "Sessão de pagamento não encontrada." });
      return;
    }
    fetch(`/api/checkout/verify/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setResult({ state: "error", message: data.error });
          return;
        }
        if (data.payment_status !== "paid") {
          setResult({ state: "error", message: "Pagamento ainda não confirmado. Aguarde alguns instantes e recarregue a página." });
          return;
        }
        setResult({ state: "success", orderId: data.order_id ?? null, customerEmail: data.customer_email ?? null });
      })
      .catch(() => {
        setResult({ state: "error", message: "Erro ao conectar ao servidor." });
      });
  }, [sessionId]);

  if (result.state === "loading") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
            <Icon name="hourglass_top" className="text-primary" size={40} />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2">Verificando pagamento...</h1>
          <p className="text-white/50 text-sm">Aguarde enquanto confirmamos seu pedido.</p>
        </div>
      </div>
    );
  }

  if (result.state === "error") {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <Icon name="error" className="text-red-400" size={40} filled />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-red-400">Erro na verificação</h1>
          <p className="text-white/50 text-sm">{result.message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/" className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-center hover:bg-white/10 transition-all">
            Voltar ao Início
          </Link>
          <a
            href="https://wa.me/5515998594085"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold text-center hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="support_agent" size={16} />
            Falar com Suporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
      {/* Animated success icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl scale-150" />
        <div className="relative w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <Icon name="check_circle" className="text-green-400" size={52} filled />
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Pagamento Confirmado
        </div>
        <h1 className="text-4xl font-black mb-3">
          Pedido Recebido!{result.orderId ? ` #${result.orderId}` : ""}
        </h1>
        <p className="text-white/60 text-base leading-relaxed">
          Seu pagamento foi processado com sucesso.{" "}
          {result.customerEmail && (
            <>Enviamos uma confirmação para <span className="text-white font-semibold">{result.customerEmail}</span>.</>
          )}{" "}
          Um booster será atribuído ao seu pedido em breve.
        </p>
      </div>

      {/* Steps */}
      <div className="w-full glass-card rounded-2xl border border-white/5 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest text-left">Próximos Passos</h3>
        {[
          { icon: "person_search", label: "Atribuição de Booster", desc: "Um booster qualificado será atribuído ao seu pedido.", done: false },
          { icon: "sports_esports", label: "Início do Serviço", desc: "O booster entrará em contato e iniciará o boost.", done: false },
          { icon: "emoji_events", label: "Entrega Garantida", desc: "Você alcançará o rank desejado dentro do prazo.", done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name={step.icon} className="text-primary" size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">{step.label}</p>
              <p className="text-xs text-white/40">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          className="flex-1 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-center hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="home" size={16} />
          Voltar ao Início
        </Link>
        <a
          href="https://wa.me/5515998594085"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold text-center hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="support_agent" size={16} />
          Falar com Suporte
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
              <Icon name="hourglass_top" className="text-primary" size={40} />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
