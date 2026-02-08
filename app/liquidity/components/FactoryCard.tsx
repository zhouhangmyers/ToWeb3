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
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    Copy,
    Check,
    Loader2,
    Factory as FactoryIcon,
} from "lucide-react"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface FactoryCardProps {
    isConnected: boolean
    wethAddress: string | null
    factoryAddress: string | null
    factoryFeeToSetter?: string
    factoryFeeTo?: string
    factoryPairsLength?: bigint
    feeToSetter: string
    setFeeToSetter: (value: string) => void
    userAddress?: string
    isDeploying: boolean
    isWaiting: boolean
    deployError: Error | null
    onDeployFactory: (feeToSetterAddr: string) => void
    onReset: () => void
}

export function FactoryCard({
    isConnected,
    wethAddress,
    factoryAddress,
    factoryFeeToSetter,
    factoryFeeTo,
    factoryPairsLength,
    feeToSetter,
    setFeeToSetter,
    userAddress,
    isDeploying,
    isWaiting,
    deployError,
    onDeployFactory,
    onReset,
}: FactoryCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleDeploy = () => {
        const setter = feeToSetter.trim() || userAddress || ""
        onDeployFactory(setter)
    }

    return (
        <Card className={`w-full max-w-sm bg-gray-900/50 border-gray-800 ${!wethAddress ? "opacity-50" : ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {factoryAddress
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${wethAddress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</span>
                    }
                    部署 Factory 合约
                </CardTitle>
                <CardDescription>
                    Uniswap V2 Factory 用于创建交易对。需要传入 feeToSetter 地址（有权设置手续费接收地址的管理员）。
                </CardDescription>
            </CardHeader>

            {factoryAddress ? (
                <CardContent>
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">合约地址</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {factoryAddress}
                                </span>
                                <button
                                    onClick={() => handleCopy(factoryAddress)}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                    title="复制地址"
                                >
                                    {copied === factoryAddress
                                        ? <Check className="w-3.5 h-3.5 text-green-500" />
                                        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                    }
                                </button>
                            </div>
                        </div>
                        {factoryFeeToSetter && (
                            <div className="flex justify-between items-start">
                                <span className="text-muted-foreground">feeToSetter</span>
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {factoryFeeToSetter}
                                </span>
                            </div>
                        )}
                        {factoryFeeTo !== undefined && (
                            <div className="flex justify-between items-start">
                                <span className="text-muted-foreground">feeTo</span>
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {factoryFeeTo === ZERO_ADDRESS
                                        ? "未设置"
                                        : factoryFeeTo}
                                </span>
                            </div>
                        )}
                        {factoryPairsLength !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">交易对数量</span>
                                <span className="font-mono">{factoryPairsLength.toString()}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            ) : (
                <>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="feeToSetter" className="flex items-center gap-1.5 text-sm">
                                    <FactoryIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                    feeToSetter 地址
                                </Label>
                                <Input
                                    id="feeToSetter"
                                    placeholder={userAddress || "0x..."}
                                    value={feeToSetter}
                                    onChange={(e) => setFeeToSetter(e.target.value)}
                                    disabled={!wethAddress}
                                />
                                <p className="text-xs text-muted-foreground">
                                    留空则默认使用当前钱包地址作为 feeToSetter。
                                </p>
                            </div>
                            {deployError && (
                                <p className="text-sm text-red-500">
                                    部署失败：{deployError.message.slice(0, 100)}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleDeploy}
                            disabled={!isConnected || !wethAddress || isDeploying || isWaiting}
                        >
                            {!wethAddress
                                ? "请先部署 WETH"
                                : !isConnected
                                    ? "请先连接钱包"
                                    : isDeploying
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
                                        : isWaiting
                                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
                                            : "部署 Factory"}
                        </Button>
                    </CardFooter>
                </>
            )}

            {factoryAddress && (
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
