import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, Type, Hash, Settings } from "lucide-react"

interface TokenFormProps {
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    initialSupply: string
    onTokenNameChange: (value: string) => void
    onTokenSymbolChange: (value: string) => void
    onTokenDecimalsChange: (value: string) => void
    onInitialSupplyChange: (value: string) => void
    onDeploy: () => void
    isConnected: boolean
    isDeploying: boolean
    isWaiting: boolean
    deployError: Error | null
}

export function TokenForm({
    tokenName,
    tokenSymbol,
    tokenDecimals,
    initialSupply,
    onTokenNameChange,
    onTokenSymbolChange,
    onTokenDecimalsChange,
    onInitialSupplyChange,
    onDeploy,
    isConnected,
    isDeploying,
    isWaiting,
    deployError,
}: TokenFormProps) {
    return (
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle>代币创建</CardTitle>
                <CardDescription>填写以下信息来创建你的 ERC-20 代币</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tokenName" className="flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5 text-muted-foreground" />
                            代币名称
                        </Label>
                        <Input
                            id="tokenName"
                            placeholder="例如：MyToken"
                            value={tokenName}
                            onChange={(e) => onTokenNameChange(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tokenSymbol" className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                            代币符号
                        </Label>
                        <Input
                            id="tokenSymbol"
                            placeholder="例如：MTK"
                            value={tokenSymbol}
                            onChange={(e) => onTokenSymbolChange(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tokenDecimals" className="flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                            小数位数
                        </Label>
                        <Input
                            id="tokenDecimals"
                            type="number"
                            min="0"
                            max="18"
                            value={tokenDecimals}
                            onChange={(e) => onTokenDecimalsChange(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="initialSupply" className="flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                            初始数量
                        </Label>
                        <Input
                            id="initialSupply"
                            type="number"
                            placeholder="例如：1000000"
                            value={initialSupply}
                            onChange={(e) => onInitialSupplyChange(e.target.value)}
                        />
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
                    onClick={onDeploy}
                    disabled={!isConnected || isDeploying || isWaiting || !tokenName || !tokenSymbol || !initialSupply}
                >
                    {!isConnected
                        ? "请先连接钱包"
                        : isDeploying
                          ? "确认交易中..."
                          : isWaiting
                            ? "部署中..."
                            : "一键创建"}
                </Button>
            </CardFooter>
        </Card>
    )
}
