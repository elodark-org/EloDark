"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { WalletSummary, Withdrawal } from "@/types";

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

const PIX_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatória" },
] as const;

export default function BoosterWalletPage() {
  const { loading: guardLoading, authorized } = useRoleGuard("booster");
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState<Withdrawal["pix_type"]>("cpf");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [walletData, withdrawalsData] = await Promise.all([
        api.get<WalletSummary>("/booster/wallet"),
        api.get<{ withdrawals: Withdrawal[] }>("/booster/withdrawals"),
      ]);
      setWallet(walletData);
      setWithdrawals(withdrawalsData.withdrawals);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar carteira");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchData();
  }, [authorized, fetchData]);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError("Insira um valor válido.");
      return;
    }
    if (!pixKey.trim()) {
      setFormError("Insira sua chave PIX.");
      return;
    }
    if (wallet && numAmount > wallet.available_balance) {
      setFormError("Valor excede o saldo disponível.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/booster/withdrawals", {
        amount: numAmount,
        pix_key: pixKey.trim(),
        pix_type: pixType,
      });
      setFormSuccess(true);
      setAmount("");
      setPixKey("");
      setPixType("cpf");
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao solicitar saque");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<Withdrawal>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="text-primary font-bold">#{row.id}</span>
      ),
    },
    {
      key: "amount",
      label: "Valor",
      render: (row) => (
        <span className="font-bold">{formatBRL(parseFloat(row.amount))}</span>
      ),
    },
    {
      key: "pix_key",
      label: "Chave PIX",
      render: (row) => (
        <span className="text-white/60 text-xs font-mono">{row.pix_key}</span>
      ),
    },
    {
      key: "pix_type",
      label: "Tipo",
      render: (row) => (
        <span className="text-white/70 uppercase text-xs font-bold">
          {row.pix_type}
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
      label: "Data",
      render: (row) => (
        <span className="text-white/60">
          {new Date(row.created_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  if (guardLoading || !authorized) {
    return (
      <>
        <PageHeader title="Carteira" />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Carteira" />
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
        <PageHeader title="Carteira" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Falha ao carregar dados da carteira.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Carteira" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon="payments"
            label="Total Ganho"
            value={wallet ? formatBRL(wallet.total_earned) : "R$ 0.00"}
            iconColor="text-accent-gold"
          />
          <StatCard
            icon="account_balance_wallet"
            label="Saldo Disponível"
            value={wallet ? formatBRL(wallet.available_balance) : "R$ 0.00"}
            iconColor="text-green-400"
          />
          <StatCard
            icon="schedule"
            label="Saques Pendentes"
            value={wallet ? formatBRL(wallet.pending_withdrawals) : "R$ 0.00"}
            iconColor="text-yellow-400"
          />
        </div>

        {/* Withdrawal Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icon name="send" className="text-primary" />
            Solicitar Saque
          </h2>

          <form
            onSubmit={handleWithdraw}
            className="glass-card rounded-2xl p-6 border border-white/5 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* PIX Key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Chave PIX
                </label>
                <input
                  type="text"
                  placeholder="Insira sua chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* PIX Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Tipo PIX
                </label>
                <select
                  value={pixType}
                  onChange={(e) =>
                    setPixType(e.target.value as Withdrawal["pix_type"])
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  {PIX_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-[#0f0f1a] text-white"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <Icon name="error" size={16} />
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Icon name="check_circle" size={16} />
                Solicitação de saque enviada com sucesso!
              </div>
            )}

            <Button
              type="submit"
              icon="send"
              disabled={submitting}
              className="w-full md:w-auto"
            >
              {submitting ? "Enviando..." : "Solicitar Saque"}
            </Button>
          </form>
        </div>

        {/* Withdrawal History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icon name="history" className="text-primary" />
            Histórico de Saques
          </h2>

          <DataTable
            columns={columns}
            data={withdrawals}
            emptyMessage="Nenhum histórico de saque ainda."
          />
        </div>
      </div>
    </>
  );
}
