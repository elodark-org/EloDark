import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Review } from "@/types";

const avatarColors = ["bg-primary", "bg-accent-cyan", "bg-accent-purple", "bg-accent-gold"];

const reviews: Review[] = [
  {
    id: "1",
    name: "Lucas M.",
    game: "League of Legends",
    gameColor: "purple",
    rating: 5,
    text: "No início tive um pouco de dúvida... Mas o trabalho foi feito 100% de confiança.",
    date: "via Instagram",
    verified: true,
  },
  {
    id: "2",
    name: "Gabriel S.",
    game: "League of Legends",
    gameColor: "purple",
    rating: 5,
    text: "O booster era muito educado e me deu dicas durante o jogo. Pretendo comprar de novo, adorei o serviço.",
    date: "via Instagram",
    verified: true,
  },
  {
    id: "3",
    name: "Matheus R.",
    game: "Valorant",
    gameColor: "cyan",
    rating: 5,
    text: "Gostei do serviço de vocês, foram rápido e discretos. Parabéns!",
    date: "via Instagram",
    verified: true,
  },
  {
    id: "4",
    name: "Felipe A.",
    game: "Coach",
    gameColor: "purple",
    rating: 5,
    text: "Essa foi minha primeira experiência com coach e foi incrível. O coach foi super atencioso e muito preocupado com a minha evolução. Isso é um diferencial enorme na empresa de vocês!",
    date: "via Instagram",
    verified: true,
  },
];

function ReviewCard({ review, colorClass }: { review: Review; colorClass: string }) {
  const initials = review.name.split(" ").map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="flex flex-col p-5 rounded-xl glass-panel border border-white/8 hover:border-primary/20 transition-all duration-300 gap-3">
      {/* Stars */}
      <div className="flex gap-0.5 text-accent-gold">
        {[...Array(review.rating)].map((_, i) => (
          <Icon key={i} name="star" filled size={14} />
        ))}
      </div>

      {/* Text */}
      <p className="text-white/75 text-sm leading-relaxed flex-grow">
        {review.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${colorClass}`}>
          {initials}
        </div>
        <div>
          <p className="text-white text-xs font-bold">{review.name}</p>
          <p className="text-white/40 text-[10px]">{review.date}</p>
        </div>
        {review.verified && (
          <div className="ml-auto flex items-center gap-1 text-green-400">
            <Icon name="check_circle" size={12} />
            <span className="text-[10px] font-semibold">Verificado</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative z-10 py-16 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        {/* Header + score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Trustpilot score */}
          <div className="flex items-center gap-4 p-5 rounded-xl glass-panel border border-white/8 min-w-[180px]">
            <div>
              <div className="flex gap-1 text-accent-gold mb-1">
                {[...Array(4)].map((_, i) => (
                  <Icon key={i} name="star" filled size={18} />
                ))}
                <Icon name="star_half" filled size={18} />
              </div>
              <p className="text-3xl font-black text-white leading-none">4.9</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#00b67a]" />
                <span className="text-xs font-bold text-white">Trustpilot</span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} colorClass={avatarColors[i % avatarColors.length]} />
            ))}
          </div>


          {/* Arrow nav */}
          <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all text-white/60 hover:text-white">
            <Icon name="chevron_right" size={20} />
          </button>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="https://www.instagram.com/elodark1/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-2.5 bg-primary/8 border border-primary/20 rounded-xl hover:bg-primary/15 hover:border-primary/40 transition-all duration-300"
          >
            <span className="text-sm font-bold text-primary group-hover:text-white transition-colors">
              Ver Todas as Avaliações no Instagram
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary group-hover:translate-x-1 group-hover:text-white transition-all"
              size={14}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
