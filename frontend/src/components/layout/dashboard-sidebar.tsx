"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/dashboard/chat", icon: "forum", label: "Chat" },
  { href: "/dashboard/analytics", icon: "analytics", label: "Analytics" },
  { href: "/dashboard/settings", icon: "settings", label: "Settings" },
  { href: "/dashboard/referrals", icon: "group_add", label: "Referrals" },
  { href: "/dashboard/activity", icon: "bolt", label: "Activity" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-bg-primary/80 backdrop-blur-xl flex flex-col shrink-0 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(46,123,255,0.5)]">
          <Icon name="bolt" className="text-bg-primary font-bold" />
        </div>
        <div>
          <Link href="/" className="text-xl font-bold tracking-tighter">
            EloDark
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-semibold">
            Elite Boosting
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon name={item.icon} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent-purple/10 rounded-2xl p-4 border border-white/5">
          <p className="text-xs text-white/40 mb-2">Current Plan</p>
          <p className="text-sm font-bold mb-3">Diamond Fast-Track</p>
          <button className="w-full py-2 bg-primary text-bg-primary text-xs font-bold rounded-lg hover:brightness-110 transition-all cursor-pointer">
            UPGRADE
          </button>
        </div>
      </div>
    </aside>
  );
}
