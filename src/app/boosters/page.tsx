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

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16 w-full">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {loading ? "Carregando..." : `${boosters.length} boosters ativos`}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            Esquadrão Elite
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            O top 1% dos jogadores competitivos do Brasil.
            Selecionados por excelência, desempenho e profissionalismo.
          </p>
        </div>

        {/* Boosters Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {boosters.map((b, i) => {
              const isFirst = i === 0;
              return (
                <div
                  key={b.id}
                  className={`glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 ${
                    isFirst
                      ? "border-2 border-accent-gold shadow-[0_0_24px_rgba(255,215,0,0.15)]"
                      : "border border-white/5"
                  }`}
                >
                  {/* Posição */}
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isFirst
                      ? "bg-accent-gold/20 text-accent-gold"
                      : "bg-white/5 text-white/40"
                  }`}>
                    {isFirst ? (
                      <span className="flex items-center gap-1">
                        <Icon name="rewarded_ads" size={12} filled /> #1
                      </span>
                    ) : (
                      `#${i + 1}`
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`flex items-center justify-center rounded-full bg-white/5 ${
                    isFirst
                      ? "size-24 text-5xl border-2 border-accent-gold/50"
                      : "size-20 text-4xl border border-white/10"
                  }`}>
                    {b.avatar_emoji || "🎮"}
                  </div>

                  {/* Nome e rank */}
                  <div>
                    <h3 className={`font-bold ${isFirst ? "text-xl" : "text-base"}`}>
                      {b.game_name}
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${
                      isFirst ? "text-accent-gold" : "text-white/40"
                    }`}>
                      {b.rank}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <div className="bg-white/5 rounded-lg py-2">
                      <p className="text-[10px] text-white/30 uppercase font-bold">Win Rate</p>
                      <p className="text-sm font-bold text-accent-cyan">{b.win_rate}%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg py-2">
                      <p className="text-[10px] text-white/30 uppercase font-bold">Pedidos</p>
                      <p className="text-sm font-bold text-white">{b.games_played ?? 0}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Banner */}
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Quer fazer parte da equipe?</h2>
            <p className="text-gray-400 text-sm max-w-lg">
              Estamos sempre em busca dos melhores jogadores do Brasil.
              Mostre seu elo e comece a faturar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/apply"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all text-sm text-center shadow-lg shadow-primary/20"
            >
              Candidatar-se
            </Link>
            <Link
              href="/boost/lol"
              className="px-8 py-3 glass-card border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm text-center"
            >
              Contratar um Booster
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
