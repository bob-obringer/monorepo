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
  const reactNode = convertStringToReactNode(html);
  return <div className={className}>{reactNode}</div>;
}
