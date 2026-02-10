import { useState, useEffect, useCallback } from "react"
import { usePublicClient } from "wagmi"
import { uniswapV2FactoryAbil } from "@/lib/uniswapV2Factory"
import { useTokenPresets } from "./useTokenPresets"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export function usePairCheck(
    factoryAddress: string | undefined,
    tokenAAddr: `0x${string}` | undefined,
    tokenBAddr: `0x${string}` | undefined
) {
    const publicClient = usePublicClient()
    const { presets } = useTokenPresets()
    const [pairAddress, setPairAddress] = useState<string | null>(null)
    const [pairExists, setPairExists] = useState<boolean | null>(null)
    const [checkingPair, setCheckingPair] = useState(false)
    const [refetchCounter, setRefetchCounter] = useState(0)

    // 将原生代币地址转换为对应的 WETH 地址
    const convertToWETH = (addr: `0x${string}` | undefined): `0x${string}` | undefined => {
        if (!addr) return undefined

        // 检查是否为原生代币
        if (addr.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()) {
            // 查找对应链的 WETH/WBNB/WMATIC 等 Wrapped 代币地址
            const wethPreset = presets.find(p =>
                (p.symbol.includes("WETH") ||
                 p.symbol.includes("WBNB") ||
                 p.symbol.includes("WMATIC") ||
                 p.symbol.includes("WAVAX")) &&
                !p.isNative
            )
            return wethPreset?.address as `0x${string}` | undefined
        }

        return addr
    }

    useEffect(() => {
        async function checkPair() {
            if (!factoryAddress || !tokenAAddr || !tokenBAddr || !publicClient) {
                setPairAddress(null)
                setPairExists(null)
                return
            }

            // 转换原生代币为 WETH
            const finalTokenA = convertToWETH(tokenAAddr)
            const finalTokenB = convertToWETH(tokenBAddr)

            if (!finalTokenA || !finalTokenB) {
                setPairAddress(null)
                setPairExists(null)
                return
            }

            setCheckingPair(true)
            try {
                const pair = await publicClient.readContract({
                    address: factoryAddress as `0x${string}`,
                    abi: uniswapV2FactoryAbil,
                    functionName: "getPair",
                    args: [finalTokenA, finalTokenB],
                }) as string

                setPairAddress(pair)
                setPairExists(pair !== ZERO_ADDRESS)
            } catch (err) {
                console.error("检查交易对失败:", err)
                setPairExists(null)
            } finally {
                setCheckingPair(false)
            }
        }

        checkPair()
    }, [factoryAddress, tokenAAddr, tokenBAddr, publicClient, presets, refetchCounter])

    // 手动刷新交易对信息（使用 useCallback 确保函数引用稳定）
    const refetchPair = useCallback(() => {
        setRefetchCounter(prev => prev + 1)
    }, [])

    return { pairAddress, pairExists, checkingPair, refetchPair }
}
