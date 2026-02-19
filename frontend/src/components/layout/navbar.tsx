"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/layout/search-overlay";

const navLinks = [
  { href: "/#games", label: "Games" },
  { href: "/boosters", label: "Boosters" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "Support" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
  <>
    <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md bg-bg-primary/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-primary to-accent-purple shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300">
            <Icon name="bolt" className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            EloDark
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </button>

          {/* Online Boosters Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span className="text-xs font-medium text-gray-300">
              Boosters Online:{" "}
              <span className="text-white font-bold">47</span>
            </span>
          </div>

          <Button
            size="md"
            className="hidden sm:flex shadow-[0_0_15px_rgba(46,123,255,0.3)]"
            iconRight="arrow_forward"
          >
            Order Now
          </Button>

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
            <Button size="md" className="mt-2 w-full" iconRight="arrow_forward">
              Order Now
            </Button>
          </nav>
        </div>
      )}
    </header>

    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  );
}
