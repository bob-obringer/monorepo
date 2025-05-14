import { getSystemPrompt } from "@/app/api/chat/_/chatbot-system-prompt";
import { models } from "@/integrations/llms";
import { getAllContactInfo } from "@/integrations/sanity-io/queries/contact-info";
import { rateLimit } from "@/integrations/vercel/rate-limit";
import { streamText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const { success } = await rateLimit(25, "5m");
  if (!success)
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const { messages } = await request.json();

  const systemPrompt = await getSystemPrompt();

  const abortController = new AbortController();

  try {
    const result = streamText({
      //model: models[chatbotConfig.model ?? "anthropicHaiku"],
      model: models.xAIGrok3,
      system: systemPrompt,
      messages,
      temperature: 0.7,
      tools: {
        resume: resumeTool,
        contact: contactTool,
      },
      abortSignal: abortController.signal,
      toolCallStreaming: true,
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.log("catch");
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
the contactMethod to "all methods".  Don't run this unless the user explicityly asks to contact bob.`,
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
