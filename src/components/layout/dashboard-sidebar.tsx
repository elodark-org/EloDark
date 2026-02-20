"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navByRole: Record<string, NavItem[]> = {
  user: [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/dashboard/orders", icon: "shopping_cart", label: "My Orders" },
    { href: "/dashboard/chat", icon: "forum", label: "Chat" },
    { href: "/dashboard/settings", icon: "settings", label: "Settings" },
  ],
  booster: [
    { href: "/dashboard/booster", icon: "dashboard", label: "Dashboard" },
    { href: "/dashboard/booster/available", icon: "storefront", label: "Available" },
    { href: "/dashboard/booster/orders", icon: "assignment", label: "My Orders" },
    { href: "/dashboard/booster/wallet", icon: "account_balance_wallet", label: "Wallet" },
    { href: "/dashboard/booster/chat", icon: "forum", label: "Chat" },
  ],
  admin: [
    { href: "/dashboard/admin", icon: "dashboard", label: "Dashboard" },
    { href: "/dashboard/admin/orders", icon: "shopping_cart", label: "Orders" },
    { href: "/dashboard/admin/boosters", icon: "sports_esports", label: "Boosters" },
    { href: "/dashboard/admin/users", icon: "people", label: "Users" },
    { href: "/dashboard/admin/withdrawals", icon: "payments", label: "Withdrawals" },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = user?.role || "user";
  const navItems = navByRole[role] || navByRole.user;

  function handleLogout() {
    logout();
    router.push("/");
  }

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
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
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

      {/* User Info + Logout */}
      <div className="p-4">
        <div className="glass-card rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-white/40 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-white/5 border border-white/10 text-xs font-bold rounded-lg hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}
