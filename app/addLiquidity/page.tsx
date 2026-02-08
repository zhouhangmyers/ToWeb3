"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
import { isAddress, parseUnits, maxUint256, formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Tabs 组件暂时不用，直接用按钮切换
import { AlertCircle, Loader2, CheckCircle2, Info, History, Trash2, Copy, Check, Coins } from "lucide-react"
import { erc20Abi } from "@/lib/erc20-contract"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import { uniswapV2FactoryAbil } from "@/lib/uniswapV2Factory"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const ROUTER_STORAGE_KEY = "deployed-router-address"
const HISTORY_KEY = "token-create-history"

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

export default function AddLiquidityPage() {
    const { address, isConnected } = useAccount()
    const publicClient = usePublicClient()

    // 模式选择：custom（自定义） 或 external（外部）
    const [mode, setMode] = useState<"custom" | "external">("custom")

    // 自定义 Router 地址（从 localStorage 读取）
    const [customRouterAddress, setCustomRouterAddress] = useState<string | null>(null)

    // 外部 Router 地址（用户输入）
    const [externalRouterInput, setExternalRouterInput] = useState("")

    // Token 地址
    const [tokenA, setTokenA] = useState("")
    const [tokenB, setTokenB] = useState("")
    const [amountA, setAmountA] = useState("")
    const [amountB, setAmountB] = useState("")

    // 交易对状态
    const [pairAddress, setPairAddress] = useState<string | null>(null)
    const [pairExists, setPairExists] = useState<boolean | null>(null)
    const [checkingPair, setCheckingPair] = useState(false)

    // 错误和提示
    const [error, setError] = useState<string | null>(null)

    // 铸造历史
    const [history, setHistory] = useState<TokenRecord[]>([])
    const [copied, setCopied] = useState<string | null>(null)

    // 初始化：从 localStorage 读取自定义 Router 和历史记录
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(ROUTER_STORAGE_KEY)
            setCustomRouterAddress(saved)
            if (!saved) {
                // 如果没有自定义 Router，默认切换到外部模式
                setMode("external")
            }
            // 加载铸造历史
            setHistory(loadHistory())
        }
    }, [])

    // 确定当前使用的 Router 地址
    const routerAddress = mode === "custom"
        ? customRouterAddress
        : (isAddress(externalRouterInput) ? externalRouterInput : null)
    const routerAddr = routerAddress as `0x${string}` | undefined

    // 读取 Router 的 Factory 地址
    const { data: factoryAddress } = useReadContract({
        address: routerAddr,
        abi: uniswapV2RouterAbi,
        functionName: "factory",
        query: { enabled: !!routerAddr },
    })

    // Token 地址验证
    const tokenAAddr = isAddress(tokenA) ? (tokenA as `0x${string}`) : undefined
    const tokenBAddr = isAddress(tokenB) ? (tokenB as `0x${string}`) : undefined

    // 读取 Token 信息
    const { data: tokenADecimals } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenAAddr },
    })

    const { data: tokenBDecimals } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenBAddr },
    })

    const { data: tokenASymbol } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "symbol",
        query: { enabled: !!tokenAAddr },
    })

    const { data: tokenBSymbol } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "symbol",
        query: { enabled: !!tokenBAddr },
    })

    // 读取授权额度
    const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenAAddr && !!address && !!routerAddr },
    })

    const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenBAddr && !!address && !!routerAddr },
    })

    // 读取余额
    const { data: balanceA } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenAAddr && !!address },
    })

    const { data: balanceB } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenBAddr && !!address },
    })

    // Approve 操作
    const { writeContract: writeApproveA, data: approveAHash, isPending: isApproveAPending } = useWriteContract()
    const { writeContract: writeApproveB, data: approveBHash, isPending: isApproveBPending } = useWriteContract()
    const { isLoading: isApproveAConfirming, isSuccess: isApproveASuccess } = useWaitForTransactionReceipt({ hash: approveAHash })
    const { isLoading: isApproveBConfirming, isSuccess: isApproveBSuccess } = useWaitForTransactionReceipt({ hash: approveBHash })

    // AddLiquidity 操作
    const { writeContract: writeAddLiquidity, data: addLiquidityHash, isPending: isAddLiquidityPending } = useWriteContract()
    const { isLoading: isAddLiquidityConfirming, isSuccess: isAddLiquiditySuccess } = useWaitForTransactionReceipt({ hash: addLiquidityHash })

    // 检查交易对是否存在
    useEffect(() => {
        async function checkPair() {
            if (!factoryAddress || !tokenAAddr || !tokenBAddr || !publicClient) {
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
                    args: [tokenAAddr, tokenBAddr],
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
    }, [factoryAddress, tokenAAddr, tokenBAddr, publicClient])

    // Approve 成功后刷新授权额度
    useEffect(() => {
        if (isApproveASuccess) refetchAllowanceA()
    }, [isApproveASuccess, refetchAllowanceA])

    useEffect(() => {
        if (isApproveBSuccess) refetchAllowanceB()
    }, [isApproveBSuccess, refetchAllowanceB])

    // 添加流动性成功后清空表单
    useEffect(() => {
        if (isAddLiquiditySuccess) {
            setAmountA("")
            setAmountB("")
        }
    }, [isAddLiquiditySuccess])

    // 处理函数
    const handleApproveA = () => {
        if (!tokenAAddr || !routerAddr) return
        writeApproveA({
            address: tokenAAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    const handleApproveB = () => {
        if (!tokenBAddr || !routerAddr) return
        writeApproveB({
            address: tokenBAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    const handleAddLiquidity = () => {
        if (!routerAddr || !tokenAAddr || !tokenBAddr || !amountA || !amountB || !address) return

        try {
            const parsedA = parseUnits(amountA, Number(tokenADecimals ?? 18))
            const parsedB = parseUnits(amountB, Number(tokenBDecimals ?? 18))
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

            writeAddLiquidity({
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
                    address,
                    BigInt(deadline),
                ],
            })
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "添加流动性失败")
        }
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
    const tokenADecimalsNum = Number(tokenADecimals ?? 18)
    const tokenBDecimalsNum = Number(tokenBDecimals ?? 18)

    const isAllowanceAEnough = allowanceA !== undefined && amountA &&
        allowanceA >= parseUnits(amountA, tokenADecimalsNum)

    const isAllowanceBEnough = allowanceB !== undefined && amountB &&
        allowanceB >= parseUnits(amountB, tokenBDecimalsNum)

    const isApproveABusy = isApproveAPending || isApproveAConfirming
    const isApproveBBusy = isApproveBPending || isApproveBConfirming
    const isAddLiquidityBusy = isAddLiquidityPending || isAddLiquidityConfirming

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">添加流动性</h1>
                <p className="text-muted-foreground">
                    为代币对添加流动性，赚取交易手续费
                </p>
            </div>

            {/* 两栏布局：左边添加流动性功能 + 右边铸造历史 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：添加流动性功能 */}
                <div className="flex flex-col gap-8 flex-1 min-w-0">

            {/* 模式选择 */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle>选择 Router</CardTitle>
                    <CardDescription>
                        使用自定义部署的 Router 或提供外部 Router 地址
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 模式切换按钮 */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={mode === "custom" ? "default" : "outline"}
                            onClick={() => setMode("custom")}
                            className="w-full"
                        >
                            自定义 Router {customRouterAddress && "✓"}
                        </Button>
                        <Button
                            variant={mode === "external" ? "default" : "outline"}
                            onClick={() => setMode("external")}
                            className="w-full"
                        >
                            外部 Router
                        </Button>
                    </div>

                    {/* 自定义 Router 模式 */}
                    {mode === "custom" && (
                        <div className="space-y-4">
                            {customRouterAddress ? (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-green-300">已检测到自定义 Router</p>
                                            <p className="text-sm text-green-400 font-mono mt-1">{customRouterAddress}</p>
                                            {(factoryAddress as string) && (
                                                <p className="text-xs text-green-400 mt-2">
                                                    Factory: {factoryAddress as string}
                                                </p>
                                            )}
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

                    {/* 外部 Router 模式 */}
                    {mode === "external" && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="routerAddress">Router 合约地址</Label>
                                <Input
                                    id="routerAddress"
                                    placeholder="0x..."
                                    value={externalRouterInput}
                                    onChange={(e) => setExternalRouterInput(e.target.value)}
                                />
                                {(factoryAddress as string) && isAddress(externalRouterInput) && (
                                    <p className="text-sm text-green-400">
                                        ✓ Factory: {factoryAddress as string}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 添加流动性表单 */}
            {routerAddress && (
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>添加流动性</CardTitle>
                        <CardDescription>
                            输入两个代币地址和数量
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Token A */}
                        <div className="grid gap-2">
                            <Label htmlFor="tokenA">Token A 地址</Label>
                            <Input
                                id="tokenA"
                                placeholder="0x..."
                                value={tokenA}
                                onChange={(e) => setTokenA(e.target.value)}
                            />
                            {tokenASymbol && (
                                <p className="text-sm text-muted-foreground">
                                    {tokenASymbol as string} | Decimals: {tokenADecimals?.toString()} | 余额: {balanceA ? formatUnits(balanceA, tokenADecimalsNum) : "—"}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amountA">Token A 数量</Label>
                            <Input
                                id="amountA"
                                type="number"
                                placeholder="100"
                                value={amountA}
                                onChange={(e) => setAmountA(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Token B */}
                        <div className="grid gap-2">
                            <Label htmlFor="tokenB">Token B 地址</Label>
                            <Input
                                id="tokenB"
                                placeholder="0x..."
                                value={tokenB}
                                onChange={(e) => setTokenB(e.target.value)}
                            />
                            {tokenBSymbol && (
                                <p className="text-sm text-muted-foreground">
                                    {tokenBSymbol as string} | Decimals: {tokenBDecimals?.toString()} | 余额: {balanceB ? formatUnits(balanceB, tokenBDecimalsNum) : "—"}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amountB">Token B 数量</Label>
                            <Input
                                id="amountB"
                                type="number"
                                placeholder="100"
                                value={amountB}
                                onChange={(e) => setAmountB(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* 交易对状态 */}
                        {tokenAAddr && tokenBAddr && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                                    <div className="flex-1">
                                        {checkingPair ? (
                                            <p className="text-sm text-blue-300">
                                                <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                                                检查交易对...
                                            </p>
                                        ) : pairExists === false ? (
                                            <div>
                                                <p className="font-medium text-blue-300">⚠️ 交易对未被创建</p>
                                                <p className="text-sm text-blue-400 mt-1">
                                                    当前操作会创建交易对并添加流动性
                                                </p>
                                            </div>
                                        ) : pairExists === true ? (
                                            <div>
                                                <p className="font-medium text-green-300">✓ 交易对已存在</p>
                                                <p className="text-xs text-green-400 font-mono mt-1">{pairAddress}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 授权按钮 */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={handleApproveA}
                                disabled={!tokenAAddr || !amountA || isAllowanceAEnough || isApproveABusy}
                            >
                                {isAllowanceAEnough ? "✓ Token A 已授权" : isApproveABusy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权中...</> : "授权 Token A"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleApproveB}
                                disabled={!tokenBAddr || !amountB || isAllowanceBEnough || isApproveBBusy}
                            >
                                {isAllowanceBEnough ? "✓ Token B 已授权" : isApproveBBusy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权中...</> : "授权 Token B"}
                            </Button>
                        </div>

                        {/* 添加流动性按钮 */}
                        <Button
                            className="w-full"
                            onClick={handleAddLiquidity}
                            disabled={
                                !isConnected ||
                                !tokenAAddr ||
                                !tokenBAddr ||
                                !amountA ||
                                !amountB ||
                                !isAllowanceAEnough ||
                                !isAllowanceBEnough ||
                                isAddLiquidityBusy
                            }
                        >
                            {!isConnected ? "请先连接钱包" : isAddLiquidityBusy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />添加中...</> : "添加流动性"}
                        </Button>

                        {/* 错误提示 */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* 成功提示 */}
                        {isAddLiquiditySuccess && (
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-400">
                                ✓ 流动性添加成功！
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
