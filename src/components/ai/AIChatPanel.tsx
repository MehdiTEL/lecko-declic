import { useState, useRef, useEffect } from "react";
import { useAI } from "@/hooks/useAI";
import AIChatBubble from "./AIChatBubble";
import { X, Send, Bot, Trash2 } from "lucide-react";

interface AIChatPanelProps {
  open: boolean;
  onClose: () => void;
  context?: string;
}

export default function AIChatPanel({ open, onClose, context }: AIChatPanelProps) {
  const { messages, loading, remaining, error, sendMessage, clearMessages } = useAI(context);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#13131D] border-l border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-violet-400" />
            <span className="text-white font-semibold text-sm">Assistant IA</span>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="p-1.5 text-[#55556A] hover:text-white transition-colors"
                title="Effacer la conversation"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#55556A] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot size={32} className="mx-auto text-[#55556A] mb-3" />
              <p className="text-sm text-[#8A8AA3]">
                Posez vos questions sur la formation en cours.
              </p>
              <p className="text-xs text-[#55556A] mt-1">
                L'assistant vous aide à comprendre et appliquer les concepts.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <AIChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-violet-400" />
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          {remaining !== null && (
            <p className="text-xs text-[#55556A] mb-2 text-center">
              {remaining} message{remaining !== 1 ? "s" : ""} restant{remaining !== 1 ? "s" : ""} aujourd'hui
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#55556A] focus:outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
