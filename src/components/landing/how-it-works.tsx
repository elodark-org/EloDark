import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Step } from "@/types";

const steps: Step[] = [
  {
    number: "01",
    title: "Escolha Seu Boost",
    description: "Escolha seu rank atual e o rank desejado.",
    icon: "ads_click",
    color: "purple",
  },
  {
    number: "02",
    title: "Encontramos Seu Pro",
    description: "Encontramos Seu Pro",
    icon: "shield_person",
    color: "cyan",
  },
  {
    number: "03",
    title: "Acompanhe e Domine",
    description: "Acompanhe e Domine",
    icon: "rocket_launch",
    color: "gold",
  },
];

const colorMap = {
  purple: {
    text: "text-accent-purple",
    border: "border-accent-purple/40",
    iconBg: "bg-accent-purple/15",
    glow: "rgba(168,85,247,0.3)",
  },
  cyan: {
    text: "text-accent-cyan",
    border: "border-accent-cyan/40",
    iconBg: "bg-accent-cyan/15",
    glow: "rgba(0,212,255,0.3)",
  },
  gold: {
    text: "text-accent-gold",
    border: "border-accent-gold/40",
    iconBg: "bg-accent-gold/15",
    glow: "rgba(255,215,0,0.25)",
  },
};

const trustBadges = [
  { icon: "vpn_key", label: "Proteção VPN" },
  { icon: "support_agent", label: "Suporte 24/7" },
  { icon: "currency_exchange", label: "Garantia de Reembolso" },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 py-16 px-4 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
              Como Funciona
            </span>
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto font-light">
            Suba de elo em 3 passos simples. Seguro, rápido e anônimo.
          </p>
        </div>

        {/* Steps — horizontal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <div key={step.number} className="group relative flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 0 20px ${c.glow}` }}
                >
                  <Icon name={step.icon} className={`${c.text} text-2xl`} />
                </div>

                {/* Label */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>
                    Passo {step.number}
                  </p>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>

                {/* Arrow connector (not last) */}
                {i < 2 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px">
                    <div className="w-full h-full animated-gradient-line opacity-25" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-r border-t border-primary/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6">
          <Link href="/boost/league-of-legends">
            <Button
              size="lg"
              iconRight="arrow_forward"
              className="glow-primary shadow-[0_0_30px_rgba(236,19,236,0.3)] hover:shadow-[0_0_50px_rgba(236,19,236,0.5)] text-base px-10 font-bold"
            >
              Comece Seu Boost Agora
            </Button>
          </Link>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/8 hover:border-primary/20 transition-colors text-sm font-medium text-gray-300"
              >
                <Icon name={badge.icon} className="text-primary" size={15} />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
