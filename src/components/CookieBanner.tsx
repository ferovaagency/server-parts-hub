import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("pps_cookies")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t p-4 shadow-elevated">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra política de cookies.</p>
        <button
          onClick={() => { localStorage.setItem("pps_cookies", "true"); setShow(false); }}
          className="bg-red text-accent-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-light transition-colors whitespace-nowrap"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
