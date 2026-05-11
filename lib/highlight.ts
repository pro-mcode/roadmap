import type { CodeLanguage } from "@/types/content";

/**
 * Shiki-based server-side syntax highlighter.
 *
 * - Loaded lazily via dynamic import so client-side bundles never see shiki.
 * - Uses shiki's built-in singleton (`getSingletonHighlighter`) so multiple
 *   server components share one instance.
 * - Emits a dual-theme HTML output (light + dark) so the same markup
 *   reacts to the `.dark` class on <html> via CSS variables.
 * - On any failure, falls back to a plain escaped `<pre>` so a broken
 *   highlight never breaks the page.
 */

const LANG_MAP: Record<CodeLanguage, string> = {
  typescript: "typescript",
  javascript: "javascript",
  rust: "rust",
  solidity: "solidity",
  go: "go",
  python: "python",
  sql: "sql",
  bash: "bash",
  json: "json",
  yaml: "yaml",
  toml: "toml",
  text: "text",
};

const LANGS = [
  "typescript",
  "javascript",
  "rust",
  "solidity",
  "go",
  "python",
  "sql",
  "bash",
  "json",
  "yaml",
  "toml",
];

const THEMES = ["github-light", "github-dark-dimmed"];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fallback(code: string): string {
  return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
}

/**
 * Highlight a code snippet into shiki HTML. Always resolves; failures
 * return an escaped plain `<pre>` so renders never throw.
 */
export async function highlightCode(
  code: string,
  language: CodeLanguage,
): Promise<string> {
  const lang = LANG_MAP[language] ?? "text";
  if (lang === "text") return fallback(code);

  try {
    const shiki = await import("shiki");
    const highlighter = await shiki.getSingletonHighlighter({
      themes: THEMES,
      langs: LANGS,
    });
    return highlighter.codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    });
  } catch {
    return fallback(code);
  }
}

import type { ContentBlock } from "@/types/content";

/**
 * Walk a block list and pre-render shiki HTML for every code block.
 * Returns an array index-aligned with `blocks`; non-code blocks map to
 * undefined so the renderer can pass the array straight to BlockRenderer.
 */
export async function highlightBlocks(
  blocks: ContentBlock[],
): Promise<(string | undefined)[]> {
  return Promise.all(
    blocks.map((b) =>
      b.kind === "code" ? highlightCode(b.code, b.language) : Promise.resolve(undefined),
    ),
  );
}
