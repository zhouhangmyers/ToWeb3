"use client"

export type SwapMode = "exactIn" | "exactOut"

interface SwapInfoProps {
    swapMode: SwapMode
    slippage: string
    amountIn: string
    amountOut: string
    tokenInSymbol?: string
    tokenOutSymbol?: string
}

export function SwapInfo({
    swapMode,
    slippage,
    amountIn,
    amountOut,
    tokenInSymbol,
    tokenOutSymbol,
}: SwapInfoProps) {
    const slippagePercent = parseFloat(slippage) / 100

    return (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">兑换模式</span>
                <span className="font-medium">
                    {swapMode === "exactIn" ? "精确输入" : "精确输出"}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">滑点容差</span>
                <span className="font-medium">{slippage}%</span>
            </div>
            {swapMode === "exactIn" && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">最小获得</span>
                    <span className="font-medium">
                        {(parseFloat(amountOut) * (1 - slippagePercent)).toFixed(6)} {tokenOutSymbol}
                    </span>
                </div>
            )}
            {swapMode === "exactOut" && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">最多花费</span>
                    <span className="font-medium">
                        {(parseFloat(amountIn) * (1 + slippagePercent)).toFixed(6)} {tokenInSymbol}
                    </span>
                </div>
            )}
        </div>
    )
}
