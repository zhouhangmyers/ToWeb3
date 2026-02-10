import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel, Wallet } from "lucide-react"
import { formatEther, formatGwei } from "viem"

interface GasEstimateProps {
    ethBalance: { value: bigint } | undefined
    gasPrice: bigint | undefined
    gasEstimate: bigint | undefined
    estimatedCost: bigint | undefined
    deployData: `0x${string}` | undefined
}

export function GasEstimate({ ethBalance, gasPrice, gasEstimate, estimatedCost, deployData }: GasEstimateProps) {
    return (
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    费用预估
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5" />
                            ETH 余额
                        </span>
                        <span className="font-mono">
                            {ethBalance
                                ? `${parseFloat(formatEther(ethBalance.value)).toFixed(6)} ETH`
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Price</span>
                        <span className="font-mono">
                            {gasPrice
                                ? `${parseFloat(formatGwei(gasPrice)).toFixed(2)} Gwei`
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">预估 Gas</span>
                        <span className="font-mono">
                            {gasEstimate
                                ? gasEstimate.toLocaleString()
                                : deployData ? "估算中..." : "请填写表单"}
                        </span>
                    </div>
                    <div className="border-t pt-2.5 flex justify-between font-medium">
                        <span>预估总费用</span>
                        <span className="font-mono">
                            {estimatedCost
                                ? `${parseFloat(formatEther(estimatedCost)).toFixed(6)} ETH`
                                : "—"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
