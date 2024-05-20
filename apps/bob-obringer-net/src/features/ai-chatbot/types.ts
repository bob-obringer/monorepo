import { CoreMessage } from "ai";
import { ReactNode } from "react";
import { StreamableValue } from "ai/rsc";
import { ChatbotVercelAIContextProvider } from "@/features/ai-chatbot/context/chatbot-vercel-ai-context";
import { ResumeCompany } from "@/services/sanity-io/resume-company-helpers";

export type ChatbotVercelAIContext = typeof ChatbotVercelAIContextProvider;

/*
  Messages
 */
export type MessageRole = "user" | "assistant";

type ChatbotVercelAIMessage = CoreMessage & {
  id: string;
};

export type ChatbotVercelUIMessage = Omit<CoreMessage, "content"> & {
  id: string;
  role: MessageRole;
  ui: ReactNode;
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
  context: ChatbotVercelAIStateContext;
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
  streamEventCount: StreamableValue<number>;
  message: {
    id: string;
    role: "user" | "assistant";
    ui: ReactNode;
  };
};

export type ChatbotVercelActions = {
  sendChatbotMessage: (
    message: string,
  ) => Promise<SendChatbotMessageResponse | null>;
};
