"use client";

import dynamic from "next/dynamic";
import { DisclaimerModal } from "@/components/DisclaimerModal";

const Web3Provider = dynamic(
  () => import("@/components/Web3Provider").then((mod) => mod.Web3Provider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      {children}
      <DisclaimerModal />
    </Web3Provider>
  );
}
