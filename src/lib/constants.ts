export const WHATSAPP_NUMBER = "573168788749";
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
export const COMPANY_EMAIL = "mcalder@cableado-estructuraco.com.co";
export const COMPANY_NAME = "Partes Para Servidores";
export const COMPANY_SLOGAN = "Tu fuente confiable de partes para servidores, redes y UPS";
export const DOMAIN = "partesparaservidores.com.co";

export function whatsappUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export function consultarPrecioUrl(name: string, sku: string) {
  return whatsappUrl(
    `Hola, estoy interesado en ${name} (SKU: ${sku}).\n¿Pueden indicarme disponibilidad y precio?`
  );
}

export function generateQuoteRef() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${date}-${rand}`;
}
