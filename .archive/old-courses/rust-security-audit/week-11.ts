import type { Week } from "@/types/content";
import { blocks, callout, ol } from "@/content/courses/_helpers";

export const week11: Week = {
  id: "week-11",
  number: 11,
  title: "Real-world incidents and post-mortems",
  stage: "Security Research Workflow",
  summary:
    "Studying real exploits is the fastest way to internalize a vulnerability class. We work through canonical incidents and abstract the patterns.",
  objectives: [
    "Reconstruct three high-profile exploits from on-chain data.",
    "Identify the warning signs the audit missed (or could have caught).",
    "Translate each incident into a personal cheatsheet entry.",
    "Run a tabletop exercise simulating an exploit response.",
  ],
  concepts: [
    "Etherscan forensics, transaction tracing",
    "Tenderly debugger, Phalcon explorer",
    "Post-mortem writing, root cause analysis",
    "Incident response: pause, communicate, remediate",
  ],
  deliverables: [
    "Three written reconstructions of real incidents in your own words.",
    "Tabletop exercise transcript and after-action notes.",
    "Three cheatsheet entries derived from the incidents.",
  ],
  reviewGate:
    "Given a transaction hash on Etherscan, can you tell the story of an exploit step-by-step?",
  stack: ["Etherscan", "Tenderly", "Foundry", "Phalcon"],
  modules: [
    {
      id: "w11-m1",
      title: "Reading the chain",
      summary:
        "On-chain data is the source of truth. Auditors who can read it learn faster than those who can't.",
      lessons: [
        {
          id: "w11-l1",
          slug: "reconstructing-an-exploit",
          title: "Reconstructing an exploit from on-chain data",
          summary:
            "Walk through how to take a single attacker transaction and reverse-engineer the bug it exploited.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["forensics", "incident-response"],
          blocks: blocks(
            ol([
              "Find the attacker EOA — usually visible from the protocol's loss disclosure.",
              "Trace each transaction in chronological order. Note token transfers, contract calls, value flows.",
              "For each contract called, inspect the source. If unverified, decompile or trace via Tenderly.",
              "Identify the function that mutated state in a way the protocol didn't anticipate. That's the bug.",
              "Walk back: what assumption did the protocol have that the attacker violated?",
              "Write the bug as a single sentence. If you can't, you're not done.",
            ]),
            callout(
              "tip",
              "Keep a personal Foundry repro of every major exploit you study. Forking mainnet and replaying the attack in a unit test is the fastest way to internalize the bug.",
            ),
          ),
        },
        {
          id: "w11-l2",
          slug: "incident-response-tabletop",
          title: "Tabletop: 'we just got drained, what now?'",
          summary:
            "The runbook every protocol team practices and every auditor should be able to facilitate.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["incident-response", "operations"],
          blocks: blocks(
            ol([
              "Detect: monitor alerts on TVL, on-chain anomalies, dashboards.",
              "Confirm: is this a real exploit or an alarm bug? Sanity-check on Etherscan.",
              "Pause: if a pause function exists, use it. Buy time.",
              "Communicate: pre-drafted statement on Twitter, Discord, status page.",
              "Investigate: assemble the incident channel; freeze relevant funds where possible.",
              "Remediate: ship the fix; coordinate with white-hats and law enforcement; recover funds where possible.",
              "Post-mortem: write it publicly, take ownership, name the root cause and the fix.",
            ]),
            callout(
              "warning",
              "The communication phase makes or breaks user trust. Silence reads as evasion. A clear, owned post-mortem within 72 hours preserves the protocol's reputation even after a drain.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w11-set-1",
      level: "senior",
      category: "Incident response",
      question:
        "What's the difference between a good and a bad post-mortem?",
      modelAnswer:
        "A bad post-mortem is defensive — emphasizes how clever the attacker was and how the team did their best. A good post-mortem names the root cause precisely, owns the missing test, lists the new guardrails, and credits the people who helped. The signal isn't 'we got attacked'; it's 'here is what we changed structurally so this class of bug can't recur'. Read Compound's, MakerDAO's, and Beanstalk's post-mortems for examples of the high bar.",
    },
  ],
  productionInsights: [
    {
      title: "Build your incident library",
      summary:
        "Maintain a folder of reconstructed exploits with your own writeup.",
      details:
        "A few pages per incident, walked through with code references and your own commentary, builds a body of pattern-matching knowledge that auto-fires the next time you see something similar in an audit. The Rekt News archive is an excellent starting source.",
    },
  ],
};
