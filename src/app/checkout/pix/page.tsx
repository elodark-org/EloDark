"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

type Step = "form" | "qrcode" | "paid";

interface PixData {
  pagbank_order_id: string;
  qr_code_text: string;
  qr_code_image: string | null;
  amount: number;
  expires_at: string;
}

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function PixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [pollError, setPollError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollErrorCount = useRef(0);

  // Pré-preenche nome e email do usuário logado
  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!orderId) {
      setError("Pedido não encontrado. Volte e configure seu boost.");
    }
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!pixData?.expires_at) return;
    const update = () => {
      const diff = Math.floor((new Date(pixData.expires_at).getTime() - Date.now()) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [pixData]);

  // Função de verificação reutilizada pelo polling e pelo botão manual
  const checkPayment = async (): Promise<boolean> => {
    const res = await fetch(`/api/checkout/verify/${orderId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.payment_status === "paid") {
      clearInterval(pollRef.current!);
      setStep("paid");
      setTimeout(() => {
        router.push(`/checkout/success?order_id=${orderId}`);
      }, 2000);
      return true;
    }
    return false;
  };

  // Polling para verificar pagamento
  useEffect(() => {
    if (step !== "qrcode" || !orderId) return;

    pollErrorCount.current = 0;
    pollRef.current = setInterval(async () => {
      try {
        await checkPayment();
        pollErrorCount.current = 0;
        setPollError(false);
      } catch {
        pollErrorCount.current += 1;
        if (pollErrorCount.current >= 5) {
          setPollError(true);
        }
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, orderId]);

  // Verificação manual pelo botão "Já paguei"
  async function handleManualVerify() {
    if (!orderId) return;
    setVerifying(true);
    setPollError(false);
    try {
      const paid = await checkPayment();
      if (!paid) {
        setPollError(false);
        // Volta a mostrar "verificando" por mais alguns segundos
      }
    } catch {
      setPollError(true);
    } finally {
      setVerifying(false);
    }
  }

  async function handleGeneratePix() {
    if (!orderId || !name.trim() || !email.trim() || cpf.replace(/\D/g, "").length !== 11) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/pix-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Number(orderId),
          name: name.trim(),
          email: email.trim(),
          cpf: cpf.replace(/\D/g, ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao gerar PIX");
        return;
      }
      setPixData(data);
      setStep("qrcode");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!pixData?.qr_code_text) return;
    await navigator.clipboard.writeText(pixData.qr_code_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (!orderId) {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <Icon name="error" className="text-red-400" size={40} filled />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-red-400">Pedido inválido</h1>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
        <Button variant="primary" onClick={() => router.push("/boost/league-of-legends")}>
          Configurar Pedido
        </Button>
      </div>
    );
  }

  if (step === "paid") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
            <Icon name="check_circle" className="text-green-400" size={52} filled />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-green-400">Pagamento confirmado!</h1>
          <p className="text-white/50 text-sm">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (step === "qrcode" && pixData) {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 text-green-400 text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Aguardando Pagamento
          </div>
          <h1 className="text-2xl font-black mb-1">Pague com PIX</h1>
          <p className="text-white/50 text-sm">
            Escaneie o QR code ou copie o código abaixo
          </p>
        </div>

        {/* Valor */}
        <div className="glass-card rounded-2xl p-4 border border-white/5 w-full text-center">
          <p className="text-xs text-white/40 uppercase font-bold mb-1">Valor a pagar</p>
          <p className="text-3xl font-black text-primary">
            {pixData.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          {timeLeft !== null && timeLeft > 0 && (
            <p className="text-xs text-white/40 mt-1">
              Expira em <span className="text-yellow-400 font-bold">{formatTime(timeLeft)}</span>
            </p>
          )}
          {timeLeft === 0 && (
            <p className="text-xs text-red-400 mt-1 font-bold">PIX expirado — gere um novo</p>
          )}
        </div>

        {/* QR Code */}
        {pixData.qr_code_image ? (
          <div className="glass-card rounded-2xl p-4 border border-white/5">
            <Image
              src={pixData.qr_code_image}
              alt="QR Code PIX"
              width={240}
              height={240}
              className="rounded-xl"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-60 h-60 glass-card rounded-2xl border border-white/5 flex items-center justify-center">
            <Icon name="qr_code_2" className="text-white/20" size={80} />
          </div>
        )}

        {/* Copia e cola */}
        <div className="w-full space-y-2">
          <p className="text-xs text-white/40 uppercase font-bold">PIX Copia e Cola</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/60 font-mono truncate">
              {pixData.qr_code_text}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/30 transition-all shrink-0 flex items-center gap-1.5"
            >
              <Icon name={copied ? "check" : "content_copy"} size={14} />
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="glass-card rounded-2xl p-4 border border-white/5 w-full space-y-2">
          <p className="text-xs font-bold text-white/40 uppercase">Como pagar</p>
          {[
            "Abra o app do seu banco",
            "Escolha pagar com PIX",
            "Escaneie o QR code ou cole o código",
            "Confirme o pagamento",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-xs text-white/60">{s}</span>
            </div>
          ))}
        </div>

        {/* Botão de verificação manual */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={handleManualVerify}
            disabled={verifying}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Icon name="hourglass_top" size={16} className="animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Icon name="check_circle" size={16} />
                Já paguei — verificar agora
              </>
            )}
          </button>

          {pollError ? (
            <p className="text-xs text-yellow-400/80 text-center">
              Problemas ao verificar automaticamente.{" "}
              <button onClick={handleManualVerify} className="underline hover:text-yellow-400">
                Clique aqui para tentar novamente
              </button>
            </p>
          ) : (
            <p className="text-xs text-white/30 text-center">
              Verificando pagamento automaticamente...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Step: form
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
          <Icon name="pix" className="text-primary" size={32} />
        </div>
        <h1 className="text-2xl font-black mb-2">Pagamento via PIX</h1>
        <p className="text-white/50 text-sm">Preencha seus dados para gerar o QR code</p>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/5 w-full space-y-4">
        <div>
          <label className="block text-xs text-white/40 mb-1.5 font-bold uppercase">Nome completo</label>
          <input
            type="text"
            placeholder="João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5 font-bold uppercase">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5 font-bold uppercase">CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            maxLength={14}
            autoComplete="off"
            className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <Icon name="error" className="text-red-400 shrink-0" size={16} />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <Button
          variant="primary"
          className="w-full"
          disabled={loading || !name.trim() || !email.trim() || cpf.replace(/\D/g, "").length !== 11}
          onClick={handleGeneratePix}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Icon name="hourglass_top" size={16} className="animate-spin" />
              Gerando PIX...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Icon name="qr_code_2" size={16} />
              Gerar QR Code PIX
            </span>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-1">
          <Icon name="lock" size={12} />
          <span className="text-[10px] font-bold uppercase">Pagamento Seguro</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="verified_user" size={12} />
          <span className="text-[10px] font-bold uppercase">PagBank</span>
        </div>
      </div>
    </div>
  );
}

export default function PixCheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
              <Icon name="hourglass_top" className="text-primary" size={32} />
            </div>
          }
        >
          <PixContent />
        </Suspense>
      </main>
    </div>
  );
}
