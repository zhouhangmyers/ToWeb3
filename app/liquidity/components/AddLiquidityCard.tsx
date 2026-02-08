import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Droplets, CheckCircle2 } from "lucide-react"
import { formatUnits } from "viem"

interface AddLiquidityCardProps {
    isConnected: boolean
    routerAddress: string | null
    factoryAddress: string | null
    wethAddress: string | null

    // Token 状态
    tokenA: string
    setTokenA: (value: string) => void
    tokenB: string
    setTokenB: (value: string) => void
    amountA: string
    setAmountA: (value: string) => void
    amountB: string
    setAmountB: (value: string) => void

    // Token 信息
    tokenADecimalsNumber?: number
    tokenBDecimalsNumber?: number
    allowanceA?: bigint
    allowanceB?: bigint
    balanceA?: bigint
    balanceB?: bigint

    // 操作状态
    isAddLiquidityPending: boolean
    isAddLiquidityConfirming: boolean
    isApproveAPending: boolean
    isApproveAConfirming: boolean
    isApproveBPending: boolean
    isApproveBConfirming: boolean

    // 错误
    approveAError: Error | null
    approveBError: Error | null
    addLiquiditySimError: string | null

    // 操作方法
    onApproveTokenA: () => void
    onApproveTokenB: () => void
    onAddLiquidity: () => void
}

