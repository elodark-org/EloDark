import type { ServiceType } from "@/lib/validation";

// ─── Tipos internos ───────────────────────────────────────────────────────────
type RankInfo = { id: string; label: string; divisions: number };

// ─── Ranks LoL ───────────────────────────────────────────────────────────────
const lolRanks: RankInfo[] = [
  { id: "iron",     label: "Ferro",     divisions: 4 },
  { id: "bronze",   label: "Bronze",    divisions: 4 },
  { id: "silver",   label: "Prata",     divisions: 4 },
  { id: "gold",     label: "Ouro",      divisions: 4 },
  { id: "platinum", label: "Platina",   divisions: 4 },
  { id: "emerald",  label: "Esmeralda", divisions: 4 },
  { id: "diamond",  label: "Diamante",  divisions: 4 },
  { id: "master",   label: "Mestre",    divisions: 1 },
];

// ─── Ranks Valorant ───────────────────────────────────────────────────────────
const valorantRanks: RankInfo[] = [
  { id: "iron",      label: "Ferro",      divisions: 3 },
  { id: "bronze",    label: "Bronze",     divisions: 3 },
  { id: "silver",    label: "Prata",      divisions: 3 },
  { id: "gold",      label: "Ouro",       divisions: 3 },
  { id: "platinum",  label: "Platina",    divisions: 3 },
  { id: "diamond",   label: "Diamante",   divisions: 3 },
  { id: "ascendant", label: "Ascendente", divisions: 3 },
  { id: "immortal",  label: "Imortal",    divisions: 3 },
  { id: "radiant",   label: "Radiante",   divisions: 1 },
];

// ─── Tabelas de preços LoL ────────────────────────────────────────────────────
const lolPricePerDivision: Record<string, number> = {
  iron: 12.99, bronze: 14.99, silver: 16.99, gold: 17.99,
  platinum: 23.39, emerald: 38.69,
};

const lolDiamondPrices: Record<string, number> = {
  "4>3": 75.00, "3>2": 72.00, "2>1": 76.50, "1>master": 87.00,
};

const lolMd5Prices: Record<string, number> = {
  iron: 39, bronze: 44, silver: 49, gold: 59,
  platinum: 74, emerald: 99, diamond: 139, master: 179,
};

const valorantMd5Prices: Record<string, number> = {
  iron: 30, bronze: 35, silver: 45, gold: 60,
  platinum: 65, diamond: 85, ascendant: 90, immortal: 105, radiant: 135,
};

const lolWinPrices: Record<string, number> = {
  iron: 3, bronze: 5, silver: 8, gold: 12,
  platinum: 18, emerald: 25, diamond: 40, master: 70,
};

// ─── Tabelas de preços Valorant ───────────────────────────────────────────────
const valorantPriceSteps: number[] = [
  1,  1,  1,   // Ferro
  6,  6,  6,   // Bronze
  10, 10, 10,  // Prata
  18, 18, 18,  // Ouro
  23, 23, 23,  // Platina
  42, 42, 42,  // Diamante
  59, 59, 59,  // Ascendente
  99, 99, 180, // Imortal (i3 inclui transição para Radiante)
  1,           // Radiante (placeholder)
];

const valorantDuoPriceSteps: number[] = [
  15,  15,  15,  // Ferro
  20,  20,  20,  // Bronze
  28,  28,  28,  // Prata
  40,  40,  40,  // Ouro
  67,  67,  67,  // Platina
  103, 103, 103, // Diamante
  119, 119, 119, // Ascendente
  199, 199, 299, // Imortal
  1,             // Radiante (placeholder)
];

const valorantWinPrices: Record<string, number> = {
  iron: 2, bronze: 4, silver: 7, gold: 11, platinum: 13,
  diamond: 20, ascendant: 25, immortal: 30, radiant: 50,
};

// ─── Pacotes de Coach (LoL e Valorant usam os mesmos valores) ─────────────────
const coachPackages = [
  { label: "Pacote Básico",                     price: 49  },
  { label: "Pacote Evolução",                   price: 74  },
  { label: "Pacote ProPlayer",                  price: 139 },
  { label: "ProPlayer + Psicólogo eSports",     price: 149 },
  { label: "Coach para Equipes",                price: 149 },
];

