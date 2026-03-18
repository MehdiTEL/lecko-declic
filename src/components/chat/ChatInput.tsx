import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-border bg-card">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        rows={1}
        placeholder="Posez votre question…"
        className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 min-h-[38px] max-h-[120px] overflow-y-auto"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <Send size={15} />
      </button>
    </div>
  );
}
