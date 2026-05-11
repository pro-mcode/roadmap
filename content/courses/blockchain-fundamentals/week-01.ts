import type { Week } from "@/types/content";
import {
  blocks,
  callout,
  code,
  diagram,
  h2,
  h3,
  p,
  ul,
} from "@/content/courses/_helpers";

export const week01: Week = {
  id: "week-01",
  number: 1,
  title: "Cryptography and consensus",
  stage: "Foundations",
  summary:
    "The cryptographic primitives every blockchain relies on, and the consensus families that turn them into a distributed ledger.",
  objectives: [
    "Explain ECDSA, public-key recovery, and signature malleability.",
    "Compute and verify Merkle proofs by hand for small trees.",
    "Compare PoW, PoS, and BFT consensus by security assumption.",
    "Reason about finality, reorgs, and confirmation depth.",
  ],
  concepts: [
    "Hash functions: preimage, collision, second preimage",
    "ECDSA, secp256k1, signature recovery",
    "Merkle trees and proofs",
    "Consensus: PoW, PoS, BFT-style",
  ],
  deliverables: [
    "Sign and verify a message with ethers.js, recovering the signer.",
    "Build a small Merkle tree and verify a proof against the root.",
  ],
  reviewGate:
    "Why is signature malleability a problem, and how does EIP-2 fix it?",
  stack: ["TypeScript", "ethers.js"],
  modules: [
    {
      id: "bc-w01-m1",
      title: "Cryptography in practice",
      summary: "The primitives, with a working code example each.",
      progression: "foundation",
      lessons: [
        {
          id: "bc-w01-l1",
          slug: "signatures",
          title: "Signatures and recovery",
          summary:
            "ECDSA gives you (r, s, v). v lets you recover the signer's address without storing it — a beautiful property the EVM uses everywhere.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["crypto", "ecdsa"],
          blocks: blocks(
            code(
              "typescript",
              `import { ethers } from "ethers";
const wallet = ethers.Wallet.createRandom();
const message = "approve 100 USDC for 0x...";
const sig = await wallet.signMessage(message);
const recovered = ethers.verifyMessage(message, sig);
console.log(recovered === wallet.address); // true`,
              "Sign and recover with ethers.js.",
            ),
            callout(
              "warning",
              "Signature malleability: for every valid (r, s), (r, n - s) is also valid. EIP-2 restricts s to the lower half of the curve order to prevent this. Always validate.",
            ),
          ),
        },
        {
          id: "bc-w01-l2",
          slug: "merkle-trees",
          title: "Merkle trees and proofs",
          summary:
            "The compact way to prove membership in a large set, used everywhere from airdrops to L1 state roots.",
          estimatedMinutes: 25,
          difficulty: "intermediate",
          tags: ["merkle"],
          blocks: blocks(
            diagram(
              `         root
         /  \\
       h12  h34
      /  \\  /  \\
     h1  h2 h3 h4
     |   |   |   |
    leaf leaf leaf leaf`,
              "Merkle tree",
            ),
            p(
              "A proof of inclusion for leaf2 is [h1, h34] — siblings along the path to the root. The verifier hashes their way up and checks the root.",
            ),
          ),
        },
      ],
    },
  ],
  productionInsights: [
    {
      title: "Finality is not a switch",
      summary:
        "Different chains, different finality models. Don't treat confirmation depth as a constant.",
      details:
        "Bitcoin: probabilistic, 6 confirmations is convention. Ethereum: stronger after the merge, with deterministic finality every two epochs. Tendermint chains: instant finality. Bridge designs that assume one model on another chain are how exploits happen.",
    },
  ],
};
