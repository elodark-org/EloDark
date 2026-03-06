import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const footerLinks = [
  { href: "/termos", label: "Termos de Uso" },
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/reembolso", label: "Política de Reembolso" },
  { href: "#", label: "Suporte" },
];

const socialLinks = [
  { href: "#", icon: "forum" },
  { href: "#", icon: "alternate_email" },
  { href: "#", icon: "share" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050508] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="EloDark" className="w-9 h-9 rounded-xl object-cover shadow-[0_0_12px_rgba(168,85,247,0.4)]" style={{ objectPosition: "center 20%" }} />
          <span className="text-lg font-bold text-white">EloDark</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <Link
              key={link.icon}
              href={link.href}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Icon name={link.icon} />
            </Link>
          ))}
        </div>

        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} EloDark Elite Boosting. O padrão
          premium em excelência gamer.
        </p>

        {/* Riot Games Disclaimer */}
        <div className="border-t border-white/5 pt-6 w-full flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="EloDark" className="w-8 h-8 rounded-lg object-cover opacity-60" style={{ objectPosition: "center 20%" }} />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">EloDark</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed text-center sm:text-left">
            League of Legends and Valorant are registered trademarks of Riot Games, Inc.
            We are in no way affiliated with, associated with or endorsed by Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
