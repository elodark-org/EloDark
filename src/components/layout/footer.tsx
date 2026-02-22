import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const footerLinks = [
  { href: "#", label: "Termos de Serviço" },
  { href: "#", label: "Política de Privacidade" },
  { href: "#", label: "Política de Reembolso" },
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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-primary to-accent-purple">
            <Icon name="bolt" className="text-white" size={18} />
          </div>
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
      </div>
    </footer>
  );
}
