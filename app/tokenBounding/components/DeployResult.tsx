import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Copy, Check } from "lucide-react"
import { formatUnits } from "viem"

interface DeployResultProps {
    contractAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    balance: bigint | undefined
    copied: string | null
    onCopy: (addr: string) => void
}

export function DeployResult({
    contractAddress,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    balance,
    copied,
    onCopy,
}: DeployResultProps) {
    return (
        <Card className="w-full max-w-md border-green-500/30 bg-gray-900/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    部署成功
                </CardTitle>
                <CardDescription>你的代币已成功部署到区块链</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">合约地址</span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs break-all max-w-48 text-right">
                                {contractAddress}
                            </span>
                            <button
                                onClick={() => onCopy(contractAddress)}
                                className="p-1 rounded hover:bg-muted transition-colors"
                                title="复制地址"
                            >
                                {copied === contractAddress
                                    ? <Check className="w-3.5 h-3.5 text-green-500" />
                                    : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                }
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">代币名称</span>
                        <span>{tokenName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">代币符号</span>
                        <span>{tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">小数位数</span>
                        <span>{tokenDecimals}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">持有数量</span>
                        <span className="font-semibold">
                            {balance !== undefined
                                ? `${formatUnits(balance, Number(tokenDecimals))} ${tokenSymbol}`
                                : "加载中..."}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
