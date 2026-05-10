# Architecture

## High-level shape

```
┌──────────────────────────────────────────────────────────┐
│                    app/ (Next.js routes)                 │
│  layout.tsx, page.tsx, courses/, interview/, search/     │
└────────────────────┬─────────────────────────────────────┘
                     │ uses
        ┌────────────▼─────────────┐
        │    components/           │   ← presentation
        │  layout, learning, ui    │
        └────────────┬─────────────┘
                     │ reads
        ┌────────────▼─────────────┐
        │       lib/               │   ← logic / lookups
        │ content, search, progress│
        └────────────┬─────────────┘
                     │ imports
        ┌────────────▼─────────────┐
        │     content/             │   ← typed content
        │   courses/<slug>/        │
        └──────────────────────────┘
```

Content flows in one direction. Pages call `lib/content.ts` lookups, which
compose typed data from `content/courses/*`. Components are presentation-only
and never reach into content modules directly.

## App router

Routes are defined in `app/`:

- `/` — marketing landing page (server component).
- `/courses` — index of all courses.
- `/courses/[courseId]` — course overview.
- `/courses/[courseId]/week/[weekId]` — week overview.
- `/courses/[courseId]/week/[weekId]/lesson/[lessonId]` — lesson page.
- `/interview` — interview prep index.
- `/interview/[topic]` — per-course interview set, grouped by category.
- `/search` — full search UI (client).
- `/about` — about page.

Every dynamic route exports `generateStaticParams()` so the entire site is
statically rendered at build time.

## Layout composition

`AppShell` is the top-level layout primitive. It composes:

- `Topbar` — navigation, search trigger, theme toggle.
- An optional `sidebar` slot — pages that have a course context pass
  `<CourseSidebar course={course} />` here; pages without one omit it.
- A `<main>` content area.

The shell is a single grid (`var(--sidebar-w) minmax(0, 1fr)`) on desktop and
collapses to a single column on mobile.

## Theme system

Themes are CSS variables defined in `app/globals.css`. Each variable holds
its color as a space-separated `R G B` triple so Tailwind can apply opacity:

```css
--c-accent: 88 92 246;
```

```js
// tailwind.config.ts
accent: "rgb(var(--c-accent) / <alpha-value>)",
```

`next-themes` toggles the `.dark` class on `<html>`, which redefines the
variables. Components consume them through Tailwind utilities (`bg-accent`,
`text-accent`, etc.) and never hardcode colors.

## Content schema

The schema lives in `types/content.ts`:

```
Course
  └─ weeks: Week[]
      └─ modules: Module[]
          └─ lessons: Lesson[]
              ├─ blocks: ContentBlock[]
              ├─ exercises?: Exercise[]
              ├─ quiz?: QuizQuestion[]
              ├─ interviewQuestions?: InterviewQuestion[]
              ├─ resources?: Resource[]
              └─ productionInsights?: ProductionInsight[]
```

`ContentBlock` is a discriminated union covering paragraphs, headings, lists,
code, callouts, diagrams, and tables. The `BlockRenderer` component walks the
union and renders each variant. New block types are added by:

1. Extending the union in `types/content.ts`.
2. Adding a helper in `content/courses/_helpers.ts`.
3. Adding a case in `BlockRenderer`.

## Progress persistence

Progress lives entirely on the client in `localStorage` under
`roadmap.progress.v1`. The `useProgress` hook hydrates lazily and ignores
SSR. No accounts, no sync — by design. If you add server-side accounts in the
future, mirror the same shape in your DB and reuse `lessonKey`/`weekKey`.

## Search

`lib/search.ts` builds a Fuse.js index from `buildSearchIndex()` lazily on
first import. This keeps the Fuse bundle out of the initial route. The
`SearchDialog` component dynamically imports the search module on first open.

## Static generation

The site is statically renderable. `generateStaticParams()` is exported on
every dynamic route. Run `npm run build` to confirm; you should see
prerender entries for every lesson.

## Performance posture

- Tailwind purge keeps CSS small (`content/**/*.{ts,tsx}` is included so
  Tailwind sees classes used in content modules — relevant if you author
  Tailwind utility classes inside MDX-style content).
- Fuse and any heavy modules are dynamically imported.
- The lesson sidebar is sticky and rendered once per course; it does not
  re-render per lesson.
- No client-side data fetching — every page is a server component except
  where interactivity demands client.
