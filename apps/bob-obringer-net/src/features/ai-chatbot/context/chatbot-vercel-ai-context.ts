import { createAI } from "ai/rsc";
import { nanoid } from "ai";
import { sendChatbotMessage } from "@/features/ai-chatbot/server-actions";
import {
  ChatbotVercelActions,
  ChatbotVercelAIState,
  ChatbotVercelUIState,
} from "@/features/ai-chatbot";

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
