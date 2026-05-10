import type { ContentBlock } from "@/types/content";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Diagram } from "@/components/ui/Diagram";

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-doc">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "heading": {
            if (b.level === 2) return <h2 key={i}>{b.text}</h2>;
            if (b.level === 3) return <h3 key={i}>{b.text}</h3>;
            return <h4 key={i}>{b.text}</h4>;
          }
          case "paragraph":
            return <p key={i}>{b.text}</p>;
          case "list":
            return b.ordered ? (
              <ol key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                code={b.code}
                language={b.language}
                caption={b.caption}
              />
            );
          case "callout":
            return (
              <Callout key={i} variant={b.variant} title={b.title}>
                {b.body}
              </Callout>
            );
          case "diagram":
            return (
              <Diagram
                key={i}
                ascii={b.ascii}
                title={b.title}
                caption={b.caption}
              />
            );
          case "table":
            return (
              <figure key={i} className="my-6 overflow-x-auto">
                {b.caption ? (
                  <figcaption className="mb-2 text-xs text-muted">
                    {b.caption}
                  </figcaption>
                ) : null}
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {b.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-muted"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-border/70 last:border-0"
                      >
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            );
        }
      })}
    </div>
  );
}
