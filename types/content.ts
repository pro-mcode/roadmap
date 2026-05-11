/**
 * Content Schema
 * --------------
 * The platform is organized into ten standalone courses, each with its own
 * dedicated learning track. The content hierarchy is:
 *
 *   Course → Week → Module → Lesson → Sections (concept | code | callout
 *                                              | exercise | quiz | resource
 *                                              | interview)
 *
 * Career paths group multiple courses into a goal-oriented sequence
 * ("Fintech Backend Engineer", "Smart Contract Auditor", etc.).
 */

export type Difficulty = "beginner" | "intermediate" | "senior" | "staff";

export type ProgressionLevel = "beginner" | "intermediate" | "advanced";

export type Discipline =
  | "language"
  | "backend"
  | "infrastructure"
  | "architecture"
  | "data"
  | "computer-science"
  | "blockchain"
  | "security"
  | "interview";

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

export interface CaseStudy {
  title: string;
  summary: string;
  takeaways: string[];
  sourceUrl?: string;
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
  caseStudies?: CaseStudy[];
  /** Optional MDX content. If set, the renderer prefers MDX over blocks. */
  mdx?: string;
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  /** Where this module sits in the difficulty arc of the course. */
  progression?: "foundation" | "core" | "advanced";
  lessons: Lesson[];
}

export interface Week {
  id: string; // e.g. "week-01"
  number: number;
  title: string;
  stage: string; // human-readable phase name within the course
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

export interface Project {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  /** Module or week id that should unlock this project. */
  unlocksAfter?: string;
  deliverables: string[];
  estimatedHours: number;
}

export interface Assessment {
  id: string;
  title: string;
  summary: string;
  /** Which week this checkpoint sits at. */
  afterWeekId: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  durationWeeks: number;
  level: Difficulty;
  progressionLevel: ProgressionLevel;
  discipline: Discipline;
  outcomes: string[];
  prerequisites: string[];
  /** Course slugs the learner should ideally complete first. */
  prerequisiteCourses?: string[];
  audience: string;
  accent: "indigo" | "amber" | "rose" | "emerald" | "sky" | "violet" | "teal";
  weeks: Week[];
  projects?: Project[];
  assessments?: Assessment[];
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
  discipline: Discipline;
  progressionLevel: ProgressionLevel;
}

export interface SearchableItem {
  type: "course" | "week" | "lesson" | "interview" | "path";
  courseSlug: string;
  weekId?: string;
  lessonSlug?: string;
  title: string;
  summary: string;
  tags: string[];
  href: string;
}

export interface CareerPath {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** Total weeks across all courseSlugs. */
  durationWeeks: number;
  /** Ordered course slugs that compose this path. */
  courseSlugs: string[];
  description: string;
  outcomes: string[];
  audience: string;
  accent: Course["accent"];
}
