"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
import { isAddress, parseUnits, maxUint256, formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle2, ArrowUpDown, Settings, History, Trash2, Copy, Check, Coins } from "lucide-react"
import { erc20Abi } from "@/lib/erc20-contract"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"

const ROUTER_STORAGE_KEY = "deployed-router-address"
const HISTORY_KEY = "token-create-history"

type SwapMode = "exactIn" | "exactOut"

interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

function loadHistory(): TokenRecord[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(HISTORY_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveHistory(records: TokenRecord[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export default function SwapPage() {
    const { address, isConnected } = useAccount()
    const publicClient = usePublicClient()

    // Router 地址管理
    const [useCustomRouter, setUseCustomRouter] = useState(true)
    const [customRouterAddress, setCustomRouterAddress] = useState<string | null>(null)
    const [externalRouterInput, setExternalRouterInput] = useState("")

    // Token 信息
    const [tokenIn, setTokenIn] = useState("")
    const [tokenOut, setTokenOut] = useState("")
    const [amountIn, setAmountIn] = useState("")
    const [amountOut, setAmountOut] = useState("")

    // 交换模式：exactIn = 精确输入，exactOut = 精确输出
    const [swapMode, setSwapMode] = useState<SwapMode>("exactIn")

    // 滑点设置（百分比）
    const [slippage, setSlippage] = useState("0.5")
    const [showSlippageSettings, setShowSlippageSettings] = useState(false)

    // 路径
    const [path, setPath] = useState<string[]>([])

    // 错误和状态
    const [error, setError] = useState<string | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    // 铸造历史
    const [history, setHistory] = useState<TokenRecord[]>([])
    const [copied, setCopied] = useState<string | null>(null)

    // 初始化：从 localStorage 读取自定义 Router 和历史记录
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(ROUTER_STORAGE_KEY)
            setCustomRouterAddress(saved)
            if (!saved) {
                setUseCustomRouter(false)
            }
            // 加载铸造历史
            setHistory(loadHistory())
        }
    }, [])

    // 确定当前使用的 Router 地址
    const routerAddress = useCustomRouter
        ? customRouterAddress
        : (isAddress(externalRouterInput) ? externalRouterInput : null)
    const routerAddr = routerAddress as `0x${string}` | undefined

    // Token 地址验证
    const tokenInAddr = isAddress(tokenIn) ? (tokenIn as `0x${string}`) : undefined
    const tokenOutAddr = isAddress(tokenOut) ? (tokenOut as `0x${string}`) : undefined

    // 读取 Token 信息
    const { data: tokenInDecimals } = useReadContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenInAddr },
    })

    const { data: tokenOutDecimals } = useReadContract({
        address: tokenOutAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenOutAddr },
    })

    const { data: tokenInSymbol } = useReadContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "symbol",
        query: { enabled: !!tokenInAddr },
    })

    const { data: tokenOutSymbol } = useReadContract({
        address: tokenOutAddr,
        abi: erc20Abi,
        functionName: "symbol",
        query: { enabled: !!tokenOutAddr },
    })

    // 读取余额
    const { data: balanceIn, refetch: refetchBalanceIn } = useReadContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenInAddr && !!address },
    })

    const { data: balanceOut, refetch: refetchBalanceOut } = useReadContract({
        address: tokenOutAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenOutAddr && !!address },
    })

    // 读取授权额度
    const { data: allowanceIn, refetch: refetchAllowance } = useReadContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenInAddr && !!address && !!routerAddr },
    })

    // Approve 操作
    const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

    // Swap 操作
    const { writeContract: writeSwap, data: swapHash, isPending: isSwapPending } = useWriteContract()
    const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({ hash: swapHash })

    // 自动计算兑换数量
    useEffect(() => {
        async function calculateAmount() {
            if (!routerAddr || !tokenInAddr || !tokenOutAddr || !publicClient) {
                return
            }

            const currentPath = [tokenInAddr, tokenOutAddr]
            setPath(currentPath)

            try {
                setIsCalculating(true)
                setError(null)

                if (swapMode === "exactIn" && amountIn) {
                    // 精确输入，计算输出
                    const decimalsIn = Number(tokenInDecimals ?? 18)
                    const parsedAmountIn = parseUnits(amountIn, decimalsIn)

                    const amounts = await publicClient.readContract({
                        address: routerAddr,
                        abi: uniswapV2RouterAbi,
                        functionName: "getAmountsOut",
                        args: [parsedAmountIn, currentPath],
                    }) as bigint[]

                    const decimalsOut = Number(tokenOutDecimals ?? 18)
                    const calculatedAmountOut = formatUnits(amounts[1], decimalsOut)
                    setAmountOut(calculatedAmountOut)
                } else if (swapMode === "exactOut" && amountOut) {
                    // 精确输出，计算输入
                    const decimalsOut = Number(tokenOutDecimals ?? 18)
                    const parsedAmountOut = parseUnits(amountOut, decimalsOut)

                    const amounts = await publicClient.readContract({
                        address: routerAddr,
                        abi: uniswapV2RouterAbi,
                        functionName: "getAmountsIn",
                        args: [parsedAmountOut, currentPath],
                    }) as bigint[]

                    const decimalsIn = Number(tokenInDecimals ?? 18)
                    const calculatedAmountIn = formatUnits(amounts[0], decimalsIn)
                    setAmountIn(calculatedAmountIn)
                }
            } catch (err) {
                console.error("计算兑换数量失败:", err)
                setError("无法计算兑换数量，请检查流动性池是否存在")
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
    }, [amountIn, amountOut, swapMode, tokenInAddr, tokenOutAddr, routerAddr, publicClient, tokenInDecimals, tokenOutDecimals])

    // Approve 成功后刷新授权额度
    useEffect(() => {
        if (isApproveSuccess) refetchAllowance()
    }, [isApproveSuccess, refetchAllowance])

    // Swap 成功后清空表单并刷新余额
    useEffect(() => {
        if (isSwapSuccess) {
            setAmountIn("")
            setAmountOut("")
            // 刷新两个 token 的余额
            refetchBalanceIn()
            refetchBalanceOut()
        }
    }, [isSwapSuccess, refetchBalanceIn, refetchBalanceOut])

    // 处理授权
    const handleApprove = () => {
        if (!tokenInAddr || !routerAddr) return
        writeApprove({
            address: tokenInAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    // 处理兑换
    const handleSwap = () => {
        if (!routerAddr || !tokenInAddr || !tokenOutAddr || !address || !amountIn || !amountOut) return

        try {
            const decimalsIn = Number(tokenInDecimals ?? 18)
            const decimalsOut = Number(tokenOutDecimals ?? 18)
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
            const slippagePercent = parseFloat(slippage) / 100

            if (swapMode === "exactIn") {
                // 精确输入模式：swapExactTokensForTokens
                const amountInParsed = parseUnits(amountIn, decimalsIn)
                const amountOutParsed = parseUnits(amountOut, decimalsOut)
                // 最小输出 = 预估输出 × (1 - 滑点)
                const amountOutMin = BigInt(Math.floor(Number(amountOutParsed) * (1 - slippagePercent)))

                writeSwap({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "swapExactTokensForTokens",
                    args: [
                        amountInParsed,
                        amountOutMin,
                        path as `0x${string}`[],
                        address,
                        BigInt(deadline),
                    ],
                })
            } else {
                // 精确输出模式：swapTokensForExactTokens
                const amountOutParsed = parseUnits(amountOut, decimalsOut)
                const amountInParsed = parseUnits(amountIn, decimalsIn)
                // 最大输入 = 预估输入 × (1 + 滑点)
                const amountInMax = BigInt(Math.floor(Number(amountInParsed) * (1 + slippagePercent)))

                writeSwap({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "swapTokensForExactTokens",
                    args: [
                        amountOutParsed,
                        amountInMax,
                        path as `0x${string}`[],
                        address,
                        BigInt(deadline),
                    ],
                })
            }
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "兑换失败")
        }
    }

    // 切换输入/输出（交换数据）
    const handleSwitchTokens = () => {
        const tempTokenIn = tokenIn
        const tempTokenOut = tokenOut
        const tempAmountIn = amountIn
        const tempAmountOut = amountOut

        setTokenIn(tempTokenOut)
        setTokenOut(tempTokenIn)
        setAmountIn(tempAmountOut)
        setAmountOut(tempAmountIn)
        setError(null)
    }

    // 复制地址
    function handleCopy(addr: string) {
        navigator.clipboard.writeText(addr)
        setCopied(addr)
        setTimeout(() => setCopied(null), 2000)
    }

    // 删除单条记录
    function handleDeleteRecord(contractAddr: string) {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }

    // 清空历史
    function handleClearHistory() {
        setHistory([])
        saveHistory([])
    }

    // 检查授权是否足够
    const tokenInDecimalsNum = Number(tokenInDecimals ?? 18)
    const isAllowanceEnough = allowanceIn !== undefined && amountIn &&
        allowanceIn >= parseUnits(amountIn, tokenInDecimalsNum)

    const isApproveBusy = isApprovePending || isApproveConfirming
    const isSwapBusy = isSwapPending || isSwapConfirming

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">代币兑换</h1>
                <p className="text-muted-foreground">
                    使用 Uniswap V2 协议进行代币兑换
                </p>
            </div>

            {/* 两栏布局：左边兑换功能 + 右边铸造历史 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：兑换功能 */}
                <div className="flex flex-col gap-8 flex-1 min-w-0">

            {/* Router 选择 */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle>选择 Router</CardTitle>
                    <CardDescription>
                        使用自定义部署的 Router 或提供外部 Router 地址
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 模式切换 */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={useCustomRouter ? "default" : "outline"}
                            onClick={() => setUseCustomRouter(true)}
                            className="w-full"
                        >
                            自定义 Router {customRouterAddress && "✓"}
                        </Button>
                        <Button
                            variant={!useCustomRouter ? "default" : "outline"}
                            onClick={() => setUseCustomRouter(false)}
                            className="w-full"
                        >
                            外部 Router
                        </Button>
                    </div>

                    {/* 自定义 Router */}
                    {useCustomRouter && (
                        <div className="space-y-4">
                            {customRouterAddress ? (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-green-300">已检测到自定义 Router</p>
                                            <p className="text-sm text-green-400 font-mono mt-1">{customRouterAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-yellow-300">未检测到自定义 Router</p>
                                            <p className="text-sm text-yellow-400 mt-1">
                                                请先前往 <a href="/liquidity" className="underline font-semibold">自定义路由页面</a> 部署 Router
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 外部 Router */}
                    {!useCustomRouter && (
                        <div className="grid gap-2">
                            <Label htmlFor="routerAddress">Router 合约地址</Label>
                            <Input
                                id="routerAddress"
                                placeholder="0x..."
                                value={externalRouterInput}
                                onChange={(e) => setExternalRouterInput(e.target.value)}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 兑换表单 */}
            {routerAddress && (
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>兑换代币</CardTitle>
                                <CardDescription>
                                    输入代币地址和数量进行兑换
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
                            <div className="p-4 bg-muted rounded-lg space-y-3">
                                <Label>滑点容差（%）</Label>
                                <div className="flex gap-2">
                                    {["0.1", "0.5", "1.0"].map((value) => (
                                        <Button
                                            key={value}
                                            variant={slippage === value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSlippage(value)}
                                        >
                                            {value}%
                                        </Button>
                                    ))}
                                    <Input
                                        type="number"
                                        placeholder="自定义"
                                        value={slippage}
                                        onChange={(e) => setSlippage(e.target.value)}
                                        className="w-24"
                                        min="0"
                                        max="50"
                                        step="0.1"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    滑点越高，交易越容易成功，但可能获得更少的代币
                                </p>
                            </div>
                        )}

                        {/* Token In - 卖出 */}
                        <div className="space-y-3 p-4 bg-muted rounded-lg">
                            <div className="flex justify-between items-center">
                                <Label>卖出</Label>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSwapMode("exactIn")}
                                        className={swapMode === "exactIn" ? "bg-background" : ""}
                                    >
                                        精确输入
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Token 地址"
                                    value={tokenIn}
                                    onChange={(e) => setTokenIn(e.target.value)}
                                />
                                {tokenInSymbol && (
                                    <p className="text-sm text-muted-foreground">
                                        {tokenInSymbol as string} | 余额: {balanceIn ? formatUnits(balanceIn, tokenInDecimalsNum) : "—"}
                                    </p>
                                )}
                            </div>
                            <Input
                                type="number"
                                placeholder="0.0"
                                value={amountIn}
                                onChange={(e) => {
                                    setAmountIn(e.target.value)
                                    if (swapMode === "exactOut") {
                                        setSwapMode("exactIn")
                                    }
                                }}
                                disabled={swapMode === "exactOut" && isCalculating}
                                min="0"
                                step="0.000001"
                                className="text-2xl h-14"
                            />
                        </div>

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
                        <div className="space-y-3 p-4 bg-muted rounded-lg">
                            <div className="flex justify-between items-center">
                                <Label>买入</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSwapMode("exactOut")}
                                    className={swapMode === "exactOut" ? "bg-background" : ""}
                                >
                                    精确输出
                                </Button>
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Token 地址"
                                    value={tokenOut}
                                    onChange={(e) => setTokenOut(e.target.value)}
                                />
                                {tokenOutSymbol && (
                                    <p className="text-sm text-muted-foreground">
                                        {tokenOutSymbol as string} | 余额: {balanceOut ? formatUnits(balanceOut, Number(tokenOutDecimals ?? 18)) : "—"}
                                    </p>
                                )}
                            </div>
                            <Input
                                type="number"
                                placeholder="0.0"
                                value={amountOut}
                                onChange={(e) => {
                                    setAmountOut(e.target.value)
                                    if (swapMode === "exactIn") {
                                        setSwapMode("exactOut")
                                    }
                                }}
                                disabled={swapMode === "exactIn" && isCalculating}
                                min="0"
                                step="0.000001"
                                className="text-2xl h-14"
                            />
                        </div>

                        {/* 计算中提示 */}
                        {isCalculating && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                计算中...
                            </div>
                        )}

                        {/* 兑换信息 */}
                        {amountIn && amountOut && !isCalculating && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">兑换模式</span>
                                    <span className="font-medium">
                                        {swapMode === "exactIn" ? "精确输入" : "精确输出"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">滑点容差</span>
                                    <span className="font-medium">{slippage}%</span>
                                </div>
                                {swapMode === "exactIn" && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">最小获得</span>
                                        <span className="font-medium">
                                            {(parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {tokenOutSymbol as string}
                                        </span>
                                    </div>
                                )}
                                {swapMode === "exactOut" && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">最多花费</span>
                                        <span className="font-medium">
                                            {(parseFloat(amountIn) * (1 + parseFloat(slippage) / 100)).toFixed(6)} {tokenInSymbol as string}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 授权按钮 */}
                        {!isAllowanceEnough && (
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleApprove}
                                disabled={!tokenInAddr || !amountIn || isApproveBusy}
                            >
                                {isApproveBusy ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        授权中...
                                    </>
                                ) : (
                                    `授权 ${tokenInSymbol || "Token"}`
                                )}
                            </Button>
                        )}

                        {/* 兑换按钮 */}
                        <Button
                            className="w-full"
                            onClick={handleSwap}
                            disabled={
                                !isConnected ||
                                !tokenInAddr ||
                                !tokenOutAddr ||
                                !amountIn ||
                                !amountOut ||
                                !isAllowanceEnough ||
                                isSwapBusy ||
                                isCalculating
                            }
                        >
                            {!isConnected ? (
                                "请先连接钱包"
                            ) : isSwapBusy ? (
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

                {/* 右栏：铸造历史记录 */}
                <div className="w-full lg:w-80 shrink-0">
                    <Card className="sticky top-6 bg-gray-900/50 border-gray-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    铸造历史
                                </CardTitle>
                                {history.length > 0 && (
                                    <button
                                        onClick={handleClearHistory}
                                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        清空
                                    </button>
                                )}
                            </div>
                            <CardDescription>
                                {history.length > 0
                                    ? `共 ${history.length} 条记录`
                                    : "暂无铸造记录"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                    <Coins className="w-8 h-8 opacity-30" />
                                    <p className="text-sm">暂无铸造记录</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                    {history.map((record) => (
                                        <div
                                            key={record.contractAddress}
                                            className="group relative rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
                                        >
                                            <button
                                                onClick={() => handleDeleteRecord(record.contractAddress)}
                                                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                                                title="删除记录"
                                            >
                                                <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                            </button>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="font-semibold">{record.name}</span>
                                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    {record.symbol}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="font-mono text-xs text-muted-foreground truncate">
                                                    {record.contractAddress}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(record.contractAddress)}
                                                    className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
                                                    title="复制地址"
                                                >
                                                    {copied === record.contractAddress
                                                        ? <Check className="w-3 h-3 text-green-500" />
                                                        : <Copy className="w-3 h-3 text-muted-foreground" />
                                                    }
                                                </button>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>发行量: {Number(record.supply).toLocaleString()}</span>
                                                <span>{record.createdAt}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
