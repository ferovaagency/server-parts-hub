import { Helmet } from "react-helmet-async";
import { useProducts } from "@/hooks/useProducts";
import { useCategories, useBrands } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { whatsappUrl } from "@/lib/constants";
import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ShopPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [catFilters, setCatFilters] = useState<string[]>(params.get("category") ? [params.get("category")!] : []);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [modeFilter, setModeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilters.length === 0 || catFilters.includes(p.categoryId);
      const matchBrand = brandFilters.length === 0 || brandFilters.includes(p.brandId);
      const matchMode = modeFilter === "all" || (modeFilter === "sale" && p.saleAvailable) || (modeFilter === "rental" && p.rentalAvailable);
      return matchSearch && matchCat && matchBrand && matchMode;
    });
    if (sortBy === "az") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "za") result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [products, search, catFilters, brandFilters, modeFilter, sortBy]);

  const alternatives = products.slice(0, 3);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-sm mb-2">Categoría</CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer py-1">
              <input type="checkbox" checked={catFilters.includes(c.id)} onChange={() => toggleFilter(catFilters, c.id, setCatFilters)} className="rounded border-border accent-red" />
              {c.name}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-sm mb-2">Marca</CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer py-1">
              <input type="checkbox" checked={brandFilters.includes(b.id)} onChange={() => toggleFilter(brandFilters, b.id, setBrandFilters)} className="rounded border-border accent-red" />
              {b.name}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-sm mb-2">Modalidad</CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {[{ v: "all", l: "Todos" }, { v: "sale", l: "Venta" }, { v: "rental", l: "Arrendamiento" }].map((o) => (
            <label key={o.v} className="flex items-center gap-2 text-sm cursor-pointer py-1">
              <input type="radio" name="mode" checked={modeFilter === o.v} onChange={() => setModeFilter(o.v)} className="accent-red" />
              {o.l}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Tienda | Partes Para Servidores</title>
        <meta name="description" content="Explora nuestro catálogo de partes para servidores, redes y UPS." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tienda</h1>
          <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filtros
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-background p-4 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filtros</h2>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <FilterSidebar />
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-red text-white py-3 rounded-xl font-bold mt-6">
                Ver {filtered.length} resultados
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre o SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="recent">Más recientes</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg border ${viewMode === "grid" ? "bg-red text-white" : ""}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg border ${viewMode === "list" ? "bg-red text-white" : ""}`}><List className="w-4 h-4" /></button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">Mostrando {filtered.length} de {products.length} productos</p>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-muted animate-pulse rounded-xl h-72" />)}
              </div>
            ) : filtered.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-lg font-semibold">Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.</p>
                <p className="text-muted-foreground">Un asesor te contactará en breve.</p>
                <a href={whatsappUrl("Hola, quisiera hablar con un asesor de Partes Para Servidores.")} target="_blank" rel="noopener noreferrer" className="inline-block bg-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-light transition-colors">
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
        </div>
      </div>
    </>
  );
}
