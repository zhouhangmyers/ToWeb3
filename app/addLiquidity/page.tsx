"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { isAddress, parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"

// Hooks
import { useRouterAddress, useTokenHistory } from "./hooks/useLocalStorage"
import { useTokenInfo } from "./hooks/useTokenInfo"
import { usePairCheck } from "./hooks/usePairCheck"
import { useApproval } from "./hooks/useApproval"
import { useAddLiquidity } from "./hooks/useAddLiquidity"

// Components
import { RouterSelector } from "./components/RouterSelector"
import { TokenInput } from "./components/TokenInput"
import { PairStatus } from "./components/PairStatus"
import { ApprovalButtons } from "./components/ApprovalButtons"
import { TokenHistory } from "./components/TokenHistory"

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

export default function AddLiquidityPage() {
    const { address, isConnected } = useAccount()

    // 模式选择
    const [mode, setMode] = useState<"custom" | "external">("custom")
    const customRouterAddress = useRouterAddress()
    const [externalRouterInput, setExternalRouterInput] = useState("")

    // Token 输入
    const [tokenA, setTokenA] = useState("")
    const [tokenB, setTokenB] = useState("")
    const [amountA, setAmountA] = useState("")
    const [amountB, setAmountB] = useState("")

    // 历史记录
    const { history, deleteRecord, clearHistory } = useTokenHistory()

    // 初始化模式
    useEffect(() => {
        if (!customRouterAddress) {
            setMode("external")
        }
    }, [customRouterAddress])

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

    // Token 信息
    const tokenAInfo = useTokenInfo(tokenA, address, routerAddr)
    const tokenBInfo = useTokenInfo(tokenB, address, routerAddr)

    // 检查交易对（ETH会自动转换为WETH地址）
    const { pairAddress, pairExists, checkingPair, refetchPair } = usePairCheck(
        factoryAddress as string | undefined,
        tokenAInfo.tokenAddr,
        tokenBInfo.tokenAddr
    )

    // 授权操作
    const approvalA = useApproval(tokenAInfo.tokenAddr, routerAddr, tokenAInfo.refetchAllowance)
    const approvalB = useApproval(tokenBInfo.tokenAddr, routerAddr, tokenBInfo.refetchAllowance)

    // 添加流动性
    const {
        handleAddLiquidity,
        isAddingLiquidity,
        isSuccess,
        error,
    } = useAddLiquidity(
        routerAddr,
        tokenAInfo.tokenAddr,
        tokenBInfo.tokenAddr,
        Number(tokenAInfo.decimals ?? 18),
        Number(tokenBInfo.decimals ?? 18),
        address
    )

    // 成功后清空表单并刷新交易对信息
    useEffect(() => {
        if (isSuccess) {
            setAmountA("")
            setAmountB("")
            // 刷新交易对信息（因为可能刚创建了新的交易对）
            refetchPair()
        }
    }, [isSuccess, refetchPair])

    // 原生代币占位符地址
    const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

    // 检查是否为原生代币
    const isTokenANative = tokenA.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
    const isTokenBNative = tokenB.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()

    // 检查授权是否足够（原生代币不需要授权）
    const isAllowanceAEnough = isTokenANative || !!(tokenAInfo.allowance !== undefined && amountA &&
        tokenAInfo.allowance >= parseUnits(amountA, Number(tokenAInfo.decimals ?? 18)))

    const isAllowanceBEnough = isTokenBNative || !!(tokenBInfo.allowance !== undefined && amountB &&
        tokenBInfo.allowance >= parseUnits(amountB, Number(tokenBInfo.decimals ?? 18)))

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">添加流动性</h1>
                <p className="text-muted-foreground">
                    为代币对添加流动性，赚取交易手续费
                </p>
            </div>

            {/* 两栏布局 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：添加流动性功能 */}
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
                                <TokenInput
                                    label="Token A"
                                    addressId="tokenA"
                                    amountId="amountA"
                                    tokenAddress={tokenA}
                                    amount={amountA}
                                    onAddressChange={setTokenA}
                                    onAmountChange={(value) => setAmountA(sanitizeNumberInput(value))}
                                    symbol={tokenAInfo.symbol as string | undefined}
                                    decimals={Number(tokenAInfo.decimals ?? 18)}
                                    balance={tokenAInfo.balance}
                                    excludeAddresses={isTokenBNative ? [tokenB] : []}
                                />

                                {/* Token B */}
                                <TokenInput
                                    label="Token B"
                                    addressId="tokenB"
                                    amountId="amountB"
                                    tokenAddress={tokenB}
                                    amount={amountB}
                                    onAddressChange={setTokenB}
                                    onAmountChange={(value) => setAmountB(sanitizeNumberInput(value))}
                                    symbol={tokenBInfo.symbol as string | undefined}
                                    decimals={Number(tokenBInfo.decimals ?? 18)}
                                    balance={tokenBInfo.balance}
                                    excludeAddresses={isTokenANative ? [tokenA] : []}
                                />

                                {/* 交易对状态（ETH自动转换为WETH检查） */}
                                {tokenAInfo.tokenAddr && tokenBInfo.tokenAddr && (
                                    <PairStatus
                                        checkingPair={checkingPair}
                                        pairExists={pairExists}
                                        pairAddress={pairAddress}
                                    />
                                )}

                                {/* 授权按钮 */}
                                <ApprovalButtons
                                    tokenAAddr={tokenAInfo.tokenAddr}
                                    tokenBAddr={tokenBInfo.tokenAddr}
                                    amountA={amountA}
                                    amountB={amountB}
                                    isAllowanceAEnough={isAllowanceAEnough}
                                    isAllowanceBEnough={isAllowanceBEnough}
                                    isApproveABusy={approvalA.isApproving}
                                    isApproveBBusy={approvalB.isApproving}
                                    isTokenANative={isTokenANative}
                                    isTokenBNative={isTokenBNative}
                                    handleApproveA={approvalA.handleApprove}
                                    handleApproveB={approvalB.handleApprove}
                                />

                                {/* 添加流动性按钮 */}
                                <Button
                                    className="w-full"
                                    onClick={() => handleAddLiquidity(amountA, amountB)}
                                    disabled={
                                        !isConnected ||
                                        !tokenAInfo.tokenAddr ||
                                        !tokenBInfo.tokenAddr ||
                                        !amountA ||
                                        !amountB ||
                                        !isAllowanceAEnough ||
                                        !isAllowanceBEnough ||
                                        isAddingLiquidity
                                    }
                                >
                                    {!isConnected ? "请先连接钱包" : isAddingLiquidity ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            添加中...
                                        </>
                                    ) : "添加流动性"}
                                </Button>

                                {/* 错误提示 */}
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* 成功提示 */}
                                {isSuccess && (
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
