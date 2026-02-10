"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowUpDown, Settings } from "lucide-react"
import { SlippageSettings } from "./SlippageSettings"
import { SwapInfo, type SwapMode } from "./SwapInfo"

interface SwapFormProps {
    // Token 地址
    tokenIn: string
    tokenOut: string
    onTokenInChange: (value: string) => void
    onTokenOutChange: (value: string) => void

    // 数量
    amountIn: string
    amountOut: string
    onAmountInChange: (value: string) => void
    onAmountOutChange: (value: string) => void

    // 模式
    swapMode: SwapMode
    onSwapModeChange: (mode: SwapMode) => void

    // 滑点
    slippage: string
    onSlippageChange: (value: string) => void

    // Token 元信息（从链上读取后传入）
    tokenInSymbol?: string
    tokenOutSymbol?: string
    tokenInBalance?: string
    tokenOutBalance?: string

    // 状态
    isCalculating: boolean
    isAllowanceEnough: boolean
    isApproveBusy: boolean
    isSwapBusy: boolean
    isConnected: boolean
    isSwapSuccess: boolean
    error: string | null

    // 操作
    onApprove: () => void
    onSwap: () => void
    onSwitchTokens: () => void
}

export function SwapForm({
    tokenIn,
    tokenOut,
    onTokenInChange,
    onTokenOutChange,
    amountIn,
    amountOut,
    onAmountInChange,
    onAmountOutChange,
    swapMode,
    onSwapModeChange,
    slippage,
    onSlippageChange,
    tokenInSymbol,
    tokenOutSymbol,
    tokenInBalance,
    tokenOutBalance,
    isCalculating,
    isAllowanceEnough,
    isApproveBusy,
    isSwapBusy,
    isConnected,
    isSwapSuccess,
    error,
    onApprove,
    onSwap,
    onSwitchTokens,
}: SwapFormProps) {
    const [showSlippageSettings, setShowSlippageSettings] = useState(false)

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>兑换代币</CardTitle>
                        <CardDescription>
                            输入代币地址和数量进行兑换
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 滑点设置 */}
                {showSlippageSettings && (
                    <SlippageSettings
                        slippage={slippage}
                        onSlippageChange={onSlippageChange}
                    />
                )}

                {/* Token In - 卖出 */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                        <Label>卖出</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSwapModeChange("exactIn")}
                            className={swapMode === "exactIn" ? "bg-background" : ""}
                        >
                            精确输入
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Token 地址"
                            value={tokenIn}
                            onChange={(e) => onTokenInChange(e.target.value)}
                        />
                        {tokenInSymbol && (
                            <p className="text-sm text-muted-foreground">
                                {tokenInSymbol} | 余额: {tokenInBalance ?? "—"}
                            </p>
                        )}
                    </div>
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={amountIn}
                        onChange={(e) => {
                            onAmountInChange(e.target.value)
                            if (swapMode === "exactOut") {
                                onSwapModeChange("exactIn")
                            }
                        }}
                        disabled={swapMode === "exactOut" && isCalculating}
                        min="0"
                        step="0.000001"
                        className="text-2xl h-14"
                    />
                </div>

                {/* 切换按钮 */}
                <div className="flex justify-center -my-2 relative z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onSwitchTokens}
                        className="rounded-full"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>

                {/* Token Out - 买入 */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                        <Label>买入</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSwapModeChange("exactOut")}
                            className={swapMode === "exactOut" ? "bg-background" : ""}
                        >
                            精确输出
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Token 地址"
                            value={tokenOut}
                            onChange={(e) => onTokenOutChange(e.target.value)}
                        />
                        {tokenOutSymbol && (
                            <p className="text-sm text-muted-foreground">
                                {tokenOutSymbol} | 余额: {tokenOutBalance ?? "—"}
                            </p>
                        )}
                    </div>
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={amountOut}
                        onChange={(e) => {
                            onAmountOutChange(e.target.value)
                            if (swapMode === "exactIn") {
                                onSwapModeChange("exactOut")
                            }
                        }}
                        disabled={swapMode === "exactIn" && isCalculating}
                        min="0"
                        step="0.000001"
                        className="text-2xl h-14"
                    />
                </div>

                {/* 计算中提示 */}
                {isCalculating && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        计算中...
                    </div>
                )}

                {/* 兑换信息 */}
                {amountIn && amountOut && !isCalculating && (
                    <SwapInfo
                        swapMode={swapMode}
                        slippage={slippage}
                        amountIn={amountIn}
                        amountOut={amountOut}
                        tokenInSymbol={tokenInSymbol}
                        tokenOutSymbol={tokenOutSymbol}
                    />
                )}

                {/* 授权按钮 */}
                {!isAllowanceEnough && (
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={onApprove}
                        disabled={!tokenIn || !amountIn || isApproveBusy}
                    >
                        {isApproveBusy ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                授权中...
                            </>
                        ) : (
                            `授权 ${tokenInSymbol || "Token"}`
                        )}
                    </Button>
                )}

                {/* 兑换按钮 */}
                <Button
                    className="w-full"
                    onClick={onSwap}
                    disabled={
                        !isConnected ||
                        !tokenIn ||
                        !tokenOut ||
                        !amountIn ||
                        !amountOut ||
                        !isAllowanceEnough ||
                        isSwapBusy ||
                        isCalculating
                    }
                >
                    {!isConnected ? (
                        "请先连接钱包"
                    ) : isSwapBusy ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            兑换中...
                        </>
                    ) : (
                        "兑换"
                    )}
                </Button>

                {/* 错误提示 */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* 成功提示 */}
                {isSwapSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-400">
                        兑换成功！
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
