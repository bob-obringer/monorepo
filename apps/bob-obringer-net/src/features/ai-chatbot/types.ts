import { CoreMessage } from "ai";
import {
  Dispatch,
  FormEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import { StreamableValue } from "ai/rsc";
import { ChatbotVercelAIContextProvider } from "@/features/ai-chatbot/client/chatbot-vercel-ai-context";
import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";

export type ChatbotVercelAIContext = typeof ChatbotVercelAIContextProvider;

/*
  Messages
 */
export type MessageRole = "user" | "assistant";

export type ChatbotVercelAIMessage = CoreMessage & {
  id: string;
};

export type ChatbotVercelUIMessage = Omit<CoreMessage, "content"> & {
  id: string;
  role: MessageRole;
  display: ReactNode;
};

/*
  Vercel AI State
 */
export type ChatbotVercelAIStateContext = {
  promptInstructions: string | null;
  promptBio: string | null;
  promptJobs: string | null;
  promptSkills: string | null;
  resumeCompanies: Array<ResumeCompany>;
};

export type ChatbotVercelAIState = {
  id: string;
  // context: ChatbotVercelAIStateContext;
  messages: ChatbotVercelAIMessage[];
};

/*
  Vercel UI State
 */
export type ChatbotVercelUIState = Array<ChatbotVercelUIMessage>;

/*
  Actions
 */
export type RagStatus = "idle" | "retrieving" | "generating" | "done";

export type SendChatbotMessageResponse = {
  ragStatus: StreamableValue<RagStatus>;
  message: {
    id: string;
    role: "user" | "assistant";
    display: ReactNode;
  };
};

export type ChatbotVercelActions = {
  sendChatbotMessage: (
    message: string,
  ) => Promise<SendChatbotMessageResponse["message"] | null>;
};

/*
  Chatbot Context
 */

export type ChatbotContext = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  messages: ChatbotVercelUIMessage[];
  ragStatus: RagStatus;
  setRagStatus: Dispatch<SetStateAction<RagStatus>>;
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
};
