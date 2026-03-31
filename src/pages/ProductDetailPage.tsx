import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductBySlug, fetchCompatibleProducts, useProducts } from "@/hooks/useProducts";
import { consultarPrecioUrl, whatsappUrl } from "@/lib/constants";
import { useQuoteStore } from "@/stores/quoteStore";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [compatible, setCompatible] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const addItem = useQuoteStore((s) => s.addItem);
  const { products } = useProducts();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug).then(async (p) => {
      if (p) {
        setProduct(p);
        if (p.compatibleProducts?.length) {
          const comp = await fetchCompatibleProducts(p.compatibleProducts);
          setCompatible(comp);
        }
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center"><div className="animate-pulse bg-muted h-96 rounded-xl" /></div>;

  if (!product) {
    const alternatives = products.slice(0, 3);
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <Helmet><title>Consultando disponibilidad | Partes Para Servidores</title></Helmet>
        <p className="text-lg font-semibold">Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.</p>
        <p className="text-muted-foreground">Un asesor te contactará en breve.</p>
        <a href={whatsappUrl("Hola, quisiera hablar con un asesor de Partes Para Servidores.")} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:bg-orange-light transition-colors">
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="bg-muted rounded-xl aspect-square overflow-hidden mb-3">
              <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-contain p-6" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-16 h-16 rounded-lg border overflow-hidden flex-shrink-0 ${i === selectedImg ? "ring-2 ring-accent" : ""}`}>
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
            {product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}
            <div className="flex flex-wrap gap-2">
              {product.saleAvailable && <Badge className="bg-accent/10 text-accent border-accent/30">Disponible para venta</Badge>}
              {product.rentalAvailable && <Badge className="bg-primary/10 text-primary border-primary/30">Disponible para arrendamiento (mín. {product.rentalMinMonths} meses)</Badge>}
            </div>
            {product.description && <p className="text-muted-foreground">{product.description}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={consultarPrecioUrl(product.name, product.sku)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-accent text-accent-foreground py-3 rounded-xl font-bold hover:bg-orange-light transition-colors">
                Consultar disponibilidad y precio
              </a>
              <Button variant="outline" className="flex-1" onClick={() => addItem({ id: product.id, name: product.name, sku: product.sku, image: images[0] })}>
                <Plus className="w-4 h-4 mr-2" /> Agregar a cotización
              </Button>
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-3">Especificaciones técnicas</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map(([key, val]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 font-medium text-muted-foreground pr-4">{key}</td>
                        <td className="py-2">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Compatible products */}
        {compatible.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Partes compatibles con este equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {compatible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
