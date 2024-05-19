"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "ai";
import { SendChatbotMessageResponse } from "@/features/ai-chatbot/server-actions";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { useAppUI } from "@/features/ui/app-ui-state-context";
import { ChatbotVercelUIMessage } from "@/features/ai-chatbot";
import { ChatbotVercelAIContext } from "@/features/ai-chatbot/context/chatbot-vercel-ai-context";

export type ChatbotContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  messages: ChatbotVercelUIMessage[];
  isLoading: boolean;
  isBioLoaded: boolean;
  isInstructionsLoaded: boolean;
  isSkillsLoaded: boolean;
  isJobsLoaded: boolean;
  isRelevantHighlightsLoaded: boolean;
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

  const [isBioLoaded, setIsBioLoaded] = useState(false);
  const [isInstructionsLoaded, setIsInstructionsLoaded] = useState(false);
  const [isSkillsLoaded, setIsSkillsLoaded] = useState(false);
  const [isJobsLoaded, setIsJobsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRelevantHighlightsLoaded, setIsRelevantHighlightsLoaded] =
    useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
    }
  }, [isLoading]);

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

    // reset the form
    setInputValue("");
    if ((viewportWidth ?? 0) < 768) inputRef.current?.blur();

    // create a stub for the response, keep updating this
    // as the response is streamed back
    const currentAssistantResponse: ChatbotVercelUIMessage = {
      id: nanoid(),
      role: "assistant",
      content: "",
    };

    // add the new messages to the chat
    setMessages((prev: Array<ChatbotVercelUIMessage>) => [
      ...prev,
      { id: nanoid(), role: "user", content: inputValue },
      currentAssistantResponse,
    ]);

    // send the message to the server
    // todo: this response should be validated at runtime
    const resp: SendChatbotMessageResponse =
      await sendChatbotMessage(inputValue);
    if (!resp) {
      // todo: handle this
      throw new Error("No response from server");
    }

    // read the stream values and update when they're ready
    dontBlock(
      async () => {
        for await (const value of readStreamableValue(resp.isLoading))
          setIsLoading(Boolean(value));
      },
      async () => {
        for await (const value of readStreamableValue(resp.bioStatus))
          setIsBioLoaded(Boolean(value));
      },
      async () => {
        for await (const value of readStreamableValue(resp.instructionsStatus))
          setIsInstructionsLoaded(Boolean(value));
      },
      async () => {
        for await (const value of readStreamableValue(resp.skillsStatus))
          setIsSkillsLoaded(Boolean(value));
      },
      async () => {
        for await (const value of readStreamableValue(resp.jobsStatus))
          setIsJobsLoaded(Boolean(value));
      },
      async () => {
        for await (const value of readStreamableValue(
          resp.relevantHighlightsStatus,
        ))
          setIsRelevantHighlightsLoaded(Boolean(value));
      },
    );

    // as the new text streams in, update the last message in the chat
    for await (const value of readStreamableValue(resp.responseMessageText)) {
      currentAssistantResponse.content = value ?? "";
      setMessages((prev: Array<ChatbotVercelUIMessage>) => [
        ...prev.slice(0, -1),
        { ...currentAssistantResponse },
      ]);
    }
    setMessages((prev: Array<ChatbotVercelUIMessage>) => [
      ...prev.slice(0, -1),
      { ...currentAssistantResponse },
    ]);
  }

  return (
    <ChatbotInnerContext.Provider
      value={{
        isOpen,
        close,
        open,
        messages,
        isLoading,
        isBioLoaded,
        isInstructionsLoaded,
        isSkillsLoaded,
        isJobsLoaded,
        isRelevantHighlightsLoaded,
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
