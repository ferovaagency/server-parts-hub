import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Server, Wifi, Zap, ShoppingCart, Clock, Wrench } from "lucide-react";

export default function HomePage() {
  const { products, loading } = useProducts();
  const { brands } = useBrands();
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <Helmet>
        <title>Partes Para Servidores | Servidores, Redes y UPS</title>
        <meta name="description" content="Tu fuente confiable de partes para servidores, redes y UPS. Stock en Colombia y Miami. Entrega nacional e internacional." />
        <link rel="canonical" href="https://partesparaservidores.com.co/" />
      </Helmet>

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight max-w-4xl mx-auto"
          >
            Tu fuente confiable de partes para{" "}
            <span className="text-gradient">servidores, redes y UPS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 text-lg text-primary-foreground/80 max-w-2xl mx-auto"
          >
            Stock en Colombia 🇨🇴 y Miami 🇺🇸. Entrega nacional e internacional.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link
              to="/tienda"
              className="inline-block mt-8 bg-accent text-accent-foreground px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-orange-light transition-colors"
            >
              Ver catálogo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="bg-card border-b py-6">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <span>📦 Bodegas en Colombia y Miami</span>
          <span>🚚 Envío nacional e internacional</span>
          <span>✅ Garantía en todos los equipos</span>
          <span>💬 Asesoría especializada 24/7</span>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Nuestros servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: "Venta de partes", desc: "Servidores, networking, UPS y más. Las mejores marcas del mercado.", to: "/tienda" },
              { icon: Clock, title: "Arrendamiento", desc: "Equipos en modalidad de arriendo. Sin inversión inicial, con soporte incluido.", to: "/arrendamiento" },
              { icon: Wrench, title: "Instalación", desc: "Servicios profesionales de instalación, configuración y cableado.", to: "/servicios/instalacion" },
            ].map((s) => (
              <Link key={s.to} to={s.to} className="bg-card border rounded-xl p-6 hover:shadow-elevated transition-shadow group">
                <s.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Productos destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Explora por categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Server, label: "Servidores", slug: "servidores" },
              { icon: Wifi, label: "Networking", slug: "networking" },
              { icon: Zap, label: "UPS y Energía", slug: "ups" },
            ].map((c) => (
              <Link
                key={c.slug}
                to={`/tienda?category=${c.slug}`}
                className="flex flex-col items-center bg-card border rounded-xl p-8 hover:shadow-elevated transition-shadow group"
              >
                <c.icon className="w-12 h-12 text-accent mb-3" />
                <span className="font-bold text-lg group-hover:text-accent transition-colors">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Marcas que manejamos</h2>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {brands.map((b) => (
                <div key={b.id} className="flex items-center gap-2">
                  {b.logo ? <img src={b.logo} alt={b.name} className="h-10 object-contain" /> : <span className="text-lg font-bold text-muted-foreground">{b.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All products preview */}
      {!loading && products.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Catálogo reciente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/tienda" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-navy-light transition-colors">
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
