"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useChat, UseChatHelpers } from "ai/react";

type BobObringerAiContextType = {
  chat: UseChatHelpers;
  isOpen: boolean;
  close: () => void;
  open: () => void;
};

const BobObringerAiContext = createContext<
  BobObringerAiContextType | undefined
>(undefined);

export function BobObringerAiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat();

  useEffect(() => {
    if (!isOpen && chat.isLoading) {
      open();
    }
  }, [chat.isLoading, isOpen]);

  function close() {
    document.body.style.overflow = "auto";
    setIsOpen(false);
  }

  function open() {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  }

  return (
    <BobObringerAiContext.Provider value={{ chat, isOpen, close, open }}>
      {children}
    </BobObringerAiContext.Provider>
  );
}

export const useBobObringerAi = () => {
  const context = useContext(BobObringerAiContext);
  if (context === undefined) {
    throw new Error(
      "useBobObringerAi must be used within a BobObringerAiProvider",
    );
  }
  return context;
};