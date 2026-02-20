import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { Step } from "@/types";

const steps: Step[] = [
  {
    number: "01",
    title: "Choose Your Boost",
    description:
      "Select your current rank, desired goal, and customize your order. Choose specific agents, champions, or duo queue options.",
    icon: "ads_click",
    color: "purple",
  },
  {
    number: "02",
    title: "We Match Your Pro",
    description:
      "Our AI-driven algorithm instantly assigns a top-tier Challenger booster. Your account is 100% anonymous and VPN protected.",
    icon: "shield_person",
    color: "cyan",
  },
  {
    number: "03",
    title: "Track & Dominate",
    description:
      "Watch your rank soar in real-time via your private dashboard. Chat with your booster and reclaim your rightful place on the ladder.",
    icon: "rocket_launch",
    color: "gold",
  },
];

const colorMap = {
  purple: {
    text: "text-accent-purple",
    border: "border-accent-purple",
    hoverBorder: "hover:border-accent-purple/50",
    bg: "from-[#2a1a35] to-bg-primary",
    shadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    glow: "bg-accent-purple/20",
  },
  cyan: {
    text: "text-accent-cyan",
    border: "border-accent-cyan",
    hoverBorder: "hover:border-accent-cyan/50",
    bg: "from-[#1a2a35] to-bg-primary",
    shadow: "shadow-[0_0_20px_rgba(0,212,255,0.3)]",
    glow: "bg-accent-cyan/20",
  },
  gold: {
    text: "text-accent-gold",
    border: "border-accent-gold",
    hoverBorder: "hover:border-accent-gold/50",
    bg: "from-[#352a1a] to-bg-primary",
    shadow: "shadow-[0_0_20px_rgba(255,215,0,0.3)]",
    glow: "bg-accent-gold/20",
  },
};

const trustBadges = [
  { icon: "vpn_key", label: "VPN Protected", color: "text-accent-cyan" },
  { icon: "support_agent", label: "24/7 Support", color: "text-accent-purple" },
  { icon: "currency_exchange", label: "Money-Back Guarantee", color: "text-accent-gold" },
  { icon: "lock", label: "SSL Encrypted", color: "text-green-400" },
];

function StepCard({ step }: { step: Step }) {
  const c = colorMap[step.color];

  return (
    <div className="group relative">
      <div
        className={`absolute inset-0 ${c.glow} blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div
        className={`relative h-full glass-panel rounded-2xl p-8 flex flex-col items-center text-center ${c.hoverBorder} transition-colors duration-300`}
      >
        {/* Hexagon Icon */}
        <div className="absolute -top-10">
          <div
            className={`hexagon w-20 h-24 bg-gradient-to-b ${c.bg} border-2 ${c.border} flex items-center justify-center ${c.shadow}`}
          >
            <Icon name={step.icon} className={`${c.text} text-4xl`} />
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <span className={`${c.text} font-bold tracking-widest text-sm uppercase`}>
            Step {step.number}
          </span>
          <h3 className="text-2xl font-bold text-white">{step.title}</h3>
          <p className="text-gray-400 leading-relaxed">{step.description}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 py-20 px-4 overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col gap-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-primary to-accent-cyan">
              HOW IT WORKS
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Get boosted in 3 simple steps. Safe, anonymous, and faster than the
            speed of light.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-10">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0">
            <div className="w-full h-full bg-white/5 rounded-full" />
            <div className="absolute top-0 left-0 h-full w-full animated-gradient-line opacity-50 blur-[1px]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>

        {/* CTA + Trust */}
        <div className="flex flex-col items-center gap-12 mt-8">
          <Button
            size="lg"
            iconRight="arrow_forward"
            className="shadow-[0_0_40px_rgba(46,123,255,0.3)] hover:shadow-[0_0_60px_rgba(46,123,255,0.5)] text-lg px-12 py-5"
          >
            Start Your Boost Now
          </Button>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300"
              >
                <Icon name={badge.icon} className={badge.color} size={18} />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
