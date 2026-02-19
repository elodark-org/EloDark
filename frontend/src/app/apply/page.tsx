"use client";

import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const benefits = [
  {
    icon: "payments",
    title: "Instant Payouts",
    description: "Get paid immediately upon order completion. No waiting weeks for your hard-earned money.",
    glow: "border-accent-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]",
    iconColor: "text-accent-gold bg-accent-gold/10",
  },
  {
    icon: "calendar_today",
    title: "Flexible Schedule",
    description: "You choose when you play. Pick orders that fit your schedule and rank preferences easily.",
    glow: "border-accent-cyan/30 shadow-[0_0_20px_rgba(0,212,255,0.1)]",
    iconColor: "text-accent-cyan bg-accent-cyan/10",
  },
  {
    icon: "support_agent",
    title: "24/7 Support",
    description: "Our professional support team is available round-the-clock to handle clients and issues.",
    glow: "border-accent-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    iconColor: "text-accent-purple bg-accent-purple/10",
  },
];

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 lg:px-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Now Recruiting Top 0.1% Players
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent-gold to-accent-cyan bg-clip-text text-transparent tracking-tight">
              Turn Your Skill <br className="hidden md:block" /> into Profit
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-10">
              We are looking for the top 0.1% of players. Earn up to{" "}
              <span className="text-white font-semibold">$2,000/week</span> boosting
              the games you love on the world&apos;s most professional platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#apply"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(46,123,255,0.3)] transition-all text-center"
              >
                Start Application
              </a>
              <div className="flex items-center gap-2 px-6 py-4 text-gray-300">
                <Icon name="verified_user" className="text-accent-cyan" />
                <span className="text-sm">Verified Payouts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="px-6 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className={`glass-card ${b.glow} p-8 rounded-xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform`}
                >
                  <div className={`p-3 rounded-lg ${b.iconColor}`}>
                    <Icon name={b.icon} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{b.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="px-6 lg:px-20 py-20 relative" id="apply">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Application Form */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl p-8 lg:p-12">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Join the Elite
                  </h2>
                  <p className="text-gray-400">
                    Complete the professional vetting process to start boosting.
                  </p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                      Game Expertise
                    </label>
                    <select className="bg-white/5 border border-white/10 rounded-lg text-white focus:ring-primary focus:border-primary px-4 py-3">
                      <option>League of Legends</option>
                      <option>Valorant</option>
                      <option>Dota 2</option>
                      <option>Counter-Strike 2</option>
                      <option>Marvel Rivals</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                      Peak Rank
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white focus:ring-primary focus:border-primary px-4 py-3 placeholder:text-white/20"
                      placeholder="e.g. Challenger 600LP"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                      Peak Rank Proof Link
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white focus:ring-primary focus:border-primary px-4 py-3 placeholder:text-white/20"
                      placeholder="Tracker.gg or Op.gg link"
                      type="url"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                      Discord ID
                    </label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white focus:ring-primary focus:border-primary px-4 py-3 placeholder:text-white/20"
                      placeholder="username#0000"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                      Region
                    </label>
                    <select className="bg-white/5 border border-white/10 rounded-lg text-white focus:ring-primary focus:border-primary px-4 py-3">
                      <option>North America (NA)</option>
                      <option>Europe West (EUW)</option>
                      <option>Europe Nordic &amp; East (EUNE)</option>
                      <option>Brazil (BR)</option>
                      <option>Korea (KR)</option>
                      <option>Oceania (OCE)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg"
                    >
                      Submit Application
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-4">
                      By submitting, you agree to our Pro Booster Code of Conduct
                      and Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Testimonial */}
              <div className="glass-card rounded-2xl p-8 relative overflow-hidden border-accent-cyan/20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Icon name="format_quote" size={60} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-14 rounded-full border-2 border-primary overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent-purple/40" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Booster Alpha</h4>
                    <div className="flex text-accent-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={i} name="star" size={12} filled />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed">
                  &ldquo;Best platform I&apos;ve worked for. Instant payouts and
                  constant orders. The management actually respects the
                  boosters&apos; time.&rdquo;
                </p>
              </div>

              {/* Why EloDark */}
              <div className="glass-card rounded-2xl p-8 border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">
                  Why EloDark?
                </h4>
                <ul className="space-y-4">
                  {[
                    "High completion bonuses",
                    "Direct client tips (100% yours)",
                    "Advanced VPN & Security tools",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <Icon name="check_circle" className="text-accent-cyan" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
