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
import { generateId } from "ai";
import {
  readStreamableValue,
  useActions,
  useAIState,
  useUIState,
} from "ai/rsc";
import { useAppUI } from "@/features/ui/app-ui-state-context";
import {
  ChatbotContext,
  ChatbotUIMessage,
  ChatbotStatus,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setAiState] = useAIState<ChatbotAIContext>();
  const [messages, setMessages] = useUIState<ChatbotAIContext>();
  const [chatbotStatus, setChatbotStatus] = useState<ChatbotStatus>("idle");

  const activeAssistantMessageIdRef = useRef<string | null>(null);

  const { sendChatbotMessage } = useActions<ChatbotAIContext>();

  useEffect(() => {
    if (chatbotStatus !== "idle") {
      open();
    }
  }, [chatbotStatus]);

  function close() {
    document.body.style.overflow = "auto";
    setIsOpen(false);
  }

  function open() {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  }

  function cancel() {
    setChatbotStatus("cancelling");

    setMessages((messages: Array<ChatbotUIMessage>) => {
      const lastMessage = messages[messages.length - 1];
      return [
        ...messages.slice(0, -1),
        {
          id: lastMessage?.id ?? generateId(),
          ui: <>You cancelled my response</>,
          status: "cancelled",
          role: "assistant",
        },
      ];
    });
  }

  function clearChat() {
    setAiState({
      id: generateId(),
      messages: [],
    });
    setMessages([]);
  }

  /*
    Submit the user prompt
   */
  async function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    // VERY IMPORTANT, otherwise the browser closes the stream
    e.preventDefault();
    await submitMessage(inputValue);
  }

  async function submitMessage(messageText: string) {
    if (chatbotStatus === "active") {
      cancel();
      return;
    }

    // initialize things
    setInputValue("");
    open();
    if ((viewportWidth ?? 0) < 768) {
      inputRef.current?.blur();
    }

    // create the new message
    const messageId = generateId();
    const newMessage = {
      id: messageId,
      role: "assistant",
      ui: <>Thinking...</>,
      status: "retrieving",
    } as ChatbotUIMessage;

    // add the new messages to the chat
    setMessages((prev: Array<ChatbotUIMessage>) => [
      ...prev,
      {
        id: generateId(),
        role: "user",
        ui: <>{messageText}</>,
        status: "success",
      },
      newMessage,
    ]);

    setChatbotStatus("pending");

    /*
      Send the message to the server action
     */
    const resp = await sendChatbotMessage({ message: messageText, messageId });
    if (!resp) {
      newMessage.ui = <>Error: No response from server</>;
      newMessage.status = "error";
      return;
    }
    activeAssistantMessageIdRef.current = resp.id;

    // read the stream values and update when they're ready
    dontBlock(async () => {
      for await (const streamingStatus of readStreamableValue(resp.status)) {
        // this lets us submit a new request before an old cancelled request
        // is finished.  We stop processing updates fromt the cancelled request
        if (
          !streamingStatus ||
          activeAssistantMessageIdRef.current !== resp.id
        ) {
          return;
        }

        // if the existing message has been cancelled, don't update the status
        if (
          newMessage.status !== "cancelled" &&
          newMessage.status !== "error"
        ) {
          newMessage.status = streamingStatus;
        }

        // update the chat status
        if (["retrieving", "generating"].includes(streamingStatus)) {
          setChatbotStatus("active");
        }
        if (["success", "error"].includes(streamingStatus)) {
          setChatbotStatus("done");
          setTimeout(() => {
            setChatbotStatus("idle");
          }, 2500);
        }
      }
    });

    newMessage.ui = resp.ui;
  }

  return (
    <ChatbotInnerContext.Provider
      value={{
        isOpen,
        close,
        open,
        messages,
        chatbotStatus,
        setChatbotStatus,
        cancel,
        onFormSubmit,
        submitMessage,
        inputValue,
        setInputValue,
        inputRef,
        clearChat,
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
