import { useCallback, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { getApiKey, getProvider } from "@/lib/aiProvider";
import { streamChatResponse } from "@/lib/streamResponse";
import {
  COACH_SYSTEM_PROMPT,
  GENERAL_OPENING,
  getTaskOpeningMessage,
  getTaskContextMessage,
  generateSuggestions,
} from "@/lib/coachPrompt";
import { PREMADE_GUIDES, FREE_GUIDE_LIMIT } from "@/data/coachResponses";
import { AnalysisTask } from "@/types/analysis";

interface UseChat {
  initChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  handleRecap: () => void;
}

export function useChat(): UseChat {
  const {
    messages,
    taskContext,
    addMessage,
    updateMessage,
    setStreaming,
    isStreaming,
    freemiumCount,
    incrementFreemium,
  } = useChatContext();

  const streamingRef = useRef(false);

  const initChat = useCallback(() => {
    // Only init if no messages yet
    if (messages.length > 0) return;

    const apiKey = getApiKey();

    if (taskContext) {
      const { task, metier } = taskContext;

      // Add invisible context message (hidden from display)
      addMessage({
        role: "system",
        content: getTaskContextMessage(
          metier,
          task.nom,
          task.description,
          task.solution,
          task.type_outil,
          task.categorie
        ),
      });

      if (!apiKey) {
        // Freemium: show pre-written guide
        const guide = PREMADE_GUIDES[task.type_outil] ?? PREMADE_GUIDES["Workflow N8N"];
        addMessage({
          role: "assistant",
          content:
            `Parfait, on va automatiser **"${task.nom}"** ! Voici un guide pour commencer :\n\n` +
            guide +
            `\n\n---\n🔑 **Pour un accompagnement personnalisé et interactif**, configurez votre clé API dans les paramètres. Le coach génèrera un workflow exact pour votre cas.`,
        });
      } else {
        // Opening message (no API call needed)
        addMessage({
          role: "assistant",
          content: getTaskOpeningMessage(task.nom, metier, task.solution, task.type_outil),
        });
      }
    } else {
      if (!apiKey) {
        addMessage({
          role: "assistant",
          content:
            `Bonjour ! 👋 Je suis votre **Coach Automatisation Lecko**.\n\nPour une expérience complète avec des réponses personnalisées, configurez votre clé API dans les **paramètres**.\n\nEn attendant, je peux vous montrer des guides génériques sur N8N, Make, Power Automate ou les Agents IA. Quel sujet vous intéresse ?`,
        });
      } else {
        addMessage({ role: "assistant", content: GENERAL_OPENING });
      }
    }
  }, [messages.length, taskContext, addMessage]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (streamingRef.current || !text.trim()) return;

      const apiKey = getApiKey();
      const provider = getProvider();

      // Add user message
      addMessage({ role: "user", content: text });

      if (!apiKey || !provider) {
        // Freemium mode
        if (freemiumCount >= FREE_GUIDE_LIMIT) {
          addMessage({
            role: "assistant",
            content:
              "🔑 Vous avez atteint la limite des guides gratuits pour cette session. Pour continuer à poser des questions et obtenir des réponses personnalisées, **configurez votre clé API** dans les paramètres.",
          });
        } else {
          incrementFreemium();
          // Find relevant guide by keyword
          const lowerText = text.toLowerCase();
          let guideKey = "Workflow N8N";
          if (lowerText.includes("make") || lowerText.includes("zapier") || lowerText.includes("no-code")) {
            guideKey = "Automatisation No-Code";
          } else if (lowerText.includes("agent") || lowerText.includes("ia") || lowerText.includes("gpt") || lowerText.includes("claude")) {
            guideKey = "Agent IA";
          } else if (lowerText.includes("copilot") || lowerText.includes("assistant")) {
            guideKey = "Copilot / Assistant IA";
          } else if (lowerText.includes("python") || lowerText.includes("script")) {
            guideKey = "Script personnalisé";
          } else if (taskContext) {
            guideKey = taskContext.task.type_outil;
          }

          const guide = PREMADE_GUIDES[guideKey] ?? PREMADE_GUIDES["Workflow N8N"];
          addMessage({
            role: "assistant",
            content:
              guide +
              `\n\n---\n🔑 **Pour des réponses personnalisées à vos questions**, configurez votre clé API dans les paramètres.`,
          });
        }
        return;
      }

      // Build messages for API (last 10, exclude system messages from display but include first system for context)
      const systemMessages = messages.filter((m) => m.role === "system");
      const conversationMessages = messages.filter((m) => m.role !== "system");
      const recentMessages = conversationMessages.slice(-10);

      const apiMessages = [
        ...systemMessages.slice(0, 1), // context message if present
        ...recentMessages,
        { role: "user" as const, content: text },
      ].map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content }));

      // Create placeholder assistant message
      const assistantMsgId = addMessage({ role: "assistant", content: "", isStreaming: true });

      streamingRef.current = true;
      setStreaming(true);

      let accumulated = "";

      await streamChatResponse({
        provider,
        apiKey,
        messages: apiMessages,
        systemPrompt: COACH_SYSTEM_PROMPT,
        onToken: (token) => {
          accumulated += token;
          updateMessage(assistantMsgId, accumulated, true);
        },
        onDone: () => {
          updateMessage(assistantMsgId, accumulated, false);
          streamingRef.current = false;
          setStreaming(false);
        },
        onError: (err) => {
          updateMessage(assistantMsgId, err, false);
          streamingRef.current = false;
          setStreaming(false);
        },
      });
    },
    [messages, taskContext, addMessage, updateMessage, setStreaming, freemiumCount, incrementFreemium]
  );

  const handleRecap = useCallback(() => {
    sendMessage("Récapitule tout ce qu'on a fait et ce qu'il reste à faire, sous forme de checklist avec ✅ pour les étapes couvertes et ⬜ pour les étapes restantes.");
  }, [sendMessage]);

  return { initChat, sendMessage, handleRecap };
}
