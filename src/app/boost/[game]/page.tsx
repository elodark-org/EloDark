"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";


// ── Tipos ──
type RankInfo = { id: string; label: string; image: string; divisions: number };
type LpRange = { label: string; discount: number };

// ── Ranks por jogo ──
const gameRanks: Record<string, RankInfo[]> = {
  "league-of-legends": [
    { id: "iron", label: "Ferro", image: "/assets/games/league-of-legends/badge-iron.png", divisions: 4 },
    { id: "bronze", label: "Bronze", image: "/assets/games/league-of-legends/badge-bronze.png", divisions: 4 },
    { id: "silver", label: "Prata", image: "/assets/games/league-of-legends/badge-bronze.png", divisions: 4 },
    { id: "gold", label: "Ouro", image: "/assets/games/league-of-legends/badge-gold.png", divisions: 4 },
    { id: "platinum", label: "Platina", image: "/assets/games/league-of-legends/badge-platinum.png", divisions: 4 },
    { id: "emerald", label: "Esmeralda", image: "/assets/games/league-of-legends/badge-emerald.png", divisions: 4 },
    { id: "diamond", label: "Diamante", image: "/assets/games/league-of-legends/badge-diamond.png", divisions: 4 },
    { id: "master", label: "Mestre", image: "/assets/games/league-of-legends/badge-master.png", divisions: 1 },
  ],
  valorant: [
    { id: "iron", label: "Ferro", image: "/assets/games/valorant/Ferro.png", divisions: 3 },
    { id: "bronze", label: "Bronze", image: "/assets/games/valorant/Bronze.png", divisions: 3 },
    { id: "silver", label: "Prata", image: "/assets/games/valorant/Prata.png", divisions: 3 },
    { id: "gold", label: "Ouro", image: "/assets/games/valorant/Ouro.png", divisions: 3 },
    { id: "platinum", label: "Platina", image: "/assets/games/valorant/Platina.png", divisions: 3 },
    { id: "diamond", label: "Diamante", image: "/assets/games/valorant/Diamante.png", divisions: 3 },
    { id: "ascendant", label: "Ascendente", image: "/assets/games/valorant/Ascendente.png", divisions: 3 },
    { id: "immortal", label: "Imortal", image: "/assets/games/valorant/Imortal.png", divisions: 3 },
    { id: "radiant", label: "Radiante", image: "/assets/games/valorant/Radiante-shadow-2.png", divisions: 1 },
  ],
};

// ── Faixas de PDL ──
const lpRanges: LpRange[] = [
  { label: "0 - 20", discount: 0 },
  { label: "21 - 40", discount: 0.10 },
  { label: "41 - 60", discount: 0.15 },
  { label: "61 - 80", discount: 0.20 },
  { label: "81 - 100", discount: 0.30 },
];

// ── Tabela de preços LoL (Preço Final com 25% OFF, base 0-20 PDL) ──
// Preço por divisão para cada rank (exceto Diamante que tem preço por transição)
const lolPricePerDivision: Record<string, number> = {
  iron: 12.99,
  bronze: 14.99,
  silver: 16.99,
  gold: 17.99,
  platinum: 23.39,
  emerald: 38.69,
};

// Diamante: preço específico por transição de divisão (base 0-20 PDL, com 25% OFF)
const lolDiamondPrices: Record<string, number> = {
  "4>3": 75.00,
  "3>2": 72.00,
  "2>1": 76.50,
  "1>master": 87.00,
};

// Divisões: IV=4, III=3, II=2, I=1
const divisionLabels = ["IV", "III", "II", "I"];
const divisionValues = [4, 3, 2, 1];

