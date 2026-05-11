import type { Week } from "@/types/content";
import {
  blocks,
  callout,
  code,
  h2,
  h3,
  p,
  ul,
} from "@/content/courses/_helpers";

export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Core structures with backend stakes",
  stage: "Foundations",
  summary:
    "Hash maps, heaps, intervals, and the patterns that turn into real systems — rate limiters, schedulers, dedupers.",
  objectives: [
    "Use hash maps with custom hashing and eviction (LRU/LFU).",
    "Apply heaps to scheduling, top-k, and priority queues.",
    "Solve interval problems with sweep-line and segment trees.",
    "Translate each structure to a backend scenario.",
  ],
  concepts: [
    "Hash maps, load factor, open addressing",
    "Binary heaps, d-ary heaps, indexed heaps",
    "Interval scheduling, sweep-line",
    "LRU/LFU caches",
  ],
  deliverables: [
    "LRU cache in 30 lines.",
    "Top-k stream solver with a min-heap.",
  ],
  reviewGate:
    "Given a real backend problem, can you justify your structure choice in one paragraph?",
  stack: ["TypeScript or Go"],
  modules: [
    {
      id: "alg-w01-m1",
      title: "Structures with stakes",
      summary: "Structures, but with the backend reason for each one.",
      progression: "core",
      lessons: [
        {
          id: "alg-w01-l1",
          slug: "lru-cache",
          title: "LRU cache: hash map + doubly linked list",
          summary:
            "Every backend engineer is asked to build this. Here's why the structure is the way it is.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["cache", "interview"],
          blocks: blocks(
            code(
              "typescript",
              `class LRU<K, V> {
  private map = new Map<K, V>();
  constructor(private cap: number) {}

  get(k: K): V | undefined {
    if (!this.map.has(k)) return;
    const v = this.map.get(k)!;
    this.map.delete(k);
    this.map.set(k, v); // move to end = most-recent
    return v;
  }

  set(k: K, v: V): void {
    if (this.map.has(k)) this.map.delete(k);
    else if (this.map.size >= this.cap) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
    this.map.set(k, v);
  }
}`,
              "Map preserves insertion order — that's the linked list.",
            ),
            callout(
              "insight",
              "In JavaScript, Map gives you the doubly-linked list for free. In Go or Java, you build the node list yourself.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-alg-w01-l1-1",
              level: "senior",
              category: "Algorithms",
              question: "Why is LRU O(1) for both get and set?",
              modelAnswer:
                "Hash map gives O(1) key lookup → node. Doubly linked list gives O(1) move-to-front and O(1) remove-tail. Combined: both operations touch a constant number of pointers regardless of cache size.",
            },
          ],
        },
        {
          id: "alg-w01-l2",
          slug: "heaps-for-scheduling",
          title: "Heaps for scheduling and top-k",
          summary:
            "When you need 'smallest now' on a moving stream, you want a heap.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["heap", "streaming"],
          blocks: blocks(
            p(
              "Top-k of a stream is a min-heap of size k. Each new value: if heap.size < k push; else if value > heap.peek() replace root. O(log k) per element, O(k) space.",
            ),
            callout(
              "tip",
              "Indexed heaps (where you can update a key by ID) are a senior-interview favorite. Practice the implementation once.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Match the structure to the access pattern",
      summary:
        "The wrong structure is a slow query in disguise.",
      details:
        "Most performance regressions trace back to using a list where a set should be, or scanning where indexing would do. When latency rises, audit your structures first.",
    },
  ],
};
