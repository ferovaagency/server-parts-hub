import { Link } from "react-router-dom";
import { COMPANY_NAME, COMPANY_EMAIL, whatsappUrl } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">PPS</span>
              </div>
              <span className="font-bold">Partes Para Servidores</span>
            </div>
            <p className="text-sm text-white/60">Tu fuente confiable de partes para servidores, redes y UPS.</p>
            <p className="text-sm text-white/60 mt-2">📦 Bodegas en Colombia 🇨🇴 y Miami 🇺🇸</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[{label:"Tienda",to:"/tienda"},{label:"Arrendamiento",to:"/arrendamiento"},{label:"Instalación",to:"/servicios/instalacion"},{label:"Marcas",to:"/marcas"},{label:"Cotización",to:"/cotizacion"}].map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-red transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>📧 <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-red transition-colors">{COMPANY_EMAIL}</a></li>
              <li>📱 <a href={whatsappUrl("Hola")} target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors">+57 316 878 8749</a></li>
              <li>📦 Colombia 🇨🇴</li>
              <li>📦 Miami 🇺🇸</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[{label:"Términos",to:"/legal"},{label:"Política de datos",to:"/legal"},{label:"Cookies",to:"/legal"},{label:"Mi cuenta",to:"/mi-cuenta"}].map((l) => (
                <li key={l.label}><Link to={l.to} className="hover:text-red transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-light mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/40">
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos reservados.</p>
          <p>Construido por Ferova Agency</p>
        </div>
      </div>
    </footer>
  );
}
