"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

const conversations = [
  { id: 1, name: "Booster 'Alpha'", status: "online", lastMsg: "Starting next game now", time: "Just now", unread: 2 },
  { id: 2, name: "Support Agent", status: "online", lastMsg: "Your order has been updated", time: "5m ago", unread: 0 },
  { id: 3, name: "Booster 'Shadow'", status: "offline", lastMsg: "GG! Order completed", time: "2d ago", unread: 0 },
];

const messages = [
  { id: 1, sender: "booster", name: "Alpha", text: "Hey! I'm starting your boost now. Currently loading into champion select.", time: "2:14 PM" },
  { id: 2, sender: "user", text: "Awesome! Can you play Lee Sin jungle if possible?", time: "2:15 PM" },
  { id: 3, sender: "booster", name: "Alpha", text: "Sure thing! Lee Sin is one of my best. I'll prioritize jungle/mid. Should have 2-3 games done in the next couple hours.", time: "2:16 PM" },
  { id: 4, sender: "user", text: "Perfect, thanks! I'll be watching the stream.", time: "2:18 PM" },
  { id: 5, sender: "booster", name: "Alpha", text: "Starting next game now. Got Lee Sin! Let's go 🔥", time: "2:32 PM" },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-bg-primary/40">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
              placeholder="Search conversations..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${
                selectedChat === conv.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="size-12 rounded-full bg-accent-purple/20 border border-accent-purple/30" />
                {conv.status === "online" && (
                  <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-bg-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sm truncate">{conv.name}</p>
                  <span className="text-[10px] text-white/40">{conv.time}</span>
                </div>
                <p className="text-xs text-white/50 truncate">{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && (
                <span className="size-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-bg-primary/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-10 rounded-full bg-accent-purple/20 border border-accent-purple/30" />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-bg-primary" />
            </div>
            <div>
              <p className="font-bold">Booster &apos;Alpha&apos;</p>
              <p className="text-xs text-green-400">Online - In Game</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 transition-all">
              <Icon name="call" size={18} />
            </button>
            <button className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 transition-all">
              <Icon name="more_vert" size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.sender === "booster"
                    ? "bg-gradient-to-r from-accent-purple to-primary/80 shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {msg.sender === "booster" && (
                  <p className="text-[10px] font-bold text-white/60 mb-1">{msg.name}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-white/40 mt-1 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all">
            <button className="text-white/40 hover:text-white transition-colors">
              <Icon name="attach_file" size={20} />
            </button>
            <input
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-white/30"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="text-white/40 hover:text-white transition-colors">
              <Icon name="mood" size={20} />
            </button>
            <button className="size-9 rounded-lg bg-primary flex items-center justify-center hover:brightness-110 transition-all">
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
