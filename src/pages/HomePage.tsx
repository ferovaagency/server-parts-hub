import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories, useBrands } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Server, Wifi, Zap, ShoppingCart, Clock, Wrench, Shield, Globe, Headphones, Award, HardDrive, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { whatsappUrl } from "@/lib/constants";

const brandLogos = ["HP", "Dell", "Cisco", "Juniper", "APC", "Eaton", "IBM", "Lenovo"];

export default function HomePage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const featured = products.filter((p) => p.featured);
  const [catFilter, setCatFilter] = useState("all");
  const [contactForm, setContactForm] = useState({ name: "", email: "", need: "" });

  const filteredFeatured = useMemo(() => {
    if (catFilter === "all") return featured.length > 0 ? featured : products.slice(0, 8);
    return products.filter((p) => p.categoryId === catFilter).slice(0, 8);
  }, [products, featured, catFilter]);

  const categoryIcons: Record<string, any> = { servidores: Server, networking: Wifi, ups: Zap, almacenamiento: HardDrive };

  return (
    <>
      <Helmet>
        <title>Partes Para Servidores | Servidores, Redes y UPS</title>
        <meta name="description" content="Tu fuente confiable de partes para servidores, redes y UPS. Stock en Colombia y Miami. Entrega nacional e internacional." />
        <link rel="canonical" href="https://partesparaservidores.com.co/" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="inline-flex items-center gap-2 bg-red/10 border border-red/20 text-red px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" /> Stock verificado en Colombia y Miami
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Tu fuente confiable de partes para{" "}
                <span className="text-gradient">servidores, redes y UPS</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 text-lg text-white/60 max-w-lg">
                Equipos nuevos y remanufacturados con garantía. Entrega nacional e internacional desde nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3 mt-8">
                <Link to="/tienda" className="bg-red hover:bg-red-light text-white px-8 py-3.5 rounded-xl text-lg font-bold transition-colors">
                  Ver catálogo
                </Link>
                <a href={whatsappUrl("Hola, quisiera asesoría sobre partes para servidores.")} target="_blank" rel="noopener noreferrer" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl text-lg font-bold transition-colors">
                  Hablar con un asesor
                </a>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-8 mt-10 text-white/40 text-sm">
                <div><span className="block text-2xl font-black text-white">500+</span>Productos</div>
                <div><span className="block text-2xl font-black text-white">8+</span>Marcas</div>
                <div><span className="block text-2xl font-black text-white">2</span>Bodegas</div>
                <div><span className="block text-2xl font-black text-white">24/7</span>Soporte</div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark-light">
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" alt="Centro de datos" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Brand Logos */}
      <section className="bg-dark-light border-t border-white/5 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {(brands.length > 0 ? brands : brandLogos.map((n, i) => ({ id: String(i), name: n, logo: "" }))).map((b) => (
              <div key={b.id} className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default">
                <span className="text-lg font-bold text-white tracking-wider">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Productos destacados</h2>
            <p className="text-muted-foreground mt-2">Equipos seleccionados con disponibilidad inmediata</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button onClick={() => setCatFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${catFilter === "all" ? "bg-red text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              Todos
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${catFilter === c.id ? "bg-red text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {c.name}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-muted animate-pulse rounded-xl h-80" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFeatured.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/tienda" className="inline-flex items-center gap-2 bg-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-dark-light transition-colors">
              Ver todo el catálogo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Bodegas globales", desc: "Stock en Colombia 🇨🇴 y Miami 🇺🇸 con envío a toda Latinoamérica.", bg: "bg-dark text-white" },
              { icon: Shield, title: "Garantía total", desc: "Todos nuestros equipos incluyen garantía y soporte técnico.", bg: "bg-card" },
              { icon: Headphones, title: "Soporte 24/7", desc: "Asesoría especializada por WhatsApp, email y teléfono.", bg: "bg-dark text-white" },
              { icon: Award, title: "Marcas premium", desc: "HP, Dell, Cisco, Juniper, APC, Eaton, IBM y Lenovo.", bg: "bg-card" },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} rounded-xl p-8 border border-border/50 hover:shadow-elevated transition-shadow`}>
                <item.icon className={`w-12 h-12 mb-4 ${item.bg.includes("dark") ? "text-red" : "text-red"}`} />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className={`text-sm ${item.bg.includes("dark") ? "text-white/60" : "text-muted-foreground"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: "Venta de partes", desc: "Servidores, networking, UPS y almacenamiento. Las mejores marcas del mercado con garantía y soporte.", to: "/tienda", cta: "Ver catálogo" },
              { icon: Clock, title: "Arrendamiento", desc: "Equipos en modalidad de arriendo. Sin inversión inicial, con soporte incluido y equipos siempre actualizados.", to: "/arrendamiento", cta: "Conocer más" },
              { icon: Wrench, title: "Instalación", desc: "Servicios profesionales de instalación, configuración, cableado estructurado y puesta en marcha.", to: "/servicios/instalacion", cta: "Solicitar servicio" },
            ].map((s) => (
              <Link key={s.to} to={s.to} className="group bg-card border rounded-xl p-8 hover:shadow-elevated hover:border-red/30 transition-all">
                <s.icon className="w-12 h-12 text-red mb-4" />
                <h3 className="font-bold text-xl mb-3 group-hover:text-red transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-red font-semibold text-sm">
                  {s.cta} <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouses Banner */}
      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Bodegas en Colombia y Miami</h2>
              <p className="text-white/60 mb-6">Mantenemos inventario activo en dos ubicaciones estratégicas para garantizar tiempos de entrega rápidos a toda Latinoamérica.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-light rounded-xl p-4 border border-white/10">
                  <span className="text-2xl mb-1">🇨🇴</span>
                  <h4 className="font-bold mt-1">Colombia</h4>
                  <p className="text-sm text-white/50">Envío nacional 1-3 días hábiles</p>
                </div>
                <div className="bg-dark-light rounded-xl p-4 border border-white/10">
                  <span className="text-2xl mb-1">🇺🇸</span>
                  <h4 className="font-bold mt-1">Miami, FL</h4>
                  <p className="text-sm text-white/50">Envío internacional 5-10 días</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-9xl opacity-20 select-none">🌎</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explora por categoría</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug] || Server;
              return (
                <Link key={c.id} to={`/tienda?category=${c.id}`} className="group flex flex-col items-center bg-card border rounded-xl p-6 hover:shadow-elevated hover:border-red/30 transition-all">
                  <Icon className="w-10 h-10 text-red mb-3" />
                  <span className="font-bold group-hover:text-red transition-colors">{c.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-red-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">¿Necesitas una cotización?</h2>
            <p className="text-white/70 mb-8">Cuéntanos qué necesitas y te contactamos en minutos.</p>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input placeholder="Tu nombre" value={contactForm.name} onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))} className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
                <input placeholder="Tu email" type="email" value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
              </div>
              <input placeholder="¿Qué equipos necesitas?" value={contactForm.need} onChange={(e) => setContactForm(f => ({ ...f, need: e.target.value }))} className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 mb-3" />
              <a href={whatsappUrl(`Hola, soy ${contactForm.name || "un cliente"}. Email: ${contactForm.email || "N/A"}. Necesito: ${contactForm.need || "asesoría sobre partes para servidores"}.`)} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-dark text-center py-3 rounded-lg font-bold hover:bg-white/90 transition-colors">
                Enviar consulta por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
