// components/Web3Provider.tsx

"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { config } from "@/lib/wagmi";
import { useState } from "react";

import "@rainbow-me/rainbowkit/styles.css";

export function Web3Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    }));

    return (
        <WagmiProvider config={config as Config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()} locale="en" initialChain={sepolia}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
