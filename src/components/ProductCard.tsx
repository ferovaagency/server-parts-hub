import { Link } from "react-router-dom";
import { MessageCircle, Plus } from "lucide-react";
import { useQuoteStore } from "@/stores/quoteStore";
import { consultarPrecioUrl } from "@/lib/constants";

interface Props { product: any; showQuoteBtn?: boolean; }

export default function ProductCard({ product, showQuoteBtn = true }: Props) {
  const addItem = useQuoteStore((s) => s.addItem);
  const img = product.images?.[0] || "/placeholder.svg";
  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-elevated transition-all group">
      <Link to={`/producto/${product.slug}`}>
        <div className="aspect-square bg-muted overflow-hidden relative">
          <img src={img} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
          {product.rentalAvailable && (
            <span className="absolute top-2 left-2 bg-red text-white text-[10px] font-bold px-2 py-0.5 rounded">Arriendo</span>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-tight hover:text-red transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
        <div className="flex flex-col gap-2 pt-1">
          <a href={consultarPrecioUrl(product.name, product.sku)} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-red hover:bg-red-light text-white py-2 rounded-lg text-xs font-semibold transition-colors">
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
