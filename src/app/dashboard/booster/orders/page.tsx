"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

export default function BoosterOrdersPage() {
  const { loading: guardLoading, authorized } = useRoleGuard("booster");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get<{ orders: Order[] }>("/orders");
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchOrders();
  }, [authorized, fetchOrders]);

  async function handleComplete(orderId: number) {
    setCompletingId(orderId);
    try {
      await api.put<{ order: Order }>(`/orders/${orderId}/status`, {
        status: "completed",
      });
      await fetchOrders();
    } catch {
      // silent — order might already be completed
    } finally {
      setCompletingId(null);
    }
  }

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="text-primary font-bold">#{row.id}</span>
      ),
    },
    {
      key: "service_type",
      label: "Service",
      render: (row) => (
        <span className="capitalize">{row.service_type.replace(/-/g, " ")}</span>
      ),
    },
    {
      key: "user_name",
      label: "Client",
      render: (row) => (
        <span className="text-white/70">{row.user_name || "---"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="font-bold">{formatBRL(parseFloat(row.price))}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row) => (
        <span className="text-white/60">
          {new Date(row.created_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) =>
        row.status === "in_progress" ? (
          <Button
            variant="ghost"
            size="sm"
            icon="check_circle"
            disabled={completingId === row.id}
            onClick={() => handleComplete(row.id)}
          >
            {completingId === row.id ? "Completing..." : "Complete"}
          </Button>
        ) : null,
    },
  ];

  if (guardLoading || !authorized) {
    return (
      <>
        <PageHeader title="My Orders" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title="My Orders" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="My Orders" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load orders.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="My Orders"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={fetchOrders}>
            Refresh
          </Button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={orders}
          emptyMessage="No orders assigned to you yet."
        />
      </div>
    </>
  );
}
