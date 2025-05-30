// import {
//   ChatbotAIState,
//   SendChatbotMessageActionStatus,
// } from "@/features/ai-chatbot/types";
// import { ReactNode } from "react";
// import { createStreamableUI, createStreamableValue } from "ai/rsc";

// /*
//   Message Context
//  */
// type EndToolResponseFunction = (props: {
//   aiContent: string;
//   uiContent: ReactNode;
// }) => Promise<ReactNode>;

// type EndTextResponseFunction = (props: {
//   aiContent: string;
//   uiContent: ReactNode;
//   status: SendChatbotMessageActionStatus;
// }) => Promise<ReactNode>;

// // pulled from vercel sdk, can't get fn return type to work
// // not worth fixing for now
// type ValueOrUpdater<T> = T | ((current: T) => T);
// type MutableAIState<AIState> = {
//   get: () => AIState;
//   update: (newState: ValueOrUpdater<AIState>) => void;
//   done: ((newState: AIState) => void) | (() => void);
// };
// type AIState = MutableAIState<ChatbotAIState>;

// type UIStream = ReturnType<typeof createStreamableUI>;

// type ValueStream<T> = ReturnType<typeof createStreamableValue<T>>;
// type UIStreamStatus = ValueStream<SendChatbotMessageActionStatus>;
// type IsActiveStream = ValueStream<boolean>;

// export type MessageContext = {
//   /**
//    * The AI state used to store messages to include with the chat
//    */
//   aiState: AIState;
//   /**
//    * Keep track of the number of chunks we encounter
//    * so we can slow down how fast we populate our own stream
//    */
//   chunkCount: number;
//   /**
//          The stream from the `streamUI` call comes back too quickly with some models
//          and can cause a recursion error on the client.  Instead, we create a separate
//          stream that we can add to at our own pace
//          */
//   uiStream: UIStream;
//   /**
//    * Tool response stream;
//    */
//   toolStream: UIStream;
//   /**
//    * A separate stream that lets the client know about the status of the request
//    */
//   uiStreamStatus: UIStreamStatus;
//   /**
//    * A separate stream that lets the client know if a tool is active
//    */
//   isStreamActive: IsActiveStream;
//   /**
//    * When we're done, close all streams with final content, and log the chat
//    */
//   endToolResponse: EndToolResponseFunction;
//   /**
//    * When we're done, close all streams with final content, and log the chat
//    */
//   endTextResponse: EndTextResponseFunction;
//   /**
//    * Start a tool response
//    */
//   startTool: () => void;
//   /**
//    * A unique id for the request
//    */
//   id: string;
// };
