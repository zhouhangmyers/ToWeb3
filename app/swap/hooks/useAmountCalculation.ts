import { useEffect, useState } from "react"
import { usePublicClient } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import type { SwapMode } from "./useSwap"

const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

/**
 * 自动计算兑换数量
 */
export function useAmountCalculation(
    routerAddr: `0x${string}` | undefined,
    tokenInAddr: `0x${string}` | undefined,
    tokenOutAddr: `0x${string}` | undefined,
    tokenInDecimals: number | undefined,
    tokenOutDecimals: number | undefined,
    amountIn: string,
    amountOut: string,
    swapMode: SwapMode,
    tokenIn: string,
    tokenOut: string,
    wethAddress: `0x${string}` | undefined
) {
    const publicClient = usePublicClient()
    const [isCalculating, setIsCalculating] = useState(false)
    const [calculatedAmountIn, setCalculatedAmountIn] = useState("")
    const [calculatedAmountOut, setCalculatedAmountOut] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [path, setPath] = useState<string[]>([])

    useEffect(() => {
        async function calculateAmount() {
            // 静默检查：缺少必需参数时不显示错误，只是不执行计算
            if (!routerAddr || !tokenInAddr || !tokenOutAddr || !publicClient || !wethAddress) {
                setIsCalculating(false)
                setError(null) // 清除之前的错误
                return
            }

            // 静默检查：没有输入值时不计算
            if (swapMode === "exactIn" && !amountIn) {
                setIsCalculating(false)
                setError(null)
                setCalculatedAmountOut("") // 清空计算结果
                return
            }
            if (swapMode === "exactOut" && !amountOut) {
                setIsCalculating(false)
                setError(null)
                setCalculatedAmountIn("") // 清空计算结果
                return
            }

            try {
                setIsCalculating(true)
                setError(null)

                // 构建路径：如果是原生代币，使用WETH地址
                const isTokenInNative = tokenIn.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
                const isTokenOutNative = tokenOut.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()

                // 原生代币没有 ERC20 decimals，默认用 18
                const decimalsInResolved = tokenInDecimals ?? (isTokenInNative ? 18 : undefined)
                const decimalsOutResolved = tokenOutDecimals ?? (isTokenOutNative ? 18 : undefined)

                // 静默检查：decimals 未加载完成时等待
                if (decimalsInResolved == null || decimalsOutResolved == null) {
                    setIsCalculating(false)
                    setError(null) // 清除之前的错误
                    return
                }

                const actualTokenInAddr = isTokenInNative ? wethAddress : tokenInAddr
                const actualTokenOutAddr = isTokenOutNative ? wethAddress : tokenOutAddr

                // 检查是否选择了相同的代币
                if (actualTokenInAddr.toLowerCase() === actualTokenOutAddr.toLowerCase()) {
                    setError("不能选择相同的代币进行兑换")
                    setIsCalculating(false)
                    return
                }

                const currentPath = [actualTokenInAddr, actualTokenOutAddr]
                setPath(currentPath)

                if (swapMode === "exactIn" && amountIn) {
                    // 精确输入，计算输出
                    const decimalsIn = Number(decimalsInResolved)

                    // 安全解析数量，捕获无效输入
                    let parsedAmountIn: bigint
                    try {
                        parsedAmountIn = parseUnits(amountIn, decimalsIn)
                    } catch (parseError) {
                        setError("输入数量格式无效")
                        setIsCalculating(false)
                        return
                    }

                    // 检查输入是否为零或负数
                    if (parsedAmountIn <= 0n) {
                        setError("输入数量必须大于零")
                        setIsCalculating(false)
                        return
                    }

                    const amounts = await publicClient.readContract({
                        address: routerAddr,
                        abi: uniswapV2RouterAbi,
                        functionName: "getAmountsOut",
                        args: [parsedAmountIn, currentPath as `0x${string}`[]],
                    }) as bigint[]

                    const decimalsOut = Number(decimalsOutResolved)
                    const calculatedAmountOut = formatUnits(amounts[1], decimalsOut)
                    setCalculatedAmountOut(calculatedAmountOut)
                } else if (swapMode === "exactOut" && amountOut) {
                    // 精确输出，计算输入
                    const decimalsOut = Number(decimalsOutResolved)

                    // 安全解析数量，捕获无效输入
                    let parsedAmountOut: bigint
                    try {
                        parsedAmountOut = parseUnits(amountOut, decimalsOut)
                    } catch (parseError) {
                        setError("输出数量格式无效")
                        setIsCalculating(false)
                        return
                    }

                    // 检查输出是否为零或负数
                    if (parsedAmountOut <= 0n) {
                        setError("输出数量必须大于零")
                        setIsCalculating(false)
                        return
                    }

                    const amounts = await publicClient.readContract({
                        address: routerAddr,
                        abi: uniswapV2RouterAbi,
                        functionName: "getAmountsIn",
                        args: [parsedAmountOut, currentPath as `0x${string}`[]],
                    }) as bigint[]

                    const decimalsIn = Number(decimalsInResolved)
                    const calculatedAmountIn = formatUnits(amounts[0], decimalsIn)
                    setCalculatedAmountIn(calculatedAmountIn)
                }
            } catch (err) {
                console.error("计算兑换数量失败:", err)

                // 检查具体错误类型
                const errorMessage = err instanceof Error ? err.message : String(err)
                const errorString = errorMessage.toLowerCase()

                if (errorString.includes("ds-math-sub-underflow")) {
                    setError("流动性不足或输出量过大，请减少兑换数量")
                } else if (errorString.includes("insufficient_liquidity") || errorString.includes("insufficient liquidity")) {
                    setError("流动性不足，请检查交易对是否存在足够的流动性")
                } else if (errorString.includes("insufficient_input_amount") || errorString.includes("insufficient input")) {
                    setError("输入数量不足，请增加输入数量")
                } else if (errorString.includes("insufficient_output_amount") || errorString.includes("insufficient output")) {
                    setError("输出数量不足，请减少输出数量")
                } else if (errorString.includes("reverted")) {
                    // 通用的 revert 错误，通常是流动性池不存在或数量问题
                    if (swapMode === "exactOut") {
                        setError("无法计算所需输入数量。可能是流动性不足或输出量过大，请减少输出数量")
                    } else {
                        setError("无法计算输出数量。可能是流动性池不存在或流动性不足")
                    }
                } else {
                    setError("无法计算兑换数量，请检查流动性池是否存在")
                }

                // 清空计算结果
                setCalculatedAmountIn("")
                setCalculatedAmountOut("")
            } finally {
                setIsCalculating(false)
            }
        }

        const timer = setTimeout(() => {
            if (swapMode === "exactIn" && amountIn) {
                calculateAmount()
            } else if (swapMode === "exactOut" && amountOut) {
                calculateAmount()
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [
        amountIn,
        amountOut,
        swapMode,
        tokenInAddr,
        tokenOutAddr,
        routerAddr,
        publicClient,
        tokenInDecimals,
        tokenOutDecimals,
        tokenIn,
        tokenOut,
        wethAddress,
    ])

    return {
        isCalculating,
        calculatedAmountIn,
        calculatedAmountOut,
        error,
        setError,
        path,
    }
}
