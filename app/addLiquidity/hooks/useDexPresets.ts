import { useAccount } from "wagmi"

export interface DexPreset {
    name: string
    router: string
    factory?: string
    logo?: string
}

// 不同链上的 DEX 预设配置
const DEX_PRESETS: Record<number, DexPreset[]> = {
    // Ethereum Mainnet
    1: [
        {
            name: "Uniswap V2",
            router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        },
        {
            name: "SushiSwap",
            router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
            factory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
        },
    ],
    // Sepolia Testnet
    11155111: [
        {
            name: "Uniswap V2 (Sepolia)",
            router: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
        },
    ],
    // BSC Mainnet
    56: [
        {
            name: "PancakeSwap V2",
            router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        },
        {
            name: "SushiSwap (BSC)",
            router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        },
    ],
    // BSC Testnet
    97: [
        {
            name: "PancakeSwap V2 (Testnet)",
            router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        },
    ],
    // Polygon Mainnet
    137: [
        {
            name: "QuickSwap",
            router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        },
        {
            name: "SushiSwap (Polygon)",
            router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        },
    ],
    // Arbitrum One
    42161: [
        {
            name: "SushiSwap (Arbitrum)",
            router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        },
    ],
    // Optimism
    10: [
        {
            name: "Uniswap V2 (Optimism)",
            router: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
        },
    ],
    // Avalanche C-Chain
    43114: [
        {
            name: "Trader Joe",
            router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        },
    ],
}

export function useDexPresets() {
    const { chainId } = useAccount()

    const presets = chainId ? DEX_PRESETS[chainId] || [] : []
    const hasPresets = presets.length > 0

    const getChainName = (id?: number): string => {
        if (!id) return "请连接钱包"
        if (id === 4337) return "Localhost (Anvil)"
        const names: Record<number, string> = {
            1: "Ethereum",
            11155111: "Sepolia",
            56: "BSC",
            97: "BSC Testnet",
            137: "Polygon",
            42161: "Arbitrum",
            10: "Optimism",
            43114: "Avalanche",
        }
        return names[id] || `未预设网络Chain ${id}`
    }

    return {
        chainId,
        chainName: getChainName(chainId),
        presets,
        hasPresets,
    }
}
