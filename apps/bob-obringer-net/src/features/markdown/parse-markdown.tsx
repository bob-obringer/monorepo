import { marked, Tokens } from "marked";

const variants = {
  display:
    "font-sans font-semibold !leading-[1.0] text-[clamp(3.5rem,10vw,5rem)]",
  "heading-1":
    "font-sans font-semibold !leading-[1.0] text-[clamp(2.5rem,7vw,3.5rem)]",
  "heading-2":
    "font-sans font-semibold !leading-[1.05] text-[clamp(1.75rem,5vw,2.5rem)]",
  "heading-3":
    "font-sans font-semibold !leading-[1.1] text-[clamp(1.25rem,4vw,1.75rem)]",
  "heading-4":
    "font-sans font-semibold !leading-[1.15] text-[clamp(1rem,3vw,1.25rem)]",
  title: "fontsans font-semibold text-lg",
  lead: "font-sans text-base italic text-subtle",
  "body-large": "font-sans text-lg",
  "body-medium": "font-sans text-base",
  "body-small": "font-sans text-sm",
  caption: "font-sans text-xs text-subtle",
  label: "font-sans text-sm uppercase text-subtle",
};

class CustomRenderer extends marked.Renderer {
  heading(token: Tokens.Heading) {
    const text = this.parser.parseInline(token.tokens);
    const variant = variants[`heading-${token.depth}` as keyof typeof variants];
    return `<h${token.depth} data-markdown class="${variant} mt-4 mb-1 font-bold">${text}</h${token.depth}>`;
  }
  list(token: Tokens.List) {
    // We need to use the items property which contains the processed list items
    const items = token.items.map((item) => this.listitem(item)).join("");
    return `<${token.ordered ? "ol" : "ul"} class="${variants["body-medium"]} space-y-2 mb-4" data-markdown>${items}</${token.ordered ? "ol" : "ul"}>`;
  }
  listitem(token: Tokens.ListItem) {
    let content = "";
    if (token.tokens) {
      try {
        content = this.parser.parseInline(token.tokens);
      } catch {
        content = "";
      }
    } else if (token.text) {
      content = token.text;
    }

    return `<li data-markdown class="${variants["body-medium"]} text-size-md list-disc list-inside marker:text-color-primary">${content}</li>`;
  }
  hr() {
    // No token for hr, it's a simple override
    return `<hr data-markdown class="border border-foreground/10 my-4" />`;
  }
  code(token: Tokens.Code) {
    // For code blocks, token.text contains the raw code.
    // No need to parse further as it's pre-formatted.
    return `<code data-markdown class="font-mono">${token.text}</code>`;
  }
  strong(token: Tokens.Strong) {
    const text = this.parser.parseInline(token.tokens);
    return `<strong data-markdown class="font-semibold">${text}</strong>`;
  }
  em(token: Tokens.Em) {
    const text = this.parser.parseInline(token.tokens);
    return `<em data-markdown class="italic">${text}</em>`;
  }
  paragraph(token: Tokens.Paragraph) {
    const text = this.parser.parseInline(token.tokens);
    return `<p data-markdown class="${variants["body-medium"]} block">${text}</p>`;
  }
  link(token: Tokens.Link) {
    const text = this.parser.parseInline(token.tokens);
    return `<a data-markdown href="${token.href}" class="text-text-subtle hover:text-foreground transition-colors hover:underline">${text}</a>`;
  }
  blockquote(token: Tokens.Blockquote) {
    // For blockquotes, token.tokens contains the block content.
    // We use this.parser.parse() as blockquotes can contain other block-level elements.
    const quote = this.parser.parse(token.tokens);
    return `<blockquote data-markdown class="border-l-4 border-foreground/20 mb-2 pl-4 pt-2 italic">${quote}</blockquote>`;
  }
  space() {
    return "";
  }
}

// Create a singleton instance of our custom renderer
const customRenderer = new CustomRenderer();

// Export a function that actually parses markdown
export async function parseMarkdown(markdown: string) {
  return marked.parse(markdown, { renderer: customRenderer });
}
