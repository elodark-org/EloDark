"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// Configuração de ranks por jogo
const gameRanks: Record<string, Array<{ id: string; label: string; image: string }>> = {
  "league-of-legends": [
    { id: "iron", label: "Iron", image: "/assets/games/league-of-legends/badge-iron.png" },
    { id: "bronze", label: "Bronze", image: "/assets/games/league-of-legends/badge-bronze.png" },
    { id: "gold", label: "Gold", image: "/assets/games/league-of-legends/badge-gold.png" },
    { id: "platinum", label: "Platinum", image: "/assets/games/league-of-legends/badge-platinum.png" },
    { id: "diamond", label: "Diamond", image: "/assets/games/league-of-legends/badge-diamond.png" },
    { id: "emerald", label: "Emerald", image: "/assets/games/league-of-legends/badge-emerald.png" },
    { id: "master", label: "Master", image: "/assets/games/league-of-legends/badge-master.png" },
  ],
  valorant: [
    { id: "iron", label: "Ferro", image: "/assets/games/valorant/Ferro.png" },
    { id: "bronze", label: "Bronze", image: "/assets/games/valorant/Bronze.png" },
    { id: "silver", label: "Prata", image: "/assets/games/valorant/Prata.png" },
    { id: "gold", label: "Ouro", image: "/assets/games/valorant/Ouro.png" },
    { id: "platinum", label: "Platina", image: "/assets/games/valorant/Platina.png" },
    { id: "diamond", label: "Diamante", image: "/assets/games/valorant/Diamante.png" },
    { id: "ascendant", label: "Ascendente", image: "/assets/games/valorant/Ascendente.png" },
    { id: "immortal", label: "Imortal", image: "/assets/games/valorant/Imortal.png" },
    { id: "radiant", label: "Radiante", image: "/assets/games/valorant/Radiante-shadow-2.png" },
  ],
  // Fallback para outros jogos (usando as imagens do Google como antes)
  default: [
    { id: "iron", label: "Iron", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo5Z1WTtojOScmWJ_5XqUNgcl_2w2Y2pQ6xkpCPpgiMHq5-TUxwFezSbq2MNZuFkXIbaC-PTOOgWLgTJJamWbncKTwQdwoz-Y6s5j8gmYmW3n1scieZtHK3V6RYlABfjc3_oUYoqvv3tMQaCCk4uVade5fhO5CUEHHeHflNevh1v8CzklH2NEDVKVG589dko-sdO80RGJZUwxeZwtfwqhS1SZo8c0OkMgZOtMHvfiuRNS517kLlOHfaN4TbZlELAhg8p8qMcDmN2Qc" },
    { id: "bronze", label: "Bronze", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOnL1DBWNXb4HDLrCWLfEjdM3YUVGgVLUF0-DqrbKvGiTkjZgnAQi9Il7NTiBsQsElyqQx5jlxtgl7ThXZ6GITQRCplYQa3QYa9WuqcKDsVz91uqurRDC4pAx-SdFhQy6-AwaUU0JhTGEQHIBfauMU6lXIdMbRbHKO7tN6TaJJjTsyfv1GR_F_mAPyR3Mhe6g61rsxugUJ1e9XVZiRYHVKqaY9vUkgSvSj-UGOAFD-XYme0f1J9H-8FW1o-HuV6jVGEsjw6JPb7JS" },
    { id: "silver", label: "Silver", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN75JN_zghoWh2ncebHSh7eqysaR8MOsvn96ohyDnfzjhRm6tziWlGpSE3pP4ezC5LBgESkkRFDvlndPJ9t9NVm1fFGXC01c0ZpO-d0rl9QJVCyl0F-sQEc7Lk6jLdVpMDn7RTbYZAQPhkCa-oJaPrGvYX-Qob2ajx34FiNUjX3Z1FSkZDjOXKc9Bq085PzTJKLupANzXE4g-KWW7wihFx-2VGnJeYI9mywQPurqYNiqn2-fRi40lc2Hrx0BbF0EaRdDIAgMbdJnQt" },
    { id: "gold", label: "Gold", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMNfjcoBGgxvz7InbzNZKMVCq-KUsbvUrzP_FNNczKivoE6m28xJHlaC0_f7B5BCDP_V5MU3TIBVvaBQzTUiilnUMWu_-n2EhUyM4kSk0uN3VJu9kWrWfUPHH5mz_TAl-a2kJJD3NoXIffle6u3KJ7U4ga7Jj99eV9Y1LMduvJazKbf9ontxjRP-tnAOW5AYJCh7rvTI6M65a2cN9FHfpIrg4xQPQWepekOyXixLZFXv4g1Q4U0Jx2EHgzO5YnMjFv7Lxx_zJkkWtJ" },
    { id: "platinum", label: "Platinum", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYb70dbmyima1oWD-G48K8xALRz-xImVtRqsmJ5PFiwsb8PYqTqvD4n45mFKuD39nYmJQTMK1MrMplgpG1Rxp-BUM9QhEsY-7uWEieMWZ0OfvcUNE0BDQdkM-1f5H0pEVSc5PBfHVZRHtSMbBr7L15EMAxJkp1l3kMVCQTC4R9XzFWiYzl6hl9Iquc4k-gMOIHC6xi3NIt_-lwdOwSbTr-IcVBqx0aFA6_l6PNT2phuEzzI9rm-HMjqyEgdxRPlbsZUeCOsuKx9mBC" },
  ]
};

const rankLabels = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"];

const gameTitles: Record<string, string> = {
  "league-of-legends": "League of Legends",
  valorant: "Valorant",
  cs2: "CS2",
  "dota-2": "Dota 2",
  "marvel-rivals": "Marvel Rivals",
  "rocket-league": "Rocket League",
};

export default function OrderConfiguratorPage() {
  const params = useParams();
  const gameSlug = params.game as string;
  const gameTitle = gameTitles[gameSlug] || gameSlug;
  
  // Pegar os ranks específicos do jogo atual
  const ranks = gameRanks[gameSlug] || gameRanks.default;
  
  // Usar o primeiro rank disponível como padrão ou "gold" se existir
  const defaultRank = ranks.find(r => r.id === "gold")?.id || ranks[Math.min(2, ranks.length - 1)].id;
  const [currentRank, setCurrentRank] = useState(defaultRank);
  const [desiredRankIdx, setDesiredRankIdx] = useState(7);
  const [options, setOptions] = useState({
    duoQueue: true,
    selectRole: false,
    expressOrder: false,
    offlineMode: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const data = await api.post<{ url: string }>("/checkout/create-session", {
        service_type: "elo-boost",
        price: total,
        config: {
          game: gameSlug,
          current_rank: currentRank,
          desired_rank: rankLabels[desiredRankIdx],
          options: {
            duo_queue: options.duoQueue,
            select_role: options.selectRole,
            express_order: options.expressOrder,
            offline_mode: options.offlineMode,
          },
        },
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError("Erro ao criar sessão de pagamento");
      }
    } catch (error: any) {
      setCheckoutError(error.message || "Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  }

  const basePrice = 32.0;
  const duoPrice = options.duoQueue ? 13.99 : 0;
  const rolePrice = options.selectRole ? basePrice * 0.15 : 0;
  const expressPrice = options.expressOrder ? basePrice * 0.25 : 0;
  const total = basePrice + duoPrice + rolePrice + expressPrice;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-2">Boost de {gameTitle}</h2>
          <p className="text-white/60">
            Configure seu pedido e alcance o rank dos seus sonhos em dias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Configurator */}
          <div className="lg:col-span-8 space-y-10">
            {/* Current Rank */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="military_tech" className="text-primary" />
                <h3 className="text-xl font-bold">Selecione Seu Rank Atual</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {ranks.map((rank) => (
                  <button
                    key={rank.id}
                    onClick={() => setCurrentRank(rank.id)}
                    className={`group cursor-pointer aspect-square glass-card rounded-xl flex flex-col items-center justify-center p-4 border-2 transition-all ${
                      currentRank === rank.id
                        ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(46,123,255,0.4)]"
                        : "border-transparent hover:border-primary/40"
                    }`}
                  >
                    <Image
                      src={rank.image}
                      alt={rank.label}
                      width={currentRank === rank.id ? 80 : 64}
                      height={currentRank === rank.id ? 80 : 64}
                      className={`mb-2 transition-opacity ${
                        currentRank === rank.id
                          ? "opacity-100"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        currentRank === rank.id
                          ? "text-primary"
                          : "text-white/40 group-hover:text-white"
                      }`}
                    >
                      {rank.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Desired Rank Slider */}
            <section className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Icon name="stars" className="text-primary" />
                  <h3 className="text-xl font-bold">Rank Desejado</h3>
                </div>
                <div className="text-primary font-bold text-lg">
                  {rankLabels[desiredRankIdx]}
                </div>
              </div>
              <div className="relative pt-6 pb-2">
                <input
                  type="range"
                  min={0}
                  max={9}
                  value={desiredRankIdx}
                  onChange={(e) => setDesiredRankIdx(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-4 text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                  {rankLabels.map((label, i) => (
                    <span
                      key={label}
                      className={i === desiredRankIdx ? "text-primary" : ""}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Boost Options */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duo Queue */}
              <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg text-primary">
                    <Icon name="group" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Duo Queue</h4>
                    <p className="text-xs text-white/50">Jogue com o booster</p>
                  </div>
                </div>
                <Toggle
                  checked={options.duoQueue}
                  onChange={(v) => setOptions({ ...options, duoQueue: v })}
                />
              </div>

              {/* Select Role */}
              <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg text-primary">
                    <Icon name="person_pin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Escolher Role</h4>
                    <p className="text-xs text-white/50">Mid, Top, Jung, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                    +15%
                  </span>
                  <Toggle
                    checked={options.selectRole}
                    onChange={(v) => setOptions({ ...options, selectRole: v })}
                  />
                </div>
              </div>

              {/* Express Order (VIP) */}
              <div className="glass-card p-5 rounded-xl border border-accent-gold/20 hover:border-accent-gold/40 transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent-gold text-black text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  VIP
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-gold/10 rounded-lg text-accent-gold">
                    <Icon name="rocket_launch" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-accent-gold">
                      Pedido Expresso
                    </h4>
                    <p className="text-xs text-white/50">Prioridade na fila</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-accent-gold/20 text-accent-gold px-2 py-1 rounded">
                    +25%
                  </span>
                  <Toggle
                    checked={options.expressOrder}
                    onChange={(v) => setOptions({ ...options, expressOrder: v })}
                    color="gold"
                  />
                </div>
              </div>

              {/* Offline Mode */}
              <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg text-primary">
                    <Icon name="visibility_off" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Modo Offline</h4>
                    <p className="text-xs text-white/50">
                      Ficar invisível na lista de amigos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    GRÁTIS
                  </span>
                  <Toggle
                    checked={options.offlineMode}
                    onChange={(v) => setOptions({ ...options, offlineMode: v })}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right: Sticky Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-card rounded-2xl p-6 border border-primary/30 shadow-[0_0_20px_rgba(46,123,255,0.4)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 size-40 bg-primary/20 blur-[80px]" />

              <h3 className="text-xl font-bold mb-6 flex items-center justify-between relative z-10">
                Resumo do Pedido
                <Icon name="receipt_long" className="text-white/20" />
              </h3>

              <div className="space-y-4 mb-8 relative z-10">
                {/* Rank Display */}
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Atual
                    </span>
                    <span className="text-sm font-bold capitalize">
                      {currentRank} IV
                    </span>
                  </div>
                  <Icon name="arrow_forward" className="text-primary/40" size={14} />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Desejado
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {rankLabels[desiredRankIdx]} I
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 px-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Taxa Base de Boost</span>
                    <span className="font-medium">R$ {basePrice.toFixed(2)}</span>
                  </div>
                  {options.duoQueue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Duo Queue</span>
                      <span className="font-medium">R$ {duoPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {options.selectRole && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Seleção de Role (+15%)</span>
                      <span className="font-medium">R$ {rolePrice.toFixed(2)}</span>
                    </div>
                  )}
                  {options.expressOrder && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Expresso (+25%)</span>
                      <span className="font-medium">R$ {expressPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {options.offlineMode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Modo Offline</span>
                      <span className="text-green-400 font-bold">GRÁTIS</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon name="schedule" className="text-primary" size={14} />
                      <span className="text-xs text-white/60">Prazo Estimado</span>
                    </div>
                    <span className="text-xs font-bold">2 - 4 Dias</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">
                  Valor Total
                </div>
                <div className="text-4xl font-black text-white">
                  R$ {total.toFixed(2)}
                </div>
              </div>

              <Button
                size="lg"
                iconRight={isLoading ? undefined : "shopping_cart_checkout"}
                className="w-full mb-4 relative z-10"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Redirecionando..." : "Finalizar Compra"}
              </Button>
              {checkoutError && (
                <p className="text-red-400 text-xs text-center -mt-2 mb-2 relative z-10">
                  {checkoutError}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 py-2 opacity-40 relative z-10">
                <Icon name="verified_user" size={18} />
                <Icon name="shield_with_heart" size={18} />
                <Icon name="lock" size={18} />
              </div>
            </div>

            {/* Trust Signal */}
            <div className="mt-6 glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon name="support_agent" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Suporte Prioritário 24/7</h4>
                <p className="text-[11px] text-white/50">
                  Chat ao vivo disponível para este pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
