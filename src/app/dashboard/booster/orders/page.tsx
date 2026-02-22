"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

export default function BoosterOrdersPage() {
  const { loading: guardLoading, authorized } = useRoleGuard("booster");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [completeModalOrder, setCompleteModalOrder] = useState<Order | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get<{ orders: Order[] }>("/orders");
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchOrders();
  }, [authorized, fetchOrders]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Tipo de arquivo inv\u00e1lido. Use PNG, JPG ou JPEG.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Imagem muito grande. M\u00e1ximo: 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleCompleteWithProof() {
    if (!completeModalOrder || !imagePreview) return;

    setCompletingId(completeModalOrder.id);
    setSubmitError(null);
    try {
      await api.post<{ order: Order }>(`/orders/${completeModalOrder.id}/complete`, {
        image: imagePreview,
      });
      setCompleteModalOrder(null);
      setImagePreview(null);
      await fetchOrders();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao enviar comprovante");
    } finally {
      setCompletingId(null);
    }
  }

  function openCompleteModal(order: Order) {
    setCompleteModalOrder(order);
    setImagePreview(null);
    setImageError(null);
    setSubmitError(null);
  }

  function closeCompleteModal() {
    setCompleteModalOrder(null);
    setImagePreview(null);
    setImageError(null);
    setSubmitError(null);
  }

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
      label: "Serviço",
      render: (row) => (
        <span className="capitalize">{row.service_type.replace(/-/g, " ")}</span>
      ),
    },
    {
      key: "user_name",
      label: "Cliente",
      render: (row) => (
        <span className="text-white/70">{row.user_name || "---"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "price",
      label: "Valor",
      render: (row) => (
        <span className="font-bold">{formatBRL(parseFloat(row.price))}</span>
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
      label: "",
      render: (row) => {
        if (row.status === "in_progress") {
          return (
            <Button
              variant="ghost"
              size="sm"
              icon="upload_file"
              disabled={completingId === row.id}
              onClick={() => openCompleteModal(row)}
            >
              {completingId === row.id ? "Enviando..." : "Concluir com Comprovante"}
            </Button>
          );
        }
        if (row.status === "awaiting_approval") {
          return (
            <span className="text-xs text-orange-400 flex items-center gap-1">
              <Icon name="hourglass_top" size={14} />
              Aguardando aprova\u00e7\u00e3o
            </span>
          );
        }
        return null;
      },
    },
  ];

  if (guardLoading || !authorized) {
    return (
      <>
        <PageHeader title="Meus Pedidos" />
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
        <PageHeader title="Meus Pedidos" />
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
        <PageHeader title="Meus Pedidos" />
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
        title="Meus Pedidos"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={fetchOrders}>
            Atualizar
          </Button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={orders}
          emptyMessage="Nenhum pedido atribuído a você ainda."
        />
      </div>

      {/* Complete with Proof Modal */}
      {completeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl border border-white/10 p-8 max-w-lg w-full mx-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  <Icon name="verified" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Concluir Servi\u00e7o</h3>
                  <p className="text-xs text-white/40">Pedido #{completeModalOrder.id}</p>
                </div>
              </div>
              <button onClick={closeCompleteModal} className="text-white/40 hover:text-white transition-colors">
                <Icon name="close" size={24} />
              </button>
            </div>

            <p className="text-sm text-white/60">
              Envie uma imagem como comprovante de conclus\u00e3o do servi\u00e7o. O comprovante ser\u00e1 enviado ao cliente e analisado pelo administrador.
            </p>

            {/* File upload area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview do comprovante"
                      className="w-full max-h-64 object-contain bg-black/30"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Icon name="delete" size={14} />
                    Remover imagem
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-primary/40 rounded-xl p-8 flex flex-col items-center gap-3 transition-colors"
                >
                  <Icon name="cloud_upload" className="text-white/30" size={40} />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/60">Clique para selecionar uma imagem</p>
                    <p className="text-xs text-white/30 mt-1">PNG, JPG ou JPEG (m\u00e1x. 5MB)</p>
                  </div>
                </button>
              )}

              {imageError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <Icon name="error" size={14} />
                  {imageError}
                </p>
              )}
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={closeCompleteModal}>
                Cancelar
              </Button>
              <Button
                size="sm"
                icon="check_circle"
                disabled={!imagePreview || completingId === completeModalOrder.id}
                onClick={handleCompleteWithProof}
              >
                {completingId === completeModalOrder.id ? "Enviando..." : "Enviar Comprovante"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
