import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { fetchAllProducts, setProductActiveDB, deleteProductDB, upsertProductDB } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappUrl } from "@/lib/constants";
import { Trash2, ExternalLink, Plus, X, Upload, FileText, Search } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
};
const statusLabels: Record<string, string> = { pending: "Pendiente", contacted: "Contactado", quoted: "Cotizado", closed: "Cerrado" };

const emptyProduct = { name: "", slug: "", sku: "", shortDesc: "", description: "", images: [], categoryId: "", brandId: "", specs: {}, active: true, featured: false, saleAvailable: true, rentalAvailable: false, rentalMinMonths: 3, compatibleProducts: [] as string[] };

export default function AdminPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [tab, setTab] = useState("quotes");
  const [quoteFilter, setQuoteFilter] = useState("all");
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<any>(null);
  const [specsText, setSpecsText] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [customerQuotes, setCustomerQuotes] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [q, p, c, cat, br] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      fetchAllProducts(),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("brands").select("*").order("name"),
    ]);
    setQuotes(q.data ?? []);
    setProducts(p);
    setCustomers(c.data ?? []);
    setCategories(cat.data ?? []);
    setBrands(br.data ?? []);
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    await supabase.from("quotes").update({ status }).eq("id", id);
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const toggleActive = async (id: string, active: boolean) => {
    await setProductActiveDB(id, !active);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await deleteProductDB(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const openProductForm = (p?: any) => {
    if (p) {
      setProductForm(p);
      setSpecsText(JSON.stringify(p.specs || {}, null, 2));
      setImagesText((p.images || []).join("\n"));
    } else {
      setProductForm({ ...emptyProduct });
      setSpecsText("{}");
      setImagesText("");
    }
  };

  const saveProduct = async () => {
    if (!productForm?.name || !productForm?.sku) {
      toast({ title: "Error", description: "Nombre y SKU son obligatorios", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let specs = {};
      try { specs = JSON.parse(specsText); } catch { specs = {}; }
      const slug = productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
      const images = imagesText.split("\n").map(s => s.trim()).filter(Boolean);
      const toSave = { ...productForm, slug, specs, images };
      await upsertProductDB(toSave);
      toast({ title: "Producto guardado" });
      setProductForm(null);
      loadData();
    } catch (err) {
      toast({ title: "Error al guardar", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    let updated = 0, created = 0, errors: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      const row: any = {};
      headers.forEach((h, j) => { row[h] = vals[j] || ""; });
      if (!row.name || !row.sku) { errors.push(`Fila ${i + 1}: falta name o sku`); continue; }
      try {
        const slug = row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
        const images = row.images ? row.images.split("|").map((s: string) => s.trim()).filter(Boolean) : [];
        const catRow = categories.find(c => c.slug === row.category || c.name.toLowerCase() === (row.category || "").toLowerCase());
        const brandRow = brands.find(b => b.slug === row.brand || b.name.toLowerCase() === (row.brand || "").toLowerCase());
        const result = await upsertProductDB({
          slug, name: row.name, sku: row.sku,
          shortDesc: row.short_description || "",
          description: row.description || "",
          images,
          categoryId: catRow?.id || "",
          brandId: brandRow?.id || "",
          specs: {},
          active: true, featured: false,
          saleAvailable: row.sale_available !== "false",
          rentalAvailable: row.rental_available === "true",
          rentalMinMonths: parseInt(row.rental_min_months) || 3,
          compatibleProducts: [],
        });
        if (result.updated) updated++; else created++;
      } catch (err) { errors.push(`Fila ${i + 1}: error al procesar`); }
    }
    setCsvResult({ updated, created, errors });
    loadData();
    if (fileRef.current) fileRef.current.value = "";
  };

  const loadCustomerQuotes = async (email: string) => {
    const { data } = await supabase.from("quotes").select("*").eq("customer_email", email).order("created_at", { ascending: false });
    setCustomerQuotes(data ?? []);
  };

  const filteredQuotes = quoteFilter === "all" ? quotes : quotes.filter(q => q.status === quoteFilter);
  const filteredCustomers = customerSearch ? customers.filter(c => c.name?.toLowerCase().includes(customerSearch.toLowerCase()) || c.email?.toLowerCase().includes(customerSearch.toLowerCase())) : customers;

  return (
    <>
      <Helmet><title>Admin | Partes Para Servidores</title></Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="sheets">Generador Fichas</TabsTrigger>
            <TabsTrigger value="import">Importación</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          {/* TAB 1: QUOTES */}
          <TabsContent value="quotes">
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "pending", "contacted", "quoted", "closed"].map(s => (
                <button key={s} onClick={() => setQuoteFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${quoteFilter === s ? "bg-red text-white" : "bg-muted"}`}>
                  {s === "all" ? "Todas" : statusLabels[s]}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-2">Ref</th><th className="py-2">Cliente</th><th className="py-2 hidden md:table-cell">Empresa</th>
                  <th className="py-2 hidden md:table-cell">Email</th><th className="py-2 hidden md:table-cell">Tel</th>
                  <th className="py-2">Items</th><th className="py-2">Estado</th><th className="py-2 hidden md:table-cell">Fecha</th><th className="py-2">Acciones</th>
                </tr></thead>
                <tbody>
                  {filteredQuotes.map((q) => (
                    <>
                      <tr key={q.id} className="border-b cursor-pointer hover:bg-muted/50" onClick={() => setExpandedQuote(expandedQuote === q.id ? null : q.id)}>
                        <td className="py-2 font-mono text-xs">{q.reference}</td>
                        <td className="py-2">{q.customer_name}</td>
                        <td className="py-2 hidden md:table-cell">{q.customer_company || "-"}</td>
                        <td className="py-2 hidden md:table-cell">{q.customer_email}</td>
                        <td className="py-2 hidden md:table-cell">{q.customer_phone}</td>
                        <td className="py-2">{Array.isArray(q.items) ? q.items.length : 0}</td>
                        <td className="py-2">
                          <select value={q.status} onClick={e => e.stopPropagation()} onChange={(e) => updateQuoteStatus(q.id, e.target.value)} className={`rounded px-2 py-1 text-xs font-medium ${statusColors[q.status] || ""}`}>
                            <option value="pending">Pendiente</option>
                            <option value="contacted">Contactado</option>
                            <option value="quoted">Cotizado</option>
                            <option value="closed">Cerrado</option>
                          </select>
                        </td>
                        <td className="py-2 hidden md:table-cell text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString()}</td>
                        <td className="py-2" onClick={e => e.stopPropagation()}>
                          <a href={whatsappUrl(`Hola ${q.customer_name}, respecto a su cotización ${q.reference}...`)} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" />WA</Button>
                          </a>
                        </td>
                      </tr>
                      {expandedQuote === q.id && (
                        <tr key={`${q.id}-detail`}><td colSpan={9} className="p-4 bg-muted/30">
                          <div className="text-xs space-y-1">
                            {Array.isArray(q.items) && q.items.map((item: any, i: number) => (
                              <div key={i}>• {item.name} — SKU: {item.sku}</div>
                            ))}
                            {q.notes && <div className="mt-2 text-muted-foreground">Notas: {q.notes}</div>}
                          </div>
                        </td></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 2: PRODUCTS */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">{products.length} productos</span>
              <Button onClick={() => openProductForm()} className="bg-red hover:bg-red-light text-white"><Plus className="w-4 h-4 mr-1" /> Nuevo producto</Button>
            </div>

            {/* Product Form Dialog */}
            {productForm && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 overflow-y-auto">
                <div className="bg-card rounded-xl p-6 w-full max-w-2xl m-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{productForm.id ? "Editar" : "Nuevo"} producto</h3>
                    <button onClick={() => setProductForm(null)}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    <Input placeholder="Nombre *" value={productForm.name} onChange={e => setProductForm((f: any) => ({ ...f, name: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="SKU *" value={productForm.sku} onChange={e => setProductForm((f: any) => ({ ...f, sku: e.target.value }))} />
                      <Input placeholder="Slug (auto)" value={productForm.slug} onChange={e => setProductForm((f: any) => ({ ...f, slug: e.target.value }))} />
                    </div>
                    <Input placeholder="Descripción corta" value={productForm.shortDesc} onChange={e => setProductForm((f: any) => ({ ...f, shortDesc: e.target.value }))} />
                    <Textarea placeholder="Descripción larga" value={productForm.description} onChange={e => setProductForm((f: any) => ({ ...f, description: e.target.value }))} />
                    <Textarea placeholder="Imágenes (una URL por línea)" value={imagesText} onChange={e => setImagesText(e.target.value)} rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                      <select value={productForm.categoryId} onChange={e => setProductForm((f: any) => ({ ...f, categoryId: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm bg-background">
                        <option value="">Categoría</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select value={productForm.brandId} onChange={e => setProductForm((f: any) => ({ ...f, brandId: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm bg-background">
                        <option value="">Marca</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <Textarea placeholder='Especificaciones (JSON)' value={specsText} onChange={e => setSpecsText(e.target.value)} rows={5} className="font-mono text-xs" />
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm"><Switch checked={productForm.saleAvailable} onCheckedChange={v => setProductForm((f: any) => ({ ...f, saleAvailable: v }))} />Venta</label>
                      <label className="flex items-center gap-2 text-sm"><Switch checked={productForm.rentalAvailable} onCheckedChange={v => setProductForm((f: any) => ({ ...f, rentalAvailable: v }))} />Arriendo</label>
                      <label className="flex items-center gap-2 text-sm"><Switch checked={productForm.featured} onCheckedChange={v => setProductForm((f: any) => ({ ...f, featured: v }))} />Destacado</label>
                      <label className="flex items-center gap-2 text-sm"><Switch checked={productForm.active} onCheckedChange={v => setProductForm((f: any) => ({ ...f, active: v }))} />Activo</label>
                    </div>
                    {productForm.rentalAvailable && (
                      <Input type="number" placeholder="Meses mínimo arriendo" value={productForm.rentalMinMonths} onChange={e => setProductForm((f: any) => ({ ...f, rentalMinMonths: parseInt(e.target.value) || 3 }))} />
                    )}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Productos compatibles</label>
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                        {products.filter(p => p.id !== productForm.id).map(p => (
                          <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="checkbox" checked={(productForm.compatibleProducts || []).includes(p.id)} onChange={() => {
                              const cp = productForm.compatibleProducts || [];
                              setProductForm((f: any) => ({ ...f, compatibleProducts: cp.includes(p.id) ? cp.filter((id: string) => id !== p.id) : [...cp, p.id] }));
                            }} className="accent-red" />
                            {p.name} ({p.sku})
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={saveProduct} disabled={saving} className="flex-1 bg-red hover:bg-red-light text-white">{saving ? "Guardando..." : "Guardar"}</Button>
                    <Button variant="outline" onClick={() => setProductForm(null)}>Cancelar</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-2 w-12">Img</th><th className="py-2">Nombre</th><th className="py-2">SKU</th>
                  <th className="py-2 hidden md:table-cell">Categoría</th><th className="py-2">Venta</th><th className="py-2">Arriendo</th>
                  <th className="py-2">Activo</th><th className="py-2">Acciones</th>
                </tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2"><img src={p.images?.[0] || "/placeholder.svg"} className="w-10 h-10 rounded object-cover" /></td>
                      <td className="py-2 font-medium">{p.name}</td>
                      <td className="py-2 font-mono text-xs">{p.sku}</td>
                      <td className="py-2 hidden md:table-cell text-xs">{categories.find(c => c.id === p.categoryId)?.name || "-"}</td>
                      <td className="py-2">{p.saleAvailable ? "✅" : "—"}</td>
                      <td className="py-2">{p.rentalAvailable ? "✅" : "—"}</td>
                      <td className="py-2">
                        <Switch checked={p.active} onCheckedChange={() => toggleActive(p.id, p.active)} />
                      </td>
                      <td className="py-2 flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => openProductForm(p)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3 h-3" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 3: SHEET GENERATOR */}
          <TabsContent value="sheets">
            <div className="max-w-xl mx-auto text-center py-12 space-y-4">
              <FileText className="w-16 h-16 text-red mx-auto" />
              <h3 className="text-xl font-bold">Generador de fichas técnicas</h3>
              <p className="text-muted-foreground text-sm">Genera fichas técnicas con IA usando la función Edge <code className="bg-muted px-1 rounded">generate-product-sheet</code>.</p>
              <p className="text-sm text-muted-foreground">Esta funcionalidad requiere configurar una Edge Function en Lovable Cloud.</p>
              <Button className="bg-red hover:bg-red-light text-white" onClick={() => setTab("products")}>
                Ir a gestión de productos
              </Button>
            </div>
          </TabsContent>

          {/* TAB 4: CSV IMPORT */}
          <TabsContent value="import">
            <div className="max-w-xl mx-auto py-8">
              <h3 className="text-xl font-bold mb-4">Importación masiva de productos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sube un CSV con columnas: <code className="bg-muted px-1 rounded text-xs">name, sku, short_description, description, category, brand, sale_available, rental_available, rental_min_months, images</code>
              </p>
              <p className="text-xs text-muted-foreground mb-6">Imágenes: separa URLs con <code>|</code>. Si un SKU ya existe se actualiza, si no se crea nuevo.</p>
              <div className="border-2 border-dashed rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <input ref={fileRef} type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Seleccionar CSV</Button>
              </div>
              {csvResult && (
                <div className="mt-6 bg-muted rounded-xl p-4 space-y-2">
                  <p className="font-medium">Resultado de importación:</p>
                  <p className="text-sm text-green-600">✅ {csvResult.created} productos nuevos</p>
                  <p className="text-sm text-blue-600">🔄 {csvResult.updated} productos actualizados</p>
                  {csvResult.errors.length > 0 && (
                    <div>
                      <p className="text-sm text-destructive">❌ {csvResult.errors.length} errores:</p>
                      {csvResult.errors.map((err: string, i: number) => <p key={i} className="text-xs text-destructive">{err}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 5: CUSTOMERS */}
          <TabsContent value="customers">
            <div className="mb-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre o email..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-2">Nombre</th><th className="py-2">Email</th>
                  <th className="py-2 hidden md:table-cell">Teléfono</th><th className="py-2 hidden md:table-cell">Empresa</th>
                  <th className="py-2 hidden md:table-cell">Fecha</th>
                </tr></thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <>
                      <tr key={c.id} className="border-b cursor-pointer hover:bg-muted/50" onClick={() => { setExpandedCustomer(expandedCustomer === c.id ? null : c.id); if (expandedCustomer !== c.id) loadCustomerQuotes(c.email); }}>
                        <td className="py-2">{c.name}</td><td className="py-2">{c.email}</td>
                        <td className="py-2 hidden md:table-cell">{c.phone}</td><td className="py-2 hidden md:table-cell">{c.company || "-"}</td>
                        <td className="py-2 hidden md:table-cell text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                      {expandedCustomer === c.id && (
                        <tr key={`${c.id}-quotes`}><td colSpan={5} className="p-4 bg-muted/30">
                          <p className="text-xs font-medium mb-2">Cotizaciones de {c.name}:</p>
                          {customerQuotes.length === 0 ? <p className="text-xs text-muted-foreground">Sin cotizaciones</p> : customerQuotes.map(q => (
                            <div key={q.id} className="text-xs mb-1">
                              <span className="font-mono">{q.reference}</span> — <Badge className={`text-[10px] ${statusColors[q.status] || ""}`}>{statusLabels[q.status] || q.status}</Badge> — {new Date(q.created_at).toLocaleDateString()}
                            </div>
                          ))}
                        </td></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
