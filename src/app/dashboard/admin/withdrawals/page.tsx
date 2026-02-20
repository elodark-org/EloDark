"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Withdrawal } from "@/types";

const STATUS_TABS = ["all", "pending", "approved", "rejected"] as const;

export default function AdminWithdrawalsPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");

  const fetchWithdrawals = useCallback(() => {
    api
      .get<{ withdrawals: Withdrawal[] }>("/admin/withdrawals")
      .then((data) => setWithdrawals(data.withdrawals))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchWithdrawals();
  }, [authorized, fetchWithdrawals]);

  const filteredWithdrawals =
    activeTab === "all"
      ? withdrawals
      : withdrawals.filter((w) => w.status === activeTab);

  async function handleApprove(id: number) {
    setActionLoading(id);
    try {
      const { withdrawal } = await api.put<{ withdrawal: Withdrawal }>(
        `/admin/withdrawals/${id}`,
        { status: "approved" }
      );
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? withdrawal : w)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve withdrawal");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: number) {
    setActionLoading(id);
    try {
      const { withdrawal } = await api.put<{ withdrawal: Withdrawal }>(
        `/admin/withdrawals/${id}`,
        { status: "rejected", admin_notes: rejectNotes || undefined }
      );
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? withdrawal : w)));
      setRejectingId(null);
      setRejectNotes("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject withdrawal");
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Withdrawal>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="text-primary font-bold">#{row.id}</span>,
    },
    {
      key: "booster_name",
      label: "Booster",
      render: (row) => (
        <span className="font-medium">
          {row.booster_name || row.user_name || `Booster #${row.booster_id}`}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-bold text-green-400">
          R$ {parseFloat(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      key: "pix_key",
      label: "PIX Key",
      render: (row) => (
        <span className="text-white/60 text-xs font-mono break-all max-w-[180px] inline-block">
          {row.pix_key}
        </span>
      ),
    },
    {
      key: "pix_type",
      label: "Type",
      render: (row) => (
        <span className="text-xs text-white/40 uppercase font-bold">{row.pix_type}</span>
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
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isLoading = actionLoading === row.id;

        if (row.status !== "pending") {
          if (row.admin_notes) {
            return (
              <span className="text-xs text-white/30 italic max-w-[200px] inline-block truncate" title={row.admin_notes}>
                {row.admin_notes}
              </span>
            );
          }
          return <span className="text-xs text-white/20">--</span>;
        }

        if (rejectingId === row.id) {
          return (
            <div className="flex flex-col gap-2 min-w-[220px]">
              <input
                type="text"
                placeholder="Reason (optional)"
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  disabled={isLoading}
                  onClick={() => handleReject(row.id)}
                >
                  {isLoading ? "..." : "Confirm Reject"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setRejectingId(null); setRejectNotes(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="check_circle"
              className="text-green-400 hover:text-green-300"
              disabled={isLoading}
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="cancel"
              className="text-red-400 hover:text-red-300"
              disabled={isLoading}
              onClick={() => { setRejectingId(row.id); setRejectNotes(""); }}
            >
              Reject
            </Button>
            {isLoading && <Icon name="hourglass_top" className="animate-spin text-white/40" size={16} />}
          </div>
        );
      },
    },
  ];

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="Withdrawal Management" />
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
        <PageHeader title="Withdrawal Management" />
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
        <PageHeader title="Withdrawal Management" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load withdrawals.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Withdrawal Management"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={() => { setLoading(true); fetchWithdrawals(); }}>
            Refresh
          </Button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Status filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "all"
                ? withdrawals.length
                : withdrawals.filter((w) => w.status === tab).length;
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
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <DataTable
          columns={columns}
          data={filteredWithdrawals}
          emptyMessage="No withdrawals found for this filter."
        />
      </div>
    </>
  );
}
