import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const boosterData = {
  name: "Shadow",
  title: "Elite Grandmaster",
  rating: "5.0",
  reviews: 312,
  winRate: "99.2%",
  orders: "620+",
  peakRank: "Challenger 1,120 LP",
  mainRoles: "Jungle / Mid",
  games: ["League of Legends", "Valorant"],
  stats: [
    { label: "Total de Pedidos", value: "620+" },
    { label: "Win Rate", value: "99.2%" },
    { label: "Tempo Médio", value: "18h" },
    { label: "Clientes Recorrentes", value: "84%" },
  ],
  recentOrders: [
    { from: "Gold IV", to: "Platinum I", game: "LoL", time: "12h", status: "Concluído" },
    { from: "Silver II", to: "Gold I", game: "LoL", time: "8h", status: "Concluído" },
    { from: "Platinum IV", to: "Diamond IV", game: "LoL", time: "24h", status: "Concluído" },
    { from: "Iron I", to: "Radiant", game: "Valorant", time: "48h", status: "Em Andamento" },
  ],
  reviews_list: [
    { user: "xDarkSlayer", rating: 5, text: "Win rate insana e muito rápido. Chegou no Diamante em um dia.", date: "2 dias atrás" },
    { user: "NightHawk99", rating: 5, text: "Melhor booster que já tive. Super profissional e comunicativo.", date: "1 semana atrás" },
    { user: "ProGamer_X", rating: 5, text: "Jogador absurdo. 25 vitórias seguidas. Recomendo demais.", date: "2 semanas atrás" },
  ],
};

export default function BoosterProfilePage() {
  const b = boosterData;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className="relative">
              <div className="size-32 rounded-full border-4 border-primary p-1.5 shadow-[0_0_30px_rgba(46,123,255,0.3)]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent-purple/30" />
              </div>
              <div className="absolute bottom-2 right-2 size-5 bg-green-500 rounded-full border-3 border-bg-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">{b.name}</h1>
                <Icon name="verified" className="text-primary" size={24} filled />
              </div>
              <p className="text-accent-gold text-sm font-bold tracking-widest uppercase mb-4">
                {b.title}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {b.games.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-primary/20 text-primary text-xs rounded uppercase font-bold tracking-widest"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-accent-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={16} filled />
                  ))}
                  <span className="ml-2 text-white font-bold">{b.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">({b.reviews} avaliações)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/boost/league-of-legends"
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(46,123,255,0.4)] transition-all text-sm"
              >
                Contratar Este Booster
              </Link>
              <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <Icon name="chat" size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {b.stats.map((s) => (
                <div
                  key={s.label}
                  className="glass-card p-5 rounded-xl text-center hover:border-primary/30 transition-all"
                >
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">
                    {s.label}
                  </p>
                  <p className="text-2xl font-black">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon name="history" className="text-primary" />
                  Pedidos Recentes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-bold">De</th>
                      <th className="px-6 py-3 text-left font-bold">Para</th>
                      <th className="px-6 py-3 text-left font-bold">Jogo</th>
                      <th className="px-6 py-3 text-left font-bold">Tempo</th>
                      <th className="px-6 py-3 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.recentOrders.map((o, i) => (
                      <tr
                        key={i}
                        className="border-t border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold">{o.from}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">{o.to}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{o.game}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{o.time}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              o.status === "Concluído"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Icon name="reviews" className="text-primary" />
                Avaliações de Clientes
              </h3>
              {b.reviews_list.map((r, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-6 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/20 border border-primary/30" />
                      <span className="font-bold text-sm">{r.user}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Icon
                        key={j}
                        name="star"
                        className="text-accent-gold"
                        size={14}
                        filled
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
                Detalhes do Booster
              </h4>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rank Máximo</span>
                  <span className="font-bold">{b.peakRank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxa de Sucesso</span>
                  <span className="font-bold text-green-400">{b.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Roles Principais</span>
                  <span className="font-bold">{b.mainRoles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total de Pedidos</span>
                  <span className="font-bold">{b.orders}</span>
                </div>
              </div>

              <Link
                href="/boost/league-of-legends"
                className="block w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-primary to-accent-cyan text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
              >
                INICIAR SEU PEDIDO
              </Link>
              <p className="text-center text-xs text-gray-500 mt-3">
                <Icon
                  name="verified_user"
                  size={10}
                  className="align-middle mr-1"
                />
                100% Segurança de Conta Garantida
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
