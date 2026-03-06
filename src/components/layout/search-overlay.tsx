"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

const trendingSearches = ["Duo Queue", "Ferro ao Ouro", "Subir de Rank"];

// Dados reais da plataforma
const ALL_GAMES = [
  { name: "League of Legends", slug: "league-of-legends", icon: "sports_esports", desc: "Suba de elo no LoL" },
  { name: "Valorant", slug: "valorant", icon: "sports_esports", desc: "Suba de rank no Valorant" },
];

const ALL_SERVICES = [
  { name: "Elo Boost", slug: "league-of-legends", game: "League of Legends", icon: "rocket_launch" },
  { name: "Duo Queue", slug: "league-of-legends", game: "League of Legends", icon: "group" },
  { name: "Elo Boost", slug: "valorant", game: "Valorant", icon: "rocket_launch" },
  { name: "Duo Queue", slug: "valorant", game: "Valorant", icon: "group" },
  { name: "Coaching", slug: "league-of-legends", game: "League of Legends", icon: "school" },
];

const ALL_RANKS = [
  { name: "Ferro ao Ouro", slug: "league-of-legends", game: "LoL", icon: "military_tech" },
  { name: "Prata ao Platina", slug: "league-of-legends", game: "LoL", icon: "military_tech" },
  { name: "Ouro ao Diamante", slug: "league-of-legends", game: "LoL", icon: "military_tech" },
  { name: "Ferro ao Ouro", slug: "valorant", game: "Valorant", icon: "military_tech" },
  { name: "Prata ao Platina", slug: "valorant", game: "Valorant", icon: "military_tech" },
  { name: "Radiante", slug: "valorant", game: "Valorant", icon: "military_tech" },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
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

  // Filtro em tempo real
  const q = query.toLowerCase().trim();
  const filteredGames = useMemo(() =>
    q ? ALL_GAMES.filter(g => g.name.toLowerCase().includes(q)) : ALL_GAMES,
    [q]
  );
  const filteredServices = useMemo(() =>
    q ? ALL_SERVICES.filter(s =>
      s.name.toLowerCase().includes(q) || s.game.toLowerCase().includes(q)
    ) : [],
    [q]
  );
  const filteredRanks = useMemo(() =>
    q ? ALL_RANKS.filter(r =>
      r.name.toLowerCase().includes(q) || r.game.toLowerCase().includes(q)
    ) : [],
    [q]
  );

  const hasResults = filteredGames.length > 0 || filteredServices.length > 0 || filteredRanks.length > 0;

  function handleNavigate(slug: string) {
    router.push(`/boost/${slug}`);
    onClose();
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && filteredGames.length > 0) {
      handleNavigate(filteredGames[0].slug);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl bg-primary/10" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-3xl bg-accent-cyan/5" />
      </div>

      <div className="relative z-10 min-h-screen w-full flex flex-col p-6 md:p-12 lg:px-40">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="EloDark" className="w-10 h-10 rounded-xl object-cover" style={{ objectPosition: "center 20%" }} />
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              Elo<span className="text-primary">Dark</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="group flex items-center justify-center size-12 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <Icon name="close" className="text-gray-400 group-hover:text-primary transition-colors" />
          </button>
        </header>

        {/* Search Input */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Icon name="search" className="text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-8 pl-16 pr-8 text-2xl md:text-3xl text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:shadow-[0_0_20px_rgba(236,19,236,0.3)] focus:border-primary transition-all duration-300"
              placeholder="Buscar jogos, serviços ou ranks..."
              type="text"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-6 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>

          {/* Trending (quando sem query) */}
          {!q && (
            <div className="mt-8 flex flex-wrap items-center gap-4 px-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Em Alta:</span>
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
          )}

          {/* Resultados filtrados */}
          {q && (
            <div className="mt-8 space-y-8">
              {!hasResults && (
                <div className="text-center py-12">
                  <Icon name="search_off" size={48} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum resultado para <span className="text-white">&quot;{query}&quot;</span></p>
                </div>
              )}

              {filteredGames.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icon name="sports_esports" size={14} className="text-primary" /> Jogos
                  </h2>
                  <div className="space-y-2">
                    {filteredGames.map((g) => (
                      <button
                        key={g.slug}
                        onClick={() => handleNavigate(g.slug)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Icon name="sports_esports" className="text-primary" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{g.name}</p>
                            <p className="text-xs text-gray-500">{g.desc}</p>
                          </div>
                        </div>
                        <Icon name="arrow_forward" size={16} className="text-gray-600 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {filteredServices.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icon name="rocket_launch" size={14} className="text-primary" /> Serviços
                  </h2>
                  <div className="space-y-2">
                    {filteredServices.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleNavigate(s.slug)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                            <Icon name={s.icon} className="text-accent-purple" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.game}</p>
                          </div>
                        </div>
                        <Icon name="arrow_forward" size={16} className="text-gray-600 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {filteredRanks.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icon name="military_tech" size={14} className="text-primary" /> Ranks
                  </h2>
                  <div className="space-y-2">
                    {filteredRanks.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => handleNavigate(r.slug)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
                            <Icon name="military_tech" className="text-yellow-400" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{r.name}</p>
                            <p className="text-xs text-gray-500">{r.game}</p>
                          </div>
                        </div>
                        <Icon name="arrow_forward" size={16} className="text-gray-600 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Grid padrão (sem query) */}
          {!q && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              {/* Games */}
              <section>
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Icon name="sports_esports" className="text-primary" /> Jogos
                  </h2>
                </div>
                <div className="space-y-3">
                  {ALL_GAMES.map((g) => (
                    <button
                      key={g.slug}
                      onClick={() => handleNavigate(g.slug)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Icon name="sports_esports" className="text-primary" size={20} />
                        </div>
                        <span className="font-medium text-gray-200 group-hover:text-white">{g.name}</span>
                      </div>
                      <Icon name="chevron_right" className="text-gray-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Serviços */}
              <section>
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Icon name="rocket_launch" className="text-primary" /> Serviços
                  </h2>
                </div>
                <div className="space-y-3">
                  {ALL_SERVICES.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleNavigate(s.slug)}
                      className="w-full flex items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="size-12 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mr-4">
                        <Icon name={s.icon} className="text-accent-purple" size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white group-hover:text-primary transition-colors">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.game}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
