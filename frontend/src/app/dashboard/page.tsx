import { Icon } from "@/components/ui/icon";

const matches = [
  { champ: "Lee Sin", result: "Victory", time: "18:24", kda: "12 / 2 / 8", lp: "+28 LP", win: true },
  { champ: "Kha'Zix", result: "Victory", time: "24:51", kda: "8 / 1 / 4", lp: "+26 LP", win: true },
  { champ: "Nidalee", result: "Defeat", time: "32:10", kda: "4 / 5 / 12", lp: "-18 LP", win: false },
];

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-10 rounded-full bg-primary/20 border border-primary/30" />
            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-bg-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Welcome back, <span className="text-primary">Summoner</span>
            </h2>
            <p className="text-xs text-white/40">Premium Account</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Icon name="search" className="text-white/40 mr-2" size={18} />
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-48 placeholder:text-white/20"
              placeholder="Search orders..."
            />
          </div>
          <button className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all">
            <Icon name="notifications" size={20} />
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Active Boost Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden border border-primary/20">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full border border-primary/30 animate-pulse">
                LIVE SESSION
              </span>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Icon name="military_tech" className="text-accent-gold" size={32} />
                  </div>
                  <Icon name="double_arrow" className="text-white/20" size={32} />
                  <div className="p-3 bg-primary/10 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(46,123,255,0.3)]">
                    <Icon name="diamond" className="text-primary" size={32} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/40">Estimated Completion</p>
                  <p className="text-xl font-bold">24h 15m</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      Progress to Diamond IV
                    </h3>
                    <p className="text-sm text-white/60">
                      Current Rank: Platinum III (85 LP)
                    </p>
                  </div>
                  <p className="text-3xl font-black text-primary">68%</p>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan shadow-[0_0_20px_rgba(46,123,255,0.6)]"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
                    Games Played
                  </p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
                    Win Rate
                  </p>
                  <p className="text-xl font-bold text-green-400">85%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full animate-ping" />
                    <p className="text-sm font-bold text-primary">In-Game</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Window */}
          <div className="glass-card rounded-2xl p-1 relative overflow-hidden border border-accent-purple/40">
            <div className="relative aspect-video lg:aspect-square bg-bg-primary rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-primary/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button className="size-16 rounded-full bg-accent-purple flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-110 transition-transform">
                  <Icon name="play_arrow" size={32} />
                </button>
                <div className="text-center">
                  <p className="font-bold tracking-widest text-xs uppercase">
                    Watch Booster POV
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">
                    Direct from Alpha&apos;s desk
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-red-600 text-[10px] font-bold rounded animate-pulse">
                  LIVE
                </div>
                <div className="text-[10px] font-medium bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  1,242 Spectators
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches + Booster Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Icon name="analytics" className="text-primary" />
                Recent Matches
              </h4>
              <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
                VIEW ALL MATCHES
              </span>
            </div>
            <div className="space-y-3">
              {matches.map((match, i) => (
                <div
                  key={i}
                  className={`glass-card p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all border-l-4 ${
                    match.win ? "border-l-green-500" : "border-l-red-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon name="person" size={20} />
                    </div>
                    <div>
                      <p className={`font-bold ${!match.win ? "text-white/80" : ""}`}>
                        {match.result}
                      </p>
                      <p className="text-xs text-white/40">
                        {match.time} - Ranked Solo
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-1">KDA</p>
                      <p className="font-bold">{match.kda}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-white/40 mb-1">
                        {match.win ? "LP GAIN" : "LP LOSS"}
                      </p>
                      <p
                        className={`font-bold ${
                          match.win ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {match.lp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booster Info */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
                Current Booster
              </h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="size-14 rounded-xl bg-primary/20 border border-primary/20" />
                  <div className="absolute -top-2 -right-2 bg-primary text-bg-primary text-[10px] font-black px-1.5 py-0.5 rounded">
                    PRO
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold">Booster &apos;Alpha&apos;</p>
                  <p className="text-xs text-primary font-medium">
                    98% Success Rate
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ["Main Role", "Jungle / Mid"],
                  ["Region", "EU West"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-white/40">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Current Status</span>
                  <span className="font-bold text-green-400 flex items-center gap-1">
                    <span className="size-1.5 bg-green-400 rounded-full" />
                    Online
                  </span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-primary hover:text-bg-primary transition-all cursor-pointer">
                OPEN PRIVATE CHAT
              </button>
            </div>

            {/* Season Progress */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="military_tech" className="text-yellow-500" />
                <h4 className="font-bold">Season Progress</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/5 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
                <span className="text-xs font-bold">45%</span>
              </div>
              <p className="text-[10px] text-white/40 mt-2">
                14 more wins to reach Diamond Milestone rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
