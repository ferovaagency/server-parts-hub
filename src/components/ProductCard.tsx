import { Link } from "react-router-dom";
import { consultarPrecioUrl } from "@/lib/constants";
import { useQuoteStore } from "@/stores/quoteStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  product: any;
  showQuoteBtn?: boolean;
}

export default function ProductCard({ product, showQuoteBtn = true }: Props) {
  const addItem = useQuoteStore((s) => s.addItem);
  const img = product.images?.[0] || "/placeholder.svg";

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-elevated transition-shadow group">
      <Link to={`/producto/${product.slug}`}>
        <div className="aspect-square bg-muted overflow-hidden">
          <img src={img} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-tight hover:text-red transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={consultarPrecioUrl(product.name, product.sku)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-red text-accent-foreground text-xs font-semibold py-2 rounded-lg hover:bg-red-light transition-colors"
          >
            Consultar disponibilidad y precio
          </a>
          {showQuoteBtn && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-red text-red hover:bg-red hover:text-white"
              onClick={() => addItem({ id: product.id, name: product.name, sku: product.sku, image: img })}
            >
              <Plus className="w-3 h-3 mr-1" /> Agregar a cotización
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
