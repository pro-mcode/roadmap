# Engineering Roadmap

A premium engineering academy built with Next.js, TypeScript, and Tailwind.
Ten standalone courses, six career paths, one coherent 24-week master roadmap
that takes a working backend engineer to senior fintech, distributed-systems,
or smart-contract security work.

## Curriculum

Ten dedicated courses, sequenced from language fluency to protocol security:

| #  | Course                        | Weeks | Discipline       | Progression  |
|----|-------------------------------|-------|------------------|--------------|
| 1  | TypeScript                    | 2     | Language         | Beginner     |
| 2  | Node.js + Express             | 3     | Backend          | Intermediate |
| 3  | Database Design (SQL & NoSQL) | 2     | Data             | Intermediate |
| 4  | Algorithms & Data Structures  | 2     | Computer Science | Intermediate |
| 5  | System Design                 | 4     | Architecture     | Advanced     |
| 6  | Golang                        | 3     | Language         | Intermediate |
| 7  | Blockchain Fundamentals       | 2     | Blockchain       | Intermediate |
| 8  | Solidity                      | 2     | Blockchain       | Intermediate |
| 9  | Rust Language                 | 2     | Language         | Intermediate |
| 10 | Smart Contract Security       | 2     | Security         | Advanced     |
|    | **Total**                     | **24**| —                | —            |

Each course is self-contained. Take one at a time, chain several into a career
path, or commit to the full 24-week master roadmap.

## Career paths

Pre-chained sequences of courses tuned for a specific outcome:

- **Fintech Backend Engineer** (11w) — TypeScript → Node.js → Database → System Design
- **Distributed Systems Engineer** (11w) — Go → Database → System Design → Algorithms
- **Smart Contract Engineer** (8w) — TypeScript → Blockchain → Solidity → Security
- **Smart Contract Auditor** (8w) — Rust → Blockchain → Solidity → Security
- **Full-stack Crypto Engineer** (9w) — TypeScript → Node.js → Blockchain → Solidity
- **Master 24-week Roadmap** — every course in optimal sequence

## Each course ships with

- Course overview, learning objectives, audience, prerequisites
- Beginner → Intermediate → Advanced progression label
- Modules, lessons, and sub-lessons with deep prose, code, diagrams, callouts
- Exercises with acceptance criteria
- Projects with deliverables and estimated hours
- Interview-style questions with model answers
- Production architecture examples and case studies
- Capstone project
- Weekly review gates and stack lists

## Stack

- Next.js 14 (App Router) with static generation for every page
- React 18, TypeScript 5
- Tailwind CSS 3 with a dual-theme design-token system
- Lucide icons
- Fuse.js for client-side search

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # full TypeScript check
```

There is no backend. Content is expressed as typed TypeScript modules and
rendered server-side; every course, week, lesson, and career-path URL is
statically generated via `generateStaticParams`.

## Repository layout

```
app/
  layout.tsx                       Root layout + theme provider
  page.tsx                         Landing page
  courses/
    page.tsx                       All courses (grouped by discipline)
    [courseId]/
      page.tsx                     Course overview (dynamic weeks)
      week/[weekId]/
        page.tsx                   Week overview
        lesson/[lessonId]/
          page.tsx                 Lesson page
  paths/
    page.tsx                       All career paths
    [pathId]/page.tsx              Path detail with course sequence
  interview/                       Interview prep
  search/page.tsx                  Full search UI

components/
  layout/                          AppShell, Topbar, Footer, sidebars
  learning/                        Lesson renderer, exercises, quizzes
  theme/                           Theme provider + toggle
  ui/                              Primitives

content/
  courses/
    typescript/                    2-week language course
    nodejs-express/                3-week runtime + framework course
    golang/                        3-week language course
    database-design/               2-week data course
    algorithms/                    2-week CS / interview course
    system-design/                 4-week architecture course
    blockchain-fundamentals/       2-week EVM substrate course
    solidity/                      2-week protocol-engineering course
    rust-language/                 2-week language course
    smart-contract-security/       2-week security / audit course
    _helpers.ts                    Block authoring helpers

lib/
  content.ts                       Course registry + lookups
  career-paths.ts                  Career-path definitions
  progress.ts                      localStorage-backed progress
  search.ts                        Lazy Fuse.js index
  utils.ts                         cn, slugify, accent map

types/
  content.ts                       Course / Week / Module / Lesson schema
```

## Documentation

- **[Architecture](docs/architecture.md)** — folder-by-folder explanation
- **[Content authoring guide](docs/content-authoring.md)** — how to add or edit
  courses, weeks, lessons, projects, and career paths
- **[Design tokens](docs/design-tokens.md)** — the token system that drives
  the themes and component palettes
- **[Contribution guide](CONTRIBUTING.md)** — how to propose content and code
  changes

## Why this exists

Most engineering content stops at the tutorial layer — enough to compile, not
enough to design or audit production systems. This platform is built for
engineers who want to move into senior fintech, distributed-systems, or
smart-contract security work, and who are willing to do the structured climb.
The platform is the delivery surface; the curriculum is the content.

## License

MIT — see [LICENSE](LICENSE).
