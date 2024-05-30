"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "ai";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { useAppUI } from "@/features/ui/app-ui-state-context";
import {
  ChatbotContext,
  ChatbotUIMessage,
  MessageStatus,
} from "@/features/ai-chatbot/types";
import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";

const ChatbotInnerContext = createContext<ChatbotContext | undefined>(
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

  const [messages, setMessages] = useUIState<ChatbotAIContext>();
  const { sendChatbotMessage } = useActions<ChatbotAIContext>();

  const [messageStatus, setMessageStatus] = useState<MessageStatus>("idle");

  useEffect(() => {
    if (messageStatus !== "idle") {
      open();
    }
  }, [messageStatus]);

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
    if ((viewportWidth ?? 0) < 768) {
      console.log({ inputRef });
      inputRef.current?.blur();
    }

    const newMessage = {
      id: nanoid(),
      role: "assistant",
      ui: <>Thinking...</>,
    } as ChatbotUIMessage;

    // add the new messages to the chat
    setMessages((prev: Array<ChatbotUIMessage>) => [
      ...prev,
      { id: nanoid(), role: "user", ui: inputValue },
      newMessage,
    ]);

    // send the message to the server
    // todo: this response should be validated at runtime
    setMessageStatus("retrieving");
    const resp = await sendChatbotMessage(inputValue);
    if (!resp) {
      // todo: handle this
      throw new Error("No response from server");
    }

    // read the stream values and update when they're ready
    dontBlock(async () => {
      for await (const value of readStreamableValue(resp.messageStatus)) {
        if (value) setMessageStatus(value);
      }
    });

    newMessage.ui = resp.ui;
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
        messageStatus,
        setMessageStatus,
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
