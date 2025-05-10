import { CoreMessage } from "ai";
import { FormEvent, ReactElement, RefObject } from "react";
import { StreamableValue } from "ai/rsc";

/*
  Messages
 */
export type MessageRole = "user" | "assistant";

/*
  Vercel AI State
 */
export type ChatbotAIMessage = CoreMessage & {
  id: string;
  role: MessageRole;
};

export type ChatbotAIState = {
  id: string;
  messages: ChatbotAIMessage[];
};

/*
  Vercel UI State
 */
export type ChatbotStatus =
  | "idle"
  | "pending"
  | "active"
  | "cancelling"
  | "done";

export type MessageStatus = SendChatbotMessageActionStatus | "cancelled";

export type ChatbotUIMessage = Omit<CoreMessage, "content"> & {
  id: string;
  role: MessageRole;
  ui: ReactElement;
  status: MessageStatus;
};

export type ChatbotUIState = Array<ChatbotUIMessage>;

/*
  Actions
 */
export type SendChatbotMessageActionStatus =
  | "retrieving"
  | "generating"
  | "success"
  | "error";

export type SendChatbotMessageActionResponse = {
  status: StreamableValue<SendChatbotMessageActionStatus>;
  ui: ReactElement;
  id: string;
};

export type SendChatbotMessageProps = {
  message: string;
  messageId: string;
};

export type ChatbotActions = {
  sendChatbotMessage: (
    props: SendChatbotMessageProps,
  ) => Promise<SendChatbotMessageActionResponse | null>;
};

/*
  Chatbot Context
 */
export type ChatbotContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  messages: ChatbotUIMessage[];
  chatbotStatus: ChatbotStatus;
  setChatbotStatus: (status: ChatbotStatus) => void;
  cancel: () => void;
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitMessage: (text: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  clearChat: () => void;
};
