import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const stats = [
  { icon: "query_stats", label: "Taxa de Vitória", value: "100%", detail: "+100% de Impacto" },
  { icon: "swords", label: "KDA Médio", value: "12.4", detail: "Performance Divina" },
  { icon: "schedule", label: "Tempo de Conclusão", value: "48h", detail: "Entrega Rápida" },
];

const timeline = [
  {
    icon: "error",
    title: "O Desafio",
    text: "Nosso cliente jogava desde a Season 8, sempre terminando no Bronze I. Apesar de milhares de partidas e incontáveis guias assistidos, ele não conseguia superar o \"Elo Hell\" de teammates inconsistentes e jogadores smurf. O objetivo era simples, mas ambicioso: alcançar Diamante IV para finalmente jogar em lobbies de alto nível.",
    tags: ["Preso há 3 Seasons", "Ganho de MMR Baixo"],
    tagColor: "bg-red-500/10 border-red-500/20 text-red-500",
    isResult: false,
  },
  {
    icon: "strategy",
    title: "A Estratégia",
    text: "Nosso booster de elite, 'Shadow', identificou que o MMR da conta do cliente estava severamente danificado. Ele optou por uma estratégia de \"Hyper-Carry\" usando campeões de alta mobilidade para influenciar todas as lanes. Focando em objetivos neutros e punindo o posicionamento inimigo, Shadow manteve um tempo médio de partida de 20 minutos para recuperar o MMR rapidamente.",
    tags: [],
    isResult: false,
  },
  {
    icon: "emoji_events",
    title: "O Resultado",
    text: "Em 48 horas, a conta conquistou uma sequência de 25 vitórias consecutivas. O MMR foi reparado com sucesso, com o cliente agora ganhando +28 LP por vitória em lobbies de Diamante. O cliente agora pode aproveitar partidas competitivas com teammates habilidosos, finalmente quebrando o ciclo de frustração dos elos baixos.",
    tags: [],
    isResult: true,
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent">
          <div className="relative min-h-[500px] w-full flex flex-col justify-center px-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest mb-6 w-fit">
              <Icon name="verified" size={12} /> História de Sucesso em Destaque
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tighter">
              De <span className="text-gray-500">Hardstuck</span> a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan">
                Herói: A Escalada para o Diamante
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              Um mergulho profundo em como nosso booster tier Challenger &apos;Shadow&apos;
              transformou uma conta Bronze I estagnada por 3 seasons em Diamante
              IV em apenas 48 horas.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">
                  Rank Inicial
                </span>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-orange-900/30 rounded-full flex items-center justify-center border border-orange-700/50">
                    <Icon name="workspace_premium" className="text-orange-500" size={18} />
                  </div>
                  <span className="font-bold">Bronze I</span>
                </div>
              </div>
              <Icon name="arrow_forward" className="text-primary" />
              <div className="flex flex-col">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">
                  Rank Final
                </span>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-400/50">
                    <Icon name="diamond" className="text-accent-cyan" size={18} />
                  </div>
                  <span className="font-bold text-accent-cyan">Diamond IV</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center group hover:border-primary/50 transition-all"
            >
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon name={s.icon} className="text-primary" size={32} />
              </div>
              <p className="text-gray-400 font-medium mb-1">{s.label}</p>
              <h3 className="text-5xl font-black text-white">{s.value}</h3>
              <p className="text-green-400 text-sm font-bold mt-2">{s.detail}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="auto_stories" className="text-primary" />
                O Caminho para a Vitória
              </h2>

              {timeline.map((item, i) => (
                <div
                  key={item.title}
                  className={`relative pl-12 ${
                    !item.isResult
                      ? "before:absolute before:left-[19px] before:top-10 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:to-primary/10"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute left-0 top-1 size-10 rounded-full flex items-center justify-center z-10 ${
                      item.isResult
                        ? "bg-primary shadow-[0_0_30px_rgba(46,123,255,0.3)]"
                        : "glass-card border border-primary/40"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className={item.isResult ? "text-white" : "text-primary"}
                      size={20}
                    />
                  </div>
                  <div
                    className={`glass-card p-8 rounded-2xl ${
                      item.isResult ? "border-primary/50 bg-primary/5" : ""
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{item.text}</p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${item.tagColor}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="play_circle" className="text-primary" />
                Prova de Maestria
              </h2>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 group bg-gray-900">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all cursor-pointer">
                  <div className="size-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(46,123,255,0.3)] group-hover:scale-110 transition-transform">
                    <Icon name="play_arrow" size={40} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-lg glass-card text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                    Replay ao Vivo: Partida 24 de Promoção
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-2xl p-6 border-primary/30 sticky top-28">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
                O Booster por Trás da Escalada
              </h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative size-16 rounded-full border-2 border-primary p-1">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/30 to-accent-purple/30" />
                  <div className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-2 border-bg-primary" />
                </div>
                <div>
                  <h5 className="text-lg font-bold">Shadow</h5>
                  <div className="flex items-center gap-1 text-primary">
                    <Icon name="stars" size={14} />
                    <span className="text-xs font-bold">TOP 0.1% Global</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rank Máximo</span>
                  <span className="font-bold">Challenger 1.120 LP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxa de Sucesso</span>
                  <span className="font-bold text-green-400">99.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Roles Principais</span>
                  <span className="font-bold">Jungle / Mid</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/boost/league-of-legends"
                className="block w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-primary to-accent-cyan text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
              >
                COMECE SUA HISTÓRIA
              </Link>
              <p className="text-center text-xs text-gray-500 mt-3">
                <Icon name="verified_user" size={10} className="align-middle mr-1" />
                100% de Segurança da Conta Garantida
              </p>

              {/* Quote */}
              <div className="mt-8 pt-8 border-t border-primary/10">
                <Icon name="format_quote" className="text-primary mb-2" />
                <p className="text-sm italic text-gray-400 leading-relaxed mb-4">
                  &ldquo;Eu estava honestamente cético sobre algum dia chegar ao Diamante.
                  O Shadow fez parecer tão fácil. As dicas de coaching que ele deixou no
                  relatório pós-boost foram a cereja do bolo. Valeu cada centavo.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-bg-primary flex items-center justify-center font-bold text-xs text-primary border border-primary/20">
                    JD
                  </div>
                  <div>
                    <p className="text-xs font-bold">João D.</p>
                    <p className="text-[10px] text-gray-500">Cliente Verificado</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
