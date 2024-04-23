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
  isFullScreen: boolean;
  close: () => void;
};

const BobObringerAiContext = createContext<
  BobObringerAiContextType | undefined
>(undefined);

export function BobObringerAiProvider({ children }: { children: ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chat = useChat();

  useEffect(() => {
    if (!isFullScreen && chat.isLoading) {
      document.body.style.overflow = "hidden";
      setIsFullScreen(true);
    }
  }, [chat.isLoading, isFullScreen]);

  function close() {
    document.body.style.overflow = "auto";
    setIsFullScreen(false);
  }

  return (
    <BobObringerAiContext.Provider value={{ chat, isFullScreen, close }}>
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
