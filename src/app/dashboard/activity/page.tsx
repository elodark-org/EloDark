import { Icon } from "@/components/ui/icon";

const activities = [
  { type: "boost", user: "xDarkSlayer", action: "Gold II → Platinum IV completed", time: "2 min ago", icon: "rocket_launch", color: "text-primary" },
  { type: "order", user: "NightHawk99", action: "New order: Diamond boost started", time: "8 min ago", icon: "shopping_cart", color: "text-accent-cyan" },
  { type: "review", user: "ProGamer_X", action: "Left a 5-star review", time: "15 min ago", icon: "star", color: "text-accent-gold" },
  { type: "boost", user: "ShadowFury", action: "Silver I → Gold IV completed", time: "22 min ago", icon: "rocket_launch", color: "text-primary" },
  { type: "join", user: "MysticBlade", action: "Joined EloDark Premium", time: "35 min ago", icon: "person_add", color: "text-green-400" },
  { type: "order", user: "ThunderStrike", action: "New order: Coaching session booked", time: "1h ago", icon: "school", color: "text-accent-purple" },
  { type: "boost", user: "PhoenixRise", action: "Platinum III → Diamond IV completed", time: "1h ago", icon: "rocket_launch", color: "text-primary" },
  { type: "review", user: "EliteSniper", action: "Left a 5-star review", time: "2h ago", icon: "star", color: "text-accent-gold" },
];

export default function ActivityPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <h2 className="text-xl font-bold">Live Activity Feed</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-400">Live</span>
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
