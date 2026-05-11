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
  title: "The EVM execution model",
  stage: "Execution",
  summary:
    "Stack, memory, storage, calldata. Opcode-level gas reasoning. How calls, creates, and reverts actually work.",
  objectives: [
    "Read EVM bytecode at the opcode level.",
    "Distinguish stack vs memory vs storage and their costs.",
    "Compute gas costs for common patterns from opcode prices.",
    "Reason about CALL vs DELEGATECALL vs STATICCALL vs CREATE.",
  ],
  concepts: [
    "Stack, memory, storage, calldata",
    "Opcode pricing, cold/warm access",
    "CALL semantics and msg.sender propagation",
    "Reverts, returndata, error bubbling",
  ],
  deliverables: [
    "Annotated bytecode walkthrough of a simple Solidity function.",
    "Gas-cost analysis of a storage write vs a memory write.",
  ],
  reviewGate:
    "Why is the first SLOAD on a slot in a transaction more expensive than the second?",
  stack: ["evm.codes", "Foundry / cast"],
  modules: [
    {
      id: "bc-w02-m1",
      title: "EVM execution",
      summary: "The substrate every smart contract runs on.",
      progression: "core",
      lessons: [
        {
          id: "bc-w02-l1",
          slug: "memory-vs-storage",
          title: "Memory vs storage",
          summary:
            "Storage is persistent and expensive. Memory is temporary and cheap. The line between them is the biggest gas decision in any contract.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["evm", "gas"],
          blocks: blocks(
            ul([
              "SSTORE: 20k cold, 2.9k warm. SLOAD: 2.1k cold, 100 warm.",
              "MSTORE / MLOAD: 3 gas + memory expansion cost.",
              "Calldata is read-only; CALLDATALOAD is 3 gas.",
            ]),
            callout(
              "tip",
              "Cache storage reads to memory if you'll use them more than once. The savings show up immediately.",
            ),
          ),
        },
        {
          id: "bc-w02-l2",
          slug: "call-vs-delegatecall",
          title: "CALL vs DELEGATECALL vs STATICCALL",
          summary:
            "The same opcode family, three completely different semantics for who 'you' are.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["evm", "calls"],
          blocks: blocks(
            ul([
              "CALL: executes target's code with target's storage; msg.sender is your address.",
              "DELEGATECALL: executes target's code with YOUR storage; msg.sender is preserved from the caller. The basis of proxies.",
              "STATICCALL: like CALL but disallows state changes — used for views.",
            ]),
            callout(
              "warning",
              "Most proxy hacks come from misunderstanding DELEGATECALL. The target reads and writes the proxy's storage layout — keep them aligned or you'll corrupt state.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-bc-w02-l2-1",
              level: "senior",
              category: "EVM",
              question:
                "Why is upgrading via DELEGATECALL dangerous if the new implementation reorders storage slots?",
              modelAnswer:
                "DELEGATECALL runs the implementation's code against the proxy's storage. If the new implementation declares variables in a different order, slot indices shift — a uint256 that used to hold balance now holds totalSupply. State silently corrupts. The fix is reserved storage gaps and a strict 'append-only' rule for state variables in upgradeable contracts.",
            },
          ],
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Gas as a design constraint",
      summary:
        "On the EVM, your data layout is your performance budget.",
      details:
        "Pack structs into single slots when fields are small enough. Prefer events to storage for data you'll never need on-chain. The 21k baseline transaction cost is fixed; everything else is yours to design around.",
    },
  ],
};
