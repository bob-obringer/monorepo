import { ReactNode } from "react";
import { z } from "zod";
import { createStreamableUI } from "ai/rsc";
import { SendChatbotMessageActionStatus } from "@/features/ai-chatbot/types";

type Streamable = ReactNode | Promise<ReactNode>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Renderer<T extends Array<any>> = (
  ...args: T
) =>
  | Streamable
  | Generator<Streamable, Streamable, void>
  | AsyncGenerator<Streamable, Streamable, void>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderTool<PARAMETERS extends z.ZodTypeAny = any> = {
  description?: string;
  parameters: PARAMETERS;
  generate?: Renderer<
    [
      z.infer<PARAMETERS>,
      {
        toolName: string;
        toolCallId: string;
      },
    ]
  >;
};

export type EndStreams = (props: {
  aiContent: string;
  uiContent: ReactNode;
  status?: SendChatbotMessageActionStatus;
}) => null;

export type UIStream = ReturnType<typeof createStreamableUI>;
