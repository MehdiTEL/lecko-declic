import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ChatMessage as ChatMessageType } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "system") return null;

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-sm mt-0.5">
          <Sparkles size={14} strokeWidth={1.5} className="text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2.5 text-sm",
          isUser
            ? "bg-blue-50 dark:bg-blue-900/20 text-foreground rounded-br-sm"
            : "bg-white dark:bg-card border border-border/50 text-foreground rounded-bl-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1 prose-h2:text-base prose-h3:text-sm prose-h4:text-xs prose-code:text-xs">
            <ReactMarkdown
              components={{
                code({ children, className, ...rest }) {
                  const isBlock = className?.startsWith("language-");
                  const lang = className?.replace("language-", "") ?? "";
                  if (isBlock) {
                    return (
                      <CodeBlock code={String(children).replace(/\n$/, "")} language={lang} />
                    );
                  }
                  return (
                    <code
                      className="bg-muted-foreground/20 px-1 py-0.5 rounded text-[11px] font-mono"
                      {...rest}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-flex gap-0.5 ml-1 align-middle">
                <span className="w-1 h-1 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm mt-0.5">
          👤
        </div>
      )}
    </div>
  );
}
