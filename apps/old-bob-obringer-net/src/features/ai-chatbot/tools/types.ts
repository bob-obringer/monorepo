import { ReactNode } from "react";
import { z } from "zod";
import {
  ChatbotAIState,
  SendChatbotMessageActionStatus,
} from "@/features/ai-chatbot/types";
import { createStreamableUI, createStreamableValue } from "ai/rsc";

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

/*
  Message Context
 */
type EndResponseFunction = (props: {
  aiContent: string;
  uiContent: ReactNode;
  status: SendChatbotMessageActionStatus;
}) => null;

// pulled from vercel sdk, can't get fn return type to work
// not worth fixing for now
type ValueOrUpdater<T> = T | ((current: T) => T);
type MutableAIState<AIState> = {
  get: () => AIState;
  update: (newState: ValueOrUpdater<AIState>) => void;
  done: ((newState: AIState) => void) | (() => void);
};
type AIState = MutableAIState<ChatbotAIState>;

type UIStream = ReturnType<typeof createStreamableUI>;

type StatusStream = ReturnType<
  typeof createStreamableValue<SendChatbotMessageActionStatus>
>;

export type MessageContext = {
  /**
   * The AI state used to store messages to include with the chat
   */
  aiState: AIState;
  /**
   * Keep track of the number of chunks we encounter
   * so we can slow down how fast we populate our own stream
   */
  chunkCount: number;
  /**
   The stream from the `streamUI` call comes back too quickly with some models
   and can cause a recursion error on the client.  Instead, we create a separate
   stream that we can add to at our own pace
   */
  uiStream: UIStream;
  /**
   * A separate stream that lets the client know about the status of the request
   */
  statusStream: StatusStream;
  /**
   * When we're done, close all streams with final content, and log the chat
   */
  endResponse: EndResponseFunction;
  /**
   * A unique id for the request
   */
  id: string;
};
