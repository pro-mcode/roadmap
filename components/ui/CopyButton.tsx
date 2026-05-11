"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]",
        "text-muted transition-colors hover:text-text",
      )}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check size={12} /> : <Clipboard size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
