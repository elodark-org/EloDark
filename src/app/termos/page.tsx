import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Termos de Uso — EloDark",
  description: "Leia os Termos de Uso da EloDark antes de utilizar nossos serviços de elo boosting.",
};

const sections = [
  {
    title: "Introdução",
    content:
      "Estes termos de uso regulam o uso dos serviços oferecidos pela EloDark, localizada no Brasil. Ao acessar e utilizar o Site, você concorda com os seguintes termos de uso. Se você não concorda com estes termos, por favor, não use o Site.",
  },
  {
    title: "Conteúdo Exclusivo",
    content:
      "Todo o conteúdo presente no Site, incluindo mas não limitado ao visual design, logotipo, marcas registradas e outros materiais, são propriedade exclusiva da EloDark e estão protegidos por leis de propriedade intelectual. Qualquer uso não autorizado deste conteúdo pode violar as leis de propriedade intelectual.",
  },
  {
    title: "Serviços de Boosting",
    content:
      "A EloDark oferece serviços de boosting para jogos online. Ao contratar esses serviços, você concorda em fornecer informações precisas e atualizadas sobre sua conta de jogo e em cumprir os termos de uso desses jogos. A EloDark não se responsabiliza por quaisquer violações dos termos de uso dos jogos ou por quaisquer outras ações tomadas contra sua conta de jogo.",
  },
  {
    title: "Cadastro de Clientes",
    content:
      "Para acessar todos os recursos do site, os clientes devem se cadastrar em nossa plataforma, fornecendo informações precisas e atualizadas. É de responsabilidade do cliente manter suas informações atualizadas e garantir que elas sejam precisas. A EloDark se reserva o direito de cancelar ou suspender qualquer conta que forneça informações falsas ou incompletas.",
  },
  {
    title: "Promoções e Eventos",
    content:
      "A EloDark pode oferecer promoções e eventos especiais para seus clientes. Essas promoções e eventos podem ter regras e condições específicas que serão informadas aos clientes no momento da oferta.",
  },
  {
    title: "Suporte ao Cliente",
    content:
      "O suporte ao cliente pode ser obtido acessando o chat em nosso website. A EloDark se esforça para fornecer suporte rápido e eficiente, mas não garante a disponibilidade imediata de atendimento.",
  },
  {
    title: "Transações Financeiras",
    content:
      "A EloDark processa todos os pagamentos de forma segura através da Stripe, aceitando cartões de Crédito e Débito (Visa, Mastercard, American Express e Elo), Apple Pay, Google Pay, Link e carteiras digitais. Ao utilizar esses meios de pagamento, você concorda em fornecer informações precisas e atualizadas e em cumprir com todas as regras e regulamentos aplicáveis. A EloDark não se responsabiliza por quaisquer erros ou problemas relacionados a pagamentos, incluindo, mas não se limitando a, fraudes ou problemas de segurança.",
  },
  {
    title: "Cancelamento de Serviços",
    content:
      "A EloDark se reserva o direito de cancelar ou suspender quaisquer serviços contratados por qualquer motivo, incluindo, mas não se limitando a, violação dos termos de uso ou conduta ilegal. Em caso de cancelamento ou suspensão, nenhum reembolso será fornecido.",
  },
  {
    title: "Responsabilidade do Cliente",
    content:
      "Os clientes são responsáveis por garantir que os serviços contratados sejam utilizados de acordo com os termos de uso e com as leis aplicáveis. A EloDark não se responsabiliza por quaisquer danos ou prejuízos decorrentes do uso indevido dos serviços.",
  },
  {
    title: "Uso Indevido",
    content:
      "Qualquer uso indevido dos serviços oferecidos pela EloDark, incluindo, mas não se limitando a, fraudes, tentativas de acesso não autorizado a outras contas, violação de direitos autorais e uso comercial sem autorização, resultará no cancelamento imediato dos serviços e poderá resultar em ações legais.",
  },
  {
    title: "Modificações dos Termos de Uso",
    content:
      "A EloDark se reserva o direito de modificar estes termos de uso a qualquer momento. As modificações serão efetivas imediatamente após a publicação das novas versões dos termos de uso no Site. Ao continuar a usar o Site após as modificações, você concorda em seguir os termos de uso modificados.",
  },
  {
    title: "Modificações dos Serviços",
    content:
      "A EloDark se reserva o direito de modificar, suspender ou descontinuar qualquer aspecto dos serviços oferecidos no Site, incluindo, mas não se limitando a, recursos, preços e disponibilidade, a qualquer momento e sem aviso prévio.",
  },
  {
    title: "Isenção de Responsabilidade",
    content:
      'A EloDark não garante que o Site ou qualquer conteúdo disponível nele esteja livre de erros ou esteja disponível sem interrupções. O Site e seu conteúdo são fornecidos "tal como estão" e "conforme disponíveis". A EloDark se isenta expressamente de quaisquer garantias de qualquer tipo, expressas ou implícitas.',
  },
  {
    title: "Limitação de Responsabilidade",
    content:
      "Em nenhuma circunstância a EloDark será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares decorrentes do uso ou incapacidade de uso do Site ou de qualquer conteúdo disponível nele, incluindo, sem limitação, danos por lucros cessantes, interrupção de negócios ou perda de dados.",
  },
  {
    title: "Indenização",
    content:
      "Você concorda em indenizar, defender e isentar a EloDark de e contra quaisquer reivindicações, danos, custos e despesas, incluindo honorários advocatícios, decorrentes ou relacionados ao seu uso do Site ou dos serviços oferecidos por ele.",
  },
  {
    title: "Privacidade",
    content:
      "A EloDark respeita sua privacidade e adere aos princípios de privacidade estabelecidos na legislação brasileira (LGPD). Para obter informações detalhadas sobre nossa política de privacidade, consulte nossa Política de Privacidade disponível no Site.",
  },
  {
    title: "Comunicação",
    content:
      "A EloDark pode entrar em contato com você por meio de e-mail ou outras formas de comunicação eletrônica para fornecer informações importantes relacionadas aos serviços contratados ou para fins promocionais.",
  },
  {
    title: "Conformidade",
    content:
      "A EloDark se compromete a cumprir todas as leis e regulamentos aplicáveis, incluindo, mas não se limitando a, as leis de propriedade intelectual, privacidade e proteção de dados.",
  },
  {
    title: "Leis Aplicáveis",
    content:
      "Estes termos de uso são regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa decorrente ou relacionada ao uso do Site ou destes termos de uso será resolvida exclusivamente nos tribunais do Brasil.",
  },
  {
    title: "Divisibilidade",
    content:
      "Se qualquer disposição destes termos de uso for considerada inválida ou inaplicável, tal disposição será limitada ou excluída na medida mínima necessária e essa exclusão não afetará a validade e aplicabilidade das disposições restantes.",
  },
  {
    title: "Integralidade do Acordo",
    content:
      "Estes termos de uso representam o acordo completo entre você e a EloDark quanto ao uso do Site e dos serviços oferecidos por ele, e substituem todos os acordos anteriores ou contemporâneos, sejam escritos ou orais.",
  },
  {
    title: "Contato",
    content:
      "Se você tiver alguma dúvida sobre estes termos de uso ou sobre o Site, entre em contato com a EloDark através do chat em nosso website ou por meio de nossos canais de suporte.",
  },
];

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-400 text-sm">
              Última atualização: março de 2025. Ao utilizar nossos serviços, você concorda com os termos descritos abaixo.
            </p>
          </div>

          {/* Acceptance Banner */}
          <div className="glass-panel rounded-xl p-5 border border-primary/20 mb-10">
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">Aceitação dos Termos: </span>
              Ao utilizar o Site e os serviços oferecidos pela EloDark, você declara ter lido, compreendido e aceito todos os termos de uso abaixo. Caso você não concorde com algum dos termos, por favor, não utilize o Site ou seus serviços.
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
