"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Icon } from "@/components/ui/icon";

interface AdminStats {
  users: number;
  boosters: number;
  orders: number;
  pending: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;
    api
      .get<{ stats: AdminStats }>("/admin/stats")
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authorized]);

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="Painel Administrativo" />
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
        <PageHeader title="Painel Administrativo" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <PageHeader title="Painel Administrativo" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Falha ao carregar estatísticas do admin.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Painel Administrativo" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon="people"
            label="Total de Usuários"
            value={stats.users}
            iconColor="text-primary"
          />
          <StatCard
            icon="sports_esports"
            label="Total de Boosters"
            value={stats.boosters}
            iconColor="text-accent-purple"
          />
          <StatCard
            icon="shopping_cart"
            label="Total de Pedidos"
            value={stats.orders}
            iconColor="text-blue-400"
          />
          <StatCard
            icon="pending"
            label="Pedidos Pendentes"
            value={stats.pending}
            iconColor="text-yellow-400"
          />
          <StatCard
            icon="payments"
            label="Receita"
            value={`R$ ${stats.revenue.toFixed(2)}`}
            iconColor="text-green-400"
          />
        </div>
      </div>
    </>
  );
}
