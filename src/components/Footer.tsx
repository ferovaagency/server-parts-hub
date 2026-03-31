import { Link } from "react-router-dom";
import { COMPANY_EMAIL, WHATSAPP_NUMBER, COMPANY_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">{COMPANY_NAME}</h3>
            <p className="text-sm text-primary-foreground/70">Tu fuente confiable de partes para servidores, redes y UPS.</p>
            <p className="text-sm text-primary-foreground/70 mt-2">📦 Bodegas en Colombia 🇨🇴 y Miami 🇺🇸</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/tienda" className="hover:text-red transition-colors">Tienda</Link></li>
              <li><Link to="/arrendamiento" className="hover:text-red transition-colors">Arrendamiento</Link></li>
              <li><Link to="/servicios/instalacion" className="hover:text-red transition-colors">Servicios</Link></li>
              <li><Link to="/marcas" className="hover:text-red transition-colors">Marcas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>📧 <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-red transition-colors">{COMPANY_EMAIL}</a></li>
              <li>📱 <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors">+57 316 878 8749</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/legal" className="hover:text-red transition-colors">Términos y condiciones</Link></li>
              <li><Link to="/legal" className="hover:text-red transition-colors">Política de datos</Link></li>
              <li><Link to="/legal" className="hover:text-red transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-light mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
