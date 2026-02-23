"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";

function CancelContent() {
  const searchParams = useSearchParams();
  const game = searchParams.get("game") || "league-of-legends";

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-2xl scale-150" />
        <div className="relative w-28 h-28 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.2)]">
          <Icon name="cancel" className="text-orange-400" size={52} filled />
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Icon name="info" size={12} />
          Pagamento Cancelado
        </div>
        <h1 className="text-4xl font-black mb-3">Nenhuma cobrança realizada</h1>
        <p className="text-white/60 text-base leading-relaxed">
          Você cancelou o pagamento. Não se preocupe — nenhum valor foi cobrado.
          Você pode tentar novamente a qualquer momento.
        </p>
      </div>

      {/* Info card */}
      <div className="w-full glass-card rounded-2xl border border-white/5 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest text-left">Por que continuar?</h3>
        {[
          { icon: "verified_user", label: "100% Seguro", desc: "Pagamento processado pela Stripe com criptografia total." },
          { icon: "schedule", label: "Entrega Rápida", desc: "Boosters disponíveis 24h. Início em até 1 hora após o pagamento." },
          { icon: "emoji_events", label: "Garantia de Entrega", desc: "Se não entregarmos, devolvemos seu dinheiro." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name={item.icon} className="text-primary" size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
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
        <Link
          href={`/boost/${game}`}
          className="flex-1 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-bold text-center hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(46,123,255,0.4)]"
        >
          <Icon name="refresh" size={16} />
          Tentar Novamente
        </Link>
      </div>

      {/* Support */}
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

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center animate-pulse">
              <Icon name="cancel" className="text-orange-400" size={40} filled />
            </div>
          }
        >
          <CancelContent />
        </Suspense>
      </main>
    </div>
  );
}
