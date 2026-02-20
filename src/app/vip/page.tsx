import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const tiers = [
  {
    tier: "Novice Tier",
    name: "Squire",
    price: "$9.99",
    featured: false,
    features: [
      { label: "Priority Queue Access", included: true },
      { label: "5% Permanent Discount", included: true },
      { label: "Free Live Stream", included: false },
      { label: "Direct Discord Contact", included: false },
    ],
    cta: "Select Squire",
  },
  {
    tier: "Elite Tier",
    name: "King",
    price: "$29.99",
    featured: true,
    features: [
      { label: "Ultra-Priority Queue", included: true },
      { label: "15% Permanent Discount", included: true },
      { label: "Free Private 4K Stream", included: true },
      { label: "Direct Discord with Booster", included: true },
      { label: "Exclusive Profile Badge", included: true },
    ],
    cta: "Unlock Elite Status",
  },
  {
    tier: "Veteran Tier",
    name: "Knight",
    price: "$19.99",
    featured: false,
    features: [
      { label: "High-Priority Queue", included: true },
      { label: "10% Permanent Discount", included: true },
      { label: "Free Live Stream", included: true },
      { label: "Direct Discord Contact", included: false },
    ],
    cta: "Select Knight",
  },
];

const comparison = [
  { feature: "Wait Time Reduction", squire: "Low", king: "Instant", knight: "High" },
  { feature: "Booster Messaging", squire: false, king: true, knight: false },
  { feature: "Legacy Profile Badge", squire: false, king: true, knight: true },
  { feature: "Custom Stream UI", squire: false, king: true, knight: false },
];

export default function VipPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center px-6 py-12">
        {/* Hero Title */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-accent-gold via-yellow-200 to-yellow-700 bg-clip-text text-transparent">
            EloDark Elite VIP
          </h1>
          <p className="text-gray-400 text-lg">
            Elevate your competitive journey with our exclusive tier-based perks.
            Precision, speed, and absolute dominance.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-6xl w-full">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card rounded-xl flex flex-col gap-8 relative ${
                tier.featured
                  ? "p-10 border-2 border-accent-gold shadow-[0_0_50px_rgba(255,215,0,0.15)] md:scale-105 z-20"
                  : "p-8 hover:border-primary/20 transition-all duration-300"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-gold to-yellow-200 px-4 py-1 rounded-full text-bg-primary text-[10px] font-black uppercase tracking-tighter shadow-lg">
                  Most Popular
                </div>
              )}

              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest mb-2 block ${
                    tier.featured ? "text-accent-gold" : "text-gray-400"
                  }`}
                >
                  {tier.tier}
                </span>
                <h3 className={`font-bold text-white mb-4 ${tier.featured ? "text-3xl" : "text-2xl"}`}>
                  {tier.name}
                </h3>
                <div
                  className={`inline-flex items-baseline gap-1 px-4 py-2 rounded-lg border ${
                    tier.featured
                      ? "bg-accent-gold/10 px-6 py-3 border-accent-gold/20"
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  <span className={`font-bold text-white ${tier.featured ? "text-4xl font-black" : "text-3xl"}`}>
                    {tier.price}
                  </span>
                  <span className={`text-sm ${tier.featured ? "text-accent-gold/70 font-bold" : "text-gray-400"}`}>
                    /mo
                  </span>
                </div>
              </div>

              <ul className={`flex flex-col ${tier.featured ? "gap-5" : "gap-4"}`}>
                {tier.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-center gap-3 ${
                      tier.featured
                        ? "text-white text-base"
                        : f.included
                        ? "text-gray-300 text-sm"
                        : "text-gray-500 text-sm"
                    }`}
                  >
                    {tier.featured ? (
                      <Icon name="verified" className="text-accent-gold" size={24} filled />
                    ) : f.included ? (
                      <Icon name="check_circle" className="text-primary" size={20} />
                    ) : (
                      <Icon name="block" className="text-gray-600" size={20} />
                    )}
                    {f.label}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  tier.featured
                    ? "bg-gradient-to-r from-accent-gold to-yellow-200 text-bg-primary font-black text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                    : "border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-24 w-full max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Membership Benefits Comparison
            </h2>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="size-2 rounded-full bg-primary" /> Included
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1 ml-4">
                <span className="size-2 rounded-full bg-white/10" /> Not Included
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-white/5 glass-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-gray-400 font-medium">Core Feature</th>
                  <th className="p-6 text-center text-gray-300 font-bold">Squire</th>
                  <th className="p-6 text-center text-primary font-bold">King</th>
                  <th className="p-6 text-center text-gray-300 font-bold">Knight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <td className="p-6 text-gray-200">{row.feature}</td>
                    {(["squire", "king", "knight"] as const).map((tier) => {
                      const val = row[tier];
                      return (
                        <td key={tier} className="p-6 text-center">
                          {typeof val === "string" ? (
                            <span className={tier === "king" ? "text-primary font-bold" : "text-gray-400"}>
                              {val}
                            </span>
                          ) : val ? (
                            <Icon name={tier === "king" ? "done_all" : "verified"} className="text-primary mx-auto" />
                          ) : (
                            <Icon name="close" className="text-gray-700 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
