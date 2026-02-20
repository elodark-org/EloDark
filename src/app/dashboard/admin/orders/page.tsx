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

const STATUS_TABS = [
  "all",
  "pending",
  "active",
  "available",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["active", "available", "cancelled"],
  active: ["available", "in_progress", "cancelled"],
  available: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [assignInputs, setAssignInputs] = useState<Record<number, string>>({});
  const [statusMenuOpen, setStatusMenuOpen] = useState<number | null>(null);

  const fetchOrders = useCallback(() => {
    api
      .get<{ orders: Order[] }>("/admin/orders")
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchOrders();
  }, [authorized, fetchOrders]);

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  async function handleStatusChange(orderId: number, newStatus: string) {
    setActionLoading(orderId);
    setStatusMenuOpen(null);
    try {
      const { order } = await api.put<{ order: Order }>(
        `/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAssign(orderId: number) {
    const boosterId = assignInputs[orderId]?.trim();
    if (!boosterId) return;
    setActionLoading(orderId);
    try {
      const { order } = await api.put<{ order: Order }>(
        `/admin/orders/${orderId}/assign`,
        { booster_id: Number(boosterId) }
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
      setAssignInputs((prev) => ({ ...prev, [orderId]: "" }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign booster");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRelease(orderId: number) {
    setActionLoading(orderId);
    try {
      const { order } = await api.put<{ order: Order }>(
        `/admin/orders/${orderId}/release`,
        {}
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to release booster");
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="text-primary font-bold">#{row.id}</span>,
    },
    {
      key: "user_name",
      label: "Client",
      render: (row) => (
        <span className="text-white/80">{row.user_name || `User #${row.user_id}`}</span>
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
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "booster_name",
      label: "Booster",
      render: (row) => (
        <span className="text-white/60">
          {row.booster_name || (row.booster_id ? `Booster #${row.booster_id}` : "--")}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="font-bold">R$ {parseFloat(row.price).toFixed(2)}</span>
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
      label: "Actions",
      render: (row) => {
        const isLoading = actionLoading === row.id;
        const transitions = STATUS_TRANSITIONS[row.status] || [];

        return (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status change */}
            {transitions.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="swap_vert"
                  disabled={isLoading}
                  onClick={() =>
                    setStatusMenuOpen(statusMenuOpen === row.id ? null : row.id)
                  }
                >
                  Status
                </Button>
                {statusMenuOpen === row.id && (
                  <div className="absolute top-full right-0 mt-1 z-50 glass-card rounded-xl border border-white/10 py-1 min-w-[140px]">
                    {transitions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(row.id, s)}
                        className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white capitalize transition-colors"
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assign booster */}
            {row.status !== "completed" && row.status !== "cancelled" && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Booster ID"
                  value={assignInputs[row.id] || ""}
                  onChange={(e) =>
                    setAssignInputs((prev) => ({ ...prev, [row.id]: e.target.value }))
                  }
                  className="w-24 px-2 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="person_add"
                  disabled={isLoading || !assignInputs[row.id]?.trim()}
                  onClick={() => handleAssign(row.id)}
                />
              </div>
            )}

            {/* Release booster */}
            {row.booster_id && row.status !== "completed" && row.status !== "cancelled" && (
              <Button
                variant="ghost"
                size="sm"
                icon="person_remove"
                disabled={isLoading}
                onClick={() => handleRelease(row.id)}
                className="text-red-400 hover:text-red-300"
              />
            )}

            {isLoading && <Icon name="hourglass_top" className="animate-spin text-white/40" size={16} />}
          </div>
        );
      },
    },
  ];

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="Order Management" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Order Management" />
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
        <PageHeader title="Order Management" />
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
        title="Order Management"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={() => { setLoading(true); fetchOrders(); }}>
            Refresh
          </Button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Status filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "all" ? orders.length : orders.filter((o) => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60"
                }`}
              >
                {tab.replace("_", " ")} ({count})
              </button>
            );
          })}
        </div>

        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage="No orders found for this filter."
        />
      </div>
    </>
  );
}
