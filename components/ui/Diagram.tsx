interface Props {
  ascii: string;
  title?: string;
  caption?: string;
}

export function Diagram({ ascii, title, caption }: Props) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border bg-elevated">
      {title ? (
        <header className="border-b border-border bg-surface px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {title}
          </span>
        </header>
      ) : null}
      <pre className="code-block thin-scroll text-[12.5px] leading-[1.55]">
        <code>{ascii}</code>
      </pre>
      {caption ? (
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
