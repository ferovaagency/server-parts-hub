import { Helmet } from "react-helmet-async";
import { COMPANY_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <Helmet><title>Nosotros | Partes Para Servidores</title></Helmet>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Sobre nosotros</h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
        <p className="text-lg text-muted-foreground">
          <strong className="text-foreground">Partes Para Servidores</strong> es tu aliado en infraestructura IT.
          Contamos con bodegas en Colombia 🇨🇴 y Miami 🇺🇸, lo que nos permite ofrecer un amplio inventario de partes
          para servidores, equipos de red y sistemas de energía ininterrumpida (UPS).
        </p>
        <p className="text-muted-foreground">
          Trabajamos con las mejores marcas: HP, Dell, IBM, Lenovo, Cisco, Juniper, APC, Eaton y más.
          Ofrecemos venta directa, arrendamiento de equipos y servicios de instalación profesional.
        </p>
        <p className="text-muted-foreground">
          Nuestro equipo de asesores especializados está disponible para ayudarte a encontrar la solución
          perfecta para tu empresa, sin importar el tamaño o la complejidad del proyecto.
        </p>
        <div className="bg-card border rounded-xl p-6 space-y-2">
          <p className="font-bold">¿Listo para empezar?</p>
          <p className="text-sm text-muted-foreground">📧 {COMPANY_EMAIL}</p>
          <p className="text-sm text-muted-foreground">📱 +57 316 878 8749</p>
          <a href={whatsappUrl("Hola, quisiera más información sobre Partes Para Servidores.")} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-3 bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-orange-light transition-colors">
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
