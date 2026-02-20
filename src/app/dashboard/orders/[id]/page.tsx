"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Icon } from "@/components/ui/icon";
import type { Order } from "@/types";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Icon
            name="star"
            filled={star <= (hover || value)}
            size={28}
            className={
              star <= (hover || value) ? "text-accent-gold" : "text-white/20"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    api
      .get<{ order: Order }>(`/orders/${orderId}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || submittingReview) return;

    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        order_id: Number(orderId),
        rating,
        comment: reviewText.trim(),
      });
      setReviewSubmitted(true);
    } catch {
      // silent — review may fail if API is unavailable
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader title={`Order #${orderId}`} />
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/40">
            <Icon name="hourglass_top" className="animate-spin" />
            <span>Loading order details...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <PageHeader
          title={`Order #${orderId}`}
          actions={
            <Link
              href="/dashboard/orders"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <Icon name="arrow_back" size={16} />
              Back to Orders
            </Link>
          }
        />
        <div className="p-8">
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <Icon name="error" className="text-red-400 mb-2" size={32} />
            <p className="text-white/60">Failed to load order details.</p>
            <p className="text-xs text-white/30 mt-1">{error || "Order not found"}</p>
          </div>
        </div>
      </>
    );
  }

  const config = order.config || {};
  const configEntries = Object.entries(config).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  const showReviewForm =
    order.status === "completed" && !reviewSubmitted;

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:border-white/20 transition-all"
            >
              <Icon name="arrow_back" size={16} />
              Back
            </Link>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-1 px-4 py-2 bg-primary rounded-xl text-sm font-bold hover:brightness-110 transition-all"
            >
              <Icon name="chat" size={16} />
              Chat
            </Link>
          </div>
        }
      />

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Order Info Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
                <Icon name="receipt_long" className="text-primary" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold capitalize">
                  {order.service_type.replace(/-/g, " ")}
                </h2>
                <p className="text-sm text-white/40">Order #{order.id}</p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="h-px bg-white/5" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailRow label="Price" value={`R$ ${parseFloat(order.price).toFixed(2)}`} highlight />
              <DetailRow
                label="Status"
                value={order.status.replace("_", " ")}
              />
              <DetailRow
                label="Booster"
                value={order.booster_name || "Awaiting assignment"}
              />
            </div>
            <div className="space-y-4">
              <DetailRow
                label="Created"
                value={new Date(order.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <DetailRow
                label="Last Update"
                value={new Date(order.updated_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              {order.notes && <DetailRow label="Notes" value={order.notes} />}
            </div>
          </div>
        </div>

        {/* Config Card */}
        {configEntries.length > 0 && (
          <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Icon name="tune" size={18} />
              Order Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {configEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white/5 rounded-xl p-4 border border-white/5"
                >
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm font-bold capitalize">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="glass-card rounded-2xl p-8 border border-accent-gold/20 space-y-6">
            <div className="flex items-center gap-3">
              <Icon name="rate_review" className="text-accent-gold" size={24} />
              <h3 className="text-lg font-bold">Rate this service</h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">
                  Comments (optional)
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 resize-none transition-all"
                  rows={3}
                  placeholder="How was your experience?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || submittingReview}
                className="px-6 py-3 bg-primary rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <Icon name="hourglass_top" className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon name="send" size={16} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Review Submitted */}
        {reviewSubmitted && (
          <div className="glass-card rounded-2xl p-8 border border-green-500/20 text-center space-y-2">
            <Icon name="check_circle" className="text-green-400" size={32} />
            <p className="font-bold">Thank you for your review!</p>
            <p className="text-sm text-white/40">
              Your feedback helps us improve our service.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-sm font-medium capitalize ${highlight ? "text-primary text-lg font-bold" : ""}`}>
        {value}
      </p>
    </div>
  );
}
