"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

const COMMISSION_RATE = 0.4;

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

export default function AvailableOrdersPage() {
  const { loading: guardLoading, authorized } = useRoleGuard("booster");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get<{ orders: Order[] }>("/orders/available");
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    fetchOrders();
  }, [authorized, fetchOrders]);

  async function handleClaim(orderId: number) {
    setClaimingId(orderId);
    setClaimError(null);

    try {
      await api.post<{ order: Order }>(`/orders/${orderId}/claim`, {});
      await fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to claim";
      if (message.includes("409") || message.toLowerCase().includes("already")) {
        setClaimError("Order already claimed by another booster.");
      } else {
        setClaimError(message);
      }
      await fetchOrders();
    } finally {
      setClaimingId(null);
    }
  }

  if (guardLoading || !authorized) {
    return (
      <>
        <PageHeader title="Available Services" />
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
        <PageHeader title="Available Services" />
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
        <PageHeader title="Available Services" />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load available orders.</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Available Services"
        actions={
          <Button variant="ghost" size="sm" icon="refresh" onClick={fetchOrders}>
            Refresh
          </Button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {claimError && (
          <div className="glass-card rounded-xl p-4 border border-red-500/20 flex items-center gap-3">
            <Icon name="warning" className="text-red-400" size={20} />
            <p className="text-sm text-red-400">{claimError}</p>
            <button
              onClick={() => setClaimError(null)}
              className="ml-auto text-white/40 hover:text-white transition-colors"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 border border-white/5 text-center space-y-4">
            <Icon name="inbox" className="text-white/20" size={48} />
            <div>
              <p className="text-white/60 font-medium">No available orders</p>
              <p className="text-sm text-white/30 mt-1">
                Check back later for new boost requests.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => {
              const price = parseFloat(order.price);
              const commission = price * COMMISSION_RATE;
              const isClaiming = claimingId === order.id;

              return (
                <div
                  key={order.id}
                  className="glass-card rounded-2xl border border-white/5 hover:border-primary/20 transition-all group"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <Icon name="sports_esports" size={22} />
                      </div>
                      <div>
                        <p className="font-bold capitalize">
                          {order.service_type.replace(/-/g, " ")}
                        </p>
                        <p className="text-xs text-white/40">Order #{order.id}</p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Config details */}
                  {order.config && Object.keys(order.config).length > 0 && (
                    <div className="px-6 pb-4">
                      <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
                        {Object.entries(order.config).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-white/40 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-white/80">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Commission */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/40">Order price</p>
                        <p className="text-lg font-bold">{formatBRL(price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-400/80">Your commission</p>
                        <p className="text-lg font-bold text-green-400">
                          {formatBRL(commission)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Claim button */}
                  <div className="px-6 pb-6">
                    <Button
                      className="w-full"
                      icon="bolt"
                      disabled={isClaiming}
                      onClick={() => handleClaim(order.id)}
                    >
                      {isClaiming ? "Claiming..." : "Claim Order"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
