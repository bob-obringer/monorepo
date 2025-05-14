import { H2, H3, H4, LI, P, Strong } from "@bob-obringer/design-system";
import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";

export function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

export const components: Components = {
  h2(props) {
    return <H2 className="mb-2">{props.children}</H2>;
  },
  h3(props) {
    return <H3 className="mb-2">{props.children}</H3>;
  },
  h4(props) {
    return <H4 className="mb-2">{props.children}</H4>;
  },
  em(props) {
    return (
      <i className="text-accent-foreground/60 font-semibold">
        {props.children}
      </i>
    );
  },
  ol(props) {
    return <ol className="whitespace-normal">{props.children}</ol>;
  },
  ul(props) {
    return (
      <ul className="marker:text-foreground/60 mb-4 list-outside list-disc whitespace-normal pl-3">
        {props.children}
      </ul>
    );
  },
  li(props) {
    return <LI className="py-1">{props.children}</LI>;
  },
  hr() {
    return <hr className="border-foreground/10 my-4 border" />;
  },
  code(props) {
    return <code className="font-mono">{props.children}</code>;
  },
  strong(props) {
    return <Strong>{props.children}</Strong>;
  },
  p(props) {
    return <P className="mb-4">{props.children}</P>;
  },
  link(props) {
    return (
      <a
        href={props.href}
        className="text-text-subtle hover:text-foreground transition-colors hover:underline"
      >
        {props.children}
      </a>
    );
  },
  blockquote(props) {
    return (
      <blockquote className="border-foreground/20 mb-2 whitespace-normal border-l-4 py-2 pl-4 italic [&>p]:mb-0">
        {props.children}
      </blockquote>
    );
  },
};

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
