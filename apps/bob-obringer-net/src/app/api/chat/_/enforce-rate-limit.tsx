import { MessageContext } from "@/features/ai-chatbot/server/types";
import { rateLimit } from "@/integrations/vercel/rate-limit";

export async function isRateLimited({ context }: { context: MessageContext }) {
  const { success } = await rateLimit(25, "5m");
  if (!success) {
    context.endTextResponse({
      aiContent: "You're sending messages too quickly.  Please slow down.",
      uiContent: (
        <>{`You're sending messages too quickly.  Please slow down.`}</>
      ),
      status: "error",
    });
    return {
      isStreamActive: context.isStreamActive.value,
      uiStreamStatus: context.uiStreamStatus.value,
      ui: <>{context.uiStream.value}</>,
      toolUI: <>{context.toolStream.value}</>,
      id: context.id,
    };
  }
  return false;
}
