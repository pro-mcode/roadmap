# Design tokens

The platform uses a single design token system defined in
`app/globals.css`. Tailwind consumes the tokens via the `colors:` block in
`tailwind.config.ts` so utilities like `bg-surface` and `text-muted` are
themed automatically.

## Color tokens

Each token is a space-separated `R G B` triple so that Tailwind can apply
opacity via the `<alpha-value>` placeholder.

| Token | Role |
|-------|------|
| `--c-canvas` | Page background |
| `--c-surface` | Cards, sidebars, primary surfaces |
| `--c-elevated` | Subtler surface (hover, code blocks) |
| `--c-border` | Default 1px borders |
| `--c-border-strong` | Hover/active borders |
| `--c-text` | Body text |
| `--c-muted` | Secondary text |
| `--c-hint` | Placeholder text |
| `--c-accent` | Primary accent (indigo light / lavender dark) |
| `--c-accent-soft` | Accent fill at low opacity |
| `--c-accent-contrast` | Foreground on accent backgrounds |
| `--c-success` | Green for completed states |
| `--c-warning` | Amber for cautions |
| `--c-danger` | Red for destructive states |
| `--c-info` | Blue for informational |
| `--c-syntax-bg` | Code block background |
| `--c-syntax-text` | Code block foreground |

## Typography

```css
--font-sans: "Inter", "DM Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Space Mono", ui-monospace, monospace;
```

Loaded via the platform's standard font pipeline. `font-feature-settings`
enables stylistic alternates that improve rendering of digits and lowercase
glyphs.

## Layout

```css
--header-h: 60px;
--sidebar-w: 288px;
```

The `app-shell` grid uses `--sidebar-w` directly. Override at media
breakpoints if you change layouts.

## Border radii

```css
borderRadius: {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
}
```

## Shadows

```css
shadow-soft  /* subtle resting elevation */
shadow-glow  /* accent-tinted glow for the search dialog and hovered CTAs */
```

## Animations

| Class | Use |
|-------|-----|
| `animate-fade-in` | Fade + small translate for revealed elements |
| `animate-shimmer` | Loading state for skeletons |

## Adding a new accent

To introduce a new course accent (e.g. `emerald`):

1. Add the slug to `Course["accent"]` in `types/content.ts`.
2. Add a token mapping in `app/globals.css` if needed:
   ```css
   --c-accent-emerald: 16 185 129;
   ```
3. Use the slug in your course's `index.ts`.
4. Update card styling in `app/page.tsx` and `app/courses/page.tsx` to map
   the slug to a Tailwind class. Centralize the mapping in a small helper if
   the number of accents grows beyond 3-4.

## Dark vs light

Light is the default at the OS level when `prefers-color-scheme: light`. The
header sets `themeColor` per scheme so iOS Safari and Chrome on Android pick
the right chrome color. The toggle cycles `system → light → dark`.

## Accessibility

- Focus ring is `2px solid rgb(var(--c-accent))` with offset `2px`.
- All borders use `rgb(var(--c-border))` so they pass contrast in both
  themes when paired with the canvas/surface tokens.
- Code blocks use a dedicated foreground token to keep `code` legible on the
  elevated surface.
