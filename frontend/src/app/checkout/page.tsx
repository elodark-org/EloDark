"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PaymentMethod = "card" | "paypal" | "crypto" | "applepay";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const methods: { id: PaymentMethod; label: string; extra?: string }[] = [
    { id: "card", label: "Credit / Debit Card" },
    { id: "paypal", label: "PayPal" },
    { id: "crypto", label: "Crypto", extra: "Fast" },
    { id: "applepay", label: "Apple / Google Pay" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-20 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Form */}
          <div className="flex-1 space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Secure Checkout</h2>
              <p className="text-gray-400">
                Complete your elite boosting order to start climbing today.
              </p>
            </div>

            {/* Payment Method Selection */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Icon name="account_balance_wallet" className="text-primary" />
                Select Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`glass-card p-5 rounded-xl cursor-pointer flex flex-col gap-4 transition-all text-left ${
                      paymentMethod === m.id
                        ? "border-2 border-primary shadow-[0_0_20px_rgba(46,123,255,0.3)]"
                        : "border border-primary/10 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{m.label}</span>
                        {m.extra && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 uppercase tracking-wider font-bold">
                            {m.extra}
                          </span>
                        )}
                      </div>
                      <Icon
                        name={paymentMethod === m.id ? "check_circle" : "circle"}
                        className={
                          paymentMethod === m.id
                            ? "text-primary"
                            : "text-gray-600"
                        }
                      />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <section className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Icon name="credit_card" className="text-primary" />
                  Card Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Cardholder Name"
                      placeholder="e.g. Alex Summoner"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Card Number"
                      placeholder="0000 0000 0000 0000"
                      rightIcon="lock"
                    />
                  </div>
                  <Input label="Expiry Date" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="123" rightIcon="help" />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-gray-800 border-gray-700 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">
                    Save card for future orders
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Right: Summary */}
          <aside className="w-full lg:w-[400px]">
            <div className="glass-card rounded-2xl p-8 sticky top-28 space-y-8">
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <h3 className="text-xl font-bold">Order Summary</h3>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                  #28941
                </span>
              </div>

              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                    <Icon name="military_tech" className="text-accent-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">
                      Elo Boost
                    </p>
                    <p className="font-bold leading-tight">
                      League of Legends: Gold IV to Platinum I
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Selected Add-ons
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
                      Duo Queue
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
                      Offline Mode
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 pt-4 border-t border-primary/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>$45.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Platform Fee</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    className="flex-1 bg-gray-900/80 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:border-primary/60 focus:outline-none transition-all"
                    placeholder="Discount Code"
                  />
                  <button className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/30 transition-all">
                    Apply
                  </button>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-3xl font-black text-accent-gold">
                    $45.99
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  iconRight="double_arrow"
                  className="w-full text-lg font-black tracking-wide"
                >
                  COMPLETE PURCHASE
                </Button>
                <div className="flex items-center justify-center gap-6 pt-2 opacity-50">
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
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
