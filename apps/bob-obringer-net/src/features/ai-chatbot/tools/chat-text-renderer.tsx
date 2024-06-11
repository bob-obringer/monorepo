import { Markdown } from "@/features/markdown/markdown";
import { MessageContext } from "@/features/ai-chatbot/tools/types";

export function chatTextRenderer(context: MessageContext) {
  return async function ({
    content,
    done,
  }: {
    content: string;
    done: boolean;
  }) {
    if (done) {
      return context.endResponse({
        aiContent: content,
        uiContent: <Markdown markdown={content} />,
        status: "success",
      });
    }

    context.chunkCount = context.chunkCount + 1;
    if (context.chunkCount % 3 === 0) {
      context.uiStream.update(<Markdown markdown={content} />);
    }

    return null;
  };
}
