import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const topBoosters = [
  {
    rank: 2,
    name: "Shadow",
    games: ["LoL", "Valorant"],
    rating: "5.0",
    orders: "620+",
    winRate: "98.8%",
  },
  {
    rank: 1,
    name: "Alpha",
    title: "Elite Grandmaster",
    games: ["LoL", "Valorant"],
    rating: "5.0",
    winRate: "99.2%",
  },
  {
    rank: 3,
    name: "Nova",
    games: ["Valorant", "CS2"],
    rating: "5.0",
    orders: "450+",
    winRate: "98.1%",
  },
];

const leaderboard = [
  { rank: 4, name: "Viper", games: ["LoL", "Val"], winRate: "98.5%", status: "Disponível" },
  { rank: 5, name: "Ghost", games: ["Valorant"], winRate: "97.9%", status: "Em Jogo" },
  { rank: 6, name: "Raven", games: ["LoL"], winRate: "97.2%", status: "Disponível" },
  { rank: 7, name: "Blitz", games: ["CS2", "Val"], winRate: "96.8%", status: "Em Jogo" },
  { rank: 8, name: "Luna", games: ["LoL"], winRate: "96.5%", status: "Disponível" },
];

export default function BoostersPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Esquadrão Elite
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            O top 1% dos jogadores competitivos do mundo. Selecionados por
            excelência, desempenho e profissionalismo.
          </p>
        </div>

        {/* Top 3 Showcase */}
        <div className="flex flex-col lg:flex-row items-end justify-center gap-6 mb-20 px-4">
          {topBoosters.map((b) => {
            const isKing = b.rank === 1;
            return (
              <div
                key={b.rank}
                className={`glass-card rounded-xl flex flex-col items-center relative w-full ${
                  isKing
                    ? "lg:w-80 p-8 border-2 border-accent-gold shadow-[0_0_30px_rgba(255,215,0,0.2)] lg:scale-105 z-10 order-first lg:order-2"
                    : `lg:w-72 p-6 ${b.rank === 2 ? "order-2 lg:order-1" : "order-3"}`
                }`}
              >
                {isKing ? (
                  <div className="absolute -top-6 text-accent-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                    <Icon name="rewarded_ads" size={36} filled />
                  </div>
                ) : (
                  <div className="absolute -top-4 bg-gray-800 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    #{b.rank} Rank
                  </div>
                )}

                <div
                  className={`rounded-full overflow-hidden mb-4 ${
                    isKing
                      ? "size-32 border-4 border-accent-gold p-1.5 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                      : `size-24 border-2 ${b.rank === 2 ? "border-primary/30" : "border-accent-cyan/30"} p-1`
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent-purple/30" />
                </div>

                <h3 className={`font-bold mb-1 ${isKing ? "text-2xl font-black" : "text-xl"}`}>
                  {b.name}
                </h3>
                {b.title && (
                  <p className="text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
                    {b.title}
                  </p>
                )}

                <div className="flex gap-2 mb-4">
                  {b.games.map((g) => (
                    <span
                      key={g}
                      className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold tracking-widest ${
                        g === "LoL"
                          ? "bg-primary/20 text-primary"
                          : g === "Valorant" || g === "Val"
                          ? "bg-accent-cyan/20 text-accent-cyan"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className={`grid grid-cols-2 w-full gap-4 text-center border-t ${isKing ? "border-white/10 pt-6" : "border-white/5 pt-4"}`}>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Avaliação</p>
                    <div className="flex items-center justify-center text-accent-gold gap-1">
                      <span className={`font-bold ${isKing ? "text-lg font-black" : "text-sm"}`}>
                        {b.rating}
                      </span>
                      <Icon name="star" size={isKing ? 18 : 12} filled />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                      {b.winRate ? "Win Rate" : "Pedidos"}
                    </p>
                    <p className={`font-bold ${isKing ? "text-lg font-black" : "text-sm"}`}>
                      {isKing ? b.winRate : b.orders || b.winRate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content: Table + Sidebar */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Leaderboard Table */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 px-4">
              <h2 className="text-2xl font-bold">Rankings Elite 4-10</h2>
              <div className="flex gap-2">
                <button className="glass-card p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Icon name="filter_list" size={16} />
                </button>
                <button className="glass-card p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Icon name="sort" size={16} />
                </button>
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Nome do Booster</th>
                    <th className="px-6 py-4">Jogos</th>
                    <th className="px-6 py-4">Win Rate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leaderboard.map((b) => (
                    <tr
                      key={b.rank}
                      className="hover:bg-primary/5 hover:shadow-[inset_0_0_15px_rgba(46,123,255,0.1)] transition-all group"
                    >
                      <td className="px-6 py-5 font-bold text-gray-500 group-hover:text-primary">
                        #{b.rank}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-gray-800 border border-white/10" />
                          <span className="font-bold">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-1">
                          {b.games.map((g) => (
                            <span
                              key={g}
                              className="text-[9px] bg-white/5 px-2 py-1 rounded text-gray-300"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-accent-cyan font-bold">{b.winRate}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full animate-pulse ${
                              b.status === "Disponível" ? "bg-green-500" : "bg-primary"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              b.status === "Disponível" ? "text-green-500" : "text-primary"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/boosters/${b.name.toLowerCase()}`}
                          className="text-xs font-bold text-primary hover:text-white transition-colors"
                        >
                          Ver Perfil
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="xl:w-80 space-y-8">
            <div className="glass-card rounded-xl p-8 border-primary/20 sticky top-24">
              <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="verified_user" className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Seja um Pro</h3>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Acha que tem o que é preciso para entrar no top 1%? Estamos sempre
                em busca de talentos de classe mundial para o time EloDark.
              </p>
              <ul className="space-y-4 mb-10">
                {["ELO Alto Verificado", "Conduta profissional", "Pagamentos instantâneos"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Icon name="check_circle" className="text-primary" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/apply"
                className="block w-full bg-primary hover:bg-primary/90 transition-all text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-primary/20 text-center"
              >
                Candidatar-se
              </Link>
            </div>

            <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-accent-cyan/5 to-primary/5 border-accent-cyan/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-8 bg-accent-cyan rounded flex items-center justify-center">
                  <Icon name="support_agent" className="text-bg-primary" size={18} />
                </div>
                <h4 className="font-bold">Precisa de um Booster?</h4>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Nossos especialistas podem encontrar o booster perfeito para seus
                objetivos em até 5 minutos.
              </p>
              <Link
                href="/dashboard/chat"
                className="text-accent-cyan text-xs font-bold flex items-center gap-2 hover:underline"
              >
                Abrir Chat ao Vivo
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
