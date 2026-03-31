import { Helmet } from "react-helmet-async";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { whatsappUrl } from "@/lib/constants";
import { Clock, Shield, RefreshCw, Headphones } from "lucide-react";

export default function RentalPage() {
  const { products, loading } = useProducts();
  const rental = products.filter((p) => p.rentalAvailable);

  return (
    <>
      <Helmet>
        <title>Arrendamiento de Equipos | Partes Para Servidores</title>
        <meta name="description" content="Arrienda servidores, UPS y equipos de red. Sin inversión inicial, con soporte incluido." />
      </Helmet>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Arrendamiento de equipos</h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Equipa tu empresa sin inversión inicial. Equipos de última generación con soporte incluido.</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Clock, title: "Sin inversión inicial", desc: "Paga mensualmente y conserva tu capital" },
              { icon: Shield, title: "Soporte incluido", desc: "Asistencia técnica durante todo el contrato" },
              { icon: RefreshCw, title: "Equipos actualizados", desc: "Renueva tus equipos al finalizar el contrato" },
              { icon: Headphones, title: "Asesoría 24/7", desc: "Equipo de expertos a tu disposición" },
            ].map((b) => (
              <div key={b.title} className="bg-card border rounded-xl p-6 text-center">
                <b.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Equipos disponibles para arrendamiento</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-muted animate-pulse rounded-xl h-72" />)}
            </div>
          ) : rental.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rental.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">Próximamente más equipos disponibles para arrendamiento.</p>
          )}

          <div className="text-center mt-10">
            <a href={whatsappUrl("Hola, me interesa el servicio de arrendamiento de equipos.")} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:bg-orange-light transition-colors">
              Solicitar cotización de arrendamiento
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
