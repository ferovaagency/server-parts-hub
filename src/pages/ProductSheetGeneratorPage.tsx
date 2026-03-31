import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductSheetGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-sheet", {
        body: {
          name: fd.get("name"),
          sku: fd.get("sku"),
          description: fd.get("description"),
          rentalAvailable: fd.get("rental") === "on",
        },
      });
      if (error) throw error;
      setResult(data?.url || "Ficha generada exitosamente");
    } catch (err: any) {
      setResult("Error: " + (err.message || "No se pudo generar la ficha"));
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Generador de Fichas | Admin</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Generador de fichas técnicas</h1>
        <form onSubmit={handleGenerate} className="space-y-4">
          <Input name="name" required placeholder="Nombre del producto" />
          <Input name="sku" placeholder="SKU" />
          <Input name="description" placeholder="Descripción" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="rental" className="rounded" />
            Disponible para arrendamiento
          </label>
          <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-orange-light">
            {loading ? "Generando..." : "Generar ficha técnica"}
          </Button>
        </form>
        {result && <p className="mt-4 p-4 bg-card border rounded-lg text-sm">{result}</p>}
      </div>
    </>
  );
}
