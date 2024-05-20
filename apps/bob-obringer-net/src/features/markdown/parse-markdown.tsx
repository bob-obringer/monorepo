import { marked } from "marked";
import convertStringToReactNode from "html-react-parser";

const headingLevels = [
  "text-size-2xl",
  "text-size-xl",
  "text-size-lg",
  "text-size-md",
  "text-size-sm",
  "text-size-xs",
];

const renderer = {
  heading(text: string, level: number) {
    return `<h${level} class="${headingLevels[level - 1]} mt-4 font-weight-bold">${text}</h${level}>`;
  },
  list(body: string, ordered: boolean) {
    return `<${ordered ? "ol" : "ul"} class="font-size:0">${body}</${ordered ? "ol" : "ul"}>`;
  },
  listitem(text: string) {
    return `<li class="text-size-md list-disc list-inside">${text}</li>`;
  },
  hr() {
    return `<hr class="border border-[#cccccc33] my-4" />`;
  },
};

marked.use({ renderer });

export async function parseMarkdown(markdown: string) {
  const html = await marked.parse(markdown);
  return convertStringToReactNode(html);
}
