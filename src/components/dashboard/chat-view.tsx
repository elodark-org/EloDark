"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/lib/api";
import type { Order, Message } from "@/types";
import Link from "next/link";

interface ChatViewProps {
  orders: Order[];
}

const CHAT_ELIGIBLE_STATUSES = ["in_progress", "active", "available"];

export function ChatView({ orders }: ChatViewProps) {
  // Only show orders that have a booster and are in an active status
  const chatOrders = orders.filter(
    (o) => o.booster_id && CHAT_ELIGIBLE_STATUSES.includes(o.status)
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    chatOrders[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedOrderId) return;
    try {
      const data = await api.get<{ messages: Message[] }>(
        `/chat/${selectedOrderId}`
      );
      setMessages(data.messages);
      setChatError(null);
    } catch (err) {
      setChatError(
        err instanceof Error ? err.message : "Failed to load messages"
      );
    }
  }, [selectedOrderId]);

  useEffect(() => {
    setMessages([]);
    setChatError(null);
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedOrderId || sending) return;
    setSending(true);
    try {
      await api.post(`/chat/${selectedOrderId}`, { content: input.trim() });
      setInput("");
      await fetchMessages();
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  const selectedOrder = chatOrders.find((o) => o.id === selectedOrderId);

  // No eligible orders for chat
  if (chatOrders.length === 0) {
    const hasOrders = orders.length > 0;
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Icon name="forum" size={32} className="text-white/20" />
          </div>
          <div>
            <p className="text-lg font-bold text-white/60">
              {hasOrders ? "No active conversations" : "No conversations yet"}
            </p>
            <p className="text-sm text-white/30 mt-2 leading-relaxed">
              {hasOrders
                ? "Chat is available only for orders that are in progress and have a booster assigned. Your current orders are either pending or already completed."
                : "The chat connects you directly with your booster during an active order. Create an order to get started!"}
            </p>
          </div>
          <div className="flex items-center gap-3 justify-center pt-2">
            <div className="flex items-center gap-2 text-[10px] text-white/20">
              <Icon name="person" size={14} />
              <span>Client</span>
              <Icon name="sync_alt" size={14} />
              <Icon name="sports_esports" size={14} />
              <span>Booster</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary/20 transition-all"
          >
            <Icon name="storefront" size={18} />
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Order list */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-bg-primary/40">
        <div className="p-4 border-b border-white/10">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            Active Orders
          </p>
          <p className="text-[10px] text-white/20 mt-1">
            Direct chat with your booster
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${
                selectedOrderId === order.id
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : ""
              }`}
            >
              <div className="relative">
                <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold">
                  #{order.id}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-bg-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate capitalize">
                  {order.service_type.replace(/-/g, " ")}
                </p>
                <p className="text-[10px] text-white/40">
                  {order.booster_name || "Booster"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-bg-primary/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold">
                #{selectedOrderId}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-bg-primary" />
            </div>
            <div>
              <p className="font-bold">
                {selectedOrder?.booster_name || "Booster"}
              </p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="size-1.5 bg-green-400 rounded-full" />
                Active &middot;{" "}
                <span className="text-white/40 capitalize">
                  {selectedOrder?.service_type.replace(/-/g, " ")}
                </span>
              </p>
            </div>
          </div>
          <div className="text-[10px] text-white/20 flex items-center gap-1">
            <Icon name="lock" size={12} />
            Order #{selectedOrderId}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatError && (
            <div className="text-center py-8">
              <Icon
                name="error"
                className="text-red-400 mx-auto mb-2"
                size={28}
              />
              <p className="text-sm text-white/40">{chatError}</p>
            </div>
          )}
          {!chatError && messages.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <Icon
                name="waving_hand"
                size={40}
                className="text-white/10 mx-auto"
              />
              <p className="text-white/30 text-sm">
                Say hi to your booster! Messages are private to this order.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.is_system
                  ? "justify-center"
                  : msg.sender_role === "booster"
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              {msg.is_system ? (
                <p className="text-[10px] text-white/30 bg-white/5 px-3 py-1 rounded-full">
                  {msg.content}
                </p>
              ) : (
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.sender_role === "booster"
                      ? "bg-gradient-to-r from-accent-purple to-primary/80 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {msg.sender_name && (
                    <p className="text-[10px] font-bold text-white/60 mb-1">
                      {msg.sender_name}
                    </p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-[10px] text-white/40 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all">
            <input
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-white/30"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="size-9 rounded-lg bg-primary flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Icon name="send" size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
