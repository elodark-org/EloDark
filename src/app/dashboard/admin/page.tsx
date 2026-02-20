"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Icon } from "@/components/ui/icon";

interface AdminStats {
  total_users: number;
  total_boosters: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
}

export default function AdminDashboardPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;
    api
      .get<AdminStats>("/admin/stats")
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authorized]);

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="Admin Dashboard" />
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
        <PageHeader title="Admin Dashboard" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <PageHeader title="Admin Dashboard" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load admin stats.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Admin Dashboard" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon="people"
            label="Total Users"
            value={stats.total_users}
            iconColor="text-primary"
          />
          <StatCard
            icon="sports_esports"
            label="Total Boosters"
            value={stats.total_boosters}
            iconColor="text-accent-purple"
          />
          <StatCard
            icon="shopping_cart"
            label="Total Orders"
            value={stats.total_orders}
            iconColor="text-blue-400"
          />
          <StatCard
            icon="pending"
            label="Pending Orders"
            value={stats.pending_orders}
            iconColor="text-yellow-400"
          />
          <StatCard
            icon="payments"
            label="Revenue"
            value={`R$ ${stats.total_revenue.toFixed(2)}`}
            iconColor="text-green-400"
          />
        </div>
      </div>
    </>
  );
}
