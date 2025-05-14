import React from "react";
import {
  parseMarkdownIntoBlocks,
  components as customComponents,
} from "@/features/markdown/memoized-markdown";
import { FadeIn } from "./fade-in";
import ReactMarkdown from "react-markdown";

export function AnimatedMarkdown({
  content,
  id,
}: {
  content: string;
  id: string;
}) {
  const blocks = React.useMemo(
    () => parseMarkdownIntoBlocks(content),
    [content],
  );
  return (
    <>
      {blocks.map((block: string, index: number) => (
        <FadeIn key={`${id}-block_${index}`}>
          <ReactMarkdown components={customComponents}>{block}</ReactMarkdown>
        </FadeIn>
      ))}
    </>
  );
}
