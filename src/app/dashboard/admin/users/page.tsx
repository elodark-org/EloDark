"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { Icon } from "@/components/ui/icon";
import type { DashboardUser } from "@/types";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-400 border-red-500/30",
  booster: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  user: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export default function AdminUsersPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;
    api
      .get<{ users: DashboardUser[] }>("/admin/users")
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authorized]);

  const columns: Column<DashboardUser>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="text-primary font-bold">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-white/60">{row.email}</span>,
    },
    {
      key: "role",
      label: "Role",
      render: (row) => {
        const colors = ROLE_COLORS[row.role] || "bg-white/10 text-white/60 border-white/20";
        return (
          <span
            className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${colors}`}
          >
            {row.role}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Created At",
      render: (row) => (
        <span className="text-white/60">
          {new Date(row.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="User Management" />
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
        <PageHeader title="User Management" />
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
        <PageHeader title="User Management" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load users.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="User Management" />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Summary row */}
        <div className="flex items-center gap-4 text-sm text-white/40">
          <span>{users.length} total users</span>
          <span className="text-white/10">|</span>
          <span>{users.filter((u) => u.role === "admin").length} admins</span>
          <span className="text-white/10">|</span>
          <span>{users.filter((u) => u.role === "booster").length} boosters</span>
          <span className="text-white/10">|</span>
          <span>{users.filter((u) => u.role === "user").length} users</span>
        </div>

        <DataTable
          columns={columns}
          data={users}
          emptyMessage="No users found."
        />
      </div>
    </>
  );
}
