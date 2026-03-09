import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: "bolt",
    label: "Início do Boost",
    value: "< 30 min",
  },
  {
    icon: "military_tech",
    label: "Rank dos Boosters",
    value: "Radiante",
  },
  {
    icon: "verified",
    label: "Satisfação",
    value: "Garantida",
  },
] as const;

const features = [
  { icon: "chat", label: "Chat Offline", color: "text-primary" },
  { icon: "schedule", label: "Suporte 24/7", color: "text-accent-cyan" },
  { icon: "money_off", label: "Garantia de Reembolso", color: "text-accent-gold" },
];

export function Hero() {
  return (
    <section className="relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 animated-grid" />
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[800px] h-[600px] bg-accent-purple/8 rounded-full blur-[120px]" />
        <div className="absolute top-[15%] left-[5%] w-20 h-20 border border-primary/15 rounded-xl rotate-12 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute bottom-[25%] right-[8%] w-28 h-28 border border-accent-cyan/10 rounded-full bg-gradient-to-tr from-accent-cyan/5 to-transparent blur-sm" />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-12 pb-0 lg:pt-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-end relative z-10">
        {/* Left: Text & CTA */}
        <div className="flex flex-col gap-7 pb-10">
          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter">
              <span className="text-white block">Domine</span>
              <span className="text-white block">Seu Rank</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-md font-light leading-relaxed">
              Boosters de elite. Velocidade incomparável. Segurança total da conta. Junte-se à elite hoje.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/boost/league-of-legends">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold text-base px-8 shadow-[0_0_30px_rgba(236,19,236,0.4)] hover:shadow-[0_0_50px_rgba(236,19,236,0.6)]"
              >
                Começar Boost
              </Button>
            </Link>
            <Link href="/boosters">
              <Button
                size="lg"
                variant="outline"
                iconRight="arrow_forward"
                className="border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-semibold"
              >
                Conheça Nossos Pros
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-5 text-sm text-gray-400">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-1.5">
                <Icon name={f.icon} className={f.color} size={16} />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Gamer Image */}
        <div className="relative flex items-end justify-center lg:justify-end">
          <div className="relative w-full max-w-[520px] h-[360px] lg:h-[420px]">
            {/* Glow behind image */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-primary/20 rounded-full blur-[60px]" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcSNlopJKsL5wqh4Q2X_0bPtSk60NvA0R-1znH1CYkEOmklr1KNBuzHU0stPQdJ1UbhAd1DSYBYRClmpuPEx2tF4Q-ta3Qvj3EPYxZ3GLYTs32Ko5nwwLckvEzd_xR1HWzp3DqeXehPJxPVloHpVLaB3tevBI8TG_VpP24PdD338VDhNS_21zkJMBcyHzQ6K6GAWznPQ4JSWBX8Id_1RQKfkAH1AfgwwdqsrXo8nxlMVoOVj3JgUalcgH4e8o9-R1JVq1WMQ3v206Y"
              alt="Gamer EloDark"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-around gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Icon name={stat.icon} className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-white leading-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
