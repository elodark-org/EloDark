"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Icon } from "@/components/ui/icon";
import type { Order, WalletSummary } from "@/types";

const COMMISSION_RATE = 0.4;

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

export default function BoosterDashboardPage() {
  const { user, loading: guardLoading, authorized } = useRoleGuard("booster");
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;

    Promise.all([
      api.get<{ orders: Order[] }>("/orders"),
      api.get<WalletSummary>("/booster/wallet"),
    ])
      .then(([ordersData, walletData]) => {
        setOrders(ordersData.orders);
        setWallet(walletData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authorized]);

  if (guardLoading || !authorized) {
    return (
      <>
        <PageHeader title="Booster Dashboard" />
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
        <PageHeader title="Booster Dashboard" />
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
        <PageHeader title="Booster Dashboard" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load dashboard data.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  const activeOrders = orders.filter((o) => o.status === "in_progress");
  const completedOrders = orders.filter((o) => o.status === "completed");

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
      key: "price",
      label: "Commission",
      render: (row) => (
        <span className="font-bold text-green-400">
          {formatBRL(parseFloat(row.price) * COMMISSION_RATE)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
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
  ];

  return (
    <>
      <PageHeader
        title="Booster Dashboard"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/booster/available"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-sm font-bold text-primary hover:bg-primary/30 transition-all"
            >
              <Icon name="storefront" size={18} />
              Available Orders
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="play_circle"
            label="Active Orders"
            value={activeOrders.length}
            iconColor="text-blue-400"
          />
          <StatCard
            icon="check_circle"
            label="Completed"
            value={completedOrders.length}
            iconColor="text-green-400"
          />
          <StatCard
            icon="payments"
            label="Total Earned"
            value={wallet ? formatBRL(wallet.total_earned) : "R$ 0.00"}
            iconColor="text-accent-gold"
          />
          <StatCard
            icon="account_balance_wallet"
            label="Available Balance"
            value={wallet ? formatBRL(wallet.available_balance) : "R$ 0.00"}
            iconColor="text-primary"
          />
        </div>

        {/* Active Orders Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Icon name="bolt" className="text-primary" />
              In Progress
            </h2>
            <Link
              href="/dashboard/booster/orders"
              className="text-xs text-primary font-bold hover:underline uppercase"
            >
              View All Orders
            </Link>
          </div>

          <DataTable
            columns={columns}
            data={activeOrders}
            emptyMessage="No active orders. Check available services!"
          />
        </div>
      </div>
    </>
  );
}
