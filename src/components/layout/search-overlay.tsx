"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";

const trendingSearches = ["Duo Queue", "Ferro ao Ouro", "Partidas de MD10"];

const gameResults = [
  { name: "League of Legends", slug: "league-of-legends" },
  { name: "Valorant", slug: "valorant" },
  { name: "Counter-Strike 2", slug: "cs2" },
];

const boosterResults = [
  { name: "Alpha", rating: "5.0", orders: "200+", online: true },
  { name: "Shadow", rating: "4.9", orders: "150+", online: true },
  { name: "ApexMaster", rating: "4.8", orders: "89+", online: false },
];

const recentSearches = ["LoL Mestre", "Valorant Radiante", "Coaching"];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl bg-primary/10" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-3xl bg-accent-cyan/5" />
      </div>

      <div className="relative z-10 min-h-screen w-full flex flex-col p-6 md:p-12 lg:px-40">
        {/* Header / Close Button */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <Icon name="rocket_launch" className="text-primary" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              Elo<span className="text-primary">Dark</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="group flex items-center justify-center size-12 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <Icon
              name="close"
              className="text-gray-400 group-hover:text-primary transition-colors"
            />
          </button>
        </header>

        {/* Main Search */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Icon
                name="search"
                className="text-gray-500 group-focus-within:text-primary transition-colors"
              />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 pl-16 pr-8 text-2xl md:text-3xl text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:shadow-[0_0_20px_rgba(46,123,255,0.4)] focus:border-primary transition-all duration-300"
              placeholder="Buscar jogos, boosters ou ranks..."
              type="text"
            />
          </div>

          {/* Trending */}
          <div className="mt-8 flex flex-wrap items-center gap-4 px-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              Em Alta:
            </span>
            <div className="flex flex-wrap gap-3">
              {trendingSearches.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="text-sm text-gray-300 hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <Icon name="trending_up" size={16} /> {t}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            {/* Games */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Icon name="sports_esports" className="text-primary" /> Jogos
                </h2>
                <a className="text-xs text-primary font-bold hover:underline" href="/games">
                  Ver Todos
                </a>
              </div>
              <div className="space-y-3">
                {gameResults.map((g) => (
                  <a
                    key={g.slug}
                    href={`/boost/${g.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-gray-800 flex items-center justify-center">
                        <Icon name="sports_esports" className="text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white">
                        {g.name}
                      </span>
                    </div>
                    <Icon
                      name="chevron_right"
                      className="text-gray-600 group-hover:text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                ))}
              </div>
            </section>

            {/* Top Boosters */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Icon name="verified" className="text-primary" /> Top Boosters
                </h2>
                <a className="text-xs text-primary font-bold hover:underline" href="/boosters">
                  Ranking
                </a>
              </div>
              <div className="space-y-3">
                {boosterResults.map((b) => (
                  <a
                    key={b.name}
                    href={`/boosters/${b.name.toLowerCase()}`}
                    className="flex items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="size-12 rounded-full bg-primary/20 border-2 border-primary/50" />
                      <div
                        className={`absolute bottom-0 right-0 size-3 ${
                          b.online ? "bg-green-500" : "bg-orange-500"
                        } border-2 border-bg-primary rounded-full`}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-primary transition-colors">
                          {b.name}
                        </span>
                        <div className="flex items-center text-primary text-xs">
                          <Icon name="star" size={14} filled />
                          <span className="ml-1 font-bold">{b.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {b.orders} Pedidos Concluídos
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Recent Searches */}
          <footer className="mt-20 flex flex-col items-center">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">
              Buscas Recentes
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-400 cursor-pointer flex items-center gap-2 transition-all"
                >
                  <Icon name="history" size={18} /> {s}
                </button>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
