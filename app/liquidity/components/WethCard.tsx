import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    CheckCircle2,
    Copy,
    Check,
    Loader2,
    Wallet,
    ArrowDownUp,
    ArrowDown,
    ArrowUp,
} from "lucide-react"
import { formatEther } from "viem"

interface WethCardProps {
    isConnected: boolean
    wethAddress: string | null
    wethName?: string
    wethSymbol?: string
    wethTotalSupply?: bigint
    wethBalance?: bigint
    ethBalance: any
    depositAmount: string
    setDepositAmount: (amount: string) => void
    withdrawAmount: string
    setWithdrawAmount: (amount: string) => void
    isDeploying: boolean
    isWaiting: boolean
    isDepositPending: boolean
    isDepositConfirming: boolean
    isWithdrawPending: boolean
    isWithdrawConfirming: boolean
    deployError: Error | null
    depositError: Error | null
    withdrawError: Error | null
    onDeployWeth: () => void
    onDeposit: (amount: string) => void
    onWithdraw: (amount: string) => void
    onReset: () => void
}

export function WethCard({
    isConnected,
    wethAddress,
    wethName,
    wethSymbol,
    wethTotalSupply,
    wethBalance,
    ethBalance,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
    isDeploying,
    isWaiting,
    isDepositPending,
    isDepositConfirming,
    isWithdrawPending,
    isWithdrawConfirming,
    deployError,
    depositError,
    withdrawError,
    onDeployWeth,
    onDeposit,
    onWithdraw,
    onReset,
}: WethCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const isDepositBusy = isDepositPending || isDepositConfirming
    const isWithdrawBusy = isWithdrawPending || isWithdrawConfirming

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleMaxDeposit = () => {
        if (ethBalance) {
            // 留一点 gas 费
            const maxEth = Math.max(0, parseFloat(formatEther(ethBalance.value)) - 0.01)
            setDepositAmount(maxEth.toFixed(6))
        }
    }

    const handleMaxWithdraw = () => {
        if (wethBalance !== undefined) {
            setWithdrawAmount(formatEther(wethBalance))
        }
    }

    return (
        <Card className="w-full max-w-sm bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {wethAddress
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                    }
                    部署 WETH 合约
                </CardTitle>
                <CardDescription>
                    WETH（Wrapped Ether）是 ETH 的 ERC-20 包装版本，Router 合约需要它来处理 ETH 交易。
                </CardDescription>
            </CardHeader>

            {wethAddress ? (
                <CardContent>
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">合约地址</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {wethAddress}
                                </span>
                                <button
                                    onClick={() => handleCopy(wethAddress)}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                    title="复制地址"
                                >
                                    {copied === wethAddress
                                        ? <Check className="w-3.5 h-3.5 text-green-500" />
                                        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                    }
                                </button>
                            </div>
                        </div>
                        {wethName && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">名称</span>
                                <span>{wethName}</span>
                            </div>
                        )}
                        {wethSymbol && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">符号</span>
                                <span>{wethSymbol}</span>
                            </div>
                        )}
                        {wethTotalSupply !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">总供应量</span>
                                <span className="font-mono">{formatEther(wethTotalSupply)} WETH</span>
                            </div>
                        )}

                        {/* 余额区域 */}
                        <div className="border-t pt-3 mt-1 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Wallet className="w-3.5 h-3.5" />
                                    ETH 余额
                                </span>
                                <span className="font-mono font-semibold">
                                    {ethBalance
                                        ? `${parseFloat(formatEther(ethBalance.value)).toFixed(6)} ETH`
                                        : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <ArrowDownUp className="w-3.5 h-3.5" />
                                    WETH 余额
                                </span>
                                <span className="font-mono font-semibold">
                                    {wethBalance !== undefined
                                        ? `${parseFloat(formatEther(wethBalance)).toFixed(6)} WETH`
                                        : "—"}
                                </span>
                            </div>
                        </div>

                        {/* Deposit: ETH → WETH */}
                        <div className="border-t pt-3 mt-1">
                            <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
                                <ArrowDown className="w-4 h-4 text-green-500" />
                                存入 ETH → 获得 WETH
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        placeholder="ETH 数量"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        onClick={handleMaxDeposit}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <Button
                                    onClick={() => onDeposit(depositAmount)}
                                    disabled={!depositAmount || isDepositBusy || parseFloat(depositAmount) <= 0}
                                    className="shrink-0"
                                >
                                    {isDepositBusy
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : "存入"}
                                </Button>
                            </div>
                            {depositError && (
                                <p className="text-xs text-red-500 mt-1">
                                    {depositError.message.slice(0, 80)}
                                </p>
                            )}
                        </div>

                        {/* Withdraw: WETH → ETH */}
                        <div className="border-t pt-3 mt-1">
                            <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
                                <ArrowUp className="w-4 h-4 text-blue-500" />
                                取出 WETH → 获得 ETH
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        placeholder="WETH 数量"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        onClick={handleMaxWithdraw}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <Button
                                    onClick={() => onWithdraw(withdrawAmount)}
                                    disabled={!withdrawAmount || isWithdrawBusy || parseFloat(withdrawAmount) <= 0}
                                    variant="outline"
                                    className="shrink-0"
                                >
                                    {isWithdrawBusy
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : "取出"}
                                </Button>
                            </div>
                            {withdrawError && (
                                <p className="text-xs text-red-500 mt-1">
                                    {withdrawError.message.slice(0, 80)}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            ) : (
                <>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            WETH 合约无需构造参数，点击下方按钮即可直接部署。部署后地址会自动保存到本地。
                        </p>
                        {deployError && (
                            <p className="text-sm text-red-500 mt-3">
                                部署失败：{deployError.message.slice(0, 100)}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={onDeployWeth}
                            disabled={!isConnected || isDeploying || isWaiting}
                        >
                            {!isConnected
                                ? "请先连接钱包"
                                : isDeploying
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
                                    : isWaiting
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
                                        : "部署 WETH"}
                        </Button>
                    </CardFooter>
                </>
            )}

            {/* 已部署时显示重置按钮 */}
            {wethAddress && (
                <CardFooter className="flex justify-between">
                    <span className="text-xs text-green-400 font-medium">已部署</span>
                    <button
                        onClick={onReset}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                        重置地址
                    </button>
                </CardFooter>
            )}
        </Card>
    )
}
