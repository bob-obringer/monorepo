// import { z } from "zod";
// import { ResumeCard, ResumeLinkCard } from "@/components/resume-card";
// import { RenderTool } from "@/features/ai-chatbot/tools/types";
// import { MessageContext } from "@/features/ai-chatbot/server/types";

// export function resumeTool(context: MessageContext): RenderTool {
//   return {
//     description: `If user wants to download Bob's resume or get a pdf, run this tool.
//           If they just want to view Bob's background, don't run the tool.  Don't run this
//           tool unless they explicitly want to view Bob's resume or download it.`,
//     parameters: z.object({}),
//     generate: async function () {
//       return context.endToolResponse({
//         aiContent: "[Showing Resume Cards]",
//         uiContent: (
//           <div className="justify-middle flex flex-col gap-2 align-middle md:flex-row">
//             <ResumeCard />
//             <ResumeLinkCard />
//           </div>
//         ),
//       });
//     },
//   };
// }
