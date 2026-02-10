import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { mainnet, bsc, arbitrum, sepolia, hardhat } from "wagmi/chains"

export const config = getDefaultConfig({
    appName: "我的DeFi 应用",
    projectId: "ec1420bad5cf6bca03b13d2cd4b17b64",
    chains: [mainnet, bsc, arbitrum, sepolia, hardhat],
    ssr: false, // 禁用 SSR 以避免 indexedDB 错误
    transports: {
        [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
        [bsc.id]: http("https://bsc-rpc.publicnode.com"),
        [arbitrum.id]: http("https://arbitrum-one-rpc.publicnode.com"),
        [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"), // 使用更稳定的公共 RPC
        [hardhat.id]: http("http://127.0.0.1:8545"),
    },
})
