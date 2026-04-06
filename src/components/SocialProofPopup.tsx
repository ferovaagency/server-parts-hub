import { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const cities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena", "Miami", "Ciudad de México", "Lima", "Santiago"];
const names = ["Carlos M.", "Ana G.", "Luis R.", "María P.", "Juan D.", "Sofía L.", "Andrés T.", "Camila V.", "Diego F.", "Valentina S."];

export default function SocialProofPopup() {
  const { products } = useProducts();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ name: "", city: "", product: "", mins: 0 });

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      const p = products[Math.floor(Math.random() * products.length)];
      const c = cities[Math.floor(Math.random() * cities.length)];
      const n = names[Math.floor(Math.random() * names.length)];
      const mins = Math.floor(Math.random() * 12) + 1;
      setData({ name: n, city: c, product: p.name, mins });
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }, 18000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 z-40 bg-card rounded-xl p-4 shadow-elevated max-w-xs border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-muted-foreground">{data.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">{data.name} en {data.city}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">acaba de consultar <span className="font-medium text-foreground">{data.product}</span></p>
              <p className="text-[10px] text-muted-foreground mt-1">hace {data.mins} {data.mins === 1 ? "minuto" : "minutos"}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
