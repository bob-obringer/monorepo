"use client";

import {
  createContext,
  Dispatch,
  FormEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "ai";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { useAppUI } from "@/features/ui/app-ui-state-context";
import {
  ChatbotVercelAIContext,
  ChatbotVercelUIMessage,
  RagStatus,
  SendChatbotMessageResponse,
} from "@/features/ai-chatbot/types";

export type ChatbotContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  messages: ChatbotVercelUIMessage[];
  ragStatus: RagStatus;
  setRagStatus: Dispatch<SetStateAction<RagStatus>>;
  streamEventCount: number;
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
};

export const ChatbotInnerContext = createContext<ChatbotContext | undefined>(
  undefined,
);

export function ChatbotInnerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { viewportWidth } = useAppUI();
  const [isOpen, setIsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useUIState<ChatbotVercelAIContext>();
  const { sendChatbotMessage } = useActions<ChatbotVercelAIContext>();

  const [ragStatus, setRagStatus] = useState<RagStatus>("idle");
  const [streamEventCount, setStreamEventCount] = useState(0);

  useEffect(() => {
    if (ragStatus !== "idle") {
      open();
    }
  }, [ragStatus]);

  function close() {
    document.body.style.overflow = "auto";
    setIsOpen(false);
  }

  function open() {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  }

  /*
    Submit the user prompt
   */
  async function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    // VERY IMPORTANT, otherwise the browser closes the stream
    e.preventDefault();

    // initialize things
    setInputValue("");
    open();
    // alert(viewportWidth);
    if ((viewportWidth ?? 0) < 768) {
      // alert("blur");
      console.log({ inputRef });
      inputRef.current?.blur();
    }
    setRagStatus("retrieving");

    // create a stub for the response, keep updating this
    // as the response is streamed back
    const currentAssistantResponse: ChatbotVercelUIMessage = {
      id: nanoid(),
      role: "assistant",
      ui: "",
    };

    // add the new messages to the chat
    setMessages((prev: Array<ChatbotVercelUIMessage>) => [
      ...prev,
      { id: nanoid(), role: "user", ui: inputValue },
      currentAssistantResponse,
    ]);

    // send the message to the server
    // todo: this response should be validated at runtime
    const resp: SendChatbotMessageResponse | null =
      await sendChatbotMessage(inputValue);
    if (!resp) {
      // todo: handle this
      throw new Error("No response from server");
    }

    // read the stream values and update when they're ready
    dontBlock(
      async () => {
        for await (const value of readStreamableValue(resp.ragStatus)) {
          if (value) setRagStatus(value);
        }
      },
      async () => {
        for await (const value of readStreamableValue(resp.streamEventCount)) {
          if (value) setStreamEventCount(value);
        }
      },
    );

    setMessages((prev: Array<ChatbotVercelUIMessage>) => [
      ...prev.slice(0, -1),
      resp.message,
    ]);
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <ChatbotInnerContext.Provider
      value={{
        isOpen,
        close,
        open,
        messages,
        ragStatus,
        setRagStatus,
        streamEventCount,
        onFormSubmit,
        inputValue,
        setInputValue,
        inputRef,
      }}
    >
      {children}
    </ChatbotInnerContext.Provider>
  );
}

function dontBlock(...fns: Array<() => void>) {
  fns.forEach((fn) => void fn());
}

export const useChatbot = () => {
  const context = useContext(ChatbotInnerContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotContext");
  }
  return context;
};
