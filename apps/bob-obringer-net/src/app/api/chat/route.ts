import resume from "@/features/resume/data.json";
import { getFileContents } from "@/services/aws-s3";
import { StreamingTextResponse, streamText } from "ai";
import { haiku } from "@/services/ai";

const model = haiku;

// todo: this should come from a vectordb
const resumePrompt = resume.work
  .map((work) => {
    return `
  From ${work.startDate.substring(0, 4)} ${work.endDate ? `to ${work.endDate.substring(0, 4)}` : "today"},
  Bob worked at ${work.company} as a ${work.position}.  
  and had these accomplishments: ${work.highlights.map((highlight) => `- ${highlight}`).join("\n")}
  link: https://bob.obringer.net/experience/${work.name}\n\n`;
  })
  .join();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = await getFileContents("ai/system-prompt.txt");
  const bio = await getFileContents("ai/bio.txt");
  const system = `
${systemPrompt}

Background:
${resumePrompt}
${bio}  
  `;

  const result = await streamText({ system, messages, model });
  return new StreamingTextResponse(result.toAIStream());
}
