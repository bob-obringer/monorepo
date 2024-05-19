import { createAI, StreamableValue } from "ai/rsc";
import { CoreMessage, nanoid } from "ai";
import { sendChatbotMessage } from "@/features/ai-chatbot/server-actions";
import { ReactNode } from "react";

const initialAIState = {
  id: nanoid(),
  messages: [],
  context: {
    promptJobs: null,
    promptBio: null,
    promptInstructions: null,
    promptSkills: null,
    resumeCompanies: [],
  },
};

export const ChatbotVercelAIContextProvider = createAI<
  ChatbotVercelAIState,
  ChatbotVercelUIState,
  ChatbotVercelActions
>({
  initialAIState,
  initialUIState: [],
  actions: { sendChatbotMessage },
});

export type ChatbotVercelAIContext = typeof ChatbotVercelAIContextProvider;

/*
  Messages
 */
type ChatbotVercelAIMessage = CoreMessage & {
  id: string;
};

export type ChatbotVercelUIMessage = CoreMessage & {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
};

/*
  Vercel AI State
 */
export type ChatbotVercelAIStateContext = {
  promptInstructions: string | null;
  promptBio: string | null;
  promptJobs: string | null;
  promptSkills: string | null;
  // resumeCompanies: ResumeCompany[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resumeCompanies: Array<any>;
};

export type ChatbotVercelAIState = {
  id: string;
  context: ChatbotVercelAIStateContext;
  // status: "augmenting" | "generating" | "done";
  messages: ChatbotVercelAIMessage[];
};

/*
  Vercel UI State
 */
export type ChatbotVercelUIState = Array<ChatbotVercelUIMessage>;

/*
  Actions
 */
export type SendChatbotMessageResponse = {
  responseMessageText: StreamableValue<string>;
  bioStatus: StreamableValue<boolean>;
  instructionsStatus: StreamableValue<boolean>;
  skillsStatus: StreamableValue<boolean>;
  jobsStatus: StreamableValue<boolean>;
  relevantHighlightsStatus: StreamableValue<boolean>;
  isLoading: StreamableValue<boolean>;
};

export type ChatbotVercelActions = {
  sendChatbotMessage: (message: string) => Promise<SendChatbotMessageResponse>;
};
