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
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, username);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar conta");
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
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-primary to-accent-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Icon name="bolt" className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-white">EloDark</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:text-accent-cyan transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
