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
      <main className="min-h-screen relative overflow-x-hidden">
        {/* Background ambient */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 animated-grid opacity-[0.04]" />
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-purple/8 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
              <Icon name="home" size={14} />
              Início
            </Link>
            <Icon name="chevron_right" size={14} className="text-gray-700" />
            <span className="text-sm text-gray-300">Boosters</span>
          </div>

          {/* Hero */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {loading ? "Carregando..." : `${boosters.length} boosters ativos`}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
              Esquadrão{" "}
              <span className="text-primary">Elite</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              O top 1% dos jogadores competitivos do Brasil. Selecionados por excelência, desempenho e profissionalismo.
            </p>
          </div>

          {/* Boosters Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32 text-white/30">
              <Icon name="hourglass_top" className="animate-spin mr-3" size={24} />
              Carregando equipe...
            </div>
          ) : boosters.length === 0 ? (
            <div className="text-center py-32">
              <div className="size-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="group" size={36} className="text-white/20" />
              </div>
              <p className="text-white/30 text-lg">Nenhum booster cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-20">
              {boosters.map((b, i) => {
                const isFirst = i === 0;
                return (
                  <div
                    key={b.id}
                    className={`glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                      isFirst
                        ? "border-2 border-accent-gold shadow-[0_0_30px_rgba(255,215,0,0.12)]"
                        : "border border-white/5 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(236,19,236,0.08)]"
                    }`}
                  >
                    {/* Rank badge */}
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
                    <div className={`flex items-center justify-center rounded-full ${
                      isFirst
                        ? "size-24 text-5xl border-2 border-accent-gold/50 bg-accent-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                        : "size-20 text-4xl border border-white/10 bg-white/5"
                    }`}>
                      {b.avatar_emoji || "🎮"}
                    </div>

                    {/* Nome e rank */}
                    <div>
                      <h3 className={`font-black uppercase tracking-tight ${isFirst ? "text-xl text-white" : "text-base text-gray-200"}`}>
                        {b.game_name}
                      </h3>
                      <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                        isFirst ? "text-accent-gold" : "text-primary/70"
                      }`}>
                        {b.rank}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="w-full pt-3 border-t border-white/5">
                      <div className="bg-white/5 rounded-xl py-2.5">
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-0.5">Win Rate</p>
                        <p className="text-sm font-black text-accent-cyan">{b.win_rate}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Banner */}
          <div className="relative rounded-2xl p-8 md:p-12 border border-primary/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-primary/8 via-transparent to-accent-purple/5">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Quer fazer parte da equipe?</h2>
              <p className="text-gray-400 text-sm max-w-lg">
                Estamos sempre em busca dos melhores jogadores do Brasil. Mostre seu elo e comece a faturar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative">
              <Link
                href="/apply"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all text-sm text-center shadow-lg shadow-primary/30"
              >
                Candidatar-se
              </Link>
              <Link
                href="/boost/league-of-legends"
                className="px-8 py-3 glass-card border border-white/10 hover:border-primary/30 hover:bg-white/5 text-white font-bold rounded-xl transition-all text-sm text-center"
              >
                Contratar um Booster
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