// ─── Mapeamento de faixa de PDL → desconto ────────────────────────────────────
const lpLabelToDiscount: Record<string, number> = {
  "0 - 20":   0,
  "21 - 40":  0.10,
  "41 - 60":  0.15,
  "61 - 80":  0.20,
  "81 - 100": 0.30,
};

// ─── Parsing de labels de rank ────────────────────────────────────────────────
// LoL: divisões são "IV"(4), "III"(3), "II"(2), "I"(1)
const lolDivLabelToInt: Record<string, number> = { IV: 4, III: 3, II: 2, I: 1 };

// Valorant: divisões são "1"(div=4), "2"(div=3), "3"(div=2)
const valDivLabelToInt: Record<string, number> = { "1": 4, "2": 3, "3": 2 };

function parseRankLabel(
  label: string,
  ranks: RankInfo[],
  divMap: Record<string, number>,
): { rankId: string; div: number } | null {
  for (const rank of ranks) {
    if (rank.divisions === 1) {
      if (label === rank.label) return { rankId: rank.id, div: 1 };
    } else {
      for (const [divLabel, div] of Object.entries(divMap)) {
        if (label === `${rank.label} ${divLabel}`) return { rankId: rank.id, div };
      }
    }
  }
  return null;
}

function parseRankLabelOnly(label: string, ranks: RankInfo[]): string | null {
  return ranks.find((r) => r.label === label)?.id ?? null;
}

// ─── Cálculo LoL ─────────────────────────────────────────────────────────────
function lolLinearIndex(rankId: string, div: number): number {
  let idx = 0;
  for (const rank of lolRanks) {
    if (rank.id === rankId) return idx + (rank.divisions - div);
    idx += rank.divisions;
  }
  return idx;
}

function buildLolPriceSteps(): number[] {
  const steps: number[] = [];
  for (const rank of lolRanks) {
    if (rank.id === "master") break;
    if (rank.id === "diamond") {
      if (rank.divisions >= 2) steps.push(lolDiamondPrices["4>3"]);
      if (rank.divisions >= 3) steps.push(lolDiamondPrices["3>2"]);
      if (rank.divisions >= 4) steps.push(lolDiamondPrices["2>1"]);
      steps.push(lolDiamondPrices["1>master"]);
    } else {
      const price = lolPricePerDivision[rank.id] || 0;
      for (let d = 0; d < rank.divisions; d++) steps.push(price);
    }
  }
  return steps;
}

function calcLolBoostPrice(
  fromRankId: string, fromDiv: number,
  toRankId: string, toDiv: number,
  lpDiscount: number,
): number {
  const fromIdx = lolLinearIndex(fromRankId, fromDiv);
  const toIdx   = lolLinearIndex(toRankId, toDiv);
  if (toIdx <= fromIdx) return 0;
  const steps = buildLolPriceSteps();
  let total = 0;
  for (let i = fromIdx; i < toIdx; i++) {
    let step = steps[i] || 0;
    if (i === fromIdx) step *= (1 - lpDiscount);
    total += step;
  }
  return total;
}

// ─── Cálculo Valorant ─────────────────────────────────────────────────────────
function valorantLinearIndex(rankId: string, div: number): number {
  let total = 0;
  for (const rank of valorantRanks) {
    if (rank.id === rankId) {
      if (rank.divisions === 1) return total;
      const pos = [4, 3, 2].indexOf(div);
      return total + (pos >= 0 ? pos : 0);
    }
    total += rank.divisions;
  }
  return total;
}

function calcValorantBoostPrice(
  fromRankId: string, fromDiv: number,
  toRankId: string, toDiv: number,
  steps: number[],
): number {
  const fromIdx = valorantLinearIndex(fromRankId, fromDiv);
  const toIdx   = valorantLinearIndex(toRankId, toDiv);
  if (toIdx <= fromIdx) return 0;
  let sum = 0;
  for (let i = fromIdx; i < toIdx; i++) sum += steps[i] ?? 0;
  return sum;
}

// ─── Função principal ─────────────────────────────────────────────────────────
/**
 * Calcula o preço de um serviço inteiramente no servidor.
 * Retorna null se o config não for válido para o serviceType informado.
 */
