import { z } from "zod";
import { ResumeCard, ResumeLinkCard } from "@/components/resume-card";
import { MessageContext, RenderTool } from "@/features/ai-chatbot/tools/types";

export function resumeTool(context: MessageContext): RenderTool {
  return {
    description: `If user wants to download Bob's resume or get a pdf, run this tool.
          If they just want to view Bob's background, don't run the tool.`,
    parameters: z.object({}),
    generate: async function () {
      return context.endResponse({
        status: "success",
        aiContent: "[Showing Resume Cards]",
        uiContent: (
          <div className="justify-middle flex flex-col gap-2 align-middle md:flex-row">
            <ResumeCard />
            <ResumeLinkCard />
          </div>
        ),
      });
    },
  };
}
