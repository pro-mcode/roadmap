import type { Week } from "@/types/content";
import { blocks, callout, code, diagram, h2, p, ul } from "@/content/courses/_helpers";
export const week04: Week = {
  id: "week-04",
  number: 4,
  title: "EVM internals and Solidity for security review",
  stage: "Blockchain + Smart Contract Security",
  summary:
    "Auditing Solidity requires reading like the EVM does. We'll go deeper than typical Solidity tutorials and build the bytecode-level intuition every senior auditor needs.",
  objectives: [
    "Map Solidity constructs to EVM opcodes and gas costs.",
    "Read storage layouts, including proxy slots and complex inheritance hierarchies.",
    "Reason about external calls, delegatecalls, and reentrancy at the opcode level.",
    "Use the `forge inspect` toolchain to verify intuitions against bytecode.",
  ],
  concepts: [
    "Stack, memory, storage, calldata, returndata, transient storage",
    "CALL, DELEGATECALL, STATICCALL, CALLCODE",
    "Transaction context: msg.sender, tx.origin, msg.value",
    "Storage slot computation, proxy storage clashes",
    "Gas costs for opcodes and storage operations",
  ],
  deliverables: [
    "Annotated reading of OpenZeppelin's TransparentUpgradeableProxy bytecode.",
    "A reentrancy demonstration in a Foundry test, then a fix.",
    "Storage layout map for a real audited contract.",
  ],
  reviewGate:
    "Given a Solidity function, can you predict its gas envelope ±20% before running it?",
  stack: ["Solidity", "Foundry", "EVM"],
  modules: [
    {
      id: "w04-m1",
      title: "Reading Solidity at audit depth",
      summary:
        "What separates an audit reviewer from a contract developer is depth of model.",
      lessons: [
        {
          id: "w04-l1",
          slug: "evm-context-and-calls",
          title: "EVM call context: CALL vs DELEGATECALL",
          summary:
            "The single most important distinction in EVM auditing. Get this wrong and proxy systems eat your collateral.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["evm", "solidity", "audit"],
          blocks: blocks(
            h2("CALL vs DELEGATECALL"),
            diagram(
              `CALL:        A → B          msg.sender = A,   storage = B
DELEGATECALL: A → B (logic)  msg.sender = caller(A), storage = A
STATICCALL:   A → B          read-only; no state changes
CALLCODE:     deprecated`,
              "Call context cheat sheet",
            ),
            p(
              "DELEGATECALL runs B's code in A's storage and msg.sender context. This is how proxy patterns work — but it also means a malicious DELEGATECALL target can rewrite the proxy's storage arbitrarily.",
            ),
            code(
              "solidity",
              `// CRITICAL audit pattern: anything that calls DELEGATECALL must
// constrain the target to a contract whose storage layout is compatible.
function upgrade(address newImpl) external onlyOwner {
    require(_validateLayout(newImpl), "incompatible layout");
    _setImplementation(newImpl);
}`,
              "Layout validation is rarely written; layout bugs are common.",
            ),
            callout(
              "warning",
              "Proxy storage collisions: if the proxy and the implementation both write slot 0, the implementation overwrites the admin. EIP-1967 standardizes pseudo-random slots to avoid this.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w04-l1-1",
              level: "senior",
              category: "Smart contract security",
              question:
                "A contract uses DELEGATECALL to a user-supplied address. What attacks are now possible?",
              modelAnswer:
                "Total compromise. The attacker's contract executes in your contract's storage and msg.sender context, so it can: rewrite any storage slot (zero out balances, change owner), do anything msg.sender can (transfer tokens you've approved), and make subsequent state assumptions wrong. The fix is to never DELEGATECALL to untrusted addresses. If you must, use a small trampoline that validates the call data and reverts on anything other than a whitelisted set of selectors. The wallet contract bug class (Parity multisig) is the canonical example.",
              realWorldExample:
                "The 2017 Parity wallet freezing incident locked ~$280M because the library contract was self-destructed via an unprotected initializer reachable through DELEGATECALL.",
            },
          ],
        },
        {
          id: "w04-l2",
          slug: "reentrancy-deeper",
          title: "Reentrancy: every flavor, with examples",
          summary:
            "Single-function reentrancy is well-known. Cross-function and read-only reentrancy still pass code review at most teams. We taxonomize all of them.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["reentrancy", "audit"],
          blocks: blocks(
            h2("The four flavors"),
            ul([
              "Single-function: a function calls external before updating its own state. Classic DAO bug.",
              "Cross-function: function A is reentered through function B, both modifying shared state.",
              "Cross-contract: contracts A and B share state through a library or controller; the call comes back through B.",
              "Read-only: the reentered function only reads state, but the read is used to make a decision elsewhere — and the read sees stale state mid-update.",
            ]),
            code(
              "solidity",
              `// Read-only reentrancy in a Curve-like LP token price oracle
function getLpPrice() public view returns (uint256) {
    // ❌ this read happens during a swap that has already updated reserves
    // but not the virtual price; consumers see a stale price they trust
    return pool.virtualPrice();
}`,
              "Read-only reentrancy reads stale views during a state mutation.",
            ),
            callout(
              "production",
              "OpenZeppelin's ReentrancyGuard protects single-contract reentrancy. It does not protect against read-only reentrancy in oracle consumers. You need protocol-level locks or oracle freshness checks.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w04-l2-1",
              level: "senior",
              category: "Reentrancy",
              question:
                "Where does ReentrancyGuard fail to protect you?",
              modelAnswer:
                "ReentrancyGuard mutexes a single contract. It does not protect cross-contract reentrancy where attacker reenters through a different contract that shares state, and it does not help with read-only reentrancy where downstream consumers read your contract's view functions during a mutation. Protocol-wide guards (a single global lock contract) and explicit freshness checks in oracle consumers are the real defenses.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w04-set-1",
      level: "senior",
      category: "Smart contract auditing",
      question:
        "Walk me through how you'd review an arbitrary upgradeable proxy.",
      modelAnswer:
        "Verify the proxy storage layout is EIP-1967 compliant (admin/impl/beacon slots). Confirm the admin role is held by a multisig with a timelock. Check the implementation's storage layout matches the previous version (forge inspect storage-layout). Confirm there's no constructor with side effects in the implementation (it never runs through the proxy). Look for initializer reentrancy and lockable initializers. Verify there are no public state-changing functions reachable on the implementation contract directly. Finally, test upgrades end-to-end on a forked mainnet.",
    },
  ],
  productionInsights: [
    {
      title: "Use forge inspect early",
      summary:
        "Bytecode is the source of truth. Solidity's source can lie.",
      details:
        "Run `forge inspect <Contract> ir-optimized` and `storageLayout` on every contract you audit. Solidity's optimizer can produce surprising bytecode; reading the IR catches a class of issues that source review misses (over-aggressive inlining, unexpected SLOADs, surprising masking).",
    },
  ],
};
