import { createAI } from "ai/rsc";
import {
  ChatbotVercelActions,
  ChatbotVercelAIMessage,
  ChatbotVercelUIState,
} from "@/features/ai-chatbot/types";
import { sendChatbotMessage } from "@/features/ai-chatbot/server/send-chatbot-message";

// const initialAIState = {
//   id: nanoid(),
//   messages: [],
//   // context: {
//   //   promptJobs: null,
//   //   promptBio: null,
//   //   promptInstructions: null,
//   //   promptSkills: null,
//   //   resumeCompanies: [],
//   // },
// };

export const ChatbotVercelAIContextProvider = createAI<
  Array<ChatbotVercelAIMessage>,
  ChatbotVercelUIState,
  ChatbotVercelActions
>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendChatbotMessage },
});
