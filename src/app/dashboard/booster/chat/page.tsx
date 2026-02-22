"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChatView } from "@/components/dashboard/chat-view";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

export default function BoosterChatPage() {
  const { loading: guardLoading, authorized } = useRoleGuard("booster");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorized) return;

    api
      .get<{ orders: Order[] }>("/orders")
      .then((data) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authorized]);

  if (guardLoading || !authorized || loading) {
    return (
      <>
        <PageHeader title="Chat" />
        <div className="p-8 flex items-center justify-center h-[calc(100vh-65px)]">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Chat" />
      <div className="flex-1 min-h-0">
        <ChatView orders={orders} />
      </div>
    </div>
  );
}
