"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChatView } from "@/components/dashboard/chat-view";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

export default function ChatPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ orders: Order[] }>("/orders")
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Chat" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando conversas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Chat" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Falha ao carregar conversas.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Chat" />
      <div className="flex-1 overflow-hidden">
        <ChatView orders={orders} />
      </div>
    </div>
  );
}
