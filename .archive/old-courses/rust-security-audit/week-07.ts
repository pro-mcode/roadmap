import type { Week } from "@/types/content";
import { blocks, callout, code, p } from "@/content/courses/_helpers";
export const week07: Week = {
  id: "week-07",
  number: 7,
  title: "Static analysis, fuzzing, and invariant testing",
  stage: "Security Research Workflow",
  summary:
    "The tooling layer of audits. Slither, Mythril, Echidna, Medusa — and Foundry's invariant framework. We use them as force multipliers, not crutches.",
  objectives: [
    "Use Slither and Mythril to surface known patterns and lock down regressions.",
    "Write effective Foundry invariant tests that catch interaction bugs.",
    "Run Echidna or Medusa to fuzz contracts beyond hand-written tests.",
    "Combine differential testing across implementations.",
  ],
  concepts: [
    "Static analysis: detectors, false positives, suppression",
    "Fuzzing: shrinking, corpora, stateful sequences",
    "Invariant testing in Foundry vs Echidna",
    "Differential testing across multiple implementations",
  ],
  deliverables: [
    "Slither config tuned for your audit workflow.",
    "Foundry invariant test that catches a real interaction bug.",
    "Echidna campaign with custom properties for an AMM.",
  ],
  reviewGate:
    "Can you turn a written invariant ('total supply equals sum of balances') into a passing fuzz campaign?",
  stack: ["Foundry", "Slither", "Echidna", "Medusa"],
  modules: [
    {
      id: "w07-m1",
      title: "Tooling for auditors",
      summary:
        "Tools won't find every bug, but they'll find the same bug consistently — saving your eyes for the hard ones.",
      lessons: [
        {
          id: "w07-l1",
          slug: "invariant-testing-foundry",
          title: "Invariant testing in Foundry",
          summary:
            "Define a property that should never break, then let the engine try to break it.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["foundry", "invariants", "fuzzing"],
          blocks: blocks(
            code(
              "solidity",
              `// invariant: x * y >= k for any sequence of operations
contract VaultInvariant is Test {
    Vault vault;
    Handler handler;

    function setUp() public {
        vault = new Vault();
        handler = new Handler(vault);
        targetContract(address(handler));
    }

    function invariant_totalAssetsCoversShares() public {
        assertGe(vault.totalAssets(), vault.totalShares() * vault.pricePerShare());
    }
}

contract Handler {
    Vault vault;
    constructor(Vault v) { vault = v; }
    function deposit(uint256 amt) public { vault.deposit(bound(amt, 0, 1e24)); }
    function withdraw(uint256 amt) public { vault.withdraw(bound(amt, 0, 1e24)); }
}`,
              "An invariant test that fuzzes sequences of deposit/withdraw.",
            ),
            callout(
              "production",
              "Use a Handler contract instead of fuzzing the Vault directly. Handlers let you bound inputs realistically and track cumulative state for stronger invariants.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w07-l1-1",
              level: "senior",
              category: "Fuzzing",
              question:
                "Why isn't 100% line coverage enough for a smart contract test suite?",
              modelAnswer:
                "Line coverage tells you each line ran at least once with one set of inputs — it doesn't test interactions, sequences, or boundary conditions. A function that handles 10 well at line 45 might fail at line 45 when called after a different state mutation. Invariant tests + fuzz tests + adversarial unit tests are how you cover sequences and boundaries. The mature signal is 'invariants pass after 10M random sequences', not 'lines covered'.",
            },
          ],
        },
        {
          id: "w07-l2",
          slug: "static-analysis-with-slither",
          title: "Slither: signal vs noise",
          summary:
            "Slither will flag dozens of issues on any non-trivial contract. The skill is filtering — keeping the real signals, suppressing the rest with explanation.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["slither", "static-analysis"],
          blocks: blocks(
            code(
              "bash",
              `# baseline scan
slither . --filter-paths "node_modules|test"

# focused scan with severity
slither . --detect reentrancy-eth,suicidal,uninitialized-state,arbitrary-send-eth

# emit a JSON report your CI can ingest
slither . --json slither-report.json`,
              "A practical Slither workflow.",
            ),
            p(
              "Slither's high-severity detectors (reentrancy-eth, suicidal, uninitialized-state) are the lowest-hanging fruit on any audit. Run them on day one. Lower-severity findings (e.g. naming conventions) are usually noise — suppress with config.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w07-set-1",
      level: "senior",
      category: "Tooling",
      question:
        "How do you decide between Echidna and Foundry's invariant tests?",
      modelAnswer:
        "Foundry invariants are the easiest first step — they live in the same toolchain as your unit tests, share fixtures, and are quick to write. Echidna is an older, more powerful fuzzer with property-based testing in Solidity itself, sequence shrinking, and deeper random search. Use Foundry for fast iteration and Echidna for deep, overnight campaigns. Medusa is a newer Go-based competitor with similar guarantees and tighter integration with Foundry projects.",
    },
  ],
  productionInsights: [
    {
      title: "Suppress noise with explanations",
      summary:
        "Every suppressed warning needs a comment explaining why.",
      details:
        "A suppressed warning without explanation rots: future readers don't know if it was OK or someone gave up. Treat suppressions like security assumptions — write them down, review them on every audit pass.",
    },
  ],
};
