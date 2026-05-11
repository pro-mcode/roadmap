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

export const week02: Week = {
  id: "week-02",
  number: 2,
  title: "Graphs, dynamic programming, and interview drill",
  stage: "Applied",
  summary:
    "The senior-interview core: graphs, DP, and a structured drill so the patterns land in muscle memory.",
  objectives: [
    "Solve graph problems with BFS, DFS, topological sort, and union-find.",
    "Recognize DP problem shapes (knapsack, intervals, paths) and implement bottom-up.",
    "Drill medium-hard problems with a structured 90-minute format.",
    "Communicate solutions clearly under time pressure.",
  ],
  concepts: [
    "BFS, DFS, Dijkstra, BFS-shortest-path",
    "Topological sort, Kahn's algorithm",
    "Union-find with path compression",
    "DP shapes: knapsack, intervals, paths",
  ],
  deliverables: [
    "Topological sort + cycle detection.",
    "Coin-change DP with reconstruction.",
    "Three timed mock problems.",
  ],
  reviewGate:
    "Can you talk through a DP solution while writing it, the way you would in an interview?",
  stack: ["TypeScript or Go"],
  modules: [
    {
      id: "alg-w02-m1",
      title: "Graphs and DP",
      summary: "Pattern recognition is the senior interview skill.",
      progression: "advanced",
      lessons: [
        {
          id: "alg-w02-l1",
          slug: "graph-patterns",
          title: "Graph traversal patterns",
          summary:
            "BFS for shortest path on unweighted graphs. DFS for connected components and cycle detection. Toposort for ordering with dependencies.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["graphs", "interview"],
          blocks: blocks(
            code(
              "typescript",
              `// Kahn's toposort
function topo(n: number, edges: [number, number][]): number[] | null {
  const adj: number[][] = Array.from({length: n}, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  const q = indeg.flatMap((d, i) => d === 0 ? [i] : []);
  const out: number[] = [];
  while (q.length) {
    const u = q.shift()!; out.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return out.length === n ? out : null;
}`,
              "Cycle detection falls out of toposort for free.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-alg-w02-l1-1",
              level: "senior",
              category: "Graphs",
              question:
                "Given a dependency graph of tasks, how would you parallelize execution while respecting dependencies?",
              modelAnswer:
                "Toposort to get levels. Each level is a set of tasks with no remaining dependencies — execute them concurrently, then advance to the next level. Use indegree counters: decrement on each task completion, push to the ready set when it hits zero. This is the basis of build systems and workflow engines.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-alg-w02-set-1",
      level: "senior",
      category: "DP",
      question:
        "Walk me through coin change (min coins for amount N from a set of denominations).",
      modelAnswer:
        "DP table of size N+1, all infinity except dp[0] = 0. For each coin c, for each amount a from c to N: dp[a] = min(dp[a], dp[a-c] + 1). Answer is dp[N] or 'impossible' if infinity. Time O(N * coins), space O(N). For reconstruction, store the chosen coin per state.",
    },
  ],
  productionInsights: [
    {
      title: "Communicate while you solve",
      summary:
        "Interviewers grade approach as much as correctness.",
      details:
        "Talk through the structure choice, the complexity, the edge cases — even when stuck. A clear thought process under pressure is the signal senior interviewers actually evaluate.",
    },
  ],
};
