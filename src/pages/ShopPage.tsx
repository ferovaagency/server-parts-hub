import { Helmet } from "react-helmet-async";
import { useProducts } from "@/hooks/useProducts";
import { useCategories, useBrands } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { whatsappUrl } from "@/lib/constants";
import { Search } from "lucide-react";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [catFilter, setCatFilter] = useState(params.get("category") || "all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || p.categoryId === catFilter;
      const matchBrand = brandFilter === "all" || p.brandId === brandFilter;
      const matchMode = modeFilter === "all" || (modeFilter === "sale" && p.saleAvailable) || (modeFilter === "rental" && p.rentalAvailable);
      return matchSearch && matchCat && matchBrand && matchMode;
    });
  }, [products, search, catFilter, brandFilter, modeFilter]);

  const alternatives = products.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Tienda | Partes Para Servidores</title>
        <meta name="description" content="Explora nuestro catálogo de partes para servidores, redes y UPS." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tienda</h1>
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Marca" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Modalidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sale">Venta</SelectItem>
              <SelectItem value="rental">Arrendamiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-muted animate-pulse rounded-xl h-72" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg font-semibold">Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.</p>
            <p className="text-muted-foreground">Un asesor te contactará en breve.</p>
            <a href={whatsappUrl("Hola, quisiera hablar con un asesor de Partes Para Servidores.")} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:bg-orange-light transition-colors">
              Hablar con un asesor
            </a>
            {alternatives.length > 0 && (
              <>
                <h3 className="text-lg font-bold mt-8 mb-4">Productos que te pueden interesar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {alternatives.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
