"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Booster {
  id: number;
  game_name: string;
  rank: string;
  win_rate: number;
  games_played: number;
  avatar_emoji: string;
}

export default function BoostersPage() {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/boosters")
      .then((r) => r.json())
      .then((d) => setBoosters(d.boosters ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // top 3 já vêm ordenados por win_rate DESC da API
  const top3 = boosters.slice(0, 3);
  const rest = boosters.slice(3);

  // Pódio: rank2 (esq) | rank1 (centro, maior) | rank3 (dir)
  const podium: (Booster & { pos: number })[] = [];
  if (top3[1]) podium.push({ ...top3[1], pos: 2 });
  if (top3[0]) podium.push({ ...top3[0], pos: 1 });
  if (top3[2]) podium.push({ ...top3[2], pos: 3 });

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Esquadrão Elite
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            O top 1% dos jogadores competitivos do Brasil. Selecionados por
            excelência, desempenho e profissionalismo.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-white/30">
            <Icon name="hourglass_top" className="animate-spin mr-3" size={24} />
            Carregando equipe...
          </div>
        ) : boosters.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <Icon name="group" size={48} className="mb-4 mx-auto block" />
            <p>Nenhum booster cadastrado ainda.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Pódio */}
            {top3.length > 0 && (
              <div className="flex flex-col lg:flex-row items-end justify-center gap-6 mb-20 px-4">
                {podium.map((b) => {
                  const isKing = b.pos === 1;
                  return (
                    <div
                      key={b.id}
                      className={`glass-card rounded-xl flex flex-col items-center relative w-full ${
                        isKing
                          ? "lg:w-80 p-8 border-2 border-accent-gold shadow-[0_0_30px_rgba(255,215,0,0.2)] lg:scale-105 z-10"
                          : `lg:w-72 p-6 ${b.pos === 2 ? "border-primary/20" : "border-accent-cyan/20"}`
                      }`}
                    >
                      {isKing ? (
                        <div className="absolute -top-6 text-accent-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                          <Icon name="rewarded_ads" size={36} filled />
                        </div>
                      ) : (
                        <div className="absolute -top-4 bg-gray-800 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                          #{b.pos} Rank
                        </div>
                      )}

                      <div
                        className={`rounded-full flex items-center justify-center mb-4 ${
                          isKing
                            ? "size-32 border-4 border-accent-gold shadow-[0_0_30px_rgba(255,215,0,0.2)] text-6xl"
                            : `size-24 border-2 ${
                                b.pos === 2 ? "border-primary/30" : "border-accent-cyan/30"
                              } text-4xl`
                        } bg-white/5`}
                      >
                        {b.avatar_emoji || "🎮"}
                      </div>

                      <h3 className={`font-bold mb-1 ${isKing ? "text-2xl font-black" : "text-xl"}`}>
                        {b.game_name}
                      </h3>
                      <p className={`text-xs font-bold tracking-widest uppercase mb-4 ${
                        isKing ? "text-accent-gold" : "text-white/40"
                      }`}>
                        {b.rank}
                      </p>

                      <div className={`grid grid-cols-2 w-full gap-4 text-center border-t ${
                        isKing ? "border-white/10 pt-6" : "border-white/5 pt-4"
                      }`}>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Win Rate</p>
                          <p className={`font-bold text-accent-cyan ${
                            isKing ? "text-lg font-black" : "text-sm"
                          }`}>
                            {b.win_rate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Pedidos</p>
                          <p className={`font-bold ${isKing ? "text-lg font-black" : "text-sm"}`}>
                            {b.games_played ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tabela restante */}
            <div className="flex flex-col xl:flex-row gap-8">
              <div className="flex-1">
                {rest.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-6 px-4">
                      <h2 className="text-2xl font-bold">
                        Rankings Elite {top3.length + 1}–{boosters.length}
                      </h2>
                    </div>

                    <div className="glass-card rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Booster</th>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Win Rate</th>
                            <th className="px-6 py-4">Pedidos</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {rest.map((b, i) => (
                            <tr
                              key={b.id}
                              className="hover:bg-primary/5 hover:shadow-[inset_0_0_15px_rgba(46,123,255,0.1)] transition-all group"
                            >
                              <td className="px-6 py-5 font-bold text-gray-500 group-hover:text-primary">
                                #{top3.length + i + 1}
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                                    {b.avatar_emoji || "🎮"}
                                  </div>
                                  <span className="font-bold">{b.game_name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-accent-gold text-xs font-bold uppercase">{b.rank}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-accent-cyan font-bold">{b.win_rate}%</span>
                              </td>
                              <td className="px-6 py-5 text-white/60">
                                {b.games_played ?? 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
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
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
