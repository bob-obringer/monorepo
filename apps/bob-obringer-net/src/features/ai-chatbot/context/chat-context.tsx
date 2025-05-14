"use client";

import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatRequestOptions, UIMessage } from "ai";

export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

type ChatContextValue = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  messages: Array<UIMessage>;
  status: ChatStatus;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<UIMessage>>>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
};

// todo: rethink this whole thing/break into atoms. It's leftover from v3 ai/rsc and rushed
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatContextProvider({ children }: { children: ReactNode }) {
  /*
    State
   */
  const {
    messages,
    status,
    input,
    handleInputChange,
    handleSubmit,
    error,
    setInput,
    stop,
    setMessages,
  } = useChat({
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "resume") {
        return "resume";
      }
    },
  });

  if (error) {
    console.error("Chat error:", error);
  }

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
    Behaviors
   */
  useEffect(close, [pathname]);

  function close() {
    document.body.style.overflow = "auto";
    setIsOpen(false);
  }

  function open() {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  }

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        close,
        open,
        status,
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        inputRef,
        messages,
        stop,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useBobsChatbot() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotContext");
  }
  return context;
}
