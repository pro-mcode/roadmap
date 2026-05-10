import type {
  CalloutBlock,
  CodeBlock,
  CodeLanguage,
  ContentBlock,
  DiagramBlock,
  HeadingBlock,
  ListBlock,
  ParagraphBlock,
  TableBlock,
} from "@/types/content";

export const p = (text: string): ParagraphBlock => ({ kind: "paragraph", text });
export const h2 = (text: string): HeadingBlock => ({
  kind: "heading",
  level: 2,
  text,
});
export const h3 = (text: string): HeadingBlock => ({
  kind: "heading",
  level: 3,
  text,
});
export const ul = (items: string[]): ListBlock => ({ kind: "list", items });
export const ol = (items: string[]): ListBlock => ({
  kind: "list",
  ordered: true,
  items,
});
export const code = (
  language: CodeLanguage,
  code: string,
  caption?: string,
): CodeBlock => ({
  kind: "code",
  language,
  code,
  caption,
});
export const callout = (
  variant: CalloutBlock["variant"],
  body: string,
  title?: string,
): CalloutBlock => ({ kind: "callout", variant, body, title });
export const diagram = (
  ascii: string,
  title?: string,
  caption?: string,
): DiagramBlock => ({ kind: "diagram", ascii, title, caption });
export const table = (
  headers: string[],
  rows: string[][],
  caption?: string,
): TableBlock => ({ kind: "table", headers, rows, caption });

export const blocks = (...b: ContentBlock[]) => b;
