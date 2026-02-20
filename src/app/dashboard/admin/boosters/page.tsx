"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Booster } from "@/types";

export default function AdminBoostersPage() {
  const { loading: authLoading, authorized } = useRoleGuard("admin");
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ user_id: "", game_name: "", rank: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ game_name: "", rank: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchBoosters = useCallback(() => {
    api
      .get<{ boosters: Booster[] }>("/admin/boosters")
      .then((data) => setBoosters(data.boosters))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchBoosters();
  }, [authorized, fetchBoosters]);

  async function handleAdd() {
    if (!addForm.user_id || !addForm.game_name || !addForm.rank) return;
    setAddLoading(true);
    try {
      const { booster } = await api.post<{ booster: Booster }>("/admin/boosters", {
        user_id: Number(addForm.user_id),
        game_name: addForm.game_name,
        rank: addForm.rank,
      });
      setBoosters((prev) => [booster, ...prev]);
      setAddForm({ user_id: "", game_name: "", rank: "" });
      setShowAddForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add booster");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleToggleActive(booster: Booster) {
    setActionLoading(booster.id);
    try {
      const { booster: updated } = await api.put<{ booster: Booster }>(
        `/admin/boosters/${booster.id}`,
        { active: !booster.active }
      );
      setBoosters((prev) => prev.map((b) => (b.id === booster.id ? updated : b)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle booster");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleEdit(id: number) {
    if (!editForm.game_name && !editForm.rank) return;
    setActionLoading(id);
    try {
      const body: Record<string, string> = {};
      if (editForm.game_name) body.game_name = editForm.game_name;
      if (editForm.rank) body.rank = editForm.rank;
      const { booster: updated } = await api.put<{ booster: Booster }>(
        `/admin/boosters/${id}`,
        body
      );
      setBoosters((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setEditingId(null);
      setEditForm({ game_name: "", rank: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booster");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: number) {
    setActionLoading(id);
    try {
      await api.delete(`/admin/boosters/${id}`);
      setBoosters((prev) => prev.filter((b) => b.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete booster");
    } finally {
      setActionLoading(null);
    }
  }

  function startEdit(booster: Booster) {
    setEditingId(booster.id);
    setEditForm({ game_name: booster.game_name, rank: booster.rank });
    setDeleteConfirm(null);
  }

  const columns: Column<Booster>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="text-primary font-bold">#{row.id}</span>,
    },
    {
      key: "game_name",
      label: "Name",
      render: (row) => {
        if (editingId === row.id) {
          return (
            <input
              value={editForm.game_name}
              onChange={(e) => setEditForm((f) => ({ ...f, game_name: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
            />
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{row.avatar_emoji}</span>
            <span className="font-medium">{row.game_name}</span>
          </div>
        );
      },
    },
    {
      key: "user_name",
      label: "User",
      render: (row) => (
        <div className="text-white/60 text-xs">
          <p>{row.user_name || `User #${row.user_id}`}</p>
          {row.user_email && <p className="text-white/30">{row.user_email}</p>}
        </div>
      ),
    },
    {
      key: "rank",
      label: "Rank",
      render: (row) => {
        if (editingId === row.id) {
          return (
            <input
              value={editForm.rank}
              onChange={(e) => setEditForm((f) => ({ ...f, rank: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
            />
          );
        }
        return <span className="text-accent-gold font-bold text-xs uppercase">{row.rank}</span>;
      },
    },
    {
      key: "win_rate",
      label: "Win Rate",
      render: (row) => <span className="text-green-400 font-bold">{row.win_rate}%</span>,
    },
    {
      key: "active",
      label: "Active",
      render: (row) => {
        const isLoading = actionLoading === row.id;
        return (
          <button
            onClick={() => handleToggleActive(row)}
            disabled={isLoading}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              row.active ? "bg-green-500/30 border-green-500/50" : "bg-white/10 border-white/20"
            } border`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
                row.active ? "translate-x-5 bg-green-400" : "translate-x-0 bg-white/40"
              }`}
            />
          </button>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isLoading = actionLoading === row.id;

        if (editingId === row.id) {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon="check"
                disabled={isLoading}
                onClick={() => handleEdit(row.id)}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setEditingId(null); setEditForm({ game_name: "", rank: "" }); }}
              >
                Cancel
              </Button>
            </div>
          );
        }

        if (deleteConfirm === row.id) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Delete?</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
                disabled={isLoading}
                onClick={() => handleDelete(row.id)}
              >
                Yes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
              >
                No
              </Button>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="edit"
              onClick={() => startEdit(row)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="delete"
              className="text-red-400 hover:text-red-300"
              onClick={() => { setDeleteConfirm(row.id); setEditingId(null); }}
            />
            {isLoading && <Icon name="hourglass_top" className="animate-spin text-white/40" size={16} />}
          </div>
        );
      },
    },
  ];

  if (authLoading || !authorized) {
    return (
      <>
        <PageHeader title="Booster Management" />
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
        <PageHeader title="Booster Management" />
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
        <PageHeader title="Booster Management" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load boosters.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Booster Management"
        actions={
          <Button
            variant={showAddForm ? "ghost" : "primary"}
            size="sm"
            icon={showAddForm ? "close" : "person_add"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Add Booster"}
          </Button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Add booster form */}
        {showAddForm && (
          <div className="glass-card rounded-2xl p-6 border border-primary/20 space-y-4">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
              New Booster
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">User ID</label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={addForm.user_id}
                  onChange={(e) => setAddForm((f) => ({ ...f, user_id: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Game Name</label>
                <input
                  type="text"
                  placeholder="e.g. ShadowStrike"
                  value={addForm.game_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, game_name: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Rank</label>
                <input
                  type="text"
                  placeholder="e.g. Challenger"
                  value={addForm.rank}
                  onChange={(e) => setAddForm((f) => ({ ...f, rank: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                icon="add"
                disabled={addLoading || !addForm.user_id || !addForm.game_name || !addForm.rank}
                onClick={handleAdd}
              >
                {addLoading ? "Adding..." : "Add Booster"}
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={boosters}
          emptyMessage="No boosters registered yet."
        />
      </div>
    </>
  );
}
