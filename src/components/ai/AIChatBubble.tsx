import { Bot, User } from "lucide-react";

interface AIChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatBubble({ role, content }: AIChatBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isAssistant
            ? "bg-violet-500/10 text-violet-400"
            : "bg-cyan-500/10 text-cyan-400"
        }`}
      >
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-white/[0.03] border border-white/[0.06] text-[#C8C8D8]"
            : "bg-violet-500/10 border border-violet-500/20 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
