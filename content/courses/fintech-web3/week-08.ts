import type { Week } from "@/types/content";
import { blocks, callout, code, diagram, h2, h3, p } from "@/content/courses/_helpers";
export const week08: Week = {
  id: "week-08",
  number: 8,
  title: "Web3 fundamentals: blockchains, EVM, and Solidity",
  stage: "Web3 Systems",
  summary:
    "Pivot to Web3 with a precise mental model: what a blockchain is, how the EVM works, and how Solidity contracts actually execute.",
  objectives: [
    "Explain consensus, blocks, gas, accounts, and storage at the EVM level.",
    "Read Solidity fluently and identify common patterns and anti-patterns.",
    "Use Foundry to compile, test, and deploy contracts.",
    "Understand state, calldata, memory, and the gas costs of each.",
  ],
  concepts: [
    "PoW vs PoS, finality, reorgs, MEV intro",
    "Accounts (EOA vs contract), nonces, ABI encoding",
    "Storage slots, packed types, transient storage",
    "Foundry: forge, cast, anvil",
    "Reentrancy, checks-effects-interactions",
  ],
  deliverables: [
    "Annotated diagram of how a transaction propagates from wallet to chain.",
    "ERC-20 implementation with full Foundry test suite.",
    "Storage layout diagram for a real contract you read.",
  ],
  reviewGate:
    "Can you predict the storage slot of any state variable in a contract you've never seen?",
  stack: ["Solidity", "Foundry", "EVM"],
  modules: [
    {
      id: "w08-m1",
      title: "EVM mental model",
      summary:
        "Smart contracts are just bytecode running in a deterministic VM. Once you internalize that, security and gas optimization stop feeling magical.",
      lessons: [
        {
          id: "w08-l1",
          slug: "evm-internals",
          title: "EVM internals: storage, memory, calldata, gas",
          summary:
            "The four data locations and what they cost. The single most leveraged piece of knowledge for both correctness and gas.",
          estimatedMinutes: 40,
          difficulty: "intermediate",
          tags: ["evm", "solidity", "gas"],
          blocks: blocks(
            h2("Storage"),
            p(
              "Each contract has a 256-bit keyed key-value store. Each non-zero slot costs 20,000 gas to set initially and 2,900 gas to update — these are the most expensive operations in the EVM. Solidity packs sequential variables into the same slot when they fit (e.g. two uint128, or one uint64 and one address).",
            ),
            code(
              "solidity",
              `contract Layout {
    uint128 a;     // slot 0, lower 16 bytes
    uint128 b;     // slot 0, upper 16 bytes  (packed!)
    address owner; // slot 1, lower 20 bytes
    bool    paused;// slot 1, byte 20         (packed)
    uint256 big;   // slot 2 (won't fit with packing)
}`,
              "Solidity's storage packing in action.",
            ),
            h3("Memory"),
            p(
              "Memory is a per-call linear byte array. Cheaper than storage but expensive when it grows quadratically with size. Always the location for in-call working data.",
            ),
            h3("Calldata"),
            p(
              "Calldata is the immutable input to an external call. The cheapest data location. Any function parameter that you don't need to mutate should be `calldata`, not `memory`.",
            ),
            callout(
              "tip",
              "When optimizing, your first sweep is always: are loops reading from storage? Cache to a stack variable once.",
            ),
          ),
          exercises: [
            {
              id: "w08-l1-e1",
              title: "Predict storage slots",
              difficulty: "intermediate",
              prompt:
                "Given a contract with three state variables of varying types, write down which slots they occupy and the byte offsets. Verify with `forge inspect <contract> storageLayout`.",
              acceptanceCriteria: [
                "Pack ordering accounts for whether the next variable fits in the remaining slot bytes.",
                "Mappings and dynamic arrays use their slot's keccak as the data root.",
              ],
            },
          ],
          interviewQuestions: [
            {
              id: "iv-w08-l1-1",
              level: "senior",
              category: "EVM",
              question:
                "Why is `memory` cheap for small data but suddenly expensive when it grows large?",
              modelAnswer:
                "Memory is charged linearly up to a threshold and quadratically beyond. The formula is `Cmem(n) = 3n + n²/512` words. So a 1KB buffer is fine; a 1MB buffer is prohibitively expensive. This is intentional — it bounds the cost of pathological allocations and discourages on-chain storage of large blobs.",
            },
          ],
        },
        {
          id: "w08-l2",
          slug: "foundry-workflow",
          title: "Foundry workflow: forge, cast, anvil",
          summary:
            "The toolchain that has displaced Hardhat for serious smart-contract teams. Speed, cheatcodes, and Solidity-native tests.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["foundry", "tooling"],
          blocks: blocks(
            code(
              "bash",
              `# Initialize a project and install OpenZeppelin
forge init my-vault
cd my-vault
forge install OpenZeppelin/openzeppelin-contracts

# Run tests with stack traces
forge test -vvvv

# Fork mainnet and test against real state
forge test --fork-url $RPC_URL --match-test test_LiveOracle

# Deploy with explicit gas, broadcast, and a script
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify`,
              "Day-one Foundry commands.",
            ),
            h3("Cheatcodes"),
            p(
              "Foundry exposes 'cheatcodes' that mutate VM state for tests: `vm.warp` skips time, `vm.deal` sets ETH balances, `vm.startPrank` impersonates accounts, `vm.expectRevert` asserts a specific revert. They are the difference between testing 'happy path' and testing real adversarial scenarios.",
            ),
          ),
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w08-set-1",
      level: "senior",
      category: "Solidity",
      question:
        "Explain the checks-effects-interactions pattern with a concrete example.",
      modelAnswer:
        "Order your function as: (1) all input checks (require, revert), (2) all state mutations, (3) any external calls. The classic violation is updating state AFTER calling an external contract — the called contract can re-enter and exploit the stale state. Reentrancy guards (a mutex flag) backstop the pattern but the discipline is to write code that doesn't need them.",
      realWorldExample:
        "The 2016 DAO hack drained ~$60M because withdraw() called the external contract before zeroing the user's balance. The recipient's fallback re-entered withdraw() and drained funds before the balance was set.",
    },
  ],
  productionInsights: [
    {
      title: "Read the bytecode",
      summary:
        "Solidity is a high-level language. The EVM doesn't speak Solidity.",
      details:
        "Use `forge inspect <contract> ir-optimized` and `forge inspect <contract> bytecode` to see what your code becomes. Many security bugs hide in the gap between what the developer intended and what the EVM actually executes.",
    },
  ],
};
