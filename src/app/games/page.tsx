import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const allGames = [
  {
    id: "lol",
    name: "League of Legends",
    slug: "league-of-legends",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ57yBbvSagW2n78XduHHRhYr7gnvAagpEinC0l_XTQ3f34CDVFxD9acJ74L61R23houojXNJvTfnPizeGF2ZBohkjuZFlOiTORIYeCcE0JvVJ_YynqUUcoM5yuhnXcCyCtJSTRJwd86cv4irfrA-h_v6XV8oI7-k1T4p4RMqFNC7TOvaxnBjhEfLf68ezXVXqGuguyS35_KjWf2LikWqKiIDbdQL2JAh5LPzUjF6cavBMWktWkrBwHRcXlL5TtXEbB_lcXB07nQGx",
    startingPrice: "R$ 29,00",
    badge: "popular",
    services: ["Elo Boost", "Duo Queue", "Coaching", "MD10"],
  },
  {
    id: "val",
    name: "Valorant",
    slug: "valorant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQSvv2w2NCQS-iCHwskR1oETzbPU3tR8-27PUED-mjdk-tSupxj7eLudv0cbqCUx75okBWe5zRnEVU0XLhv-H8xMH9uVQxOmHC6HXkEBhdRZIoNsSi-y4KOUsuhvq22vl8Gpm7rgXlMZXahSlqbj-zsQg6mS6w1VYTfsc558HpKcMyMxtSqQKOyWYtLnOk7CxnEU-Z4D3oO8lIaSw7oRyP3BZgumlmZ4OX37R8Wk9zDf-XqR7L8DMiNztpOkP2jBTr4x37obKuW19",
    startingPrice: "R$ 29,50",
    badge: "popular",
    services: ["Elo Boost", "Duo Queue", "MD10", "Win Boost"],
  },
];

export default function GamesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative overflow-x-hidden">
        {/* Background ambient */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 animated-grid opacity-[0.04]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-purple/8 rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <Icon name="home" size={14} />
                Início
              </Link>
              <Icon name="chevron_right" size={14} className="text-gray-700" />
              <span className="text-sm text-gray-300">Jogos</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
              Escolha seu{" "}
              <span className="text-primary">Jogo</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Serviços profissionais de boost para os jogos mais competitivos do mundo.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            {allGames.map((game) => (
              <Link
                key={game.id}
                href={`/boost/${game.slug}`}
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer block"
              >
                {/* Glow border on hover */}
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/50 shadow-[0_0_0_0_rgba(236,19,236,0)] group-hover:shadow-[0_0_30px_-5px_rgba(236,19,236,0.4)] z-20 pointer-events-none transition-all duration-300" />

                {/* BG Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${game.image}')` }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080E] via-[#08080E]/50 to-transparent z-10" />

                {/* Overlay tint on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 z-10 transition-colors duration-300" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-between p-6">
                  {/* Top badges */}
                  <div className="flex justify-between items-start">
                    {game.badge && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/30">
                        <Icon name="star" size={12} filled />
                        Popular
                      </span>
                    )}
                    <div className="ml-auto glass-card px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/10">
                      A partir de{" "}
                      <span className="text-primary text-sm">{game.startingPrice}</span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                      {game.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {game.services.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-white/8 border border-white/10 px-2 py-0.5 rounded-md text-gray-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <span>Começar Boost</span>
                      <Icon name="arrow_forward" size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
