"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { FAQItem } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "Is Elo Boosting safe for my account?",
    answer:
      "Our boosting services are 100% safe. We use premium VPN protection localized to your region and high-level encryption to ensure your account remains secure and undetectable by game developers. Your privacy is our top priority.",
  },
  {
    question: "How long will my boost take?",
    answer:
      "Boost times vary depending on your starting rank and target goal. Typically, orders are started within 30 minutes. A standard division boost usually takes 24-48 hours. You can track live progress in your customer dashboard.",
  },
  {
    question: "Can I play other games while being boosted?",
    answer:
      "Yes! You can play any other games on your PC. However, you must not log into the specific game account that is being boosted while our professional is active. We recommend setting up a schedule with your booster via our chat system.",
  },
  {
    question: "Are the boosters professional players?",
    answer:
      "Absolutely. Every EloDark booster is strictly vetted and must maintain a high-tier rank (Top 0.1% of the ladder). Most are current or former semi-pro players who understand the meta and carry games with high win rates.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major Credit/Debit cards, PayPal, and various Cryptocurrencies (BTC, ETH, USDT). All transactions are handled through secure, encrypted gateways to ensure your financial data is never stored on our servers.",
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
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto font-light">
            Everything you need to know about our elite boosting services. Secure,
            fast, and professional.
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
            Still have questions?
            <Link
              href="#"
              className="text-primary font-bold hover:text-accent-cyan transition-colors flex items-center gap-1 group"
            >
              Contact our 24/7 Support
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
