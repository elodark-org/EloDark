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
      "Aceitamos todos os principais cartões de Crédito/Débito, PayPal e diversas Criptomoedas (BTC, ETH, USDT). Todas as transações são processadas por gateways seguros e criptografados para garantir que seus dados financeiros nunca sejam armazenados em nossos servidores.",
  },
];

function FAQAccordion({ item, defaultOpen }: { item: FAQItem; defaultOpen?: boolean }) {
  return (
    <details
      className="group glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,123,255,0.2)] hover:border-primary/40"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
        <span className="text-white text-lg font-semibold tracking-wide pr-4">
          {item.question}
        </span>
        <div className="text-primary group-open:rotate-180 transition-transform duration-300 flex items-center justify-center shrink-0">
          <Icon name="expand_more" size={24} />
        </div>
      </summary>
      <div className="px-6 pb-6">
        <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4">
          {item.answer}
        </p>
      </div>
    </details>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative z-10 py-16 lg:py-24 px-6">
      {/* Ambient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-gradient bg-gradient-to-r from-accent-purple to-accent-cyan text-4xl lg:text-6xl font-black mb-4 tracking-tighter">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto font-light">
            Tudo o que você precisa saber sobre nossos serviços de boost de elite. Seguro,
            rápido e profissional.
          </p>
        </div>

        {/* Accordions */}
        <div className="w-full flex flex-col gap-4">
          {faqItems.map((item, i) => (
            <FAQAccordion key={i} item={item} defaultOpen={i === 0} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-base flex items-center justify-center gap-2">
            Ainda tem dúvidas?
            <Link
              href="#"
              className="text-primary font-bold hover:text-accent-cyan transition-colors flex items-center gap-1 group"
            >
              Fale com nosso Suporte 24/7
              <Icon
                name="arrow_forward"
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
