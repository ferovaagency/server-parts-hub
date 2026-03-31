import { Helmet } from "react-helmet-async";
import { whatsappUrl } from "@/lib/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Server, Wifi, Zap, Cable } from "lucide-react";

export default function InstallationPage() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", service: "", details: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola, soy ${form.name} de ${form.company || "N/A"}.\nSolicito servicio de: ${form.service}\nDetalles: ${form.details}\nTel: ${form.phone}`;
    window.open(whatsappUrl(msg), "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Servicios de Instalación | Partes Para Servidores</title>
        <meta name="description" content="Servicios profesionales de instalación de servidores, redes, UPS y cableado estructurado." />
      </Helmet>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Servicios de instalación</h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Instalación profesional de servidores, redes, UPS y cableado estructurado.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Server, title: "Servidores", desc: "Rack, torre, blade. Instalación y configuración." },
              { icon: Wifi, title: "Redes", desc: "Switches, routers, access points, firewalls." },
              { icon: Zap, title: "UPS", desc: "Sistemas de energía ininterrumpida y PDU." },
              { icon: Cable, title: "Cableado", desc: "Cableado estructurado certificado." },
            ].map((s) => (
              <div key={s.title} className="bg-card border rounded-xl p-6 text-center">
                <s.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Nuestro proceso</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {["1. Consulta inicial", "2. Evaluación técnica", "3. Instalación", "4. Verificación y entrega"].map((step, i) => (
              <div key={i} className="bg-card border rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                <p className="font-medium text-sm">{step.slice(3)}</p>
              </div>
            ))}
          </div>

          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Solicitar servicio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input required placeholder="Nombre *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Empresa" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              <Input required placeholder="Teléfono *" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <Input required placeholder="Servicio requerido *" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} />
              <Textarea placeholder="Detalles del proyecto" value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-orange-light">Solicitar servicio por WhatsApp</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
