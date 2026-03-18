import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, ClipboardList, Settings } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSuggestions } from "./ChatSuggestions";
import { generateSuggestions, GENERAL_OPENING } from "@/lib/coachPrompt";
import { getApiKey } from "@/lib/aiProvider";
import { Link } from "react-router-dom";

const INITIAL_SUGGESTIONS_TASK = [
  "Guide-moi pas à pas",
  "Montre-moi le workflow N8N",
  "Donne le JSON à importer",
  "Quels outils installer ?",
];

const INITIAL_SUGGESTIONS_GENERAL = [
  "Automatiser mes emails",
  "Créer un workflow N8N",
  "Configurer un agent IA",
  "Qu'est-ce que Make ?",
];

export function ChatPanel() {
  const { isOpen, closeChat, messages, isStreaming, taskContext, resetChat } = useChatContext();
  const { initChat, sendMessage, handleRecap } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>(
    taskContext ? INITIAL_SUGGESTIONS_TASK : INITIAL_SUGGESTIONS_GENERAL
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasApiKey = !!getApiKey();

  // Init chat when opened
  useEffect(() => {
    if (isOpen) {
      initChat();
    }
  }, [isOpen]); // eslint-disable-line

  // Auto-scroll
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // Update suggestions after last assistant message
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.isStreaming);
    if (lastAssistant && lastAssistant.content.length > 20) {
      const newSuggestions = generateSuggestions(lastAssistant.content);
      setSuggestions(newSuggestions);
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
  };

  const handleSend = async (text: string) => {
    await sendMessage(text);
  };

  const handleSelectSuggestion = (text: string) => {
    sendMessage(text);
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    resetChat();
    setSuggestions(INITIAL_SUGGESTIONS_GENERAL);
    // Re-init after reset
    setTimeout(() => initChat(), 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={closeChat}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-card border-l border-border shadow-2xl animate-slide-in-right"
        style={{ width: "min(450px, 100vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-sm font-bold text-foreground">Coach Automatisation</p>
              <p className="text-[10px] text-foreground-muted">Lecko · Expert en automatisation</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRecap}
              disabled={isStreaming || messages.filter((m) => m.role !== "system").length < 2}
              title="Récapituler"
              className="p-1.5 rounded-lg hover:bg-muted text-foreground-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ClipboardList size={15} />
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Nouveau sujet"
              disabled={isStreaming}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={closeChat}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Task context banner */}
        {taskContext && (
          <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 shrink-0">
            <p className="text-xs text-primary font-medium truncate">
              📌 Tâche : {taskContext.task.nom}
            </p>
          </div>
        )}

        {/* No API key banner */}
        {!hasApiKey && (
          <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 shrink-0">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Mode aperçu — guides génériques uniquement.{" "}
              <Link
                to="/parametres"
                onClick={closeChat}
                className="underline font-semibold"
              >
                Configurer ma clé API →
              </Link>
            </p>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        >
          {messages.filter((m) => m.role !== "system").map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {!isAtBottom && (
          <button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setIsAtBottom(true);
            }}
            className="absolute bottom-28 right-4 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-all animate-fade-in"
          >
            ↓ Nouveau message
          </button>
        )}

        {/* Suggestions */}
        <ChatSuggestions
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
          disabled={isStreaming}
        />

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xl max-w-sm w-full animate-scale-in">
            <h3 className="font-bold text-foreground mb-2">🔄 Nouveau sujet ?</h3>
            <p className="text-sm text-foreground-secondary mb-4">
              L'historique de cette conversation sera perdu. Voulez-vous continuer ?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Recommencer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
