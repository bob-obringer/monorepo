import { CoreMessage } from "ai";
import { ResumeCompany } from "@/services/sanity-io/resume-company-helpers";
import { ReactNode } from "react";
import { StreamableValue } from "ai/rsc";

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
  resumeCompanies: ResumeCompany[];
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
