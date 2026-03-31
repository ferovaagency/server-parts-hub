import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choice" | "chat" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleOpen = () => { setOpen(true); setMode("choice"); };

  const startAI = () => {
    setMode("chat");
    setMessages([{ role: "assistant", content: "¡Hola! Soy el asistente virtual de Partes Para Servidores. 🖥️\n\nPuedo ayudarte a encontrar partes compatibles para servidores HP, Dell, IBM, Lenovo, Cisco, Juniper, APC, Eaton y más.\n\n¿En qué puedo ayudarte hoy?" }]);
  };

  const startHuman = () => {
    window.open(whatsappUrl("Hola, quisiera hablar con un asesor de Partes Para Servidores."), "_blank");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    // Simulated AI response (replace with edge function when Lovable Cloud is enabled)
    setTimeout(() => {
      const response = generateLocalResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1000);
  };

  const sendSummary = () => {
    const summary = messages.map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`).join("\n\n");
    window.open(whatsappUrl(`Resumen de conversación con asistente IA:\n\n${summary}`), "_blank");
  };

  return (
    <>
      {/* Toggle button - positioned above WhatsApp */}
      {!open && (
        <button onClick={handleOpen} className="fixed bottom-6 right-20 z-50 bg-primary text-primary-foreground p-3.5 rounded-full shadow-elevated hover:bg-navy-light transition-colors" aria-label="Abrir chat">
          <Bot className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-[360px] max-h-[500px] bg-card border rounded-2xl shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-hero text-primary-foreground p-4 flex items-center justify-between">
              <span className="font-bold text-sm">Asistente PPS</span>
              <button onClick={() => { setOpen(false); setMode(null); }} className="text-primary-foreground/70 hover:text-primary-foreground"><X className="w-4 h-4" /></button>
            </div>

            {mode === "choice" && (
              <div className="p-6 space-y-4 text-center">
                <p className="font-bold">¡Hola! Soy el asistente de Partes Para Servidores 🖥️</p>
                <p className="text-sm text-muted-foreground">¿Cómo prefieres que te ayudemos hoy?</p>
                <button onClick={startAI} className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:bg-orange-light transition-colors">🤖 Asesorarme con IA</button>
                <button onClick={startHuman} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-navy-light transition-colors">👤 Hablar con una persona</button>
              </div>
            )}

            {mode === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && <div className="flex justify-start"><div className="bg-muted rounded-xl px-3 py-2 text-sm animate-pulse">Escribiendo...</div></div>}
                  <div ref={endRef} />
                </div>

                <div className="border-t p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Escribe tu consulta..."
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button onClick={sendMessage} disabled={loading} className="bg-accent text-accent-foreground p-2 rounded-lg hover:bg-orange-light transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={sendSummary} className="w-full text-xs text-muted-foreground hover:text-accent transition-colors">
                    Enviar resumen al asesor →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function generateLocalResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("servidor") || lower.includes("server")) {
    return "Trabajamos con servidores HP ProLiant, Dell PowerEdge, IBM System x y Lenovo ThinkSystem. Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.\n\n¿Necesitas un modelo específico o quieres que te recomiende opciones?";
  }
  if (lower.includes("disco") || lower.includes("ssd") || lower.includes("hdd")) {
    return "Manejamos discos SAS, SATA y SSD NVMe para todas las marcas. Tenemos opciones desde 480GB SSD hasta 18TB HDD.\n\nEstamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.";
  }
  if (lower.includes("ram") || lower.includes("memoria")) {
    return "Contamos con módulos DDR4 y DDR5 ECC para servidores. Capacidades de 8GB a 128GB por módulo.\n\nEstamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸. ¿Qué modelo de servidor tienes?";
  }
  if (lower.includes("ups") || lower.includes("energía") || lower.includes("energia")) {
    return "Trabajamos con UPS de APC y Eaton. Desde UPS de rack hasta soluciones modulares de alta capacidad.\n\nEstamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.";
  }
  if (lower.includes("precio") || lower.includes("costo") || lower.includes("valor")) {
    return "Los precios dependen de la disponibilidad y condiciones de mercado. Un asesor puede darte una cotización personalizada.\n\n¿Te gustaría que envíe tu consulta a un asesor humano?";
  }
  return "Gracias por tu consulta. Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.\n\n¿Puedes darme más detalles sobre lo que necesitas? (marca, modelo, tipo de parte)";
}
