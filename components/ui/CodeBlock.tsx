"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CodeLanguage } from "@/types/content";

interface Props {
  code: string;
  language: CodeLanguage;
  caption?: string;
}

export function CodeBlock({ code, language, caption }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border bg-elevated">
      <header className="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]",
            "text-muted hover:text-text transition-colors",
          )}
        >
          {copied ? <Check size={12} /> : <Clipboard size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="code-block thin-scroll" data-language={language}>
        <code>{code}</code>
      </pre>
      {caption ? (
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
