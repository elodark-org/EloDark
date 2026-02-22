"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

export default function OrdersPage() {
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

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <Link href={`/dashboard/orders/${row.id}`} className="text-primary font-bold hover:underline">
          #{row.id}
        </Link>
      ),
    },
    {
      key: "service_type",
      label: "Tipo de Serviço",
      render: (row) => (
        <span className="capitalize font-medium">{row.service_type.replace(/-/g, " ")}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "booster_name",
      label: "Booster",
      render: (row) => (
        <span className="text-white/60">{row.booster_name || "Aguardando atribuição"}</span>
      ),
    },
    {
      key: "price",
      label: "Preço",
      render: (row) => (
        <span className="font-bold">R$ {parseFloat(row.price).toFixed(2)}</span>
      ),
    },
    {
      key: "created_at",
      label: "Data",
      render: (row) => (
        <span className="text-white/60">
          {new Date(row.created_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Link
          href={`/dashboard/orders/${row.id}`}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-bold"
        >
          Detalhes
          <Icon name="chevron_right" size={16} />
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <PageHeader title="Meus Pedidos" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando pedidos...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Meus Pedidos" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Falha ao carregar pedidos.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Meus Pedidos" />
      <div className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={orders}
          emptyMessage="Você ainda não tem nenhum pedido. Explore nossos serviços para começar!"
        />
      </div>
    </>
  );
}
