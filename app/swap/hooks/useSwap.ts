import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"

export type SwapMode = "exactIn" | "exactOut"

const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

/**
 * Swap 操作 hook
 */
export function useSwap(
    routerAddress: `0x${string}` | undefined,
    tokenInAddr: `0x${string}` | undefined,
    tokenOutAddr: `0x${string}` | undefined,
    tokenInDecimals: number,
    tokenOutDecimals: number,
    userAddress: `0x${string}` | undefined,
    path: string[]
) {
    const [error, setError] = useState<string | null>(null)

    const { writeContract: writeSwap, data: swapHash, isPending: isSwapPending } = useWriteContract()
    const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({ hash: swapHash })

    const handleSwap = (
        amountIn: string,
        amountOut: string,
        swapMode: SwapMode,
        slippage: string,
        tokenIn: string,
        tokenOut: string
    ) => {
        // 防御性检查：验证所有必需参数
        if (!routerAddress || !tokenInAddr || !tokenOutAddr || !userAddress) {
            setError("缺少必要参数：请确保已连接钱包并选择了代币")
            return
        }

        if (!amountIn || !amountOut) {
            setError("请输入兑换数量")
            return
        }

        // 防御性检查：验证滑点值
        const slippageNum = parseFloat(slippage)
        if (isNaN(slippageNum) || slippageNum < 0 || slippageNum > 100) {
            setError("滑点设置无效，请设置 0-100 之间的值")
            return
        }

        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
            const slippagePercent = parseFloat(slippage) / 100

            // 检查是否为原生代币（ETH/BNB/MATIC等）
            const isTokenInNative = tokenIn.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
            const isTokenOutNative = tokenOut.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()

            if (swapMode === "exactIn") {
                // 精确输入模式：swapExactTokensForTokens 或 swapExactTokensForETH 或 swapExactETHForTokens

                // 安全解析数量
                let amountInParsed: bigint
                let amountOutParsed: bigint
                try {
                    amountInParsed = parseUnits(amountIn, tokenInDecimals)
                    amountOutParsed = parseUnits(amountOut, tokenOutDecimals)
                } catch (parseError) {
                    setError("数量格式无效，请检查输入")
                    return
                }

                // 验证数量有效性
                if (amountInParsed <= 0n || amountOutParsed <= 0n) {
                    setError("兑换数量必须大于零")
                    return
                }
                // 最小输出 = 预估输出 × (1 - 滑点)
                const amountOutMin = BigInt(Math.floor(Number(amountOutParsed) * (1 - slippagePercent)))

                if (isTokenInNative) {
                    // ETH -> Token: swapExactETHForTokens
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapExactETHForTokens",
                        args: [
                            amountOutMin,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                        value: amountInParsed,
                    })
                } else if (isTokenOutNative) {
                    // Token -> ETH: swapExactTokensForETH
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapExactTokensForETH",
                        args: [
                            amountInParsed,
                            amountOutMin,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                    })
                } else {
                    // Token -> Token: swapExactTokensForTokens
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapExactTokensForTokens",
                        args: [
                            amountInParsed,
                            amountOutMin,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                    })
                }
            } else {
                // 精确输出模式：swapTokensForExactTokens 或 swapTokensForExactETH 或 swapETHForExactTokens

                // 安全解析数量
                let amountOutParsed: bigint
                let amountInParsed: bigint
                try {
                    amountOutParsed = parseUnits(amountOut, tokenOutDecimals)
                    amountInParsed = parseUnits(amountIn, tokenInDecimals)
                } catch (parseError) {
                    setError("数量格式无效，请检查输入")
                    return
                }

                // 验证数量有效性
                if (amountOutParsed <= 0n || amountInParsed <= 0n) {
                    setError("兑换数量必须大于零")
                    return
                }
                // 最大输入 = 预估输入 × (1 + 滑点)
                const amountInMax = BigInt(Math.floor(Number(amountInParsed) * (1 + slippagePercent)))

                if (isTokenInNative) {
                    // ETH -> Token: swapETHForExactTokens
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapETHForExactTokens",
                        args: [
                            amountOutParsed,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                        value: amountInMax,
                    })
                } else if (isTokenOutNative) {
                    // Token -> ETH: swapTokensForExactETH
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapTokensForExactETH",
                        args: [
                            amountOutParsed,
                            amountInMax,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                    })
                } else {
                    // Token -> Token: swapTokensForExactTokens
                    writeSwap({
                        address: routerAddress,
                        abi: uniswapV2RouterAbi,
                        functionName: "swapTokensForExactTokens",
                        args: [
                            amountOutParsed,
                            amountInMax,
                            path as `0x${string}`[],
                            userAddress,
                            BigInt(deadline),
                        ],
                    })
                }
            }
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "兑换失败")
        }
    }

    return {
        handleSwap,
        isSwapPending: isSwapPending || isSwapConfirming,
        isSwapSuccess,
        swapHash,
        error,
        setError,
    }
}
