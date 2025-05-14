import { getSystemPrompt } from "@/app/api/chat/_/chatbot-system-prompt";
import { archiveChat } from "@/app/api/chat/_/chat-archive";
import { models } from "@/integrations/llms";
import { getAllContactInfo } from "@/integrations/sanity-io/queries/contact-info";
import { rateLimit } from "@/integrations/vercel/rate-limit";
import { streamText, tool, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const { success } = await rateLimit(25, "5m");
  if (!success)
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const { id: chatId, messages } = await request.json();
  if (!chatId) {
    return NextResponse.json({ error: "Missing chat id" }, { status: 400 });
  }

  const systemPrompt = await getSystemPrompt();

  const abortController = new AbortController();

  try {
    const result = streamText({
      //model: models[chatbotConfig.model ?? "anthropicHaiku"],
      model: models.xAIGrok3,
      system: systemPrompt,
      messages,
      temperature: 0.8,
      tools: {
        resume: resumeTool,
        contact: contactTool,
      },
      abortSignal: abortController.signal,
      toolCallStreaming: true,
      onFinish: async (finalData) => {
        const isFirstMessage = messages.length === 1;
        const userMessages = messages
          .filter((m: UIMessage) => m.role === "user")
          .map((m: UIMessage) => m.content);
        const userMessage = messages[messages.length - 1];
        const assistantMessage =
          typeof finalData === "string" ? finalData : (finalData.text ?? "");
        try {
          await archiveChat({
            chatId,
            isFirstMessage,
            userMessage: userMessage.content,
            assistantMessage,
            userMessages,
          });
        } catch (e) {
          console.error("Chat persistence failed:", e);
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error(e);
    abortController.abort();
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

const resumeTool = tool({
  description:
    "If user wants to download Bob's resume or get a pdf, run this tool.",
  parameters: z.object({}).optional(),
});

const contactTool = tool({
  description: "If the user wants to communicate with bob, run this tool",
  parameters: z.object({
    contactMethod: z
      .enum(["x", "linkedin", "email", "phone", "all methods"])
      .describe(
        `If you can infer that the user is looking for "x", "linkedin", "email", or "phone",
set the contactMethod parameter to the exact value. Remember, Twitter is X.
If you can't tell exactly how they want to communicate with us, set
contactMethod to "all methods".  Don't run this unless the user explicityly asks to contact bob.`,
      ),
  }),
  execute: async function ({ contactMethod }) {
    const contactInfo = await getAllContactInfo();
    if (contactMethod === "all methods") return contactInfo;

    const singleContactInfo = contactInfo.find(
      (c) => c.contactMethod?.toLowerCase() === contactMethod.toLowerCase(),
    );
    return singleContactInfo ?? [];
  },
});
