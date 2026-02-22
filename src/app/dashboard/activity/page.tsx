import { Icon } from "@/components/ui/icon";

const activities = [
  { type: "boost", user: "xDarkSlayer", action: "Ouro II → Platina IV concluído", time: "2 min atrás", icon: "rocket_launch", color: "text-primary" },
  { type: "order", user: "NightHawk99", action: "Novo pedido: Boost Diamante iniciado", time: "8 min atrás", icon: "shopping_cart", color: "text-accent-cyan" },
  { type: "review", user: "ProGamer_X", action: "Deixou uma avaliação de 5 estrelas", time: "15 min atrás", icon: "star", color: "text-accent-gold" },
  { type: "boost", user: "ShadowFury", action: "Prata I → Ouro IV concluído", time: "22 min atrás", icon: "rocket_launch", color: "text-primary" },
  { type: "join", user: "MysticBlade", action: "Entrou no EloDark Premium", time: "35 min atrás", icon: "person_add", color: "text-green-400" },
  { type: "order", user: "ThunderStrike", action: "Novo pedido: Sessão de coaching agendada", time: "1h atrás", icon: "school", color: "text-accent-purple" },
  { type: "boost", user: "PhoenixRise", action: "Platina III → Diamante IV concluído", time: "1h atrás", icon: "rocket_launch", color: "text-primary" },
  { type: "review", user: "EliteSniper", action: "Deixou uma avaliação de 5 estrelas", time: "2h atrás", icon: "star", color: "text-accent-gold" },
];

export default function ActivityPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <h2 className="text-xl font-bold">Atividades em Tempo Real</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-400">Ao vivo</span>
        </div>
      </header>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-6">
            {activities.map((activity, i) => (
              <div key={i} className="relative flex items-start gap-6 pl-12">
                {/* Dot */}
                <div className={`absolute left-4 top-4 size-4 rounded-full border-2 border-bg-primary ${
                  i === 0 ? "bg-primary shadow-[0_0_10px_rgba(46,123,255,0.5)]" : "bg-white/20"
                }`} />

                {/* Card */}
                <div className="flex-1 glass-card p-5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-lg bg-white/5 flex items-center justify-center ${activity.color}`}>
                        <Icon name={activity.icon} size={18} />
                      </div>
                      <span className="font-bold text-sm">{activity.user}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{activity.time}</span>
                  </div>
                  <p className="text-sm text-white/70 ml-12">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
