/**
 * Content Schema
 * --------------
 * The platform is structured around a hierarchical content model:
 *
 *   Course → Week → Module/Lesson → Sections (concept | code | callout
 *                                            | exercise | quiz | resource
 *                                            | interview)
 *
 * Content lives in /content/courses/<course-slug>/week-NN.ts and is
 * rendered by a single lesson engine. The schema is intentionally
 * structured (rather than freeform MDX) so that:
 *   - search/indexing has typed access to every block
 *   - progress tracking can resolve lesson IDs deterministically
 *   - we can swap renderers without rewriting content
 *
 * The schema also accepts an optional `mdx` field on a lesson so that
 * authors who prefer MDX can opt into it on a per-lesson basis.
 */

export type Difficulty = "beginner" | "intermediate" | "senior" | "staff";

export type CalloutVariant =
  | "note"
  | "tip"
  | "warning"
  | "insight"
  | "production"
  | "tradeoff";

export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "rust"
  | "solidity"
  | "go"
  | "python"
  | "sql"
  | "bash"
  | "json"
  | "yaml"
  | "toml"
  | "text";

export interface ParagraphBlock {
  kind: "paragraph";
  text: string;
}

export interface HeadingBlock {
  kind: "heading";
  level: 2 | 3 | 4;
  text: string;
}

export interface ListBlock {
  kind: "list";
  ordered?: boolean;
  items: string[];
}

export interface CodeBlock {
  kind: "code";
  language: CodeLanguage;
  code: string;
  caption?: string;
  highlight?: number[];
}

export interface CalloutBlock {
  kind: "callout";
  variant: CalloutVariant;
  title?: string;
  body: string;
}

export interface DiagramBlock {
  kind: "diagram";
  title?: string;
  caption?: string;
  ascii: string; // monospace-rendered architecture diagram
}

export interface TableBlock {
  kind: "table";
  caption?: string;
  headers: string[];
  rows: string[][];
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | DiagramBlock
  | TableBlock;

export interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  acceptanceCriteria: string[];
  hints?: string[];
  solutionSketch?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Resource {
  title: string;
  url: string;
  kind: "article" | "paper" | "video" | "docs" | "repo" | "book" | "tool";
  author?: string;
  note?: string;
}

export interface InterviewQuestion {
  id: string;
  level: Difficulty;
  category: string;
  question: string;
  modelAnswer: string;
  followUps?: string[];
  realWorldExample?: string;
  tradeoffs?: string[];
}

export interface ProductionInsight {
  title: string;
  summary: string;
  details: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  tags: string[];
  blocks: ContentBlock[];
  exercises?: Exercise[];
  quiz?: QuizQuestion[];
  interviewQuestions?: InterviewQuestion[];
  resources?: Resource[];
  productionInsights?: ProductionInsight[];
  /** Optional MDX content. If set, the renderer prefers MDX over blocks. */
  mdx?: string;
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Week {
  id: string; // e.g. "week-01"
  number: number;
  title: string;
  stage: string; // e.g. "Foundation Layer"
  summary: string;
  objectives: string[];
  concepts: string[];
  deliverables: string[];
  reviewGate: string;
  stack: string[];
  modules: Module[];
  /** Curated interview prep specific to this week. */
  interviewSet?: InterviewQuestion[];
  productionInsights?: ProductionInsight[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  durationWeeks: number;
  level: Difficulty;
  outcomes: string[];
  prerequisites: string[];
  audience: string;
  accent: "indigo" | "amber" | "rose" | "emerald" | "sky";
  weeks: Week[];
  capstone?: {
    title: string;
    summary: string;
    deliverables: string[];
  };
  authoredBy?: string;
  lastUpdated?: string;
}

export interface CourseIndexEntry {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  durationWeeks: number;
  accent: Course["accent"];
}

export interface SearchableItem {
  type: "course" | "week" | "lesson" | "interview";
  courseSlug: string;
  weekId?: string;
  lessonSlug?: string;
  title: string;
  summary: string;
  tags: string[];
  href: string;
}
