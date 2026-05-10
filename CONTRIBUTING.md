# Contributing

Thank you for your interest in contributing. This project is built to last, so
the bar for contributions is intentionally high — but the surface for small
high-value contributions (typo fixes, additional exercises, new interview
questions) is very wide.

## Code of conduct

Be kind. Engage with substance. Disagreements are fine; condescension isn't.

## What kind of contributions help most

1. **Typo fixes and clarity edits** in lessons. Always welcome.
2. **Additional interview questions and model answers** for existing topics.
   See [content authoring](docs/content-authoring.md).
3. **New exercises and quizzes** that test the material in a hands-on way.
4. **Production insights** — short, opinionated callouts about what breaks
   in real systems.
5. **Bug fixes** in components, hooks, or lib code.
6. **Accessibility improvements** — keyboard navigation, ARIA, color contrast.

## What kind of contributions need discussion first

- New courses or new weeks. Open an issue with the proposed outline.
- Changes to the content schema in `types/content.ts`.
- Changes to the design system tokens in `app/globals.css` or
  `tailwind.config.ts`.
- Changes to the routing structure or page layout.

## Workflow

```bash
# fork, then
git clone git@github.com:<you>/engineering-roadmap.git
cd engineering-roadmap
npm install

# create a branch
git checkout -b fix/typo-week-03

# do the work
npm run dev
npm run typecheck
npm run lint

# atomic commits with imperative subjects
git commit -m "Fix typo in fintech week 3 webhook lesson"

# push and open a PR
```

PRs should be small, focused, and described in plain language. Tell us:

- What changed
- Why it changed (the failure mode or improvement opportunity)
- How you verified

For content PRs, include a screenshot of the rendered lesson when possible.

## Style

- TypeScript strict mode is on. Keep it that way.
- Prefer named exports for components.
- Tailwind classes go on elements; don't write parallel CSS files.
- Use `cn()` from `lib/utils` to combine classes.
- Icons come from `lucide-react`. No SVGs inline unless absolutely needed.

## Authoring lessons

See [docs/content-authoring.md](docs/content-authoring.md) for the full
authoring guide, including schema reference, helpers, and real examples.

## License

By contributing, you agree that your contribution is licensed under the
project's MIT license.
