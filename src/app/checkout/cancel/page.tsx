"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="text-center max-w-md space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
        <Icon name="cancel" className="text-red-400" size={48} filled />
      </div>

      <h1 className="text-3xl font-bold">Pagamento Cancelado</h1>

      <p className="text-gray-400">
        O pagamento do pedido{orderId ? ` #${orderId}` : ""} foi cancelado.
        Nenhuma cobrança foi realizada.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link href="/checkout">
          <Button variant="primary" icon="refresh">
            Tentar Novamente
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

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <Suspense>
          <CancelContent />
        </Suspense>
      </main>
    </div>
  );
}
