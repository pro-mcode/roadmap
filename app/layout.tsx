import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Engineering Roadmap — Fintech, Web3 & Security",
    template: "%s · Engineering Roadmap",
  },
  description:
    "A premium engineering learning platform with 12-week structured roadmaps for Fintech & Web3 Engineering and Rust + Smart Contract Security Auditing.",
  keywords: [
    "fintech engineering",
    "web3",
    "smart contract security",
    "rust",
    "solidity",
    "system design",
    "interview prep",
  ],
  authors: [{ name: "Adedamola Maxwell" }],
  openGraph: {
    title: "Engineering Roadmap",
    description:
      "Structured 12-week roadmaps for fintech, web3, and smart contract security engineers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
