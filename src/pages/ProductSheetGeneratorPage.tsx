import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Sparkles, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const BRANDS = ["HP", "Dell", "Lenovo", "IBM", "Cisco", "Juniper", "APC", "Eaton", "Fortinet", "Aruba", "Ubiquiti", "Otro"];
const CATEGORIES = ["Servidores", "Networking", "UPS y Energía", "Almacenamiento", "Cómputo", "Accesorios", "Otro"];

const CATEGORY_SPECS: Record<string, string[]> = {
  "Servidores": ["Procesador", "RAM", "Almacenamiento", "Factor forma", "Fuentes de poder", "Bahías"],
  "Networking": ["Puertos", "Velocidad", "Uplinks", "PoE Budget", "Sistema operativo"],
  "UPS y Energía": ["Capacidad VA", "Potencia W", "Tecnología", "Autonomía", "Factor forma"],
  "Almacenamiento": ["Capacidad", "Interface", "RPM", "Factor forma", "Compatibilidad"],
};

type SpecRow = { key: string; value: string };
type CompatProduct = { id: string; name: string; sku: string | null };

const emptyState = () => ({
  name: "", sku: "", brand: "", category: "",
  shortDesc: "", longDesc: "",
  specs: [] as SpecRow[],
  images: [""] as string[],
  saleAvailable: true, rentalAvailable: false, rentalMinMonths: 3,
  metaTitle: "", metaDesc: "",
  compatibleProducts: [] as CompatProduct[],
});

