import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, ClipboardList, Sparkles } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSuggestions } from "./ChatSuggestions";
import { generateSuggestions, getPageSuggestions } from "@/lib/coachPrompt";
import { getApiKey } from "@/lib/aiProvider";
import { usePageContext } from "@/context/PageContext";
import { useProgress } from "@/context/ProgressContext";
import { Link } from "react-router-dom";

const INITIAL_SUGGESTIONS_TASK = [
  "Guide-moi pas à pas",
  "Montre le workflow complet",
  "Donne le JSON importable",
  "Quels outils installer ?",
];

export function ChatPanel() {
  const { isOpen, closeChat, messages, isStreaming, taskContext, resetChat } = useChatContext();
  const { currentPage, analysisResult, metier: pageMetier } = usePageContext();
  const { recordUserAction } = useProgress();
  const { initChat, sendMessage, handleRecap } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>(
    taskContext ? INITIAL_SUGGESTIONS_TASK : getPageSuggestions(currentPage, !!analysisResult)
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasApiKey = !!getApiKey();

  useEffect(() => {
    if (isOpen) {
      initChat();
      recordUserAction("hasUsedCopilot");
    }
  }, [isOpen]); // eslint-disable-line

  useEffect(() => {
    if (isAtBottom) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAtBottom]);

  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.isStreaming);
    if (lastAssistant && lastAssistant.content.length > 20) {
      setSuggestions(generateSuggestions(lastAssistant.content));
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    resetChat();
    setSuggestions(getPageSuggestions(currentPage, !!analysisResult));
    setTimeout(() => initChat(), 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/35"
        onClick={closeChat}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col border-l border-border shadow-elevated animate-slide-in-right bg-white dark:bg-card"
        style={{ width: "min(450px, 100vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-primary shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={18} strokeWidth={1.5} className="text-white" />
            <div>
              <p className="text-sm font-semibold text-white">Consultant Augmenté</p>
              <p className="text-xs text-white/70 mt-0.5">by Lecko</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRecap}
              disabled={isStreaming || messages.filter((m) => m.role !== "system").length < 2}
              title="Récapituler"
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ClipboardList size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Nouveau sujet"
              disabled={isStreaming}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <RotateCcw size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={closeChat}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Context banners */}
        {taskContext ? (
          <div className="px-5 py-2.5 border-b border-border shrink-0"
            style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
            <p className="text-xs text-primary font-medium truncate">
              Tâche : {taskContext.task.nom}
            </p>
          </div>
        ) : analysisResult && (currentPage === "results" || currentPage === "equipe_results") ? (
          <div className="px-5 py-2.5 border-b border-border shrink-0"
            style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
            <p className="text-xs text-primary font-medium truncate">
              Diagnostic : {pageMetier} · {analysisResult.score_global}%
            </p>
          </div>
        ) : currentPage === "methode" ? (
          <div className="px-5 py-2.5 border-b border-border shrink-0"
            style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
            <p className="text-xs text-primary font-medium truncate">
              Méthode DÉCLIC
            </p>
          </div>
        ) : null}

        {/* No API key banner */}
        {!hasApiKey && (
          <div className="px-5 py-2.5 border-b shrink-0 callout-orange">
            Mode aperçu — guides génériques uniquement.{" "}
            <Link to="/parametres" onClick={closeChat} className="underline font-semibold">
              Configurer ma clé API
            </Link>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {messages.filter((m) => m.role !== "system").map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom */}
        {!isAtBottom && (
          <button
            onClick={() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); setIsAtBottom(true); }}
            className="absolute bottom-28 right-4 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full shadow-elevated hover:bg-primary/90 transition-all animate-fade-in"
          >
            Nouveau message
          </button>
        )}

        <ChatSuggestions suggestions={suggestions} onSelect={(t) => sendMessage(t)} disabled={isStreaming} />
        <ChatInput onSend={(t) => sendMessage(t)} disabled={isStreaming} />
      </div>

      {/* Reset confirm */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated max-w-sm w-full animate-fade-in">
            <h3 className="font-semibold text-foreground mb-2">Nouveau sujet ?</h3>
            <p className="text-sm text-foreground-secondary mb-5">
              L'historique de cette conversation sera perdu. Voulez-vous continuer ?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors text-foreground-secondary"
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
