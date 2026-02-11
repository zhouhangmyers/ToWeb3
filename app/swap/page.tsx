"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { isAddress, parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowUpDown, Settings } from "lucide-react"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import { useRouterAddress, useTokenHistory, useTokenInfo, useApproval, useSwap, useAmountCalculation, type SwapMode } from "./hooks"
import { RouterSelector, SwapTokenInput, SlippageSettings, SwapInfo } from "./components"
import { TokenHistory } from "../addLiquidity/components/TokenHistory"

const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

// 安全的数字输入验证函数
function sanitizeNumberInput(value: string): string {
    // 只允许数字、小数点和空字符串
    const sanitized = value.replace(/[^\d.]/g, '')

    // 防止多个小数点
    const parts = sanitized.split('.')
    if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('')
    }

    // 防止前导零（除了 0.xxx 的情况）
    if (sanitized.startsWith('0') && sanitized.length > 1 && !sanitized.startsWith('0.')) {
        return sanitized.substring(1)
    }

    return sanitized
}

export default function SwapTokenPage() {
    const { address, isConnected } = useAccount()

    // ─── Router 选择 ───
    const customRouterAddress = useRouterAddress()
    const [mode, setMode] = useState<"custom" | "external">("custom")
    const [externalRouterInput, setExternalRouterInput] = useState("")

    useEffect(() => {
        if (!customRouterAddress) setMode("external")
    }, [customRouterAddress])

    const routerAddress = mode === "custom"
        ? customRouterAddress
        : (isAddress(externalRouterInput) ? externalRouterInput : null)
    const routerAddr = routerAddress as `0x${string}` | undefined

    const { data: factoryAddress } = useReadContract({
        address: routerAddr,
        abi: uniswapV2RouterAbi,
        functionName: "factory",
        query: { enabled: !!routerAddr },
    })

    // 获取 WETH 地址
    const { data: wethAddress } = useReadContract({
        address: routerAddr,
        abi: uniswapV2RouterAbi,
        functionName: "WETH",
        query: { enabled: !!routerAddr },
    })

    // ─── 铸造历史 ───
    const { history, deleteRecord, clearHistory } = useTokenHistory()

    // ─── Swap 状态 ───
    const [tokenIn, setTokenIn] = useState("")
    const [tokenOut, setTokenOut] = useState("")
    const [amountIn, setAmountIn] = useState("")
    const [amountOut, setAmountOut] = useState("")
    const [swapMode, setSwapMode] = useState<SwapMode>("exactIn")
    const [slippage, setSlippage] = useState("0.5")
    const [showSlippageSettings, setShowSlippageSettings] = useState(false)

    // 当选择代币时，检查是否与另一个代币相同（考虑原生代币转换）
    const handleTokenInChange = (value: string) => {
        setTokenIn(value)
        // 如果选择了与 tokenOut 相同的代币（或都是原生代币），清空 amountOut
        const isSameAsOut = value.toLowerCase() === tokenOut.toLowerCase()
        const bothNative = value.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase() &&
            tokenOut.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
        if (isSameAsOut || bothNative) {
            setAmountOut("")
        }
    }

    const handleTokenOutChange = (value: string) => {
        setTokenOut(value)
        // 如果选择了与 tokenIn 相同的代币（或都是原生代币），清空 amountIn
        const isSameAsIn = value.toLowerCase() === tokenIn.toLowerCase()
        const bothNative = value.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase() &&
            tokenIn.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
        if (isSameAsIn || bothNative) {
            setAmountIn("")
        }
    }

    // ─── Token 信息 ───
    const tokenInInfo = useTokenInfo(tokenIn, address, routerAddr)
    const tokenOutInfo = useTokenInfo(tokenOut, address, routerAddr)

    // ─── 自动计算数量 ───
    const {
        isCalculating,
        calculatedAmountIn,
        calculatedAmountOut,
        error: calculationError,
        setError: setCalculationError,
        path,
    } = useAmountCalculation(
        routerAddr,
        tokenInInfo.tokenAddr,
        tokenOutInfo.tokenAddr,
        tokenInInfo.decimals,
        tokenOutInfo.decimals,
        amountIn,
        amountOut,
        swapMode,
        tokenIn,
        tokenOut,
        wethAddress as `0x${string}` | undefined
    )

    // 根据计算结果更新显示的数量
    useEffect(() => {
        if (swapMode === "exactIn" && calculatedAmountOut) {
            setAmountOut(calculatedAmountOut)
        }
    }, [calculatedAmountOut, swapMode])

    useEffect(() => {
        if (swapMode === "exactOut" && calculatedAmountIn) {
            setAmountIn(calculatedAmountIn)
        }
    }, [calculatedAmountIn, swapMode])

    // ─── 授权 ───
    const approvalIn = useApproval(tokenInInfo.tokenAddr, routerAddr, tokenInInfo.refetchAllowance)

    // 检查是否为原生代币
    const isTokenInNative = tokenIn.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()

    // 检查授权是否足够（原生代币不需要授权）
    const isAllowanceEnough = isTokenInNative || !!(tokenInInfo.allowance !== undefined && amountIn &&
        tokenInInfo.allowance >= parseUnits(amountIn, Number(tokenInInfo.decimals ?? 18)))

    // ─── Swap 操作 ───
    const {
        handleSwap: executeSwap,
        isSwapPending,
        isSwapSuccess,
        swapHash,
        error: swapError,
        setError: setSwapError,
    } = useSwap(
        routerAddr,
        tokenInInfo.tokenAddr,
        tokenOutInfo.tokenAddr,
        Number(tokenInInfo.decimals ?? 18),
        Number(tokenOutInfo.decimals ?? 18),
        address,
        path
    )

    // 合并错误
    const error = calculationError || swapError

    // 成功后清空表单并刷新余额
    const [lastClearedHash, setLastClearedHash] = useState<`0x${string}` | undefined>(undefined)

    useEffect(() => {
        if (!isSwapSuccess || !swapHash) return
        if (lastClearedHash === swapHash) return

        setAmountIn("")
        setAmountOut("")
        tokenInInfo.refetchBalance()
        tokenOutInfo.refetchBalance()
        setLastClearedHash(swapHash)
    }, [isSwapSuccess, swapHash, lastClearedHash, tokenInInfo, tokenOutInfo])

    // 处理 Swap
    const handleSwap = () => {
        setCalculationError(null)
        setSwapError(null)
        executeSwap(amountIn, amountOut, swapMode, slippage, tokenIn, tokenOut)
    }

    // 切换输入/输出（交换数据）
    const handleSwitchTokens = () => {
        setTokenIn(tokenOut)
        setTokenOut(tokenIn)
        setAmountIn(amountOut)
        setAmountOut(amountIn)
        setCalculationError(null)
        setSwapError(null)
    }

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">代币兑换</h1>
                <p className="text-muted-foreground">
                    使用 Uniswap V2 协议进行代币兑换，完整功能请连接钱包后使用。
                </p>
            </div>

            {/* 两栏布局 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：兑换功能 */}
                <div className="flex flex-col gap-8 flex-1 min-w-0">
                    {/* Router 选择 */}
                    <RouterSelector
                        mode={mode}
                        setMode={setMode}
                        customRouterAddress={customRouterAddress}
                        externalRouterInput={externalRouterInput}
                        setExternalRouterInput={setExternalRouterInput}
                        factoryAddress={factoryAddress as string | undefined}
                    />

                    {/* 兑换表单 - 仅在 Router 可用时显示 */}
                    {routerAddress && (
                        <Card className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>兑换代币</CardTitle>
                                        <CardDescription>
                                            选择代币和数量进行兑换
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                                    >
                                        <Settings className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* 滑点设置 */}
                                {showSlippageSettings && (
                                    <SlippageSettings
                                        slippage={slippage}
                                        onSlippageChange={setSlippage}
                                    />
                                )}

                                {/* Token In - 卖出 */}
                                <SwapTokenInput
                                    label="卖出"
                                    addressId="tokenIn"
                                    amountId="amountIn"
                                    tokenAddress={tokenIn}
                                    amount={amountIn}
                                    onAddressChange={handleTokenInChange}
                                    onAmountChange={(value) => {
                                        const sanitized = sanitizeNumberInput(value)
                                        setAmountIn(sanitized)
                                        if (swapMode === "exactOut") {
                                            setSwapMode("exactIn")
                                        }
                                    }}
                                    symbol={tokenInInfo.symbol as string | undefined}
                                    decimals={Number(tokenInInfo.decimals ?? 18)}
                                    balance={tokenInInfo.balance}
                                    excludeAddresses={[tokenOut]}
                                    swapMode={swapMode}
                                    isCalculating={isCalculating}
                                    onModeClick={() => setSwapMode("exactIn")}
                                    isInputToken={true}
                                />

                                {/* 切换按钮 */}
                                <div className="flex justify-center -my-2 relative z-10">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleSwitchTokens}
                                        className="rounded-full"
                                    >
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Token Out - 买入 */}
                                <SwapTokenInput
                                    label="买入"
                                    addressId="tokenOut"
                                    amountId="amountOut"
                                    tokenAddress={tokenOut}
                                    amount={amountOut}
                                    onAddressChange={handleTokenOutChange}
                                    onAmountChange={(value) => {
                                        const sanitized = sanitizeNumberInput(value)
                                        setAmountOut(sanitized)
                                        if (swapMode === "exactIn") {
                                            setSwapMode("exactOut")
                                        }
                                    }}
                                    symbol={tokenOutInfo.symbol as string | undefined}
                                    decimals={Number(tokenOutInfo.decimals ?? 18)}
                                    balance={tokenOutInfo.balance}
                                    excludeAddresses={[tokenIn]}
                                    swapMode={swapMode}
                                    isCalculating={isCalculating}
                                    onModeClick={() => setSwapMode("exactOut")}
                                    isInputToken={false}
                                />

                                {/* 计算中提示 */}
                                {isCalculating && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        计算中...
                                    </div>
                                )}

                                {/* 兑换信息 */}
                                {amountIn && amountOut && !isCalculating && (
                                    <SwapInfo
                                        swapMode={swapMode}
                                        slippage={slippage}
                                        amountIn={amountIn}
                                        amountOut={amountOut}
                                        tokenInSymbol={tokenInInfo.symbol as string | undefined}
                                        tokenOutSymbol={tokenOutInfo.symbol as string | undefined}
                                    />
                                )}

                                {/* 授权按钮 */}
                                {!isAllowanceEnough && !isTokenInNative && (
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={approvalIn.handleApprove}
                                        disabled={!tokenInInfo.tokenAddr || !amountIn || approvalIn.isApproving}
                                    >
                                        {approvalIn.isApproving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                授权中...
                                            </>
                                        ) : (
                                            `授权 ${tokenInInfo.symbol || "Token"}`
                                        )}
                                    </Button>
                                )}

                                {/* 兑换按钮 */}
                                <Button
                                    className="w-full"
                                    onClick={handleSwap}
                                    disabled={
                                        !isConnected ||
                                        !tokenInInfo.tokenAddr ||
                                        !tokenOutInfo.tokenAddr ||
                                        !amountIn ||
                                        !amountOut ||
                                        !isAllowanceEnough ||
                                        isSwapPending ||
                                        isCalculating
                                    }
                                >
                                    {!isConnected ? (
                                        "请先连接钱包"
                                    ) : isSwapPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            兑换中...
                                        </>
                                    ) : (
                                        "兑换"
                                    )}
                                </Button>

                                {/* 错误提示 */}
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* 成功提示 */}
                                {isSwapSuccess && (
                                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-400">
                                        ✓ 兑换成功！
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 右栏：铸造历史 */}
                <div className="w-full lg:w-80 shrink-0">
                    <TokenHistory
                        history={history}
                        onDeleteRecord={deleteRecord}
                        onClearHistory={clearHistory}
                    />
                </div>
            </div>
        </div>
    )
}
