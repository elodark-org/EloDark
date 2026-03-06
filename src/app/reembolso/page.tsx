import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Política de Reembolso — EloDark",
  description: "Entenda como funciona nossa política de reembolso na EloDark.",
};

const sections = [
  {
    title: "Introdução",
    content:
      "A EloDark preza pela satisfação de seus clientes. Esta política de reembolso descreve as condições e o processo para solicitar a devolução de valores pagos pelos nossos serviços.",
  },
  {
    title: "Direito ao Reembolso Proporcional",
    content:
      "Caso você se arrependa da compra ou deseje cancelar o serviço por qualquer motivo, basta nos avisar imediatamente através do chat em nosso website ou pelos nossos canais de suporte. No mesmo momento em que recebermos a solicitação, encerramos o serviço e realizamos a devolução proporcional ao valor não utilizado — ou seja, você só paga pelo que foi efetivamente executado.",
  },
  {
    title: "Como Solicitar o Reembolso",
    content:
      "Para solicitar o reembolso, entre em contato com nossa equipe de suporte pelo chat no website. Após a confirmação do cancelamento, o valor proporcional será processado pela Stripe e estornado para o mesmo método de pagamento utilizado na compra. O prazo de crédito pode variar de acordo com a operadora do cartão ou instituição financeira, geralmente entre 5 e 10 dias úteis.",
  },
  {
    title: "Serviços Concluídos",
    content:
      "Serviços já concluídos em sua totalidade não são elegíveis para reembolso, uma vez que o trabalho foi integralmente entregue conforme contratado.",
  },
  {
    title: "Suspensão por Violação de Termos",
    content:
      "Contas suspensas ou canceladas por violação dos nossos Termos de Uso — incluindo uso indevido, fraude ou conduta ilegal — não têm direito a reembolso, conforme previsto nos Termos de Uso da EloDark.",
  },
  {
    title: "Contato",
    content:
      "Em caso de dúvidas sobre esta política, entre em contato com nosso suporte através do chat no website. Nossa equipe está pronta para ajudá-lo da forma mais rápida e transparente possível.",
  },
];

export default function ReembolsoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Política de Reembolso
            </h1>
            <p className="text-gray-400 text-sm">
              Última atualização: março de 2025. Sua satisfação é nossa prioridade.
            </p>
          </div>

          {/* Highlight Banner */}
          <div className="glass-panel rounded-xl p-5 border border-primary/20 mb-10">
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">Simples e transparente: </span>
              Arrependeu da compra? Avise-nos e encerramos o serviço imediatamente, devolvendo o valor proporcional ao que não foi utilizado.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {sections.map((section, i) => (
              <div key={i} className="border-t border-white/5 pt-8 first:border-t-0 first:pt-0">
                <h2 className="text-white font-bold text-lg mb-3">
                  <span className="text-primary mr-2">{String(i + 1).padStart(2, "0")}.</span>
                  {section.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 border-t border-white/5 pt-8">
            <p className="text-gray-600 text-xs text-center">
              © {new Date().getFullYear()} EloDark. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
