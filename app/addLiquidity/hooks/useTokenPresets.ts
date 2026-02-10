import { useAccount } from "wagmi"

export interface TokenPreset {
    symbol: string
    name?: string       // 完整名称
    address: string
    decimals: number
    isNative?: boolean  // 是否为原生代币
    icon?: string       // emoji 图标
    logo?: string       // 图片 URL (未来可以使用)
}

// 原生代币特殊地址（通常用 0xEee... 或 WETH 地址）
const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

// 不同链上的 Token 预设配置
const TOKEN_PRESETS: Record<number, TokenPreset[]> = {
    // Ethereum Mainnet
    1: [
        {
            symbol: "ETH",
            name: "Ethereum",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
            icon: "⚡",
        },
        {
            symbol: "WETH",
            name: "Wrapped Ether",
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            decimals: 18,
            icon: "🔷",
        },
        {
            symbol: "USDC",
            name: "USD Coin",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decimals: 6,
            icon: "💵",
        },
        {
            symbol: "USDT",
            name: "Tether USD",
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            decimals: 6,
            icon: "💵",
        },
        {
            symbol: "DAI",
            name: "Dai Stablecoin",
            address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            decimals: 18,
            icon: "💎",
        },
    ],
    // Sepolia Testnet
    11155111: [
        {
            symbol: "ETH",
            name: "Sepolia Ether",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
            icon: "⚡",
        },
        {
            symbol: "WETH",
            name: "Wrapped Ether",
            address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
            decimals: 18,
            icon: "🔷",
        },
    ],
    // BSC Mainnet
    56: [
        {
            symbol: "BNB",
            name: "BNB",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
            icon: "⚡",
        },
        {
            symbol: "WBNB",
            name: "Wrapped BNB",
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            decimals: 18,
            icon: "🟡",
        },
        {
            symbol: "BUSD",
            name: "Binance USD",
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            decimals: 18,
            icon: "💵",
        },
        {
            symbol: "USDT",
            name: "Tether USD",
            address: "0x55d398326f99059fF775485246999027B3197955",
            decimals: 18,
            icon: "💵",
        },
        {
            symbol: "USDC",
            name: "USD Coin",
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            decimals: 18,
            icon: "💵",
        },
    ],
    // BSC Testnet
    97: [
        {
            symbol: "BNB (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
        {
            symbol: "WBNB",
            address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
            decimals: 18,
        },
    ],
    // Polygon Mainnet
    137: [
        {
            symbol: "MATIC (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
        {
            symbol: "WMATIC",
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            decimals: 18,
        },
        {
            symbol: "USDC",
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            decimals: 6,
        },
        {
            symbol: "USDT",
            address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            decimals: 6,
        },
        {
            symbol: "DAI",
            address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            decimals: 18,
        },
    ],
    // Arbitrum One
    42161: [
        {
            symbol: "ETH (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
        {
            symbol: "WETH",
            address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            decimals: 18,
        },
        {
            symbol: "USDC",
            address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            decimals: 6,
        },
        {
            symbol: "USDT",
            address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            decimals: 6,
        },
    ],
    // Optimism
    10: [
        {
            symbol: "ETH (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
        {
            symbol: "WETH",
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
        },
        {
            symbol: "USDC",
            address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            decimals: 6,
        },
        {
            symbol: "USDT",
            address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            decimals: 6,
        },
    ],
    // Avalanche C-Chain
    43114: [
        {
            symbol: "AVAX (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
        {
            symbol: "WAVAX",
            address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            decimals: 18,
        },
        {
            symbol: "USDC",
            address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            decimals: 6,
        },
        {
            symbol: "USDT",
            address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
            decimals: 6,
        },
    ],
    // Localhost / Anvil (常见的本地开发链 ID)
    31337: [
        {
            symbol: "ETH (原生)",
            address: NATIVE_TOKEN_PLACEHOLDER,
            decimals: 18,
            isNative: true,
        },
    ],
}

export function useTokenPresets() {
    const { chainId } = useAccount()

    const presets = chainId ? TOKEN_PRESETS[chainId] || [] : []
    const hasPresets = presets.length > 0

    return {
        chainId,
        presets,
        hasPresets,
    }
}