export function AddLiquidityCard({
    isConnected,
    routerAddress,
    factoryAddress: _factoryAddress,
    wethAddress: _wethAddress,
    tokenA,
    setTokenA,
    tokenB,
    setTokenB,
    amountA,
    setAmountA,
    amountB,
    setAmountB,
    tokenADecimalsNumber,
    tokenBDecimalsNumber,
    allowanceA,
    allowanceB,
    balanceA,
    balanceB,
    isAddLiquidityPending,
    isAddLiquidityConfirming,
    isApproveAPending,
    isApproveAConfirming,
    isApproveBPending,
    isApproveBConfirming,
    approveAError,
    approveBError,
    addLiquiditySimError,
    onApproveTokenA,
    onApproveTokenB,
    onAddLiquidity,
}: AddLiquidityCardProps) {

    const formatAllowance = (allowance: bigint | undefined, decimals: number | undefined, fallback: string) => {
        if (allowance === undefined || decimals === undefined) return fallback
        const formatted = formatUnits(allowance, decimals)
        return parseFloat(formatted) > 1e15 ? "无限制" : parseFloat(formatted).toFixed(2)
    }

    const formatBalance = (balance: bigint | undefined, decimals: number | undefined) => {
        if (balance === undefined || decimals === undefined) return "—"
        return parseFloat(formatUnits(balance, decimals)).toFixed(6)
    }

    const isApproveABusy = isApproveAPending || isApproveAConfirming
    const isApproveBBusy = isApproveBPending || isApproveBConfirming
    const isAddLiquidityBusy = isAddLiquidityPending || isAddLiquidityConfirming

    // 检查是否有足够的授权
    const isAllowanceAEnough = allowanceA !== undefined && amountA &&
        tokenADecimalsNumber !== undefined &&
        allowanceA >= BigInt(parseFloat(amountA) * 10 ** tokenADecimalsNumber)

    const isAllowanceBEnough = allowanceB !== undefined && amountB &&
        tokenBDecimalsNumber !== undefined &&
        allowanceB >= BigInt(parseFloat(amountB) * 10 ** tokenBDecimalsNumber)

    return (
        <Card className={`w-full max-w-sm bg-gray-900/50 border-gray-800 ${!routerAddress ? "opacity-50" : ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {routerAddress
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${routerAddress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>4</span>
                    }
                    <Droplets className="w-4 h-4" />
                    添加流动性
                </CardTitle>
                <CardDescription>
                    为代币对添加流动性，开始做市。首次添加会自动创建交易对。
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tokenA">Token A 地址</Label>
                        <Input
                            id="tokenA"
                            placeholder="0x..."
                            value={tokenA}
                            onChange={(e) => setTokenA(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amountA">Token A 数量</Label>
                        <Input
                            id="amountA"
                            type="number"
                            placeholder="例如：100"
                            value={amountA}
                            onChange={(e) => setAmountA(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tokenB">Token B 地址</Label>
                        <Input
                            id="tokenB"
                            placeholder="0x..."
                            value={tokenB}
                            onChange={(e) => setTokenB(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amountB">Token B 数量</Label>
                        <Input
                            id="amountB"
                            type="number"
                            placeholder="例如：100"
                            value={amountB}
                            onChange={(e) => setAmountB(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* 信息显示 */}
                    <div className="grid gap-2 text-xs text-muted-foreground">
                        <div>
                            当前授权给 Router 的 Token A：
                            <span className="ml-1 text-foreground">
                                {formatAllowance(allowanceA, tokenADecimalsNumber, "未知")}
                            </span>
                        </div>
                        <div>
                            当前授权给 Router 的 Token B：
                            <span className="ml-1 text-foreground">
                                {formatAllowance(allowanceB, tokenBDecimalsNumber, "未知")}
                            </span>
                        </div>
                        <div>
                            当前 Token A 余额：
                            <span className="ml-1 text-foreground">
                                {formatBalance(balanceA, tokenADecimalsNumber)}
                            </span>
                        </div>
                        <div>
                            当前 Token B 余额：
                            <span className="ml-1 text-foreground">
                                {formatBalance(balanceB, tokenBDecimalsNumber)}
                            </span>
                        </div>
                        <div>
                            Token A decimals：
                            <span className="ml-1 text-foreground">
                                {tokenADecimalsNumber ?? "未知"}
                            </span>
                        </div>
                        <div>
                            Token B decimals：
                            <span className="ml-1 text-foreground">
                                {tokenBDecimalsNumber ?? "未知"}
                            </span>
                        </div>
                    </div>

                    {/* 授权按钮 */}
                    <div className="grid gap-2">
                        <Label className="text-sm text-muted-foreground">授权</Label>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="secondary"
                                onClick={onApproveTokenA}
                                disabled={
                                    !isConnected ||
                                    !tokenA ||
                                    !amountA ||
                                    isAllowanceAEnough ||
                                    isApproveABusy
                                }
                            >
                                {isAllowanceAEnough
                                    ? "Token A 已授权"
                                    : isApproveABusy
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权 Token A 中...</>
                                        : "授权 Token A"}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={onApproveTokenB}
                                disabled={
                                    !isConnected ||
                                    !tokenB ||
                                    !amountB ||
                                    isAllowanceBEnough ||
                                    isApproveBBusy
                                }
                            >
                                {isAllowanceBEnough
                                    ? "Token B 已授权"
                                    : isApproveBBusy
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权 Token B 中...</>
                                        : "授权 Token B"}
                            </Button>
                        </div>
                        {(approveAError || approveBError) && (
                            <p className="text-sm text-red-500">
                                授权失败：{(approveAError ?? approveBError)?.message.slice(0, 100)}
                            </p>
                        )}
                        {addLiquiditySimError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                                <div className="font-semibold mb-1">❌ 模拟失败</div>
                                <div className="text-xs whitespace-pre-wrap wrap-break-word font-mono">
                                    {addLiquiditySimError}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 添加流动性按钮 */}
                    <Button
                        onClick={onAddLiquidity}
                        disabled={
                            !isConnected ||
                            !routerAddress ||
                            !tokenA ||
                            !tokenB ||
                            !amountA ||
                            !amountB ||
                            !isAllowanceAEnough ||
                            !isAllowanceBEnough ||
                            isAddLiquidityBusy
                        }
                        className="w-full"
                    >
                        {!routerAddress
                            ? "请先部署 Router"
                            : !isConnected
                                ? "请先连接钱包"
                                : isAddLiquidityBusy
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />添加流动性中...</>
                                    : "添加流动性"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
