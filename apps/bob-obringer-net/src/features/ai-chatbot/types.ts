import { CoreMessage } from "ai";
import {
  Dispatch,
  FormEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
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
export type ChatbotUIMessage = Omit<CoreMessage, "content"> & {
  id: string;
  role: MessageRole;
  ui: ReactNode;
};

export type ChatbotUIState = Array<ChatbotUIMessage>;

/*
  Actions
 */
export type MessageStatus = "idle" | "retrieving" | "generating" | "done";

export type SendChatbotMessageResponse = {
  messageStatus: StreamableValue<MessageStatus>;
  ui: ReactNode;
};

export type ChatbotActions = {
  sendChatbotMessage: (
    message: string,
  ) => Promise<SendChatbotMessageResponse | null>;
};

/*
  Chatbot Context
 */
export type ChatbotContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  messages: ChatbotUIMessage[];
  messageStatus: MessageStatus;
  setMessageStatus: Dispatch<SetStateAction<MessageStatus>>;
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
};
