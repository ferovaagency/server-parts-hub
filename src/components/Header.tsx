import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import { useQuoteStore } from "@/stores/quoteStore";
import { whatsappUrl } from "@/lib/constants";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Tienda", to: "/tienda" },
  { label: "Arrendamiento", to: "/arrendamiento" },
  { label: "Contacto", to: "/contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const items = useQuoteStore((s) => s.items);
  const itemCount = items.length;

  return (
    <header className="sticky top-0 z-50 bg-dark border-b border-dark-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">PPS</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-white font-bold text-sm leading-tight">Partes Para</span>
              <span className="block text-white/70 text-xs leading-tight">Servidores</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? "bg-red/10 text-red" : "text-white/80 hover:text-white hover:bg-dark-light"}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/cotizacion" className="relative flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Cotización</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <a href={whatsappUrl("Hola, quisiera información sobre Partes Para Servidores.")}
              target="_blank" rel="noopener noreferrer"
              className="bg-red hover:bg-red-light text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              WhatsApp
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <Link to="/cotizacion" className="relative text-white/80 hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="text-white/80 hover:text-red transition-colors">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-dark-light pb-4 pt-2">
            <div className="space-y-1">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? "bg-red/10 text-red" : "text-white/80 hover:bg-dark-light hover:text-white"}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 px-4">
              <a href={whatsappUrl("Hola, quisiera información sobre Partes Para Servidores.")}
                target="_blank" rel="noopener noreferrer"
                className="block w-full text-center bg-red hover:bg-red-light text-white py-3 rounded-lg font-semibold text-sm transition-colors">
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
