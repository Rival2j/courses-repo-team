import create from "zustand";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
}

interface ChatState {
  messages: ChatMessage[];
  blocked: boolean;
  addMessage: (msg: ChatMessage) => void;
  clearHistory: () => void;
  setBlocked: (b: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  blocked: false,
  addMessage: (msg) =>
    set((state) => {
      if (state.blocked && msg.role === "user") {
        // When blocked, do not accept user messages; add a system notice instead
        const notice: ChatMessage = {
          id: `sys-${Date.now()}`,
          role: "system",
          text: "El chat está deshabilitado en este flujo. Contacta al soporte si crees que es un error.",
          createdAt: new Date().toISOString(),
        };
        return { messages: [...state.messages, notice] };
      }
      return { messages: [...state.messages, msg] };
    }),
  clearHistory: () => set({ messages: [] }),
  setBlocked: (b) => set({ blocked: b }),
}));
