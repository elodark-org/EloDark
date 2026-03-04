"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const WHATSAPP_NUMBER = "5515998594085";

interface Booster {
  id: number;
  game_name: string;
  rank: string;
  win_rate: number;
  avatar_emoji: string;
}

const benefits = [
  {
    icon: "payments",
    title: "Pagamentos Instantâneos",
    description: "Receba imediatamente após concluir o pedido. Sem esperar semanas pelo seu dinheiro.",
    glow: "border-accent-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]",
    iconColor: "text-accent-gold bg-accent-gold/10",
  },
  {
    icon: "calendar_today",
    title: "Horário Flexível",
    description: "Você escolhe quando jogar. Pegue pedidos que encaixem na sua agenda e preferências de rank.",
    glow: "border-accent-cyan/30 shadow-[0_0_20px_rgba(0,212,255,0.1)]",
    iconColor: "text-accent-cyan bg-accent-cyan/10",
  },
  {
    icon: "support_agent",
    title: "Suporte 24/7",
    description: "Nossa equipe de suporte profissional está disponível 24 horas para lidar com clientes e problemas.",
    glow: "border-accent-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    iconColor: "text-accent-purple bg-accent-purple/10",
  },
];

const INPUT_CLASS =
  "bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/60 px-4 py-3 placeholder:text-white/20 transition-colors";

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    game: "League of Legends",
    nick: "",
    rank: "",
    proof_link: "",
    discord: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [boosters, setBoosters] = useState<Booster[]>([]);

  useEffect(() => {
    fetch("/api/boosters")
      .then((r) => r.json())
      .then((d) => setBoosters(d.boosters ?? []))
      .catch(() => {});
  }, []);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");

      setStatus("success");

      const msg = [
        `🎮 *Nova Candidatura de Booster — EloDark*`,
        ``,
        `👤 *Nome:* ${form.name}`,
        `📧 *Email:* ${form.email}`,
        `🎮 *Jogo:* ${form.game}`,
        `🏆 *Rank:* ${form.rank}`,
        `🎯 *Nick:* ${form.nick}`,
        `💬 *Discord:* ${form.discord}`,
        form.proof_link ? `🔗 *Comprovação:* ${form.proof_link}` : "",
        `🌎 *Região:* Brasil (BR)`,
      ]
        .filter(Boolean)
        .join("\n");

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        {/* Hero */}
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
              Recrutando os Top 0.1% Jogadores
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent-gold to-accent-cyan bg-clip-text text-transparent tracking-tight">
              Transforme Sua Skill <br className="hidden md:block" /> em Lucro
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-10">
              Estamos procurando os top 0.1% dos jogadores. Ganhe até{" "}
              <span className="text-white font-semibold">R$ 10.000/semana</span> fazendo boost
              nos jogos que você ama na plataforma mais profissional do mercado.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#apply"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(46,123,255,0.3)] transition-all text-center"
              >
                Iniciar Candidatura
              </a>
              <div className="flex items-center gap-2 px-6 py-4 text-gray-300">
                <Icon name="verified_user" className="text-accent-cyan" />
                <span className="text-sm">Pagamentos Verificados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
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
                  <p className="text-gray-400 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="px-6 lg:px-20 py-20 relative" id="apply">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Form */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl p-8 lg:p-12">
                {status === "success" ? (
                  <div className="flex flex-col items-center gap-6 py-12 text-center">
                    <div className="size-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <Icon name="check_circle" className="text-green-400" size={40} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Candidatura Enviada!</h2>
                      <p className="text-gray-400 max-w-sm">
                        Seu WhatsApp foi aberto com os dados preenchidos. Basta enviar a mensagem para o admin.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setForm({ name: "", email: "", game: "League of Legends", nick: "", rank: "", proof_link: "", discord: "" });
                      }}
                      className="text-sm text-primary underline underline-offset-4"
                    >
                      Enviar outra candidatura
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h2 className="text-3xl font-bold text-white mb-2">Junte-se à Elite</h2>
                      <p className="text-gray-400">
                        Complete o processo de avaliação profissional para começar a fazer boost.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nome */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Nome Completo <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="Seu nome"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          E-mail <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="seu@email.com"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                        />
                      </div>

                      {/* Jogo */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Jogo Principal <span className="text-red-400">*</span>
                        </label>
                        <select
                          className={INPUT_CLASS}
                          value={form.game}
                          onChange={(e) => set("game", e.target.value)}
                        >
                          <option>League of Legends</option>
                          <option>Valorant</option>
                        </select>
                      </div>

                      {/* Nick */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Nick no Jogo <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder={form.game === "Valorant" ? "Riot ID (Nick#TAG)" : "Summoner Name#BR1"}
                          type="text"
                          required
                          value={form.nick}
                          onChange={(e) => set("nick", e.target.value)}
                        />
                      </div>

                      {/* Rank */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Rank Máximo <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="ex: Challenger 600LP"
                          type="text"
                          required
                          value={form.rank}
                          onChange={(e) => set("rank", e.target.value)}
                        />
                      </div>

                      {/* Discord */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Discord <span className="text-red-400">*</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="username ou username#0000"
                          type="text"
                          required
                          value={form.discord}
                          onChange={(e) => set("discord", e.target.value)}
                        />
                      </div>

                      {/* Comprovação */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Link de Comprovação do Rank
                          <span className="text-white/30 font-normal normal-case tracking-normal ml-1">(opcional)</span>
                        </label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="Link do Tracker.gg ou Op.gg"
                          type="url"
                          value={form.proof_link}
                          onChange={(e) => set("proof_link", e.target.value)}
                        />
                      </div>

                      {/* Região — fixada em BR */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                          Região
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                          <span className="text-lg">🇧🇷</span>
                          <span className="text-white font-medium">Brasil (BR)</span>
                          <span className="ml-auto text-xs text-white/30">Único servidor atendido</span>
                        </div>
                      </div>

                      {/* Error */}
                      {status === "error" && (
                        <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          <Icon name="error" size={16} />
                          {errorMsg}
                        </div>
                      )}

                      {/* Submit */}
                      <div className="md:col-span-2 mt-2">
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg flex items-center justify-center gap-2"
                        >
                          {status === "loading" ? (
                            <><Icon name="hourglass_top" className="animate-spin" size={20} /> Enviando...</>
                          ) : (
                            <><Icon name="send" size={20} /> Enviar Candidatura via WhatsApp</>
                          )}
                        </button>
                        <p className="text-center text-gray-500 text-xs mt-4">
                          Ao enviar, seu WhatsApp será aberto com os dados preenchidos para o admin.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Equipe Atual */}
              <div className="glass-card rounded-2xl p-6 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
                    Nossa Equipe
                  </h4>
                  {boosters.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                      {boosters.length} booster{boosters.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {boosters.length === 0 ? (
                  <p className="text-white/30 text-sm">Carregando equipe...</p>
                ) : (
                  <ul className="space-y-3">
                    {boosters.slice(0, 6).map((b) => (
                      <li key={b.id} className="flex items-center gap-3">
                        <span className="text-xl">{b.avatar_emoji || "🎮"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{b.game_name}</p>
                          <p className="text-accent-gold text-xs font-bold uppercase">{b.rank}</p>
                        </div>
                        <span className="text-xs text-green-400 font-bold">{b.win_rate}%</span>
                      </li>
                    ))}
                    {boosters.length > 6 && (
                      <p className="text-white/30 text-xs text-center pt-1">+{boosters.length - 6} mais</p>
                    )}
                  </ul>
                )}
              </div>

              {/* Por que a EloDark */}
              <div className="glass-card rounded-2xl p-8 border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">
                  Por que a EloDark?
                </h4>
                <ul className="space-y-4">
                  {[
                    "Bônus altos por conclusão",
                    "Gorjetas diretas dos clientes (100% suas)",
                    "Ferramentas avançadas de VPN e Segurança",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
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
