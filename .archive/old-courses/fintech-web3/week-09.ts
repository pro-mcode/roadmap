import type { Week } from "@/types/content";
import { blocks, callout, code, h2, h3, p } from "@/content/courses/_helpers";
export const week09: Week = {
  id: "week-09",
  number: 9,
  title: "DeFi systems: AMMs, lending, and bridges",
  stage: "Web3 Systems",
  summary:
    "The protocols that hold tens of billions of dollars on-chain — and the engineering trade-offs hiding in their elegance.",
  objectives: [
    "Derive the constant-product AMM and understand its slippage and impermanent-loss math.",
    "Explain how lending protocols compute interest, collateralization, and liquidations.",
    "Map the trust model of every major bridge architecture.",
    "Understand account abstraction and what ERC-4337 makes possible.",
  ],
  concepts: [
    "Constant product (Uniswap v2), concentrated liquidity (v3)",
    "Borrow/supply rates, collateral factors, liquidation cascades",
    "Bridge architectures: lock-mint, burn-mint, message-passing",
    "Account abstraction (ERC-4337), session keys, paymasters",
    "Oracle design: TWAP, Chainlink, push vs pull",
  ],
  deliverables: [
    "AMM in 200 lines of Solidity with full Foundry tests including invariant tests.",
    "Lending pool prototype with health factors and liquidations.",
    "Comparative threat model of three bridge architectures.",
  ],
  reviewGate:
    "Can you compute the slippage on a 5% liquidity pool trade by hand?",
  stack: ["Solidity", "Foundry", "Chainlink"],
  modules: [
    {
      id: "w09-m1",
      title: "AMMs and lending",
      summary: "The two primitive shapes that everything DeFi is built from.",
      lessons: [
        {
          id: "w09-l1",
          slug: "amm-math",
          title: "AMM math: x · y = k",
          summary:
            "The deceptively simple invariant behind hundreds of billions in trading volume. Once you derive it, everything from slippage to LP fees becomes obvious.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["amm", "defi", "math"],
          blocks: blocks(
            h2("The invariant"),
            p(
              "A Uniswap v2 pool holds reserves x (token0) and y (token1) and enforces x · y = k. A trader who deposits Δx receives Δy such that (x + Δx) · (y - Δy) = k. Solving: Δy = y · Δx / (x + Δx). Add a 0.3% fee by multiplying Δx by 0.997 first.",
            ),
            code(
              "solidity",
              `function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
    public pure returns (uint256 amountOut)
{
    uint256 amountInWithFee = amountIn * 997;
    uint256 numerator = amountInWithFee * reserveOut;
    uint256 denominator = reserveIn * 1000 + amountInWithFee;
    amountOut = numerator / denominator;
}`,
              "The exact formula Uniswap v2 uses on-chain.",
            ),
            h3("Slippage"),
            p(
              "Slippage grows non-linearly with trade size relative to pool depth. A 1% trade against the pool's reserves moves the price about 1%; a 10% trade moves it about 10%; a 50% trade moves it dramatically. This is why arbitrageurs find AMM pools so lucrative when they drift from CEX prices.",
            ),
            callout(
              "insight",
              "Concentrated liquidity (v3) lets LPs pick a price range. Inside the range, capital is much more efficient; outside, the LP earns nothing. It moves the work of choosing curves from protocol authors to LPs.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w09-l1-1",
              level: "senior",
              category: "DeFi",
              question:
                "Why is the spot price (from getReserves) a bad oracle?",
              modelAnswer:
                "Spot price is manipulable in a single transaction by a flash loan: borrow, swap to skew the pool, read the price, swap back, repay. The attack costs only fees. Use a TWAP (time-weighted average price) instead — Uniswap v2 records cumulative reserves, so any consumer can compute the average over any window. v3 publishes observations as a ring buffer for cheaper reads. For high-value pricing, prefer Chainlink or a multi-source oracle.",
            },
          ],
        },
        {
          id: "w09-l2",
          slug: "lending-protocols",
          title: "Lending protocols: collateral, liquidation, and risk",
          summary:
            "How Aave/Compound move billions without a credit team. The math of liquidation health factors and the engineering of cascade resistance.",
          estimatedMinutes: 35,
          difficulty: "senior",
          tags: ["lending", "liquidation", "defi"],
          blocks: blocks(
            h2("Health factor"),
            p(
              "A position is healthy when (collateralValue · ltv) > debt. The health factor is (collateralValue · liquidationThreshold) / debt. When it drops below 1.0, the position is liquidatable — anyone can repay a portion of the debt and seize collateral at a discount.",
            ),
            h3("Liquidation cascades"),
            p(
              "When prices crash, many positions become liquidatable simultaneously. Liquidators sell seized collateral on AMMs, which pushes prices further down, which liquidates more positions. Protocol parameters (close factor, liquidation bonus, reserve factor) are tuned to break this loop without freezing the market.",
            ),
            callout(
              "tradeoff",
              "Higher liquidation bonus attracts liquidators (good for protocol solvency) but punishes borrowers and amplifies cascades. Production protocols continuously tune these via DAO governance.",
            ),
          ),
          interviewQuestions: [
            {
              id: "iv-w09-l2-1",
              level: "senior",
              category: "Lending",
              question:
                "What goes wrong if your oracle is delayed during a market crash?",
              modelAnswer:
                "If the oracle reports a stale (higher) price, positions that should be liquidatable aren't, and bad debt accrues. If too stale, the protocol becomes insolvent because borrowers walk away from positions where the oracle thinks they have collateral but the market disagrees. Mitigations: heartbeats with revert-if-stale, deviation thresholds that update on price moves, and circuit breakers that pause borrowing when oracles disagree.",
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
      category: "Bridges",
      question:
        "Compare the trust models of a lock-mint bridge, an LP-based bridge, and a message-passing bridge.",
      modelAnswer:
        "Lock-mint: assets are locked on chain A and a wrapped token is minted on chain B. Trust assumption is the bridge's lock contract and validators. LP-based (Stargate, Hop): users swap into a liquidity pool on the source and out on the destination; trust is in the LP and the inter-chain settlement. Message-passing (LayerZero, Axelar, IBC): bridges relay arbitrary messages; the receiver contract decides what the message means. Trust shifts to the relayer set and the security of inter-chain message verification. Every bridge has historically been the largest hack vector in Web3 — be paranoid.",
    },
  ],
  productionInsights: [
    {
      title: "Always run invariant tests",
      summary:
        "Foundry's invariantTest framework randomly fuzzes function calls and asserts global properties hold.",
      details:
        "For an AMM, an invariant might be 'x · y never decreases except by fees'. For a vault: 'totalAssets ≥ sum of user shares × pricePerShare'. Invariants catch the entire class of bugs that arises from interactions between functions you wrote in isolation.",
    },
  ],
};
