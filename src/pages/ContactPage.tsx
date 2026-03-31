import { Helmet } from "react-helmet-async";
import { COMPANY_EMAIL, WHATSAPP_NUMBER, whatsappUrl } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Helmet><title>Contacto | Partes Para Servidores</title></Helmet>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Contacto</h1>
          <p className="mt-3 text-primary-foreground/80">Estamos listos para ayudarte.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-card border rounded-xl p-6">
            <Mail className="w-6 h-6 text-accent mt-1" />
            <div>
              <h3 className="font-bold">Email</h3>
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-muted-foreground hover:text-accent transition-colors">{COMPANY_EMAIL}</a>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-card border rounded-xl p-6">
            <Phone className="w-6 h-6 text-accent mt-1" />
            <div>
              <h3 className="font-bold">WhatsApp</h3>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">+57 316 878 8749</a>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-card border rounded-xl p-6">
            <MapPin className="w-6 h-6 text-accent mt-1" />
            <div>
              <h3 className="font-bold">Ubicaciones</h3>
              <p className="text-muted-foreground">📦 Bodega Colombia 🇨🇴</p>
              <p className="text-muted-foreground">📦 Bodega Miami 🇺🇸</p>
            </div>
          </div>
          <div className="text-center">
            <a href={whatsappUrl("Hola, quisiera contactar a Partes Para Servidores.")} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:bg-orange-light transition-colors">
              Iniciar conversación por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
