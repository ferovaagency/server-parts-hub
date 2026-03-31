import { Helmet } from "react-helmet-async";
import { useQuoteStore } from "@/stores/quoteStore";
import { supabase } from "@/lib/supabase";
import { whatsappUrl, generateQuoteRef } from "@/lib/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";

export default function QuotePage() {
  const { items, removeItem, clearItems } = useQuoteStore();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setSaving(true);
    const ref = generateQuoteRef();
    await supabase.from("quotes").insert({
      reference: ref,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_company: form.company,
      items: items.map((i) => ({ name: i.name, sku: i.sku })),
      notes: form.notes,
    });

    const itemsList = items.map((i) => `• ${i.name} — SKU: ${i.sku}`).join("\n");
    const msg = `Hola, soy ${form.name} de ${form.company || "N/A"}.\nSolicito cotización para:\n${itemsList}\nReferencia: ${ref}\nEmail: ${form.email} | Tel: ${form.phone}\nNotas: ${form.notes || "Ninguna"}`;
    window.open(whatsappUrl(msg), "_blank");
    setSubmitted(ref);
    clearItems();
    setSaving(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-accent mx-auto" />
        <h1 className="text-3xl font-bold">¡Cotización enviada!</h1>
        <p className="text-lg text-muted-foreground">Tu referencia:</p>
        <p className="text-4xl font-black text-accent">{submitted}</p>
        <p className="text-muted-foreground">Un asesor te contactará pronto.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cotización | Partes Para Servidores</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Solicitar cotización</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">No tienes productos en tu cotización.</p>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-card border rounded-lg p-3">
                  {item.image && <img src={item.image} alt="" className="w-12 h-12 object-contain rounded" />}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input required placeholder="Nombre completo *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Empresa" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              <Input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <Input required placeholder="Teléfono *" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <Textarea placeholder="Notas adicionales" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
              <Button type="submit" disabled={saving} className="w-full bg-accent text-accent-foreground hover:bg-orange-light text-lg py-3">
                {saving ? "Enviando..." : "Enviar cotización por WhatsApp"}
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