// ── Cálculo de preço LoL ──
function calculateLolBoostPrice(
  fromRankId: string,
  fromDiv: number,
  toRankId: string,
  toDiv: number,
  lpDiscount: number,
  ranks: RankInfo[]
): number {
  // Converter posição para índice linear (0 = rank mais baixo, divisão mais alta)
  // Iron IV = 0, Iron III = 1, ..., Iron I = 3, Bronze IV = 4, ...
  function toLinearIndex(rankId: string, div: number): number {
    let idx = 0;
    for (const rank of ranks) {
      if (rank.id === rankId) {
        // div: 4=IV(mais baixo), 1=I(mais alto)
        // Para ranks com 4 divisões: IV=0, III=1, II=2, I=3
        idx += (rank.divisions - div);
        return idx;
      }
      idx += rank.divisions;
    }
    return idx;
  }

  // Construir array de preços para cada transição step[i] -> step[i+1]
  function buildPriceSteps(): number[] {
    const steps: number[] = [];
    for (const rank of ranks) {
      if (rank.id === "master") break;

      if (rank.id === "diamond") {
        // Diamond tem preço específico por transição
        if (rank.divisions >= 2) steps.push(lolDiamondPrices["4>3"]);
        if (rank.divisions >= 3) steps.push(lolDiamondPrices["3>2"]);
        if (rank.divisions >= 4) steps.push(lolDiamondPrices["2>1"]);
        // Diamond I -> Master
        steps.push(lolDiamondPrices["1>master"]);
      } else {
        const price = lolPricePerDivision[rank.id] || 0;
        // Cada divisão dentro do rank + transição para o próximo rank
        for (let d = 0; d < rank.divisions; d++) {
          steps.push(price);
        }
      }
    }
    return steps;
  }

  const fromIdx = toLinearIndex(fromRankId, fromDiv);
  const toIdx = toLinearIndex(toRankId, toDiv);

  if (toIdx <= fromIdx) return 0;

  const priceSteps = buildPriceSteps();
  let total = 0;

  for (let i = fromIdx; i < toIdx; i++) {
    let stepPrice = priceSteps[i] || 0;
    // Desconto de PDL aplica apenas na primeira transição
    if (i === fromIdx) {
      stepPrice = stepPrice * (1 - lpDiscount);
    }
    total += stepPrice;
  }

  return total;
}

const gameTitles: Record<string, string> = {
  "league-of-legends": "League of Legends",
  valorant: "Valorant",
  cs2: "CS2",
};

// Jogos que suportam precificação dinâmica
const gamesWithPricing = new Set(["league-of-legends"]);

