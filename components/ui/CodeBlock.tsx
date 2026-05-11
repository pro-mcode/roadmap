import type { CodeLanguage } from "@/types/content";
import { CopyButton } from "./CopyButton";

interface Props {
  code: string;
  language: CodeLanguage;
  caption?: string;
  /**
   * Pre-rendered shiki HTML. When omitted, the block renders as plain
   * monospace text (used as a graceful fallback).
   */
  highlightedHtml?: string;
}

/**
 * Synchronous server component. Receives shiki-highlighted HTML
 * pre-rendered by the parent (BlockRenderer) so this component can stay
 * trivially serializable.
 */
export function CodeBlock({ code, language, caption, highlightedHtml }: Props) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border bg-elevated">
      <header className="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {language}
        </span>
        <CopyButton text={code} />
      </header>
      {highlightedHtml ? (
        <div
          className="code-block thin-scroll"
          data-language={language}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="code-block thin-scroll" data-language={language}>
          <code>{code}</code>
        </pre>
      )}
      {caption ? (
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
