import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyAccountPage() {
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuote(null);
    const { data } = await supabase.from("quotes")
      .select("*")
      .eq("customer_email", email)
      .eq("reference", ref)
      .maybeSingle();
    if (data) setQuote(data);
    else setError("No se encontró la cotización. Verifica los datos.");
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Mi Cuenta | Partes Para Servidores</title></Helmet>
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Mi cuenta</h1>
        <p className="text-muted-foreground mb-6">Consulta el estado de tu cotización.</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <Input required type="email" placeholder="Tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input required placeholder="Referencia (QT-...)" value={ref} onChange={(e) => setRef(e.target.value)} />
          <Button type="submit" disabled={loading} className="w-full bg-red text-accent-foreground hover:bg-red-light">
            {loading ? "Buscando..." : "Consultar cotización"}
          </Button>
        </form>
        {error && <p className="mt-4 text-destructive text-sm">{error}</p>}
        {quote && (
          <div className="mt-6 bg-card border rounded-xl p-6 space-y-3">
            <p><strong>Referencia:</strong> {quote.reference}</p>
            <p><strong>Estado:</strong> {quote.status}</p>
            <p><strong>Fecha:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
            <div>
              <strong>Productos:</strong>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                {(quote.items as any[]).map((item: any, i: number) => (
                  <li key={i}>{item.name} — SKU: {item.sku}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
