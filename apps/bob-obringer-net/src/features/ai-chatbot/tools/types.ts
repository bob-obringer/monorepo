import { ReactNode } from "react";
import { z } from "zod";

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
