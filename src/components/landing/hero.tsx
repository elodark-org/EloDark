import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: "shopping_cart",
    label: "Pedidos",
    value: "50,000+",
    color: "primary",
  },
  {
    icon: "emoji_events",
    label: "Satisfação",
    value: "99.7%",
    color: "accent-gold",
  },
  {
    icon: "group",
    label: "Boosters Pro",
    value: "300+",
    color: "accent-cyan",
  },
] as const;

const features = [
  { icon: "encrypted", label: "Proteção VPN", color: "text-primary" },
  { icon: "schedule", label: "Suporte 24/7", color: "text-accent-cyan" },
  { icon: "money_off", label: "Garantia de Reembolso", color: "text-accent-purple" },
];

function StatCard({
  icon,
  label,
  value,
  color,
  className,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`glass-card p-4 rounded-xl flex items-center gap-3 ${className}`}>
      <div
        className={`size-10 rounded-lg bg-${color}/20 flex items-center justify-center text-${color} border border-${color}/30`}
      >
        <Icon name={icon} />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative z-10 flex-grow flex flex-col justify-center">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 animated-grid opacity-[0.07]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 left-10 w-24 h-24 border border-white/5 rounded-xl rotate-12 bg-gradient-to-br from-white/5 to-transparent blur-[1px]" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-primary/10 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-[40px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Left: Text & CTA */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          {/* Trustpilot Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#00b67a] text-white px-2 py-1 rounded text-xs font-bold gap-1">
              <Icon name="star" size={14} />
              Trustpilot
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-accent-gold">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" filled size={18} />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-medium ml-1">
                4.9/5 Avaliação
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-cyan text-gradient block pb-2">
                Domine
              </span>
              <span className="text-white">Seu Rank</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-lg font-light border-l-2 border-primary/50 pl-4">
              Boosters de elite. Velocidade incomparável. Segurança total da conta. Junte-se
              à elite hoje.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" icon="rocket_launch">
              Começar Boost
            </Button>
            <Button size="lg" variant="outline" iconRight="arrow_forward">
              Conheça Nossos Pros
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6 pt-6 text-sm text-gray-500">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <Icon name={f.icon} className={f.color} size={20} />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image & Stats */}
        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg aspect-[4/5] hexagon-mask overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10 mix-blend-overlay" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcSNlopJKsL5wqh4Q2X_0bPtSk60NvA0R-1znH1CYkEOmklr1KNBuzHU0stPQdJ1UbhAd1DSYBYRClmpuPEx2tF4Q-ta3Qvj3EPYxZ3GLYTs32Ko5nwwLckvEzd_xR1HWzp3DqeXehPJxPVloHpVLaB3tevBI8TG_VpP24PdD338VDhNS_21zkJMBcyHzQ6K6GAWznPQ4JSWBX8Id_1RQKfkAH1AfgwwdqsrXo8nxlMVoOVj3JgUalcgH4e8o9-R1JVq1WMQ3v206Y"
              alt="Personagem gamer cyberpunk"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />
          </div>

          {/* Floating Stats */}
          <StatCard
            {...stats[0]}
            className="absolute -left-4 top-[15%] lg:-left-12 lg:top-[20%] animate-bounce [animation-duration:3s]"
          />
          <StatCard
            {...stats[1]}
            className="absolute -right-2 bottom-[20%] lg:-right-8 lg:bottom-[15%] animate-bounce [animation-duration:4s] [animation-delay:1s]"
          />
          <StatCard
            {...stats[2]}
            className="hidden sm:flex absolute left-8 bottom-[5%] lg:left-0 lg:bottom-[5%] animate-bounce [animation-duration:5s] [animation-delay:0.5s]"
          />

          {/* Decorative Glows */}
          <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent-cyan/20 blur-[60px] rounded-full" />
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-accent-purple/20 blur-[60px] rounded-full" />
        </div>
      </div>

      {/* Bottom Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}
