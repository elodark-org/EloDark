"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyEmail } = useAuth();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, username);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyEmail(email, code);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido ou expirado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 animated-grid opacity-[0.07]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="EloDark" className="w-10 h-10 rounded-xl object-cover shadow-[0_0_16px_rgba(168,85,247,0.5)]" style={{ objectPosition: "center 20%" }} />
          <span className="text-2xl font-bold text-white">EloDark</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {step === "form" ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
                <p className="text-gray-400 text-sm">
                  Junte-se ao EloDark e comece a subir de elo hoje
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Nome de Usuário"
                  placeholder="Seu nome de invocador"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Mín. 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Enviando código..." : "Criar Conta"}
                </Button>
              </form>

              <p className="text-center text-gray-400 text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary font-bold hover:text-accent-cyan transition-colors">
                  Entrar
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 border border-primary/30 mx-auto mb-4">
                  <Icon name="mail" className="text-primary" size={28} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verifique seu e-mail</h1>
                <p className="text-gray-400 text-sm">
                  Enviamos um código de 6 dígitos para{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  label="Código de verificação"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                />
                <Button type="submit" size="lg" className="w-full" disabled={loading || code.length !== 6}>
                  {loading ? "Verificando..." : "Confirmar Código"}
                </Button>
              </form>

              <p className="text-center text-gray-400 text-sm">
                Não recebeu?{" "}
                <button
                  type="button"
                  className="text-primary font-bold hover:text-accent-cyan transition-colors"
                  onClick={() => { setStep("form"); setError(""); setCode(""); }}
                >
                  Tentar novamente
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
