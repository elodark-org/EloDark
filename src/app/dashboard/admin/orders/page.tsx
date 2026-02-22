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
  "awaiting_approval",
  "completed",
  "cancelled",
] as const;

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["active", "available", "cancelled"],
  active: ["available", "in_progress", "cancelled"],
  available: ["in_progress", "cancelled"],
  in_progress: ["awaiting_approval", "completed", "cancelled"],
  awaiting_approval: ["completed", "in_progress", "cancelled"],
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
  const [proofModalOrder, setProofModalOrder] = useState<Order | null>(null);

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
      alert(err instanceof Error ? err.message : "Falha ao atualizar status");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleApproveReject(orderId: number, action: "approve" | "reject") {
    setActionLoading(orderId);
    try {
      const { order } = await api.put<{ order: Order }>(
        `/admin/orders/${orderId}/approve`,
        { action }
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
      setProofModalOrder(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : `Falha ao ${action === "approve" ? "aprovar" : "rejeitar"} pedido`);
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
      alert(err instanceof Error ? err.message : "Falha ao atribuir booster");
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
      alert(err instanceof Error ? err.message : "Falha ao liberar booster");
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
      label: "Cliente",
      render: (row) => (
        <span className="text-white/80">{row.user_name || `Usuário #${row.user_id}`}</span>
      ),
    },
    {
      key: "service_type",
      label: "Serviço",
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
      label: "Ações",
      render: (row) => {
        const isLoading = actionLoading === row.id;
        const transitions = STATUS_TRANSITIONS[row.status] || [];

        return (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Approve/Reject for awaiting_approval */}
            {row.status === "awaiting_approval" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="image"
                  disabled={isLoading}
                  onClick={() => setProofModalOrder(row)}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Ver Comprovante
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="check_circle"
                  disabled={isLoading}
                  onClick={() => handleApproveReject(row.id, "approve")}
                  className="text-green-400 hover:text-green-300"
                >
                  Aprovar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="cancel"
                  disabled={isLoading}
                  onClick={() => handleApproveReject(row.id, "reject")}
                  className="text-red-400 hover:text-red-300"
                >
                  Rejeitar
                </Button>
              </>
            )}

            {/* Status change */}
            {transitions.length > 0 && row.status !== "awaiting_approval" && (
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
            {row.status !== "completed" && row.status !== "cancelled" && row.status !== "awaiting_approval" && (
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
            {row.booster_id && row.status !== "completed" && row.status !== "cancelled" && row.status !== "awaiting_approval" && (
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
        <PageHeader title="Gestão de Pedidos" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Verificando acesso...</span>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Gestão de Pedidos" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Gestão de Pedidos" />
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
      <PageHeader
        title="Gestão de Pedidos"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={() => { setLoading(true); fetchOrders(); }}>
            Atualizar
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
          emptyMessage="Nenhum pedido encontrado para este filtro."
        />
      </div>

      {/* Proof Image Modal */}
      {proofModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Icon name="fact_check" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Comprovante de Conclus&atilde;o</h3>
                  <p className="text-xs text-white/40">
                    Pedido #{proofModalOrder.id} &mdash;{" "}
                    <span className="capitalize">{proofModalOrder.service_type.replace(/-/g, " ")}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setProofModalOrder(null)} className="text-white/40 hover:text-white transition-colors">
                <Icon name="close" size={24} />
              </button>
            </div>

            {proofModalOrder.completion_image_url ? (
              <div className="rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofModalOrder.completion_image_url}
                  alt="Comprovante de conclus&atilde;o"
                  className="w-full max-h-96 object-contain bg-black/30"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-white/40">
                <Icon name="image_not_supported" size={48} />
                <p className="mt-2 text-sm">Nenhuma imagem de comprovante encontrada</p>
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                icon="cancel"
                disabled={actionLoading === proofModalOrder.id}
                onClick={() => handleApproveReject(proofModalOrder.id, "reject")}
                className="text-red-400 hover:text-red-300"
              >
                Rejeitar
              </Button>
              <Button
                size="sm"
                icon="check_circle"
                disabled={actionLoading === proofModalOrder.id}
                onClick={() => handleApproveReject(proofModalOrder.id, "approve")}
              >
                Aprovar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
