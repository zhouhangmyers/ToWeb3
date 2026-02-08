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
} from "lucide-react"

interface RouterCardProps {
    isConnected: boolean
    factoryAddress: string | null
    wethAddress: string | null
    routerAddress: string | null
    routerFactory?: string
    routerWETH?: string
    routerFactoryInput: string
    setRouterFactoryInput: (value: string) => void
    routerWethInput: string
    setRouterWethInput: (value: string) => void
    isDeploying: boolean
    isWaiting: boolean
    deployError: Error | null
    onDeployRouter: (factory: string, weth: string) => void
    onReset: () => void
}

export function RouterCard({
    isConnected,
    factoryAddress,
    wethAddress,
    routerAddress,
    routerFactory,
    routerWETH,
    routerFactoryInput,
    setRouterFactoryInput,
    routerWethInput,
    setRouterWethInput,
    isDeploying,
    isWaiting,
    deployError,
    onDeployRouter,
    onReset,
}: RouterCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleDeploy = () => {
        const factory = routerFactoryInput.trim()
        const weth = routerWethInput.trim()

        if (!factory || !weth) return

        // 验证地址是否与当前部署的一致
        if (factoryAddress && factory.toLowerCase() !== factoryAddress.toLowerCase()) {
            alert(`警告：输入的 Factory 地址与当前部署的不一致！`)
        }
        if (wethAddress && weth.toLowerCase() !== wethAddress.toLowerCase()) {
            alert(`警告：输入的 WETH 地址与当前部署的不一致！`)
        }

        onDeployRouter(factory, weth)
    }

    return (
        <Card className={`w-full max-w-sm bg-gray-900/50 border-gray-800 ${!factoryAddress ? "opacity-50" : ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {routerAddress
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${factoryAddress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>3</span>
                    }
                    部署 Router 合约
                </CardTitle>
                <CardDescription>
                    Router 合约需要 Factory 地址和 WETH 地址，用于执行代币兑换和添加流动性。
                </CardDescription>
            </CardHeader>

            {routerAddress ? (
                <CardContent>
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">合约地址</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {routerAddress}
                                </span>
                                <button
                                    onClick={() => handleCopy(routerAddress)}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                    title="复制地址"
                                >
                                    {copied === routerAddress
                                        ? <Check className="w-3.5 h-3.5 text-green-500" />
                                        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                    }
                                </button>
                            </div>
                        </div>
                        {routerFactory && (
                            <div className="flex justify-between items-start">
                                <span className="text-muted-foreground">Factory</span>
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {routerFactory}
                                </span>
                            </div>
                        )}
                        {routerWETH && (
                            <div className="flex justify-between items-start">
                                <span className="text-muted-foreground">WETH</span>
                                <span className="font-mono text-xs break-all max-w-48 text-right">
                                    {routerWETH}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            ) : (
                <>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="routerFactory" className="text-sm">
                                    Factory 地址
                                </Label>
                                <Input
                                    id="routerFactory"
                                    placeholder="0x..."
                                    value={routerFactoryInput}
                                    onChange={(e) => setRouterFactoryInput(e.target.value)}
                                    disabled={!factoryAddress}
                                    className={
                                        routerFactoryInput &&
                                        factoryAddress &&
                                        routerFactoryInput.toLowerCase() !== factoryAddress.toLowerCase()
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {routerFactoryInput &&
                                    factoryAddress &&
                                    routerFactoryInput.toLowerCase() !== factoryAddress.toLowerCase() && (
                                        <p className="text-xs text-red-500">
                                            ⚠️ 与当前 Factory 地址不一致，可能导致添加流动性失败
                                        </p>
                                    )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="routerWeth" className="text-sm">
                                    WETH 地址
                                </Label>
                                <Input
                                    id="routerWeth"
                                    placeholder="0x..."
                                    value={routerWethInput}
                                    onChange={(e) => setRouterWethInput(e.target.value)}
                                    disabled={!factoryAddress}
                                    className={
                                        routerWethInput &&
                                        wethAddress &&
                                        routerWethInput.toLowerCase() !== wethAddress.toLowerCase()
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {routerWethInput &&
                                    wethAddress &&
                                    routerWethInput.toLowerCase() !== wethAddress.toLowerCase() && (
                                        <p className="text-xs text-red-500">
                                            ⚠️ 与当前 WETH 地址不一致，可能导致添加流动性失败
                                        </p>
                                    )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                地址会自动填充前面部署的合约。<strong className="text-foreground">请勿手动修改</strong>，否则会导致添加流动性失败。
                            </p>
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
                            disabled={!isConnected || !factoryAddress || isDeploying || isWaiting || !routerFactoryInput || !routerWethInput}
                        >
                            {!factoryAddress
                                ? "请先部署 Factory"
                                : !isConnected
                                    ? "请先连接钱包"
                                    : isDeploying
                                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
                                        : isWaiting
                                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
                                            : "部署 Router"}
                        </Button>
                    </CardFooter>
                </>
            )}

            {routerAddress && (
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
