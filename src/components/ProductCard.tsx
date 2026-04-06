import { Link } from "react-router-dom";
import { MessageCircle, Plus, Eye } from "lucide-react";
import { useQuoteStore } from "@/stores/quoteStore";
import { consultarPrecioUrl } from "@/lib/constants";
import { useMemo } from "react";

interface Props { product: any; showQuoteBtn?: boolean; }

export default function ProductCard({ product, showQuoteBtn = true }: Props) {
  const addItem = useQuoteStore((s) => s.addItem);
  const img = product.images?.[0] || "/placeholder.svg";
  const viewers = useMemo(() => Math.floor(Math.random() * 10) + 3, []);

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevated hover:border-red/30 transition-all duration-300">
      <Link to={`/producto/${product.slug}`} className="block relative overflow-hidden aspect-square bg-muted">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.rentalAvailable && (
            <span className="bg-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Arriendo</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 bg-dark/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" /> {viewers} viendo
          </span>
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <Link to={`/producto/${product.slug}`} className="block">
          <h3 className="font-bold text-sm leading-tight group-hover:text-red transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        {product.sku && <p className="text-[11px] text-muted-foreground font-mono">SKU: {product.sku}</p>}
        <div className="space-y-2">
          <a href={consultarPrecioUrl(product.name, product.sku)} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-red hover:bg-red-light text-white py-2.5 rounded-lg text-xs font-bold transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> Consultar disponibilidad y precio
          </a>
          {showQuoteBtn && (
            <button onClick={() => addItem({ id: product.id, name: product.name, sku: product.sku, image: img })}
              className="w-full flex items-center justify-center gap-2 border border-red text-red hover:bg-red hover:text-white py-2 rounded-lg text-xs font-semibold transition-colors">
              <Plus className="w-3.5 h-3.5" /> Agregar a cotización
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
