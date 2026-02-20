"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/lib/api";
import type { Order, Message } from "@/types";

interface ChatViewProps {
  orders: Order[];
}

export function ChatView({ orders }: ChatViewProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    orders[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedOrderId) return;
    try {
      const data = await api.get<{ messages: Message[] }>(
        `/chat/${selectedOrderId}`
      );
      setMessages(data.messages);
    } catch {
      // API unavailable — keep current messages
    }
  }, [selectedOrderId]);

  useEffect(() => {
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

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/40">No orders with active chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Order list */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-bg-primary/40">
        <div className="p-4 border-b border-white/10">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            Conversations
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${
                selectedOrderId === order.id
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : ""
              }`}
            >
              <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold">
                #{order.id}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate capitalize">
                  {order.service_type.replace("-", " ")}
                </p>
                <p className="text-[10px] text-white/40 capitalize">
                  {order.status.replace("_", " ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-bg-primary/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold">
              #{selectedOrderId}
            </div>
            <div>
              <p className="font-bold capitalize">
                {selectedOrder?.service_type.replace("-", " ") || "Chat"}
              </p>
              <p className="text-xs text-white/40">
                Order #{selectedOrderId} &middot;{" "}
                {selectedOrder?.booster_name || selectedOrder?.user_name || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-white/30 text-sm py-12">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_role !== "system";
            return (
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
            );
          })}
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
