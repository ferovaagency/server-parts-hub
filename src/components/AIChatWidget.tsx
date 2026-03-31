import { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";
type Message = { role: "user" | "assistant"; content: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choice" | "chat" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startAI = () => {
    setMode("chat");
    setMessages([{ role: "assistant", content: "¡Hola! Soy el asistente de Partes Para Servidores 🖥️\n\nPuedo ayudarte a encontrar partes para servidores HP, Dell, IBM, Lenovo, Cisco, APC, Eaton y más.\n\n¿En qué puedo ayudarte?" }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: generateLocalResponse(userMsg.content) }]);
      setLoading(false);
    }, 900);
  };

  const sendSummary = () => {
    const summary = messages.map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`).join("\n\n");
    window.open(whatsappUrl(`Resumen de conversación:\n\n${summary}`), "_blank");
  };

  return (
    <>
      {!open && (
        <button onClick={() => { setOpen(true); setMode("choice"); }}
          className="fixed bottom-6 right-24 z-50 w-12 h-12 bg-dark hover:bg-dark-light border-2 border-red text-white rounded-full shadow-elevated flex items-center justify-center transition-all hover:scale-110">
          <Bot className="w-5 h-5" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-h-[520px] bg-card border rounded-2xl shadow-elevated flex flex-col overflow-hidden">
          <div className="bg-dark p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Asistente PPS</p>
                <p className="text-white/50 text-xs">Partes Para Servidores</p>
              </div>
            </div>
            <button onClick={() => { setOpen(false); setMode(null); }} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          {mode === "choice" && (
            <div className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-red" />
              </div>
              <div>
                <p className="font-bold text-foreground">¡Hola! Soy el asistente de Partes Para Servidores</p>
                <p className="text-sm text-muted-foreground mt-1">¿Cómo prefieres que te ayudemos hoy?</p>
              </div>
              <button onClick={startAI} className="w-full bg-red hover:bg-red-light text-white py-3 rounded-xl font-semibold text-sm transition-colors">🤖 Asesorarme con IA</button>
              <button onClick={() => window.open(whatsappUrl("Hola, quisiera hablar con un asesor."), "_blank")}
                className="w-full bg-dark hover:bg-dark-light text-white py-3 rounded-xl font-semibold text-sm transition-colors">👤 Hablar con una persona</button>
            </div>
          )}

          {mode === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <p className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${m.role === "user" ? "bg-red text-white" : "bg-muted text-foreground"}`}>{m.content}</p>
                  </div>
                ))}
                {loading && <p className="bg-muted rounded-xl px-3 py-2 text-sm animate-pulse w-fit">Escribiendo...</p>}
                <div ref={endRef} />
              </div>
              <div className="border-t p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Escribe tu consulta..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red/30" />
                  <button onClick={sendMessage} disabled={loading} className="bg-red hover:bg-red-light text-white p-2 rounded-lg transition-colors"><Send className="w-4 h-4" /></button>
                </div>
                <button onClick={sendSummary} className="w-full text-xs text-muted-foreground hover:text-red transition-colors">Enviar resumen al asesor humano →</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function generateLocalResponse(input: string): string {
  const l = input.toLowerCase();
  if (l.includes("servidor") || l.includes("server")) return "Trabajamos con HP ProLiant, Dell PowerEdge, IBM System x y Lenovo ThinkSystem.\n\nEstamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.\n\n¿Necesitas un modelo específico?";
  if (l.includes("disco") || l.includes("ssd") || l.includes("hdd")) return "Manejamos discos SAS, SATA y SSD NVMe. Opciones de 480GB hasta 18TB.\n\nEstamos consultando disponibilidad en Colombia 🇨🇴 y Miami 🇺🇸.";
  if (l.includes("ram") || l.includes("memoria")) return "Módulos DDR4 y DDR5 ECC para servidores, de 8GB a 128GB.\n\n¿Qué modelo de servidor tienes?";
  if (l.includes("ups") || l.includes("energía") || l.includes("energia")) return "UPS de APC y Eaton. Desde rack hasta soluciones modulares.\n\nEstamos consultando disponibilidad en Colombia 🇨🇴 y Miami 🇺🇸.";
  if (l.includes("precio") || l.includes("costo") || l.includes("valor")) return "Los precios dependen de disponibilidad. Un asesor puede darte cotización personalizada.\n\n¿Te conecto con un asesor?";
  if (l.includes("cisco") || l.includes("switch") || l.includes("router")) return "Switches y routers Cisco, Juniper y HP. Nuevos y remanufacturados.\n\nEstamos consultando disponibilidad en Colombia 🇨🇴 y Miami 🇺🇸.";
  return "Estamos consultando disponibilidad en nuestras bodegas en Colombia 🇨🇴 y Miami 🇺🇸.\n\n¿Puedes darme más detalles? (marca, modelo, tipo de parte)";
}
