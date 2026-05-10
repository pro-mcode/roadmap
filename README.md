# Engineering Roadmap

A premium, production-grade engineering learning platform built with Next.js,
TypeScript, and Tailwind. Two structured 12-week courses ship with the
platform:

1. **Fintech & Web3 Engineering** — internet fundamentals → backend systems →
   ledgers, payments, treasury → smart contracts and DeFi → production
   infrastructure → capstone.
2. **Rust + Smart Contract Security Auditor** — Rust foundations → EVM and
   Solidity audit-depth → vulnerability classes → audit methodology → Rust
   smart contract ecosystems (Solana, CosmWasm, NEAR) → competitive auditing
   and capstone.

Each week ships with objectives, concepts, deliverables, a review gate,
deep-explanation lessons, code examples, callouts, exercises, quizzes,
interview questions with model answers, and production insights.

## Stack

- Next.js 14 (App Router)
- React 18, TypeScript 5
- Tailwind CSS 3 with a dual-theme token system (dark / light / system)
- Lucide icons
- Fuse.js for client-side search
- next-themes for theme persistence

## Quick start

```bash
# install
npm install

# develop
npm run dev

# build
npm run build

# typecheck
npm run typecheck
```

The platform statically generates every course / week / lesson page through
`generateStaticParams`. There is no backend — content is fully expressed as
typed TypeScript modules and rendered server-side.

## Repository layout

```
app/                                Next.js App Router routes
  layout.tsx                        Root layout + theme provider
  page.tsx                          Marketing / landing page
  globals.css                       Design tokens + base styles
  courses/
    page.tsx                        All courses index
    [courseId]/
      page.tsx                      Course overview
      week/[weekId]/
        page.tsx                    Week overview
        lesson/[lessonId]/
          page.tsx                  Lesson page
  interview/
    page.tsx                        Interview prep index
    [topic]/page.tsx                Per-course interview set
  search/page.tsx                   Full search UI
  about/page.tsx                    About page
  not-found.tsx                     404

components/
  layout/                           AppShell, Topbar, Footer, sidebars
  learning/                         Lesson renderer, exercises, quizzes
  theme/                            Theme provider + toggle
  ui/                               Primitives (Button, Card, Badge, …)

content/
  courses/
    fintech-web3/                   Fintech & Web3 course
      index.ts                      Course assembly
      week-01.ts … week-12.ts       Weekly content
    rust-security-audit/            Rust security course
      index.ts
      week-01.ts … week-12.ts
    _helpers.ts                     Block authoring helpers (p, h2, code, …)

lib/
  content.ts                        Content registry + lookups
  progress.ts                       localStorage-backed progress store
  search.ts                         Lazy Fuse.js index
  utils.ts                          cn, slugify, formatMinutes

hooks/
  useProgress.ts                    Reactive progress hook

types/
  content.ts                        Course / Week / Lesson / Interview schema

styles/                             Reserved for additional stylesheets
docs/                               Authoring + architecture documentation
public/                             Static assets
```

## Documentation

- **[Architecture](docs/architecture.md)** — folder-by-folder explanation,
  data flow, and rendering pipeline.
- **[Content authoring guide](docs/content-authoring.md)** — how to add new
  courses, weeks, lessons, exercises, and interview questions.
- **[Design tokens](docs/design-tokens.md)** — the token system that drives
  the dark/light themes and component palettes.
- **[Contribution guide](CONTRIBUTING.md)** — how to propose content and code
  changes.

## Why this exists

Most engineering content stops at the tutorial layer — enough to compile,
not enough to design or audit production systems. This roadmap is built for
engineers who want to move into senior fintech, web3, and security work, and
who are willing to do the structured 12-week climb. The platform is the
delivery surface; the content is the curriculum.

## License

MIT — see [LICENSE](LICENSE).
