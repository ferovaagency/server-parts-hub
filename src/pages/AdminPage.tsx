import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchAllProducts, setProductActiveDB, deleteProductDB } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { whatsappUrl } from "@/lib/constants";
import { Trash2, ExternalLink } from "lucide-react";

export default function AdminPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tab, setTab] = useState("quotes");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [q, p, c] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      fetchAllProducts(),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
    ]);
    setQuotes(q.data ?? []);
    setProducts(p);
    setCustomers(c.data ?? []);
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    await supabase.from("quotes").update({ status }).eq("id", id);
    loadData();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await setProductActiveDB(id, !active);
    loadData();
  };

  const rentalProducts = products.filter((p) => p.rentalAvailable);

  return (
    <>
      <Helmet><title>Admin | Partes Para Servidores</title></Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="rentals">Arrendamientos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">Ref</th><th className="text-left py-2">Cliente</th><th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Estado</th><th className="text-left py-2">Acciones</th>
                </tr></thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b">
                      <td className="py-2 font-mono text-xs">{q.reference}</td>
                      <td className="py-2">{q.customer_name}</td>
                      <td className="py-2">{q.customer_email}</td>
                      <td className="py-2">
                        <select value={q.status} onChange={(e) => updateQuoteStatus(q.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                          <option value="pending">Pendiente</option>
                          <option value="contacted">Contactado</option>
                          <option value="quoted">Cotizado</option>
                          <option value="closed">Cerrado</option>
                        </select>
                      </td>
                      <td className="py-2">
                        <a href={whatsappUrl(`Hola ${q.customer_name}, respecto a su cotización ${q.reference}...`)} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline"><ExternalLink className="w-3 h-3 mr-1" /> WhatsApp</Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">Nombre</th><th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Activo</th><th className="text-left py-2">Acciones</th>
                </tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2 font-mono text-xs">{p.sku}</td>
                      <td className="py-2">
                        <Button size="sm" variant={p.active ? "default" : "outline"} onClick={() => toggleActive(p.id, p.active)}>
                          {p.active ? "Activo" : "Inactivo"}
                        </Button>
                      </td>
                      <td className="py-2">
                        <Button size="sm" variant="destructive" onClick={() => { deleteProductDB(p.id); loadData(); }}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="rentals">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">Nombre</th><th className="text-left py-2">SKU</th><th className="text-left py-2">Mín. meses</th>
                </tr></thead>
                <tbody>
                  {rentalProducts.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2 font-mono text-xs">{p.sku}</td>
                      <td className="py-2">{p.rentalMinMonths}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">Nombre</th><th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Teléfono</th><th className="text-left py-2">Empresa</th>
                </tr></thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2">{c.name}</td><td className="py-2">{c.email}</td>
                      <td className="py-2">{c.phone}</td><td className="py-2">{c.company}</td>
                    </tr>
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
