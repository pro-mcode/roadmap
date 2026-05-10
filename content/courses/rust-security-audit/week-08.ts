import type { Week } from "@/types/content";
import { blocks, callout, code, ul } from "@/content/courses/_helpers";
export const week08: Week = {
  id: "week-08",
  number: 8,
  title: "Rust smart contracts: Solana and Anchor",
  stage: "Rust Smart Contract Ecosystems",
  summary:
    "Solana's account model is the polar opposite of the EVM's storage model. Mastering Anchor and the Solana runtime opens the largest Rust contract ecosystem.",
  objectives: [
    "Understand Solana's account model, sysvars, and rent economics.",
    "Read and write Anchor programs idiomatically.",
    "Reason about cross-program invocations (CPI) and signer verification.",
    "Audit Anchor programs for the canonical Solana vulnerability classes.",
  ],
  concepts: [
    "Accounts, programs, PDAs, sysvars",
    "Rent, deposits, account size",
    "CPI, signer seeds, invoke_signed",
    "Anchor accounts macro, AccountInfo, Account, Signer types",
    "Solana-specific bugs: missing signer checks, missing owner checks, account confusion",
  ],
  deliverables: [
    "Anchor program implementing a vault with deposit, withdraw, and admin operations.",
    "Audit checklist specific to Solana / Anchor.",
    "Foundry-style test suite for the program using Anchor's testing helpers.",
  ],
  reviewGate:
    "Can you list the five Solana checks every instruction must perform before mutating state?",
  stack: ["Rust", "Solana", "Anchor"],
  modules: [
    {
      id: "w08-m1",
      title: "Solana programs",
      summary:
        "A different mental model: data lives in accounts, programs are stateless.",
      lessons: [
        {
          id: "w08-l1",
          slug: "solana-account-model",
          title: "Solana's account model in 30 minutes",
          summary:
            "Programs don't have storage. State lives in accounts that the program reads and writes. PDAs let programs sign for accounts deterministically.",
          estimatedMinutes: 30,
          difficulty: "intermediate",
          tags: ["solana", "accounts"],
          blocks: blocks(
            ul([
              "Accounts have an owner (program), a balance (lamports), and arbitrary data.",
              "Programs are stateless — a single program can serve many accounts of the same type.",
              "PDAs (Program Derived Addresses) are off-curve addresses derived from seeds + program id; the program can sign for them via invoke_signed.",
              "Rent is paid via SOL deposits sized to the account; rent-exempt accounts don't get garbage collected.",
            ]),
            callout(
              "insight",
              "On Solana, every instruction lists the accounts it touches in advance. This is what enables parallelism — Solana scheduler can run non-overlapping instructions concurrently.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w08-l1-1",
              level: "senior",
              category: "Solana",
              question:
                "How is Solana's parallel execution different from Ethereum's?",
              modelAnswer:
                "Ethereum executes transactions strictly sequentially within a block. Solana's runtime parallelizes any two transactions whose account-touch sets don't overlap. This is why every instruction must declare its accounts up front — the scheduler builds a dependency graph from the declarations. The cost is that transactions must be conservative about what they touch; the benefit is genuine parallel throughput.",
            },
          ],
        },
        {
          id: "w08-l2",
          slug: "anchor-program-pattern",
          title: "Anchor: the canonical pattern",
          summary:
            "Anchor reduces boilerplate and adds compile-time safety. Most production Solana programs use it; learning to read it is essential.",
          estimatedMinutes: 30,
          difficulty: "senior",
          tags: ["anchor", "solana"],
          blocks: blocks(
            code(
              "rust",
              `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vault {
    use super::*;
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.balance = vault.balance.checked_add(amount).ok_or(ErrorCode::Overflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, has_one = authority)]
    pub vault: Account<'info, Vault>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode { #[msg("overflow")] Overflow }`,
              "An idiomatic Anchor program.",
            ),
            callout(
              "warning",
              "Anchor's `Account<'info, T>` validates the discriminator and the owner program. Plain `AccountInfo<'info>` does not. Mixing them is the most common Solana audit finding.",
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
      category: "Solana security",
      question:
        "List the canonical Solana vulnerability classes auditors check for.",
      modelAnswer:
        "Missing signer check (instruction does privileged action without verifying msg.sender). Missing owner check (using AccountInfo instead of typed Account, allowing attacker to pass an account from a different program). Account confusion (a vault and a config account have the same layout, attacker passes the wrong one). Arithmetic without checked_* (overflow). Missing PDA validation (caller passes an arbitrary address claiming to be the vault PDA). Reinitialization (if init is not protected, attacker re-runs it after the legitimate user). Anchor mostly handles these via macros; raw programs must check by hand.",
    },
  ],
  productionInsights: [
    {
      title: "Type-safe accounts, every time",
      summary:
        "Use Anchor's Account<'info, T>, never AccountInfo<'info> in user-facing instructions.",
      details:
        "Account<'info, T> validates the program owner and the account discriminator. AccountInfo<'info> validates nothing. Mixing them is the canonical Solana foot-gun and the source of most account-confusion exploits.",
    },
  ],
};
