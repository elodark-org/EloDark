import { Icon } from "@/components/ui/icon";

const stats = [
  { label: "Total de Partidas", value: "147", icon: "sports_esports", trend: "+12 esta semana" },
  { label: "Taxa de Vitória", value: "76%", icon: "trending_up", trend: "+4% em relação ao mês passado" },
  { label: "KDA Médio", value: "8.2", icon: "auto_awesome", trend: "Excelente" },
  { label: "PDL Ganhos", value: "+842", icon: "arrow_upward", trend: "Desde o início do pedido" },
];

const matchHistory = [
  { champ: "Lee Sin", result: "Vitória", kda: "12/2/8", cs: "187", duration: "18:24", lp: "+28" },
  { champ: "Kha'Zix", result: "Vitória", kda: "8/1/4", cs: "156", duration: "24:51", lp: "+26" },
  { champ: "Nidalee", result: "Derrota", kda: "4/5/12", cs: "143", duration: "32:10", lp: "-18" },
  { champ: "Lee Sin", result: "Vitória", kda: "15/3/7", cs: "201", duration: "21:33", lp: "+29" },
  { champ: "Elise", result: "Vitória", kda: "9/2/11", cs: "134", duration: "26:45", lp: "+25" },
];

export default function AnalyticsPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <h2 className="text-xl font-bold">Análise de Partidas</h2>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-primary/20 text-primary text-sm font-bold rounded-lg border border-primary/30">
            Últimos 7 Dias
          </button>
          <button className="px-4 py-2 bg-white/5 text-white/60 text-sm font-bold rounded-lg border border-white/10 hover:text-white transition-colors">
            Últimos 30 Dias
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-white/40 uppercase font-bold tracking-widest">
                  {stat.label}
                </p>
                <Icon name={stat.icon} className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-black mb-1">{stat.value}</p>
              <p className="text-xs text-primary/80">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Win Rate Chart Placeholder */}
        <div className="glass-card rounded-2xl p-8 border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Icon name="show_chart" className="text-primary" />
            Progressão de PDL
          </h3>
          <div className="h-48 flex items-end gap-2">
            {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary to-accent-cyan rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-white/30">
                  {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Match History Table */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon name="history" className="text-primary" />
              Histórico de Partidas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-bold">Campeão</th>
                  <th className="px-6 py-3 text-left font-bold">Resultado</th>
                  <th className="px-6 py-3 text-left font-bold">KDA</th>
                  <th className="px-6 py-3 text-left font-bold">CS</th>
                  <th className="px-6 py-3 text-left font-bold">Duração</th>
                  <th className="px-6 py-3 text-left font-bold">PDL</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory.map((m, i) => (
                  <tr
                    key={i}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-sm">{m.champ}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${
                          m.result === "Vitória" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {m.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{m.kda}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{m.cs}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{m.duration}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${
                          m.lp.startsWith("+") ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {m.lp} PDL
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
