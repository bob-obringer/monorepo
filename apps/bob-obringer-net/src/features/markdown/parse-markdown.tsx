import { marked, RendererObject } from "marked";

const headingLevels = [
  "text-size-2xl",
  "text-size-xl",
  "text-size-lg",
  "text-size-md",
  "text-size-sm",
  "text-size-xs",
];

const renderer: RendererObject = {
  heading(text: string, level: number) {
    return `<h${level} data-markdown class="${headingLevels[level - 1]} mt-4 mb-1 font-weight-bold">${text}</h${level}>`;
  },
  list(body: string, ordered: boolean) {
    return `<${ordered ? "ol" : "ul"} data-markdown>${body}</${ordered ? "ol" : "ul"}>`;
  },
  listitem(text: string) {
    return `<li data-markdown class="text-size-md list-disc list-inside">${text}</li>`;
  },
  hr() {
    return `<hr data-markdown class="border border-[#cccccc33] my-4" />`;
  },
  code(code: string) {
    return `<code data-markdown class="font-family-mono">${code}</code>`;
  },
  strong(text: string) {
    return `<strong data-markdown class="font-weight-bold">${text}</strong>`;
  },
  paragraph(text: string) {
    return `<p data-markdown class="block">${text}</p>`;
  },
  link(href: string, _: string | null | undefined, text: string) {
    return `<a data-markdown href="${href}" class="text-color-link hover:text-color-link-hover transition-colors hover:underline">${text}</a>`;
  },
  blockquote(quote: string): string {
    return `<blockquote data-markdown class="border-l-4 border-[#cccccc33] pl-4 pt-2 italic">${quote}</blockquote>`;
  },
};

export const markdownParser = marked.use({ renderer });
