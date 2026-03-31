import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";

const cities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Miami", "Bucaramanga"];

export default function SocialProofPopup() {
  const { products } = useProducts();
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      const p = products[Math.floor(Math.random() * products.length)];
      const c = cities[Math.floor(Math.random() * cities.length)];
      setMsg(`Alguien en ${c} acaba de consultar ${p.name}`);
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    }, 15000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed bottom-24 left-4 z-40 bg-card rounded-lg p-4 shadow-elevated max-w-xs border"
        >
          <p className="text-sm text-foreground">{msg}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
