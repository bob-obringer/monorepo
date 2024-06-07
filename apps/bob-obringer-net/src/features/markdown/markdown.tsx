import convertStringToReactNode from "html-react-parser";
import { markdownParser } from "@/features/markdown/parse-markdown";

export async function Markdown({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  const html = await markdownParser.parse(markdown);
  return <div className={className}>{convertStringToReactNode(html)}</div>;
}
