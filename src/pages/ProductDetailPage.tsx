import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { fetchProductBySlug, fetchCompatibleProducts, useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { consultarPrecioUrl, whatsappUrl } from "@/lib/constants";
import { useQuoteStore } from "@/stores/quoteStore";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, ChevronRight, MessageCircle } from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [compatible, setCompatible] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const addItem = useQuoteStore((s) => s.addItem);
  const { products } = useProducts();
  const { categories } = useCategories();
  const viewers = useMemo(() => Math.floor(Math.random() * 20) + 4, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setSelectedImg(0);
    fetchProductBySlug(slug).then(async (p) => {
      if (p) {
        setProduct(p);
        if (p.compatibleProducts?.length) {
          const comp = await fetchCompatibleProducts(p.compatibleProducts);
          setCompatible(comp);
        } else {
          setCompatible([]);
        }
      }
      setLoading(false);
    });
  }, [slug]);

  const categoryName = useMemo(() => {
    if (!product?.categoryId || !categories.length) return "";
    return categories.find((c) => c.id === product.categoryId)?.name || "";
  }, [product, categories]);

  if (loading) return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-muted animate-pulse rounded-xl aspect-square" />
        <div className="space-y-4">
          <div className="bg-muted animate-pulse rounded h-8 w-3/4" />
          <div className="bg-muted animate-pulse rounded h-4 w-1/4" />
          <div className="bg-muted animate-pulse rounded h-20 w-full" />
        </div>
      </div>
    </div>
  );

  if (!product) {
    const alternatives = products.slice(0, 3);
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <Helmet><title>Consultando disponibilidad | Partes Para Servidores</title></Helmet>
        <p className="text-lg font-semibold">Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.</p>
        <p className="text-muted-foreground">Un asesor te contactará en breve.</p>
        <a href={whatsappUrl("Hola, quisiera hablar con un asesor de Partes Para Servidores.")} target="_blank" rel="noopener noreferrer" className="inline-block bg-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-light transition-colors">
          Hablar con un asesor
        </a>
        {alternatives.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Productos que te pueden interesar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {alternatives.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const specs = product.specs && typeof product.specs === "object" ? Object.entries(product.specs) : [];

  return (
    <>
      <Helmet>
        <title>{product.metaTitle || product.name} | Partes Para Servidores</title>
        <meta name="description" content={product.metaDesc || product.shortDesc || product.description} />
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-red transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/tienda" className="hover:text-red transition-colors">Tienda</Link>
          {categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{categoryName}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="bg-muted rounded-xl aspect-square overflow-hidden mb-3">
              <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-contain p-6" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-16 h-16 rounded-lg border overflow-hidden flex-shrink-0 transition-all ${i === selectedImg ? "ring-2 ring-red border-red" : "hover:border-red/50"}`}>
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3">
              {product.sku && <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">SKU: {product.sku}</span>}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="w-3.5 h-3.5" /> {viewers} personas viendo este producto
              </span>
            </div>

            {/* Availability badge */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">En stock en Colombia y Miami</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.saleAvailable && <Badge className="bg-red/10 text-red border-red/30">Disponible para venta</Badge>}
              {product.rentalAvailable && <Badge className="bg-primary/10 text-primary border-primary/30">Arrendamiento (mín. {product.rentalMinMonths} meses)</Badge>}
            </div>

            {product.shortDesc && <p className="text-muted-foreground">{product.shortDesc}</p>}
            {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={consultarPrecioUrl(product.name, product.sku)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-red text-white py-3.5 rounded-xl font-bold hover:bg-red-light transition-colors">
                <MessageCircle className="w-5 h-5" /> Consultar disponibilidad y precio
              </a>
              <Button variant="outline" className="flex-1 border-red text-red hover:bg-red hover:text-white" onClick={() => addItem({ id: product.id, name: product.name, sku: product.sku, image: images[0] })}>
                <Plus className="w-4 h-4 mr-2" /> Agregar a cotización
              </Button>
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-3">Especificaciones técnicas</h2>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map(([key, val], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-muted/50" : "bg-card"}>
                          <td className="py-2.5 px-4 font-medium text-muted-foreground w-1/3">{key}</td>
                          <td className="py-2.5 px-4">{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compatible products */}
        {compatible.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-2">Complete su servidor con estas partes compatibles</h2>
            <p className="text-muted-foreground mb-6">Partes verificadas para uso con {product.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {compatible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-3 z-30 flex gap-2">
        <a href={consultarPrecioUrl(product.name, product.sku)} target="_blank" rel="noopener noreferrer" className="flex-1 bg-red text-white py-3 rounded-lg font-bold text-center text-sm hover:bg-red-light transition-colors">
          Consultar precio
        </a>
        <button onClick={() => addItem({ id: product.id, name: product.name, sku: product.sku, image: images[0] })} className="border border-red text-red px-4 py-3 rounded-lg font-bold text-sm hover:bg-red hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
