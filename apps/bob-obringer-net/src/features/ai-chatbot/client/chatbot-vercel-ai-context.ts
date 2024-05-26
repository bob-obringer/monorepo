import { createAI } from "ai/rsc";
import { nanoid } from "ai";
import {
  ChatbotVercelActions,
  ChatbotVercelAIState,
  ChatbotVercelUIState,
} from "@/features/ai-chatbot/types";
import { sendChatbotMessage } from "@/features/ai-chatbot/server/send-chatbot-message";

const initialAIState = {
  id: nanoid(),
  messages: [],
  // context: {
  //   promptJobs: null,
  //   promptBio: null,
  //   promptInstructions: null,
  //   promptSkills: null,
  //   resumeCompanies: [],
  // },
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
