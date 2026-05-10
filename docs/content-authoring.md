# Content authoring guide

This guide explains how to add and edit content in the platform. The schema
is enforced by TypeScript, so the compiler will catch most mistakes; this
document is the human-readable map.

## Where content lives

```
content/courses/<course-slug>/
  index.ts              # Course metadata + assembly
  week-01.ts            # Week 1 content
  week-02.ts            # …
  …
  week-12.ts            # Week 12 content
```

Each course has an `index.ts` that imports its weekly modules and exports a
single `Course` object. `lib/content.ts` then registers it in the global
course list.

## Adding a new lesson

Open the appropriate `week-NN.ts` and add a `Lesson` to one of the modules:

```ts
import { blocks, p, h2, code, callout } from "@/content/courses/_helpers";

const myLesson: Lesson = {
  id: "wXX-l1",
  slug: "my-new-lesson",
  title: "My new lesson",
  summary: "One-sentence description used in cards and search.",
  estimatedMinutes: 25,
  difficulty: "intermediate",
  tags: ["topic", "subtopic"],
  blocks: blocks(
    h2("A section heading"),
    p("A paragraph of explanatory prose."),
    code("typescript", `const example = 1;`, "Optional caption."),
    callout("tip", "Short, opinionated, concrete."),
  ),
};
```

### Block helpers

`content/courses/_helpers.ts` exports tiny constructors that keep authoring
ergonomic:

| Helper | Description |
|--------|-------------|
| `p(text)` | Paragraph |
| `h2(text)`, `h3(text)` | Headings |
| `ul([…])`, `ol([…])` | Lists |
| `code(language, code, caption?)` | Syntax-highlighted code block |
| `callout(variant, body, title?)` | Note / tip / warning / insight / production / tradeoff |
| `diagram(ascii, title?, caption?)` | Monospace ASCII architecture diagram |
| `table(headers, rows, caption?)` | Data table |
| `blocks(…)` | Convenience constructor for a `ContentBlock[]` |

### Callout variants

- `note` — neutral context.
- `tip` — recommended approach.
- `warning` — common pitfall.
- `insight` — deeper explanation.
- `production` — operational lesson from real systems.
- `tradeoff` — explicit pros/cons or design choice.

### Code language

Pass one of: `typescript`, `javascript`, `rust`, `solidity`, `go`, `python`,
`sql`, `bash`, `json`, `yaml`, `toml`, `text`. The renderer treats the
language as a label; if you want server-side highlighting, integrate Shiki
in `components/ui/CodeBlock.tsx` (the dependency is already in
`package.json`).

## Exercises

```ts
exercises: [
  {
    id: "wXX-lY-eN",
    title: "Short imperative title",
    difficulty: "intermediate",
    prompt: "What the learner is supposed to build.",
    acceptanceCriteria: [
      "Concrete, testable bullet 1.",
      "Concrete, testable bullet 2.",
    ],
    hints: ["Optional hint 1."],
    solutionSketch: "Optional brief solution sketch.",
  },
]
```

## Quizzes

```ts
quiz: [
  {
    id: "wXX-lY-qN",
    question: "Single-best-answer multiple choice.",
    options: ["A", "B", "C", "D"],
    correctIndex: 1,
    explanation: "Why B is right and the others aren't.",
  },
]
```

## Interview questions

```ts
interviewQuestions: [
  {
    id: "iv-wXX-lY-N",
    level: "senior",
    category: "Networking",
    question: "Open-ended question.",
    modelAnswer: "Substantive answer (3-6 sentences).",
    followUps: ["Follow-up 1", "Follow-up 2"],
    tradeoffs: ["Trade-off 1", "Trade-off 2"],
    realWorldExample: "An optional concrete real-world example.",
  },
]
```

Every interview question must have a `modelAnswer`. The renderer expands the
card on click; a missing answer breaks the UX.

## Resources

```ts
resources: [
  { title: "…", url: "…", kind: "article", author: "…", note: "…" },
]
```

`kind` is one of: `article`, `paper`, `video`, `docs`, `repo`, `book`,
`tool`. The badge uses this as a label.

## Production insights

```ts
productionInsights: [
  {
    title: "Short, opinionated.",
    summary: "One-sentence summary.",
    details: "A paragraph that explains the lesson and how to apply it.",
  },
]
```

These appear at the bottom of lessons (and at the bottom of week pages when
attached to weeks).

## Adding a new week

1. Create `content/courses/<slug>/week-NN.ts` with a `Week` export.
2. Import it in `content/courses/<slug>/index.ts` and add to the `weeks`
   array.

The sidebar, course page, and search index all derive their state from the
course list; nothing else needs updating.

## Adding a new course

1. Create `content/courses/<new-slug>/` with `index.ts` and weekly files.
2. Import the course in `lib/content.ts` and add it to the `courses` array.
3. Choose an `accent` color from `Course["accent"]` (currently
   `indigo | amber | rose | emerald | sky`). Add new accents in
   `app/page.tsx` and `app/courses/page.tsx` cards if introducing a new one.

## Tone and voice

- Prefer plain English. Avoid marketing-speak ("supercharge", "blazingly").
- Be opinionated. Senior engineers learn faster from "do this, here's why"
  than from "you might consider...".
- Use real failure modes and real production stories where you can.
- Keep callouts short — they're punchlines, not paragraphs.
- Code samples should be runnable in spirit even if shortened. Don't ship
  pseudocode that pretends to be real.
