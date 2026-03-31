import { Helmet } from "react-helmet-async";
import { useBrands } from "@/hooks/useCategories";

export default function BrandsPage() {
  const { brands, loading } = useBrands();
  return (
    <>
      <Helmet><title>Marcas | Partes Para Servidores</title></Helmet>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Marcas</h1>
          <p className="mt-3 text-primary-foreground/80">Trabajamos con las mejores marcas del mercado.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-muted animate-pulse rounded-xl h-32" />)}
          </div>
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brands.map((b) => (
              <div key={b.id} className="bg-card border rounded-xl p-6 flex items-center justify-center h-32">
                {b.logo ? <img src={b.logo} alt={b.name} className="max-h-16 object-contain" /> : <span className="text-xl font-bold text-muted-foreground">{b.name}</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Próximamente más marcas.</p>
        )}
      </div>
    </>
  );
}
