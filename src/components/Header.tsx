import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import { useQuoteStore } from "@/stores/quoteStore";
import { WHATSAPP_BASE } from "@/lib/constants";

const navLinks = [
  { to: "/tienda", label: "Tienda" },
  { to: "/arrendamiento", label: "Arrendamiento" },
  { to: "/servicios/instalacion", label: "Servicios" },
  { to: "/marcas", label: "Marcas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const itemCount = useQuoteStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-navy-light">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-foreground">Partes Para Servidores</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cotizacion" className="relative text-primary-foreground hover:text-accent transition-colors">
            <FileText className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <a
            href={WHATSAPP_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-light transition-colors"
          >
            WhatsApp
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-primary-foreground">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden bg-primary border-t border-navy-light pb-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-primary-foreground/80 hover:text-accent hover:bg-navy-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
