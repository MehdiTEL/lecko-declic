import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useAI(context?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef(
    `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const sendMessage = useCallback(
    async (userMessage: string) => {
      const newMessages: Message[] = [
        ...messages,
        { role: "user", content: userMessage },
      ];
      setMessages(newMessages);
      setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await supabase.functions.invoke("ai-chat", {
          body: {
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            sessionId: sessionIdRef.current,
            context,
          },
          headers: session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : undefined,
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        const data = response.data as { content: string; remaining?: number; error?: string };

        if (data.error === "rate_limit") {
          setError("Vous avez atteint la limite quotidienne de messages.");
          setLoading(false);
          return;
        }

        setMessages([
          ...newMessages,
          { role: "assistant", content: data.content },
        ]);
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      } catch {
        setError("Impossible de contacter l'assistant. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    },
    [messages, context]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, remaining, error, sendMessage, clearMessages };
}
