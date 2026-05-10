import type { Week } from "@/types/content";
import { blocks, callout, code, p, ul } from "@/content/courses/_helpers";
export const week09: Week = {
  id: "week-09",
  number: 9,
  title: "CosmWasm, NEAR, and Substrate",
  stage: "Rust Smart Contract Ecosystems",
  summary:
    "The other Rust contract ecosystems each have their own runtime model. We sketch them at audit depth so you can move between them confidently.",
  objectives: [
    "Read and audit CosmWasm contracts (instantiate / execute / query / migrate).",
    "Understand NEAR's storage staking and async cross-contract calls.",
    "Sketch a Substrate pallet and the runtime upgrade model.",
    "Map the canonical vulnerability classes for each ecosystem.",
  ],
  concepts: [
    "CosmWasm: actor model, IBC, sudo, migrate",
    "NEAR: gas, storage staking, promise-based async",
    "Substrate: pallets, runtime upgrades, FRAME",
    "Cross-ecosystem invariants",
  ],
  deliverables: [
    "A small CosmWasm escrow contract with full test suite.",
    "A NEAR contract that handles cross-contract calls correctly.",
    "Audit checklist comparing the three ecosystems' canonical vulns.",
  ],
  reviewGate:
    "Can you predict where state lives, who pays for it, and how upgrades work in each of the three ecosystems?",
  stack: ["Rust", "CosmWasm", "NEAR", "Substrate"],
  modules: [
    {
      id: "w09-m1",
      title: "Three ecosystems, one Rust",
      summary:
        "Each runtime has its own quirks. Knowing them is what makes a Rust auditor genuinely cross-chain.",
      lessons: [
        {
          id: "w09-l1",
          slug: "cosmwasm-actor-model",
          title: "CosmWasm: contracts as actors",
          summary:
            "CosmWasm contracts process messages, return responses, and dispatch follow-up actions. The actor model shapes how state and security work.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["cosmwasm", "rust"],
          blocks: blocks(
            code(
              "rust",
              `pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg)
    -> Result<Response, ContractError>
{
    match msg {
        ExecuteMsg::Deposit {} => execute_deposit(deps, env, info),
        ExecuteMsg::Withdraw { amount } => execute_withdraw(deps, env, info, amount),
        ExecuteMsg::Migrate {} => Err(ContractError::Unauthorized {}),
    }
}`,
              "The shape of every CosmWasm contract.",
            ),
            ul([
              "instantiate runs once when the contract is created.",
              "execute mutates state.",
              "query is read-only.",
              "migrate runs on upgrades — must validate old → new state shape.",
              "sudo is invoked by the chain itself (governance), not by users.",
            ]),
            callout(
              "warning",
              "Migrate functions that don't validate the previous version's state can corrupt storage on upgrade. This is the canonical CosmWasm bug.",
            ),
          ),
        },
        {
          id: "w09-l2",
          slug: "near-promises",
          title: "NEAR: promises, callbacks, and storage staking",
          summary:
            "NEAR contracts are async-first. Cross-contract calls return promises; you must register callbacks to handle results.",
          estimatedMinutes: 25,
          difficulty: "senior",
          tags: ["near", "rust"],
          blocks: blocks(
            p(
              "Cross-contract calls on NEAR don't return synchronously. You issue a promise, then declare a callback that runs after the call completes — possibly with success or failure. Forgetting to handle the failure path is one of the most common NEAR bugs.",
            ),
            code(
              "rust",
              `#[ext_contract(ext_token)]
trait Token {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
}

pub fn withdraw(&mut self, amount: U128) -> Promise {
    let promise = ext_token::ext(self.token.clone())
        .with_attached_deposit(1)
        .ft_transfer(env::predecessor_account_id(), amount, None);
    promise.then(
        Self::ext(env::current_account_id())
            .with_static_gas(Gas(5 * TGAS))
            .on_withdraw(amount)
    )
}`,
              "A promise + callback in a NEAR contract.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w09-l2-1",
              level: "senior",
              category: "NEAR",
              question:
                "What goes wrong if you debit a user's balance before a cross-contract transfer and don't handle the failure callback?",
              modelAnswer:
                "If the transfer fails (token contract reverts, gas exhaustion, panicked callback), the user's balance has already been debited but they never receive the tokens. Senior NEAR engineering treats this like distributed-system saga compensation: debit only after the callback succeeds, or implement a refund path in the on-failure callback. Always test the failure callback explicitly.",
            },
          ],
        },
      ],
    },
  ],
  interviewSet: [
    {
      id: "iv-w09-set-1",
      level: "senior",
      category: "Cross-chain audits",
      question:
        "What's the same about auditing CosmWasm, NEAR, and Solana?",
      modelAnswer:
        "All three are Rust, all three reward typed account/state models, all three penalize implicit assumptions. The vulnerability classes look slightly different (Solana has account confusion, NEAR has callback failure, CosmWasm has migrate corruption) but the underlying methodology is identical: enumerate actors and assets, list privileged operations, verify invariants under adversarial conditions, and write a suite of property tests. Once your audit framework is rigorous, the ecosystem-specific vocabulary is a translation problem.",
    },
  ],
  productionInsights: [
    {
      title: "Test the failure path on every cross-contract call",
      summary:
        "On any chain with async cross-contract calls, a failed downstream call is the main bug class.",
      details:
        "Whether on NEAR or via IBC on CosmWasm, if you don't have a test that proves your contract behaves correctly when the downstream call reverts, you have an open finding. Compose explicit failure tests using the runtime's built-in mocks (workspaces-rs on NEAR, cw-multi-test for CosmWasm).",
    },
  ],
};
