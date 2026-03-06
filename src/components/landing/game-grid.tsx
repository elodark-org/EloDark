import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Game } from "@/types";

const games: Game[] = [
  {
    id: "lol",
    name: "League of Legends",
    slug: "league-of-legends",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ57yBbvSagW2n78XduHHRhYr7gnvAagpEinC0l_XTQ3f34CDVFxD9acJ74L61R23houojXNJvTfnPizeGF2ZBohkjuZFlOiTORIYeCcE0JvVJ_YynqUUcoM5yuhnXcCyCtJSTRJwd86cv4irfrA-h_v6XV8oI7-k1T4p4RMqFNC7TOvaxnBjhEfLf68ezXVXqGuguyS35_KjWf2LikWqKiIDbdQL2JAh5LPzUjF6cavBMWktWkrBwHRcXlL5TtXEbB_lcXB07nQGx",
    startingPrice: "R$ 29,00",
    badge: "popular",
  },
  {
    id: "val",
    name: "Valorant",
    slug: "valorant",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQSvv2w2NCQS-iCHwskR1oETzbPU3tR8-27PUED-mjdk-tSupxj7eLudv0cbqCUx75okBWe5zRnEVU0XLhv-H8xMH9uVQxOmHC6HXkEBhdRZIoNsSi-y4KOUsuhvq22vl8Gpm7rgXlMZXahSlqbj-zsQg6mS6w1VYTfsc558HpKcMyMxtSqQKOyWYtLnOk7CxnEU-Z4D3oO8lIaSw7oRyP3BZgumlmZ4OX37R8Wk9zDf-XqR7L8DMiNztpOkP2jBTr4x37obKuW19",
    startingPrice: "R$ 29,50",
    badge: "popular",
  },
];

function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/boost/${game.slug}`}
      className="group relative h-[380px] rounded-xl overflow-hidden cursor-pointer block"
    >
      {/* Glow Border on hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-primary/60 shadow-[0_0_30px_rgba(236,19,236,0.3)] opacity-0 group-hover:opacity-100 z-20 pointer-events-none transition-all duration-300" />

      {/* BG Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-108"
        style={{ backgroundImage: `url('${game.image}')` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-5">
        {/* Top: badge */}
        <div className="flex justify-start">
          {game.badge && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg">
              <Icon name="star" size={10} filled />
              {game.badge === "new" ? "Novo" : "Popular"}
            </span>
          )}
        </div>

        {/* Bottom: name + price */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-tight">
            {game.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/80 text-white text-xs font-bold rounded-md uppercase tracking-wider">
              {game.badge === "popular" ? "Popular" : "Novo"}
            </span>
            <span className="text-white/70 text-sm font-medium">{game.startingPrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GameGrid() {
  return (
    <section id="games" className="relative z-10 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Escolha Seu Jogo
          </h2>
          <p className="text-gray-400 text-base font-light">
            Booste nos jogos mais competitivos com nossos pros top 0.1%
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-8">
          <Link
            href="/games"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
          >
            <span className="text-sm font-semibold tracking-wide text-gray-300 group-hover:text-white transition-colors">
              Ver Jogos
            </span>
            <Icon
              name="arrow_right_alt"
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
