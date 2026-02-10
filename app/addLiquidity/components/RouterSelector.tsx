import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Network } from "lucide-react"
import { isAddress } from "viem"
import { useDexPresets } from "../hooks/useDexPresets"

interface RouterSelectorProps {
    mode: "custom" | "external"
    setMode: (mode: "custom" | "external") => void
    customRouterAddress: string | null
    externalRouterInput: string
    setExternalRouterInput: (value: string) => void
    factoryAddress?: string
}

export function RouterSelector({
    mode,
    setMode,
    customRouterAddress,
    externalRouterInput,
    setExternalRouterInput,
    factoryAddress,
}: RouterSelectorProps) {
    const { chainId, chainName, presets, hasPresets } = useDexPresets()

    const selectedPreset = presets.find(
        (preset) => preset.router.toLowerCase() === externalRouterInput.toLowerCase()
    )

    const handlePresetSelect = (routerAddress: string) => {
        setExternalRouterInput(routerAddress)
    }

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    选择 Router
                    {chainId && (
                        <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Network className="w-3 h-3" />
                            {chainName}
                        </span>
                    )}
                </CardTitle>
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
                                        {factoryAddress && (
                                            <p className="text-xs text-green-400 mt-2">
                                                Factory: {factoryAddress}
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
                        {/* DEX 预设选择 */}
                        {hasPresets && (
                            <div className="grid gap-2">
                                <Label htmlFor="dexPreset">快速选择 DEX</Label>
                                <select
                                    id="dexPreset"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(e) => handlePresetSelect(e.target.value)}
                                    value={selectedPreset ? selectedPreset.router : ""}
                                >
                                    <option value="" disabled>
                                        选择一个 DEX 预设...
                                    </option>
                                    {presets.map((preset) => (
                                        <option key={preset.router} value={preset.router}>
                                            {preset.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    💡 选择后会自动填入对应的 Router 地址
                                </p>
                            </div>
                        )}

                        {/* 手动输入 Router 地址 */}
                        <div className="grid gap-2">
                            <Label htmlFor="routerAddress">
                                Router 合约地址
                                {!hasPresets && chainId && (
                                    <span className="ml-2 text-xs text-yellow-400">
                                        (当前网络暂无预设)
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="routerAddress"
                                placeholder="0x..."
                                value={externalRouterInput}
                                onChange={(e) => setExternalRouterInput(e.target.value)}
                            />
                            {factoryAddress && isAddress(externalRouterInput) && (
                                <p className="text-sm text-green-400">
                                    ✓ Factory: {factoryAddress}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
