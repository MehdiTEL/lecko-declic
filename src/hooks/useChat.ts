import { useCallback, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { usePageContext } from "@/context/PageContext";
import { getApiKey, getProvider } from "@/lib/aiProvider";
import { streamChatResponse } from "@/lib/streamResponse";
import {
  COACH_SYSTEM_PROMPT,
  GENERAL_OPENING,
  getTaskOpeningMessage,
  getTaskContextMessage,
  generateSuggestions,
  buildFullDiagnosticContext,
  getPageOpeningMessage,
} from "@/lib/coachPrompt";
import { PREMADE_GUIDES } from "@/data/coachResponses";
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
  } = useChatContext();

  const { currentPage, analysisResult, metier: pageMetier, roiParams } = usePageContext();

  const streamingRef = useRef(false);

  const initChat = useCallback(() => {
    // Only init if no messages yet
    if (messages.length > 0) return;

    const apiKey = getApiKey();
    const hasAnalysis = !!analysisResult;

    // Inject full diagnostic context if available (results or equipe_results pages)
    if (hasAnalysis && analysisResult && (currentPage === "results" || currentPage === "equipe_results")) {
      addMessage({
        role: "system",
        content: buildFullDiagnosticContext(analysisResult, roiParams),
      });
    }

    if (taskContext) {
      const { task, metier } = taskContext;

      // Add task-specific context message
      addMessage({
        role: "system",
        content: getTaskContextMessage(
          metier,
          task.nom,
          task.description,
          task.solution,
          task.type_outil,
          task.categorie,
          task.niveau_accompagnement,
          task.ecosysteme,
          task.prerequis,
          task.complexite,
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
            `\n\n---\nPour un accompagnement **personnalise et interactif**, configurez votre cle API dans les parametres. Le coach generera un workflow exact pour votre cas.`,
        });
      } else {
        // Opening message (no API call needed)
        addMessage({
          role: "assistant",
          content: getTaskOpeningMessage(task.nom, metier, task.solution, task.type_outil),
        });
      }
    } else {
      // No task context — use page-aware opening
      if (!apiKey) {
        addMessage({
          role: "assistant",
          content:
            `Bienvenue. Je suis votre **Copilot DÉCLIC**.\n\nPour une expérience complète avec des réponses personnalisées, configurez votre clé API dans les **paramètres**.\n\nEn attendant, je peux vous montrer des guides génériques sur N8N, Make, Power Automate ou les Agents IA. Quel sujet vous intéresse ?`,
        });
      } else {
        const opening = getPageOpeningMessage(currentPage, hasAnalysis, pageMetier ?? undefined);
        addMessage({ role: "assistant", content: opening });
      }
    }
  }, [messages.length, taskContext, addMessage, currentPage, analysisResult, pageMetier, roiParams]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (streamingRef.current || !text.trim()) return;

      const apiKey = getApiKey();
      const provider = getProvider();

      // Add user message
      addMessage({ role: "user", content: text });

      if (!apiKey || !provider) {
        // Freemium mode — always try to match a premade guide
        const lowerText = text.toLowerCase();
        let guideKey: string | null = null;
        if (lowerText.includes("make") || lowerText.includes("zapier") || lowerText.includes("no-code")) {
          guideKey = "Automatisation No-Code";
        } else if (lowerText.includes("agent") || lowerText.includes("ia") || lowerText.includes("gpt") || lowerText.includes("claude")) {
          guideKey = "Agent IA";
        } else if (lowerText.includes("copilot") || lowerText.includes("assistant")) {
          guideKey = "Copilot / Assistant IA";
        } else if (lowerText.includes("python") || lowerText.includes("script")) {
          guideKey = "Script personnalisé";
        } else if (lowerText.includes("n8n") || lowerText.includes("workflow")) {
          guideKey = "Workflow N8N";
        } else if (taskContext) {
          guideKey = taskContext.task.type_outil;
        }

        const guide = guideKey ? (PREMADE_GUIDES[guideKey] ?? null) : null;
        if (guide) {
          addMessage({
            role: "assistant",
            content:
              guide +
              `\n\n---\nPour des reponses personnalisees a vos questions, configurez votre cle API dans les parametres.`,
          });
        } else {
          addMessage({
            role: "assistant",
            content:
              `Je n'ai pas de guide pre-ecrit pour cette question. Voici ce que je peux vous proposer :\n\n` +
              `- Demandez-moi un guide sur **N8N**, **Make**, **les Agents IA**, **Power Automate** ou **les scripts Python**\n` +
              `- Pour des reponses personnalisees et interactives, configurez votre cle API dans les **parametres**`,
          });
        }
        return;
      }

      // Build messages for API — include ALL system messages (diagnostic + task context)
      const systemMessages = messages.filter((m) => m.role === "system");
      const conversationMessages = messages.filter((m) => m.role !== "system");
      const recentMessages = conversationMessages.slice(-10);

      const apiMessages = [
        ...systemMessages, // all system messages (diagnostic context + task context)
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
    [messages, taskContext, addMessage, updateMessage, setStreaming]
  );

  const handleRecap = useCallback(() => {
    sendMessage("Récapitule tout ce qu'on a fait et ce qu'il reste à faire, sous forme de checklist sous forme de liste structurée avec les étapes couvertes et les étapes restantes.");
  }, [sendMessage]);

  return { initChat, sendMessage, handleRecap };
}
