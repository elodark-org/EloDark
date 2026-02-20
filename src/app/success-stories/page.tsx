import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const stats = [
  { icon: "query_stats", label: "Win Rate", value: "100%", detail: "+100% Impact" },
  { icon: "swords", label: "Average KDA", value: "12.4", detail: "Godlike Performance" },
  { icon: "schedule", label: "Completion Time", value: "48h", detail: "Rapid Delivery" },
];

const timeline = [
  {
    icon: "error",
    title: "The Challenge",
    text: "Our client had been playing since Season 8, consistently finishing in Bronze I. Despite thousands of matches and watching countless guides, they couldn't overcome the \"Elo Hell\" of inconsistent teammates and smurf players. The goal was simple but ambitious: reach Diamond IV to finally play in high-level lobbies.",
    tags: ["Stuck 3 Seasons", "Low MMR Gains"],
    tagColor: "bg-red-500/10 border-red-500/20 text-red-500",
    isResult: false,
  },
  {
    icon: "strategy",
    title: "The Strategy",
    text: "Our elite booster, 'Shadow', identified that the client's account MMR was severely damaged. He opted for a \"Hyper-Carry\" strategy using high-mobility champions to influence all lanes. By focusing on neutral objectives and punishing enemy positioning, Shadow maintained a 20-minute average game time to rapidly inflate the MMR.",
    tags: [],
    isResult: false,
  },
  {
    icon: "emoji_events",
    title: "The Result",
    text: "Within 48 hours, the account achieved a 25-game win streak. The MMR was successfully repaired, with the client now gaining +28 LP per win in Diamond lobbies. The client can now enjoy competitive matches with skilled teammates, finally breaking the cycle of low-tier frustration.",
    tags: [],
    isResult: true,
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent">
          <div className="relative min-h-[500px] w-full flex flex-col justify-center px-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest mb-6 w-fit">
              <Icon name="verified" size={12} /> Featured Success Story
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tighter">
              From <span className="text-gray-500">Hardstuck</span> to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan">
                Hero: The Platinum Climb
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              A deep dive into how our Challenger-tier booster &apos;Shadow&apos;
              transformed a Bronze I account plateaued for 3 seasons into Diamond
              IV in just 48 hours.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">
                  Starting Rank
                </span>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-orange-900/30 rounded-full flex items-center justify-center border border-orange-700/50">
                    <Icon name="workspace_premium" className="text-orange-500" size={18} />
                  </div>
                  <span className="font-bold">Bronze I</span>
                </div>
              </div>
              <Icon name="arrow_forward" className="text-primary" />
              <div className="flex flex-col">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">
                  Final Rank
                </span>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-400/50">
                    <Icon name="diamond" className="text-accent-cyan" size={18} />
                  </div>
                  <span className="font-bold text-accent-cyan">Diamond IV</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center group hover:border-primary/50 transition-all"
            >
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon name={s.icon} className="text-primary" size={32} />
              </div>
              <p className="text-gray-400 font-medium mb-1">{s.label}</p>
              <h3 className="text-5xl font-black text-white">{s.value}</h3>
              <p className="text-green-400 text-sm font-bold mt-2">{s.detail}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="auto_stories" className="text-primary" />
                The Path to Victory
              </h2>

              {timeline.map((item, i) => (
                <div
                  key={item.title}
                  className={`relative pl-12 ${
                    !item.isResult
                      ? "before:absolute before:left-[19px] before:top-10 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:to-primary/10"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute left-0 top-1 size-10 rounded-full flex items-center justify-center z-10 ${
                      item.isResult
                        ? "bg-primary shadow-[0_0_30px_rgba(46,123,255,0.3)]"
                        : "glass-card border border-primary/40"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className={item.isResult ? "text-white" : "text-primary"}
                      size={20}
                    />
                  </div>
                  <div
                    className={`glass-card p-8 rounded-2xl ${
                      item.isResult ? "border-primary/50 bg-primary/5" : ""
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{item.text}</p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${item.tagColor}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Icon name="play_circle" className="text-primary" />
                Proof of Mastery
              </h2>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 group bg-gray-900">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all cursor-pointer">
                  <div className="size-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(46,123,255,0.3)] group-hover:scale-110 transition-transform">
                    <Icon name="play_arrow" size={40} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-lg glass-card text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                    Live Replay: Game 24 Promotion Match
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-2xl p-6 border-primary/30 sticky top-28">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
                Booster Behind the Climb
              </h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative size-16 rounded-full border-2 border-primary p-1">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/30 to-accent-purple/30" />
                  <div className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-2 border-bg-primary" />
                </div>
                <div>
                  <h5 className="text-lg font-bold">Shadow</h5>
                  <div className="flex items-center gap-1 text-primary">
                    <Icon name="stars" size={14} />
                    <span className="text-xs font-bold">TOP 0.1% Global</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Peak Rank</span>
                  <span className="font-bold">Challenger 1,120 LP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Success Rate</span>
                  <span className="font-bold text-green-400">99.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Main Roles</span>
                  <span className="font-bold">Jungle / Mid</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/boost/league-of-legends"
                className="block w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-primary to-accent-cyan text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
              >
                START YOUR STORY
              </Link>
              <p className="text-center text-xs text-gray-500 mt-3">
                <Icon name="verified_user" size={10} className="align-middle mr-1" />
                100% Account Safety Guaranteed
              </p>

              {/* Quote */}
              <div className="mt-8 pt-8 border-t border-primary/10">
                <Icon name="format_quote" className="text-primary mb-2" />
                <p className="text-sm italic text-gray-400 leading-relaxed mb-4">
                  &ldquo;I was honestly skeptical about ever reaching Diamond.
                  Shadow made it look so easy. The coaching tips he left in the
                  post-boost report were the cherry on top. Worth every cent.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-bg-primary flex items-center justify-center font-bold text-xs text-primary border border-primary/20">
                    JD
                  </div>
                  <div>
                    <p className="text-xs font-bold">James D.</p>
                    <p className="text-[10px] text-gray-500">Verified Client</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
