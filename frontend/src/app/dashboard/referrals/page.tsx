import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const referrals = [
  { name: "Alex M.", date: "Feb 12", reward: "$10.00", status: "Completed" },
  { name: "Jordan K.", date: "Feb 8", reward: "$10.00", status: "Pending" },
  { name: "Sam W.", date: "Jan 28", reward: "$10.00", status: "Completed" },
];

export default function ReferralsPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <h2 className="text-xl font-bold">Referral Rewards</h2>
      </header>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs text-white/40 uppercase font-bold mb-2">Total Earned</p>
            <p className="text-3xl font-black text-accent-gold">$30.00</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs text-white/40 uppercase font-bold mb-2">Friends Referred</p>
            <p className="text-3xl font-black text-primary">3</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs text-white/40 uppercase font-bold mb-2">Pending Rewards</p>
            <p className="text-3xl font-black">$10.00</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="glass-card rounded-2xl p-8 border border-primary/20 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="link" className="text-primary" />
            Your Referral Link
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/60 truncate">
              https://elodark.com/ref/SUMM0NER01
            </div>
            <Button size="md" icon="content_copy">
              Copy
            </Button>
          </div>
          <p className="text-xs text-white/50">
            Earn $10.00 for every friend who completes their first order using your link.
          </p>
        </div>

        {/* Referral History */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-lg font-bold">Referral History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-bold">Friend</th>
                  <th className="px-6 py-3 text-left font-bold">Date</th>
                  <th className="px-6 py-3 text-left font-bold">Reward</th>
                  <th className="px-6 py-3 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{r.name}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{r.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-accent-gold">{r.reward}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        r.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
