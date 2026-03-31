import { whatsappUrl } from "@/lib/constants";
import { MessageCircle } from "lucide-react";
export default function WhatsAppButton() {
  return (
    <a href={whatsappUrl("Hola, quisiera información sobre Partes Para Servidores.")}
      target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20c25e] text-white rounded-full shadow-elevated flex items-center justify-center transition-all duration-300 hover:scale-110">
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
