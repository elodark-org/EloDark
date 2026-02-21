"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

type VerifyResult =
  | { state: "loading" }
  | { state: "success"; orderId: number }
  | { state: "error"; message: string };

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [result, setResult] = useState<VerifyResult>({ state: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setResult({ state: "error", message: "Sessão de pagamento não encontrada." });
      return;
    }

    fetch(`/api/checkout/verify/${sessionId}`)
      .then(async (res) => {
        const data = (await res.json()) as {
          payment_status?: string;
          order_id?: number | null;
          error?: string;
        };
        if (!res.ok || data.error) {
          setResult({ state: "error", message: data.error ?? "Erro ao verificar pagamento." });
          return;
        }
        if (data.payment_status !== "paid") {
          setResult({ state: "error", message: "Pagamento não confirmado. Tente novamente ou entre em contato com o suporte." });
          return;
        }
        setResult({ state: "success", orderId: data.order_id! });
      })
      .catch(() => {
        setResult({ state: "error", message: "Erro ao conectar ao servidor." });
      });
  }, [sessionId]);

  if (result.state === "loading") {
    return (
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <Icon name="hourglass_top" className="text-primary" size={48} />
        </div>
        <h1 className="text-3xl font-bold">Verificando pagamento...</h1>
        <p className="text-gray-400">Aguarde enquanto confirmamos seu pedido.</p>
      </div>
    );
  }

  if (result.state === "error") {
    return (
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
          <Icon name="error" className="text-red-400" size={48} filled />
        </div>
        <h1 className="text-3xl font-bold">Erro na verificação</h1>
        <p className="text-gray-400">{result.message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/dashboard">
            <Button variant="primary" icon="dashboard">
              Ir para Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" icon="home">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
        <Icon name="check_circle" className="text-green-400" size={48} filled />
      </div>

      <h1 className="text-3xl font-bold">Pagamento Confirmado!</h1>

      <p className="text-gray-400">
        Seu pedido{result.orderId ? ` #${result.orderId}` : ""} foi processado
        com sucesso. Um booster será atribuído em breve.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link href="/dashboard">
          <Button variant="primary" icon="dashboard">
            Ir para Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" icon="home">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <Suspense>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
