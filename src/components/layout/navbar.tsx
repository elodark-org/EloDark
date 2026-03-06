"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/#games", label: "Jogos", dropdown: true },
  { href: "/boosters", label: "Boosters", dropdown: true },
  { href: "/#reviews", label: "Avaliações", dropdown: false },
  { href: "/#how-it-works", label: "Como Funciona", dropdown: false },
  { href: "/#faq", label: "Suporte", dropdown: false },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md bg-bg-primary/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.png"
              alt="EloDark"
              className="w-10 h-10 rounded-xl object-cover shadow-[0_0_16px_rgba(168,85,247,0.5)]"
              style={{ objectPosition: "center 20%" }}
            />
            <span className="text-[22px] font-black tracking-tight text-white group-hover:text-primary transition-colors">
              EloDark
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
                {link.dropdown && <Icon name="expand_more" size={16} className="text-gray-500" />}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Buscar"
            >
              <Icon name="search" size={20} />
            </button>

            {/* Online Boosters Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs font-medium text-gray-300">
                Boosters Online
              </span>
            </div>

            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button
                    size="md"
                    className="hidden sm:flex bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_15px_rgba(236,19,236,0.3)] hover:shadow-[0_0_25px_rgba(236,19,236,0.5)]"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}

            {!loading && user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-white max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <Icon name="expand_more" size={18} className="text-gray-400 hidden md:block" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon name="dashboard" size={18} />
                          Painel
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon name="settings" size={18} />
                          Configurações
                        </Link>
                        <Link
                          href="/dashboard/chat"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Icon name="forum" size={18} />
                          Mensagens
                        </Link>
                      </div>
                      <div className="border-t border-white/5 py-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                        >
                          <Icon name="logout" size={18} />
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {!loading && !user && (
              <Link href="/boost/league-of-legends" className="sm:hidden">
                <Button
                  size="md"
                  className="shadow-[0_0_15px_rgba(236,19,236,0.3)]"
                  iconRight="arrow_forward"
                >
                  Pedir Agora
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5 bg-bg-primary/95 backdrop-blur-md px-6 py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!loading && !user && (
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="md" className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </>
              )}
              {!loading && user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-primary hover:text-white text-sm font-medium py-2 flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon name="dashboard" size={18} />
                    Painel
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      router.push("/");
                    }}
                    className="text-red-400 hover:text-red-300 text-sm font-medium py-2 flex items-center gap-2 text-left"
                  >
                    <Icon name="logout" size={18} />
                    Sair
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
