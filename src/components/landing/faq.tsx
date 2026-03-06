"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { FAQItem } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "Elo Boost é seguro para minha conta?",
    answer:
      "Nossos serviços de boost são 100% seguros. Utilizamos proteção VPN premium localizada na sua região e criptografia de alto nível para garantir que sua conta permaneça segura e indetectável pelos desenvolvedores do jogo. Sua privacidade é nossa prioridade máxima.",
  },
  {
    question: "Quanto tempo meu boost vai demorar?",
    answer:
      "O tempo do boost varia dependendo do seu rank inicial e objetivo final. Normalmente, os pedidos são iniciados em até 30 minutos. Um boost de divisão padrão geralmente leva de 24 a 48 horas. Você pode acompanhar o progresso em tempo real no seu painel de cliente.",
  },
  {
    question: "Posso jogar outros jogos enquanto estou sendo boostado?",
    answer:
      "Sim! Você pode jogar qualquer outro jogo no seu PC. No entanto, você não deve entrar na conta do jogo específico que está sendo boostado enquanto nosso profissional estiver ativo. Recomendamos combinar um horário com seu booster pelo nosso sistema de chat.",
  },
  {
    question: "Os boosters são jogadores profissionais?",
    answer:
      "Com certeza. Cada booster da EloDark é rigorosamente selecionado e deve manter um rank de alto nível (Top 0,1% do ranking). A maioria são jogadores semi-profissionais atuais ou ex-jogadores que entendem o meta e carregam partidas com altas taxas de vitória.",
  },
  {
    question: "Quais métodos de pagamento vocês aceitam?",
    answer:
      "Aceitamos cartões de Crédito e Débito (Visa, Mastercard, American Express, Elo), Apple Pay, Google Pay, Link e carteiras digitais. Todos os pagamentos são processados pela Stripe, uma das plataformas de pagamento mais seguras do mundo, com criptografia de nível bancário. Seus dados financeiros nunca são armazenados em nossos servidores."
  },
];

function FAQAccordion({ item, defaultOpen }: { item: FAQItem; defaultOpen?: boolean }) {
  return (
    <details
      className="group glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(236,19,236,0.1)] border border-white/5"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
        <span className="text-white text-base font-semibold tracking-wide pr-4">
          {item.question}
        </span>
        <div className="text-primary group-open:rotate-180 transition-transform duration-300 flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
          <Icon name="expand_more" size={20} />
        </div>
      </summary>
      <div className="px-6 pb-6">
        <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4 text-sm">
          {item.answer}
        </p>
      </div>
    </details>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative z-10 py-14 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-1">FAQ</h2>
          <p className="text-gray-400 text-sm">Dúvidas frequentes sobre nossos serviços.</p>
        </div>

        {/* Accordions */}
        <div className="w-full flex flex-col gap-2">
          {faqItems.map((item, i) => (
            <FAQAccordion key={i} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
