import { z } from "zod";
import { ResumeCard, ResumeLinkCard } from "@/components/resume-card";
import { EndStreams, RenderTool } from "@/features/ai-chatbot/tools/types";

export function resumeTool({
  endStreams,
}: {
  endStreams: EndStreams;
}): RenderTool {
  return {
    description: `If user wants to download Bob's resume or get a pdf, run this tool.
          If they just want to view bob's background, don't run the tool.`,
    parameters: z.object({}),
    generate: async function () {
      return endStreams({
        aiContent: "[Showing Resume Tool]",
        uiContent: (
          <div className="justify-middle flex flex-col gap-4 align-middle md:flex-row">
            <ResumeCard />
            <ResumeLinkCard />
          </div>
        ),
      });
    },
  };
}
