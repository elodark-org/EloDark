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
    startingPrice: "R$ 24,90",
    badge: "popular",
  },
  {
    id: "val",
    name: "Valorant",
    slug: "valorant",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQSvv2w2NCQS-iCHwskR1oETzbPU3tR8-27PUED-mjdk-tSupxj7eLudv0cbqCUx75okBWe5zRnEVU0XLhv-H8xMH9uVQxOmHC6HXkEBhdRZIoNsSi-y4KOUsuhvq22vl8Gpm7rgXlMZXahSlqbj-zsQg6mS6w1VYTfsc558HpKcMyMxtSqQKOyWYtLnOk7CxnEU-Z4D3oO8lIaSw7oRyP3BZgumlmZ4OX37R8Wk9zDf-XqR7L8DMiNztpOkP2jBTr4x37obKuW19",
    startingPrice: "R$ 34,90",
    badge: "popular",
  },
  {
    id: "cs2",
    name: "CS2",
    slug: "cs2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUFYWu0aIk5qFnwNA-csG1toEsCMXhTjK9LcFKFjEZFfS5j_RI39UgGI1ukW4PpiRhw7BEhttJuDd-5Tx3IOXMcdG7q6_JhLhGy1H7hjT0kFFH--Xc8OyS1DGXM3sD2sUEPsEflOVWzV7iarP9nPGO79UWVQQyPOBZxux9axnw7O7thDYE5fOTYRwWZY8Lb9dVz57-G7c63xVaEU3FmOx4C-H8HB25mWPs05jTSH39Imo1mxWx7FyKKTVIz6xZl_tOeQX-HVMkN314",
    startingPrice: "R$ 29,90",
  },
  {
    id: "dota",
    name: "Dota 2",
    slug: "dota-2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcJ7JPEgHxg2jfXctQsPUTXmWz2yrVkosbkcU26R14Lpkud7DXtn47eawIywY0Jyn3tMsCayOWG3FNQNCdw93KGKblRt0KpkeeLyzmPhGXUo8NZLF9hG5P0agCAWOv-U1Th7RxgM7TG7F2HSw5mmfBYflrsAcSu0y8zghNMmBlDclK9eik9UiU_rJLYM6at3Q180iNg73oYA9m4i3gABGcuIHBmrhK6rmV497NIKE_6Dzb1ICGNwmS6wQDialTNNByEwfhL67eBE0q",
    startingPrice: "R$ 22,90",
  },
  {
    id: "marvel",
    name: "Marvel Rivals",
    slug: "marvel-rivals",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBapfZH6ft4mU3574QFGgg8ADF87YoNfInsdv66_lE4QoWWDiYj-wJsEVcwAicUaxCFvSXNxrVmlYwzcg1FHTt6ByX2QMEXJQilQKNb9Bf6Vea3iRWzOr6uSyzPz7QoZngfu56x64bxXTGhxMY9FLuEKlr396RWSeHSbrBgsSg1fh8X4mvlPOttUWfHzDxo3aGO4RQsnYbYfBkhxB38WUtaz2gcnP8yu2IHNccdA-1L5VVHsJqSQUmCvy_2oFaUEqRvRuKXb6rs2ogq",
    startingPrice: "R$ 49,90",
    badge: "new",
    accentColor: "cyan",
  },
  {
    id: "rl",
    name: "Rocket League",
    slug: "rocket-league",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF0nXYubZoWLEz1iJPOtAyeHastb2sqoVKHM3h2oYsLD5huBrE9vXmVMn-Aki3jE3NAisNMpmmjiIZBQj7WiNHmP7GzwAOwITvFUvdyo5zy7hLx2Qlrk8LsZUaozK7x2XCZy8Q64M0fioD_-1BbJ5jjaAd1U-uC3qWmg2jmJkcpZ0AIzc46byKgA6GFsI7EPmzEP_v_CIaAum2wj2ZARQiZQ4IwLdSYf69szv5NJWhXOqOw4gj4cqhDQZXymNdimvhap3TYrFoD1aM",
    startingPrice: "R$ 19,90",
  },
];

function GameCard({ game }: { game: Game }) {
  const isCyan = game.accentColor === "cyan";
  const glowClass = isCyan
    ? "border-cyan-500/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]"
    : "border-primary/50 shadow-[0_0_30px_-5px_rgba(46,123,255,0.4)]";
  const hoverTextClass = isCyan ? "group-hover:text-cyan-400" : "group-hover:text-primary";
  const priceTextClass = isCyan ? "text-cyan-400" : "text-primary";

  return (
    <Link
      href={`/boost/${game.slug}`}
      className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer block"
    >
      {/* Glow Border */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 ${glowClass} opacity-0 group-hover:opacity-100 z-20 pointer-events-none transition-opacity duration-300`}
      />
      {/* BG Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${game.image}')` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          {game.badge && (
            <span
              className={`px-3 py-1 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg ${
                game.badge === "new"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                  : "bg-gradient-to-r from-amber-500 to-orange-600"
              }`}
            >
              {game.badge === "new" ? "Novo" : "Popular"}
            </span>
          )}
          {!game.badge && <div />}
          <div className="glass-card px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg border border-white/10">
            A partir de <span className={`${priceTextClass} text-sm`}>{game.startingPrice}</span>
          </div>
        </div>
        <div>
          <h3 className={`text-2xl font-bold text-white mb-1 ${hoverTextClass} transition-colors`}>
            {game.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span>Ver Serviços</span>
            <Icon name="arrow_forward" size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GameGrid() {
  return (
    <section id="games" className="relative z-10 py-16 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight inline-block relative">
            Escolha Seu Jogo
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-80" />
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6 font-light">
            Fazemos boost nos jogos mais competitivos do mundo
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-12">
          <Link
            href="/games"
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm font-semibold tracking-wide">
              Ver Todos os 13+ Jogos
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
