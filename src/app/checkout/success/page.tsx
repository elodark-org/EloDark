"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="text-center max-w-md space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
        <Icon name="check_circle" className="text-green-400" size={48} filled />
      </div>

      <h1 className="text-3xl font-bold">Pagamento Confirmado!</h1>

      <p className="text-gray-400">
        Seu pedido{orderId ? ` #${orderId}` : ""} foi processado com sucesso.
        Um booster será atribuído em breve.
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
