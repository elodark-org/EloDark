"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
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

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "active").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.price || "0"), 0);
  const recentOrders = orders.slice(0, 5);

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
  ];

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" />
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
        <PageHeader title="Dashboard" />
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

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/20 border border-primary/30" />
              <span className="text-sm font-medium">
                Welcome, <span className="text-primary">{user?.name || "Summoner"}</span>
              </span>
            </div>
          </div>
        }
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="shopping_bag" label="Total Orders" value={totalOrders} iconColor="text-primary" />
          <StatCard icon="play_circle" label="Active Orders" value={activeOrders} iconColor="text-blue-400" />
          <StatCard icon="check_circle" label="Completed" value={completedOrders} iconColor="text-green-400" />
          <StatCard
            icon="payments"
            label="Total Spent"
            value={`R$ ${totalSpent.toFixed(2)}`}
            iconColor="text-accent-gold"
          />
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Icon name="history" className="text-primary" />
              Recent Orders
            </h2>
            {orders.length > 5 && (
              <Link
                href="/dashboard/orders"
                className="text-xs text-primary font-bold hover:underline uppercase"
              >
                View All Orders
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 border border-white/5 text-center space-y-4">
              <Icon name="storefront" className="text-white/20" size={48} />
              <div>
                <p className="text-white/60 font-medium">No orders yet</p>
                <p className="text-sm text-white/30 mt-1">
                  Browse our services and place your first order!
                </p>
              </div>
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-xl font-bold text-sm hover:brightness-110 transition-all"
              >
                <Icon name="explore" size={18} />
                Browse Services
              </Link>
            </div>
          ) : (
            <DataTable columns={columns} data={recentOrders} emptyMessage="No recent orders" />
          )}
        </div>
      </div>
    </>
  );
}