export default function OrderConfiguratorPage() {
  const params = useParams();
  const gameSlug = params.game as string;
  const gameTitle = gameTitles[gameSlug] || gameSlug;
  const hasDynamicPricing = gamesWithPricing.has(gameSlug);

  const ranks = gameRanks[gameSlug] || gameRanks["league-of-legends"];
  const hasDivisions = ranks.some(r => r.divisions > 1);

  // Estado: rank + divisão + LP
  const [currentRank, setCurrentRank] = useState("iron");
  const [currentDiv, setCurrentDiv] = useState(4);
  const [desiredRank, setDesiredRank] = useState("gold");
  const [desiredDiv, setDesiredDiv] = useState(4);
  const [lpRange, setLpRange] = useState(0);
  const [options, setOptions] = useState({
    duoQueue: false,
    selectRole: false,
    expressOrder: false,
    offlineMode: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const currentRankData = ranks.find(r => r.id === currentRank) || ranks[0];
  const desiredRankData = ranks.find(r => r.id === desiredRank) || ranks[ranks.length - 1];

  // Quando muda o rank atual, ajustar divisão se necessário
  useEffect(() => {
    if (currentDiv > currentRankData.divisions) {
      setCurrentDiv(currentRankData.divisions);
    }
  }, [currentRank, currentRankData.divisions, currentDiv]);

  useEffect(() => {
    if (desiredDiv > desiredRankData.divisions) {
      setDesiredDiv(desiredRankData.divisions);
    }
  }, [desiredRank, desiredRankData.divisions, desiredDiv]);

  // Garantir que desired > current
  useEffect(() => {
    const ci = ranks.findIndex(r => r.id === currentRank);
    const di = ranks.findIndex(r => r.id === desiredRank);
    if (di < ci || (di === ci && desiredDiv >= currentDiv)) {
      // Mover desired para o próximo rank válido
      if (ci < ranks.length - 1) {
        setDesiredRank(ranks[ci + 1].id);
        setDesiredDiv(ranks[ci + 1].divisions);
      } else {
        setDesiredDiv(1);
      }
    }
  }, [currentRank, currentDiv, desiredRank, desiredDiv, ranks]);

  // ── Cálculo de preço ──
  const basePrice = useMemo(() => {
    if (!hasDynamicPricing) return 32.0;
    return calculateLolBoostPrice(
      currentRank, currentDiv,
      desiredRank, desiredDiv,
      lpRanges[lpRange].discount,
      ranks
    );
  }, [currentRank, currentDiv, desiredRank, desiredDiv, lpRange, hasDynamicPricing, ranks]);

  const duoPrice = options.duoQueue ? basePrice * 0.65 : 0;
  const rolePrice = options.selectRole ? basePrice * 0.15 : 0;
  const expressPrice = options.expressOrder ? basePrice * 0.25 : 0;
  const total = basePrice + duoPrice + rolePrice + expressPrice;

  // Divisões disponíveis para o rank selecionado
  const currentDivisions = divisionValues.slice(0, currentRankData.divisions);
  const desiredDivisions = divisionValues.slice(0, desiredRankData.divisions);

  // Verificar se um rank desejado é válido (deve ser > rank atual)
  function isDesiredRankDisabled(rankId: string): boolean {
    const ci = ranks.findIndex(r => r.id === currentRank);
    const ri = ranks.findIndex(r => r.id === rankId);
    return ri < ci;
  }

  function isDesiredSameRank(rankId: string): boolean {
    return rankId === currentRank;
  }

  function handleSelectCurrentRank(rankId: string) {
    setCurrentRank(rankId);
    const r = ranks.find(r => r.id === rankId);
    if (r) setCurrentDiv(r.divisions);
  }

  function handleSelectDesiredRank(rankId: string) {
    setDesiredRank(rankId);
    const r = ranks.find(r => r.id === rankId);
    if (r) setDesiredDiv(1);
  }

  async function handleCheckout() {
    if (total <= 0) return;
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const currentLabel = currentRankData.divisions > 1
        ? `${currentRankData.label} ${divisionLabels[divisionValues.indexOf(currentDiv)]}`
        : currentRankData.label;
      const desiredLabel = desiredRankData.divisions > 1
        ? `${desiredRankData.label} ${divisionLabels[divisionValues.indexOf(desiredDiv)]}`
        : desiredRankData.label;

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: "elo-boost",
          price: Math.round(total * 100) / 100,
          config: {
            game: gameSlug,
            current_rank: currentLabel,
            desired_rank: desiredLabel,
            current_lp: lpRanges[lpRange].label,
            options: {
              duo_queue: options.duoQueue,
              select_role: options.selectRole,
              express_order: options.expressOrder,
              offline_mode: options.offlineMode,
            },
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || "Erro ao criar sessão de pagamento");
        return;
      }
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

  // Labels para o resumo
  const currentSummaryLabel = currentRankData.divisions > 1
    ? `${currentRankData.label} ${divisionLabels[divisionValues.indexOf(currentDiv)]}`
    : currentRankData.label;
  const desiredSummaryLabel = desiredRankData.divisions > 1
    ? `${desiredRankData.label} ${divisionLabels[divisionValues.indexOf(desiredDiv)]}`
    : desiredRankData.label;

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
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                {ranks.map((rank) => (
                  <button
                    key={rank.id}
                    onClick={() => handleSelectCurrentRank(rank.id)}
                    className={`group cursor-pointer glass-card rounded-xl flex flex-col items-center justify-center p-3 border-2 transition-all ${
                      currentRank === rank.id
                        ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(46,123,255,0.4)]"
                        : "border-transparent hover:border-primary/40"
                    }`}
                  >
                    <Image
                      src={rank.image}
                      alt={rank.label}
                      width={currentRank === rank.id ? 56 : 48}
                      height={currentRank === rank.id ? 56 : 48}
                      className={`mb-1 transition-opacity ${
                        currentRank === rank.id
                          ? "opacity-100"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
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

              {/* Divisão + PDL */}
              {hasDivisions && (
                <div className="flex flex-wrap gap-6 mt-4">
                  {currentRankData.divisions > 1 && (
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Divisão</span>
                      <div className="flex gap-2">
                        {currentDivisions.map((d) => (
                          <button
                            key={d}
                            onClick={() => setCurrentDiv(d)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                              currentDiv === d
                                ? "bg-primary text-white shadow-[0_0_12px_rgba(46,123,255,0.5)]"
                                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {divisionLabels[divisionValues.indexOf(d)]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasDynamicPricing && (
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">PDL Atual</span>
                      <div className="flex gap-2 flex-wrap">
                        {lpRanges.map((lp, i) => (
                          <button
                            key={i}
                            onClick={() => setLpRange(i)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              lpRange === i
                                ? "bg-primary text-white shadow-[0_0_12px_rgba(46,123,255,0.5)]"
                                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {lp.label}
                            {lp.discount > 0 && (
                              <span className="ml-1 text-green-400">-{(lp.discount * 100).toFixed(0)}%</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Desired Rank */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="stars" className="text-primary" />
                <h3 className="text-xl font-bold">Selecione o Rank Desejado</h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                {ranks.map((rank) => {
                  const disabled = isDesiredRankDisabled(rank.id);
                  const isSame = isDesiredSameRank(rank.id);
                  const isDisabled = disabled;
                  return (
                    <button
                      key={rank.id}
                      onClick={() => !isDisabled && handleSelectDesiredRank(rank.id)}
                      disabled={isDisabled}
                      className={`group cursor-pointer glass-card rounded-xl flex flex-col items-center justify-center p-3 border-2 transition-all ${
                        isDisabled
                          ? "opacity-25 cursor-not-allowed border-transparent"
                          : desiredRank === rank.id
                            ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(46,123,255,0.4)]"
                            : isSame
                              ? "border-transparent opacity-60 hover:border-primary/40"
                              : "border-transparent hover:border-primary/40"
                      }`}
                    >
                      <Image
                        src={rank.image}
                        alt={rank.label}
                        width={desiredRank === rank.id ? 56 : 48}
                        height={desiredRank === rank.id ? 56 : 48}
                        className={`mb-1 transition-opacity ${
                          desiredRank === rank.id
                            ? "opacity-100"
                            : isDisabled
                              ? "opacity-40"
                              : "opacity-60 group-hover:opacity-100"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          desiredRank === rank.id
                            ? "text-primary"
                            : isDisabled
                              ? "text-white/20"
                              : "text-white/40 group-hover:text-white"
                        }`}
                      >
                        {rank.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Divisão desejada */}
              {hasDivisions && desiredRankData.divisions > 1 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Divisão Desejada</span>
                  <div className="flex gap-2">
                    {desiredDivisions.map((d) => {
                      // Desabilitar divisões inválidas se for o mesmo rank
                      const sameRank = currentRank === desiredRank;
                      const isInvalid = sameRank && d >= currentDiv;
                      return (
                        <button
                          key={d}
                          onClick={() => !isInvalid && setDesiredDiv(d)}
                          disabled={isInvalid}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            isInvalid
                              ? "bg-white/5 text-white/20 cursor-not-allowed"
                              : desiredDiv === d
                                ? "bg-primary text-white shadow-[0_0_12px_rgba(46,123,255,0.5)]"
                                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {divisionLabels[divisionValues.indexOf(d)]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                    +65%
                  </span>
                  <Toggle
                    checked={options.duoQueue}
                    onChange={(v) => setOptions({ ...options, duoQueue: v })}
                  />
                </div>
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
                <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Atual
                    </span>
                    <Image
                      src={currentRankData.image}
                      alt={currentRankData.label}
                      width={40}
                      height={40}
                    />
                    <span className="text-xs font-bold capitalize">
                      {currentSummaryLabel}
                    </span>
                  </div>
                  <Icon name="arrow_forward" className="text-primary/40" size={18} />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Desejado
                    </span>
                    <Image
                      src={desiredRankData.image}
                      alt={desiredRankData.label}
                      width={40}
                      height={40}
                    />
                    <span className="text-xs font-bold text-primary">
                      {desiredSummaryLabel}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 px-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Boost de Elo</span>
                    <span className="font-medium">R$ {basePrice.toFixed(2)}</span>
                  </div>
                  {hasDynamicPricing && lpRanges[lpRange].discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400/80">Desconto PDL ({lpRanges[lpRange].label})</span>
                      <span className="text-green-400 font-bold">Aplicado</span>
                    </div>
                  )}
                  {options.duoQueue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Duo Queue (+65%)</span>
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
                disabled={isLoading || total <= 0}
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
            <a
              href="https://wa.me/5515998594085"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 glass-card p-4 rounded-xl border border-white/5 hover:border-green-500/30 transition-all flex items-center gap-4 group cursor-pointer block"
            >
              <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 group-hover:bg-green-500/20 transition-colors">
                <Icon name="support_agent" />
              </div>
              <div>
                <h4 className="text-sm font-bold group-hover:text-green-400 transition-colors">Suporte Prioritário 24/7</h4>
                <p className="text-[11px] text-white/50">
                  Fale conosco pelo WhatsApp
                </p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
