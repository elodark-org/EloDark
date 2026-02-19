import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Review } from "@/types";

const reviews: Review[] = [
  {
    id: "1",
    name: "Marcus T.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA98Cu7q6XJmUX1ZoGnkkZ_O-dxzfDVEliaK0WkmK1UmHviNxHJqK4goZAfEEDYkjG5ZYvfVMiOg7f0dphaoApTO60d6hyheU4pezTvS8_9rjzpKVN78sDCPgqgYfLS9pOYteccfZPHroSnioHcNfCYPncW4wCQB9whr7xSnmGRNEA9mWFyJEwLqvFc0sD4odxiBKoFmNH8sAgJIHPi2x_Z5_y3NtyrKiwX_oPZe6C4ufyfVUWedfic9kW3zEZ8dA4DFGmFuuJMSTj2",
    game: "League of Legends",
    gameColor: "purple",
    rating: 5,
    text: '"Insane speed. Got me from Silver to Plat in a week. Booster was super chill and gave me tips along the way. Highly recommend!"',
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    name: "Sarah K.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDodNiWoNS4IKPx127R0Nb4Qpi5BGm3Wdvrs6dNHKuYWzIQlX-YjALYp9lgVWKbGV-AKAyG1lrz7NCeGvAQOhEcnu6T4_584QJhG-wOEV8l06_2gehdjLBn7EUrBIlQnQDRbPN_qIC_TOfV44DbJnj1PDJjsaShwN9ZKQiaw2pi3jFPYbRAGAIqsAqnAMiSXPoTx5S260muwUM81_PSQN5Xc9gMgpUSFuh-Z374O9vQs-dOG874cHj8UelhC8Fc96N3ZK5zEOXa1Ll7",
    game: "Valorant",
    gameColor: "cyan",
    rating: 5,
    text: '"Was skeptical at first but the duo queue option is legit. Learned a lot while ranking up. The process was smooth and support was always there."',
    date: "1 week ago",
    verified: true,
  },
  {
    id: "3",
    name: "Jake R.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_5s85OqkEZp_lMc2lUzrZ9X0s4Xh4eprq5zzrg0lun7WXfi6wBNl58hE5fxMuGBFBHOlZiufR903rNyjFItI7aCoWi1L6bP_eTx8OPl1hHjtFgF_X1t12HLLdNkqIf-bq-BLJ_SWhrOysT5Fpks2p5VrIogbu0JorDNhuyOwvuzFFNXwKNnsemiQ4VsH5CT8l8tk65QuAvGVkAQAq5TcIcug8TZBjTRVh37gwXAqtNkhD6ZMUevqrGzzIw2KGmaFx2ZBZ1kNmjXPw",
    game: "Valorant",
    gameColor: "red",
    rating: 5,
    text: '"Customer support helped me fix an order issue instantly. 10/10 service. I\'ve used other sites before but this one is by far the most professional."',
    date: "3 weeks ago",
    verified: true,
  },
];

const gameColorMap: Record<string, { border: string; bg: string; text: string; hoverShadow: string }> = {
  purple: {
    border: "border-accent-purple/30",
    bg: "bg-accent-purple/10",
    text: "text-purple-200",
    hoverShadow: "hover:shadow-accent-purple/10 hover:border-accent-purple/30",
  },
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    hoverShadow: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-200",
    hoverShadow: "hover:shadow-red-500/10 hover:border-red-500/30",
  },
};

function ReviewCard({ review }: { review: Review }) {
  const colors = gameColorMap[review.gameColor] ?? gameColorMap.purple;

  return (
    <div
      className={`relative flex flex-col p-6 rounded-2xl glass-panel shadow-xl ${colors.hoverShadow} transition-all duration-300 group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${colors.border}`}>
              <Image src={review.avatar} alt={review.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{review.name}</h3>
              <span className="text-xs text-white/50">{review.date}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md ${colors.bg} border ${colors.border} ${colors.text} text-xs font-bold uppercase tracking-wider`}>
            {review.game}
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 text-accent-gold">
          {[...Array(review.rating)].map((_, i) => (
            <Icon key={i} name="star" filled size={20} />
          ))}
        </div>

        {/* Text */}
        <p className="text-white/80 text-sm leading-relaxed flex-grow">
          {review.text}
        </p>

        {/* Footer */}
        {review.verified && (
          <div className="pt-4 mt-auto border-t border-white/5 flex items-center">
            <div className="flex items-center gap-1.5 text-green-400">
              <Icon name="check_circle" size={16} />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Verified Purchase
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative z-10 py-16 px-4 md:px-8 overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">4.9</h2>
          <div className="flex gap-1 text-accent-gold">
            {[...Array(4)].map((_, i) => (
              <Icon key={i} name="star" filled size={32} />
            ))}
            <Icon name="star_half" filled size={32} />
          </div>
          <p className="text-white/70 text-lg font-medium">
            Based on{" "}
            <span className="text-white font-bold border-b border-white/20">
              2,847 verified reviews
            </span>
          </p>
          <div className="flex items-center gap-6 mt-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Icon name="star" className="text-[#00b67a]" />
              <span className="font-bold text-sm">Trustpilot</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Icon name="rate_review" className="text-[#364958]" />
              <span className="font-bold text-sm">Reviews.io</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* CTA */}
        <Link
          href="#"
          className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative text-sm font-bold text-primary tracking-wide group-hover:text-white transition-colors duration-300">
            Read All 2,847 Reviews
          </span>
          <Icon
            name="arrow_forward"
            className="relative text-primary group-hover:translate-x-1 group-hover:text-white transition-all duration-300"
            size={18}
          />
        </Link>
      </div>
    </section>
  );
}
