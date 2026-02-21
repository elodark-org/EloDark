"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="shopping_cart_checkout" className="text-primary" size={48} />
          </div>

          <h2 className="text-3xl font-bold">Checkout via Stripe</h2>

          <p className="text-gray-400">
            O pagamento é processado de forma segura pelo Stripe. Configure seu
            pedido na página de boost e clique em <strong>Checkout Now</strong>{" "}
            para ser redirecionado.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/boost/league-of-legends">
              <Button variant="primary" icon="arrow_back">
                Configurar Pedido
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" icon="home">
                Página Inicial
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 opacity-50">
            <div className="flex items-center gap-1">
              <Icon name="verified_user" size={14} />
              <span className="text-[10px] font-bold uppercase">
                Norton Secured
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="lock" size={14} />
              <span className="text-[10px] font-bold uppercase">
                SSL Encrypted
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