export function calculatePrice(
  serviceType: ServiceType,
  config: Record<string, unknown>,
): number | null {
  const game = typeof config.game === "string" ? config.game : null;

  // ── Elo Boost ───────────────────────────────────────────────────────────────
  if (serviceType === "elo-boost") {
    const currentRankLabel = typeof config.current_rank === "string" ? config.current_rank : null;
    const desiredRankLabel  = typeof config.desired_rank  === "string" ? config.desired_rank  : null;
    const currentLpLabel    = typeof config.current_lp   === "string" ? config.current_lp   : "0 - 20";
    const opts = (typeof config.options === "object" && config.options !== null)
      ? (config.options as Record<string, unknown>)
      : {};

    if (!currentRankLabel || !desiredRankLabel || !game) return null;
    const lpDiscount = lpLabelToDiscount[currentLpLabel] ?? 0;

    let basePrice: number;

    if (game === "league-of-legends") {
      const from = parseRankLabel(currentRankLabel, lolRanks, lolDivLabelToInt);
      const to   = parseRankLabel(desiredRankLabel,  lolRanks, lolDivLabelToInt);
      if (!from || !to) return null;
      basePrice = calcLolBoostPrice(from.rankId, from.div, to.rankId, to.div, lpDiscount);
    } else if (game === "valorant") {
      const from = parseRankLabel(currentRankLabel, valorantRanks, valDivLabelToInt);
      const to   = parseRankLabel(desiredRankLabel,  valorantRanks, valDivLabelToInt);
      if (!from || !to) return null;
      basePrice = calcValorantBoostPrice(from.rankId, from.div, to.rankId, to.div, valorantPriceSteps);
    } else {
      basePrice = 32.0; // Jogos sem precificação dinâmica (ex: CS2)
    }

    if (basePrice <= 0) return null;

    let total = basePrice;

    // Opção: Duo Queue
    if (opts.duo_queue === true) {
      if (game === "valorant") {
        const from = parseRankLabel(currentRankLabel, valorantRanks, valDivLabelToInt);
        const to   = parseRankLabel(desiredRankLabel,  valorantRanks, valDivLabelToInt);
        if (from && to) {
          const duoTotal = calcValorantBoostPrice(from.rankId, from.div, to.rankId, to.div, valorantDuoPriceSteps);
          total += Math.max(0, duoTotal - basePrice);
        }
      } else {
        total += basePrice * 0.65;
      }
    }

    if (opts.select_role   === true) total += basePrice * 0.15;
    if (opts.express_order === true) total += basePrice * 0.25;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }

  // ── Duo Boost standalone ─────────────────────────────────────────────────────
  if (serviceType === "duo-boost") {
    return 32.0;
  }

  // ── MD5 ──────────────────────────────────────────────────────────────────────
  if (serviceType === "md5") {
    const eloLabel = typeof config.elo === "string" ? config.elo : null;
    if (!eloLabel || !game) return null;

    if (game === "league-of-legends") {
      const rankId = parseRankLabelOnly(eloLabel, lolRanks);
      if (!rankId) return null;
      return lolMd5Prices[rankId] ?? null;
    }
    // Valorant MD5
    const rankId = parseRankLabelOnly(eloLabel, valorantRanks);
    if (!rankId) return null;
    return valorantMd5Prices[rankId] ?? null;
  }

  // ── Vitórias ─────────────────────────────────────────────────────────────────
  if (serviceType === "vitorias") {
    const eloLabel = typeof config.elo      === "string" ? config.elo      : null;
    const quantity = typeof config.quantity === "number" ? config.quantity : null;
    if (!eloLabel || !quantity || !game || quantity < 1) return null;

    let pricePerWin: number;
    if (game === "league-of-legends") {
      const rankId = parseRankLabelOnly(eloLabel, lolRanks);
      if (!rankId) return null;
      pricePerWin = lolWinPrices[rankId] ?? 3;
    } else {
      const rankId = parseRankLabelOnly(eloLabel, valorantRanks);
      if (!rankId) return null;
      pricePerWin = valorantWinPrices[rankId] ?? 2;
    }
    return Math.round((pricePerWin * quantity + Number.EPSILON) * 100) / 100;
  }

  // ── Coach ─────────────────────────────────────────────────────────────────────
  if (serviceType === "coach") {
    const packageLabel = typeof config.package === "string" ? config.package : null;
    if (!packageLabel) return null;
    return coachPackages.find((p) => p.label === packageLabel)?.price ?? null;
  }

  return null;
}
