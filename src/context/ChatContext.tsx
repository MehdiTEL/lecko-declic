import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { AnalysisTask } from "@/types/analysis";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface TaskContext {
  task: AnalysisTask;
  metier: string;
}

interface ChatState {
  isOpen: boolean;
  taskContext: TaskContext | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  hasSeenNew: boolean;
  freemiumCount: number;
}

interface ChatContextValue extends ChatState {
  openChat: (taskCtx?: TaskContext) => void;
  closeChat: () => void;
  addMessage: (msg: Omit<ChatMessage, "id">) => string;
  updateMessage: (id: string, content: string, isStreaming?: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  resetChat: () => void;
  markSeen: () => void;
  incrementFreemium: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

let msgIdCounter = 0;
function nextId() {
  return `msg-${Date.now()}-${++msgIdCounter}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    taskContext: null,
    messages: [],
    isStreaming: false,
    hasSeenNew: false,
    freemiumCount: 0,
  });

  const openChat = useCallback((taskCtx?: TaskContext) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      taskContext: taskCtx ?? null,
      hasSeenNew: true,
      // Reset messages when opening with a new context
      messages: taskCtx?.task.nom !== prev.taskContext?.task.nom ? [] : prev.messages,
    }));
  }, []);

  const closeChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
    const id = nextId();
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { ...msg, id }],
    }));
    return id;
  }, []);

  const updateMessage = useCallback((id: string, content: string, isStreaming = false) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((m) =>
        m.id === id ? { ...m, content, isStreaming } : m
      ),
    }));
  }, []);

  const setStreaming = useCallback((streaming: boolean) => {
    setState((prev) => ({ ...prev, isStreaming: streaming }));
  }, []);

  const resetChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      taskContext: null,
      isStreaming: false,
    }));
  }, []);

  const markSeen = useCallback(() => {
    setState((prev) => ({ ...prev, hasSeenNew: true }));
  }, []);

  const incrementFreemium = useCallback(() => {
    setState((prev) => ({ ...prev, freemiumCount: prev.freemiumCount + 1 }));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        openChat,
        closeChat,
        addMessage,
        updateMessage,
        setStreaming,
        resetChat,
        markSeen,
        incrementFreemium,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}