export default function ProductSheetGeneratorPage() {
  const [form, setForm] = useState(emptyState());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompatProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const resultsRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof ReturnType<typeof emptyState>>(key: K, val: ReturnType<typeof emptyState>[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Preload specs when category changes
  useEffect(() => {
    const presets = CATEGORY_SPECS[form.category];
    if (presets && form.specs.length === 0) {
      set("specs", presets.map((k) => ({ key: k, value: "" })));
    }
  }, [form.category]);

  // Debounced compatible product search
  const searchProducts = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return; }
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("id,name,sku")
        .or(`name.ilike.%${q}%,sku.ilike.%${q}%`)
        .limit(5);
      setSearchResults((data || []) as CompatProduct[]);
      setShowResults(true);
    }, 300);
  }, []);

  const handleGenerate = async () => {
    if (!form.name || !form.sku) { toast.error("Nombre y SKU son obligatorios"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-sheet", {
        body: { name: form.name, sku: form.sku, brand: form.brand, category: form.category, shortDesc: form.shortDesc, specs: form.specs, rentalAvailable: form.rentalAvailable },
      });
      if (error) throw error;
      if (data?.description) set("longDesc", data.description);
      if (data?.metaTitle) set("metaTitle", data.metaTitle);
      if (data?.metaDescription) set("metaDesc", data.metaDescription);
      toast.success("Ficha generada con IA");
    } catch (err: any) {
      toast.error("Error al generar: " + (err.message || "Intenta de nuevo"));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.sku) { toast.error("Nombre y SKU son obligatorios"); return; }
    setSaving(true);
    try {
      const specsObj: Record<string, string> = {};
      form.specs.forEach((s) => { if (s.key.trim()) specsObj[s.key] = s.value; });

      const productData = {
        name: form.name,
        sku: form.sku,
        short_description: form.shortDesc || null,
        description: form.longDesc || null,
        images: form.images.filter(Boolean),
        specs: specsObj,
        sale_available: form.saleAvailable,
        rental_available: form.rentalAvailable,
        rental_min_months: form.rentalAvailable ? form.rentalMinMonths : null,
        meta_title: form.metaTitle || null,
        meta_description: form.metaDesc || null,
        compatible_products: form.compatibleProducts.map((p) => p.id),
        active: true,
      };

      const { data: existing } = await supabase.from("products").select("id").eq("sku", form.sku).maybeSingle();

      if (existing?.id) {
        await supabase.from("products").update(productData).eq("id", existing.id);
        toast.success("Producto actualizado");
      } else {
        const slug = form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 50);
        await supabase.from("products").insert({ ...productData, slug });
        toast.success("Producto creado");
      }
    } catch (err: any) {
      toast.error("Error al guardar: " + (err.message || "Intenta de nuevo"));
    }
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>Generador de Fichas | Admin</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Generador de fichas técnicas</h1>

        {/* SECTION 1 — Identification */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Identificación</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Nombre del producto *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: HP ProLiant DL380 Gen10" /></div>
              <div><Label>SKU / Número de parte *</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Ej: HP-DL380-G10" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Marca *</Label>
                <Select value={form.brand} onValueChange={(v) => set("brand", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar marca" /></SelectTrigger>
                  <SelectContent>{BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoría *</Label>
                <Select value={form.category} onValueChange={(v) => { set("category", v); set("specs", []); }}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2 — Description */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Descripción</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Descripción corta * <span className="text-muted-foreground text-xs">({form.shortDesc.length}/160)</span></Label>
              <Textarea maxLength={160} value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="Resumen breve del producto" rows={2} />
            </div>
            <div>
              <Label>Descripción larga <span className="text-muted-foreground text-xs">(la IA puede rellenar esto)</span></Label>
              <Textarea value={form.longDesc} onChange={(e) => set("longDesc", e.target.value)} placeholder="Descripción detallada..." rows={6} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3 — Specs */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Especificaciones</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {form.specs.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input className="flex-1" placeholder="Característica" value={s.key} onChange={(e) => { const n = [...form.specs]; n[i] = { ...n[i], key: e.target.value }; set("specs", n); }} />
                <Input className="flex-1" placeholder="Valor" value={s.value} onChange={(e) => { const n = [...form.specs]; n[i] = { ...n[i], value: e.target.value }; set("specs", n); }} />
                <button onClick={() => set("specs", form.specs.filter((_, j) => j !== i))} className="text-red hover:text-red-dark"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => set("specs", [...form.specs, { key: "", value: "" }])}><Plus className="w-4 h-4 mr-1" /> Agregar especificación</Button>
          </CardContent>
        </Card>

        {/* SECTION 4 — Images */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Imágenes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input className="flex-1" placeholder="URL de imagen" value={url} onChange={(e) => { const n = [...form.images]; n[i] = e.target.value; set("images", n); }} />
                {url && <img src={url} alt="" className="w-[60px] h-[60px] rounded object-cover border" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />}
                {form.images.length > 1 && <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="text-red hover:text-red-dark"><X className="w-4 h-4" /></button>}
              </div>
            ))}
            {form.images.length < 5 && (
              <Button variant="outline" size="sm" onClick={() => set("images", [...form.images, ""])}><Plus className="w-4 h-4 mr-1" /> Agregar imagen</Button>
            )}
          </CardContent>
        </Card>

        {/* SECTION 5 — Modality */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Modalidad</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={form.saleAvailable} onCheckedChange={(v) => set("saleAvailable", v)} />
              <Label>Disponible para venta</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.rentalAvailable} onCheckedChange={(v) => set("rentalAvailable", v)} />
              <Label>Disponible para arrendamiento</Label>
            </div>
            {form.rentalAvailable && (
              <div className="max-w-[200px]">
                <Label>Meses mínimo</Label>
                <Input type="number" min={1} value={form.rentalMinMonths} onChange={(e) => set("rentalMinMonths", Number(e.target.value))} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 6 — SEO */}
        <Card>
          <CardHeader><CardTitle className="text-lg">SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Meta título <span className="text-muted-foreground text-xs">({(form.metaTitle || `${form.name} | Partes Para Servidores`).length}/60)</span></Label>
              <Input maxLength={60} value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder={`${form.name} | Partes Para Servidores`} />
            </div>
            <div>
              <Label>Meta descripción <span className="text-muted-foreground text-xs">({(form.metaDesc || form.shortDesc).length}/160)</span></Label>
              <Textarea maxLength={160} value={form.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} placeholder={form.shortDesc || "Descripción para buscadores"} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 7 — Compatible Products */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Productos compatibles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); searchProducts(e.target.value); }}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {showResults && searchResults.length > 0 && (
                <div ref={resultsRef} className="absolute z-10 top-full left-0 right-0 bg-card border rounded-lg shadow-elevated mt-1 max-h-48 overflow-y-auto">
                  {searchResults.filter((r) => !form.compatibleProducts.find((c) => c.id === r.id)).map((r) => (
                    <button key={r.id} className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors"
                      onMouseDown={() => { set("compatibleProducts", [...form.compatibleProducts, r]); setSearchQuery(""); setShowResults(false); }}>
                      {r.name} {r.sku && <span className="text-muted-foreground font-mono text-xs">({r.sku})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.compatibleProducts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.compatibleProducts.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full text-xs font-medium">
                    {p.name}
                    <button onClick={() => set("compatibleProducts", form.compatibleProducts.filter((c) => c.id !== p.id))} className="text-red hover:text-red-dark"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleGenerate} disabled={loading} className="flex-1 bg-dark hover:bg-dark-light text-accent-foreground">
            <Sparkles className="w-4 h-4 mr-2" /> {loading ? "Generando..." : "Generar ficha con IA"}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 bg-red hover:bg-red-light text-accent-foreground">
            <Save className="w-4 h-4 mr-2" /> {saving ? "Guardando..." : "Guardar en catálogo"}
          </Button>
          <Button variant="outline" onClick={() => setForm(emptyState())} className="sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" /> Limpiar
          </Button>
        </div>
      </div>
    </>
  );
}
