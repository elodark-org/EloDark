import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Política de Privacidade — EloDark",
  description: "Saiba como a EloDark coleta, usa e protege suas informações pessoais.",
};

const sections = [
  {
    title: "Introdução",
    content:
      "A EloDark, localizada no Brasil, respeita a privacidade de seus clientes e se compromete a proteger as informações pessoais coletadas em nosso Site. Esta política de privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais e as escolhas disponíveis para você em relação a essas informações.",
    list: null,
  },
  {
    title: "Informações Coletadas",
    content: "Podemos coletar as seguintes informações pessoais:",
    list: [
      "Informações de contato, como nome, endereço de e-mail e número de telefone;",
      "Informações de conta, como nome de usuário e senha;",
      "Informações de pagamento, processadas de forma segura pela Stripe (não armazenamos dados de cartão em nossos servidores);",
      "Informações sobre o uso dos nossos serviços, incluindo informações sobre o jogo e a conta de jogo;",
      "Informações de localização, como endereço IP.",
    ],
  },
  {
    title: "Uso das Informações Coletadas",
    content: "As informações coletadas podem ser utilizadas para:",
    list: [
      "Fornecer e gerenciar os serviços contratados;",
      "Processar pagamentos via Stripe e prevenir fraudes;",
      "Entrar em contato com você para informações importantes relacionadas aos serviços contratados ou para fins promocionais;",
      "Melhorar e personalizar a sua experiência em nosso Site;",
      "Cumprir com as leis e regulamentos aplicáveis;",
      "Realizar pesquisas e análises para melhorar nossos serviços.",
    ],
  },
  {
    title: "Compartilhamento de Informações",
    content:
      "As informações coletadas podem ser compartilhadas com terceiros apenas nas seguintes circunstâncias:",
    list: [
      "Para fornecer os serviços contratados, incluindo o compartilhamento de informações com provedores de serviços e parceiros de negócios (como a Stripe para processamento de pagamentos);",
      "Com base em uma ordem judicial ou outra obrigação legal;",
      "Para proteger os direitos, propriedade ou segurança da EloDark, de nossos clientes ou do público.",
    ],
  },
  {
    title: "Segurança das Informações",
    content:
      "A EloDark adota medidas de segurança razoáveis para proteger as informações coletadas contra acesso não autorizado, uso indevido, alteração ou destruição. Os pagamentos são processados pela Stripe com criptografia de nível bancário, e nenhum dado financeiro é armazenado em nossos servidores. No entanto, nenhuma transmissão de dados pela internet é completamente segura e, embora façamos todos os esforços para proteger suas informações, não podemos garantir segurança absoluta.",
    list: null,
  },
  {
    title: "Escolhas Disponíveis",
    content:
      "Você tem as seguintes opções em relação às informações pessoais coletadas através do nosso Site:",
    list: [
      "Atualizar ou excluir suas informações de conta acessando sua conta em nosso Site;",
      "Solicitar que não sejamos mais contatados para fins promocionais;",
      "Exercitar seus direitos de acesso, retificação, exclusão ou oposição às informações pessoais coletadas, mediante contato conosco através do chat em nosso website.",
    ],
  },
  {
    title: "Links para Outros Sites",
    content:
      "Nosso Site pode conter links para outros sites. Não somos responsáveis pela política de privacidade ou pelo conteúdo desses sites. Recomendamos sempre que você leia as políticas de privacidade de cada site visitado.",
    list: null,
  },
  {
    title: "Conformidade com a LGPD",
    content:
      "A EloDark se compromete a cumprir com as normas da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e todas as outras leis de proteção de dados aplicáveis no Brasil. Isso inclui obter consentimento explícito dos titulares dos dados antes de coletar, armazenar e compartilhar qualquer informação pessoal, garantir a segurança das informações coletadas e fornecer acesso e correção dessas informações aos titulares dos dados quando solicitado.",
    list: null,
  },
  {
    title: "Alterações na Política de Privacidade",
    content:
      "A EloDark pode modificar esta política de privacidade periodicamente. Qualquer alteração será publicada em nosso Site. É sua responsabilidade revisar regularmente esta política para garantir que você está ciente de quaisquer alterações.",
    list: null,
  },
  {
    title: "Contato",
    content:
      "Se você tiver alguma dúvida ou preocupação sobre nossa política de privacidade, entre em contato conosco através do chat em nosso website ou por meio de nossos canais de suporte.",
    list: null,
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-400 text-sm">
              Última atualização: março de 2025. Ao utilizar nossos serviços, você concorda com esta política.
            </p>
          </div>

          {/* Intro Banner */}
          <div className="glass-panel rounded-xl p-5 border border-primary/20 mb-10">
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">Seu dado, sua proteção: </span>
              A EloDark está comprometida com a segurança e transparência no tratamento de suas informações pessoais, em total conformidade com a LGPD.
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
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{section.content}</p>
                {section.list && (
                  <ul className="flex flex-col gap-2 pl-4">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed">
                        <span className="text-primary mt-1 shrink-0">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
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
