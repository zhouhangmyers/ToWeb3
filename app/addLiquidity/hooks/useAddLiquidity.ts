import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import { useSepoliaGuard } from "@/lib/useSepoliaGuard"

// 原生代币占位符地址
const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export function useAddLiquidity(
    routerAddr: `0x${string}` | undefined,
    tokenAAddr: `0x${string}` | undefined,
    tokenBAddr: `0x${string}` | undefined,
    tokenADecimals: number,
    tokenBDecimals: number,
    userAddress?: `0x${string}`
) {
    const [error, setError] = useState<string | null>(null)
    const { assertSepolia } = useSepoliaGuard()
    const { writeContract, data: addLiquidityHash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: addLiquidityHash })

    const handleAddLiquidity = (amountA: string, amountB: string) => {
        if (!routerAddr || !tokenAAddr || !tokenBAddr || !amountA || !amountB || !userAddress) return
        if (!assertSepolia(setError)) return

        try {
            const parsedA = parseUnits(amountA, tokenADecimals)
            const parsedB = parseUnits(amountB, tokenBDecimals)
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

            // 检查是否包含原生代币
            const isTokenANative = tokenAAddr.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
            const isTokenBNative = tokenBAddr.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()

            // 两个都是原生代币是不允许的
            if (isTokenANative && isTokenBNative) {
                setError("不能在两个原生代币之间添加流动性")
                return
            }

            // 如果包含原生代币，使用 addLiquidityETH
            if (isTokenANative || isTokenBNative) {
                const [nativeAmount, tokenAmount, tokenAddr] = isTokenANative
                    ? [parsedA, parsedB, tokenBAddr]
                    : [parsedB, parsedA, tokenAAddr]

                writeContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "addLiquidityETH",
                    args: [
                        tokenAddr,           // ERC20 token 地址
                        tokenAmount,         // ERC20 token 数量
                        BigInt(0),          // token 最小数量
                        BigInt(0),          // ETH 最小数量
                        userAddress,        // 接收 LP token 的地址
                        BigInt(deadline),   // 截止时间
                    ],
                    value: nativeAmount,    // 发送的 ETH 数量
                })
            } else {
                // 两个都是 ERC20，使用标准的 addLiquidity
                writeContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "addLiquidity",
                    args: [
                        tokenAAddr,
                        tokenBAddr,
                        parsedA,
                        parsedB,
                        BigInt(0),
                        BigInt(0),
                        userAddress,
                        BigInt(deadline),
                    ],
                })
            }

            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "添加流动性失败")
        }
    }

    return {
        handleAddLiquidity,
        isAddingLiquidity: isPending || isConfirming,
        isSuccess,
        error,
        setError,
    }
}
