import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatUnits } from "viem"
import { useTokenPresets } from "@/app/addLiquidity/hooks/useTokenPresets"

const NATIVE_TOKEN_PLACEHOLDER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

interface SwapTokenInputProps {
    label: string
    addressId: string
    amountId: string
    tokenAddress: string
    amount: string
    onAddressChange: (value: string) => void
    onAmountChange: (value: string) => void
    symbol?: string
    decimals?: number
    balance?: bigint
    excludeAddresses?: string[] // 要排除的代币地址（比如另一个Token已选择的地址）
    swapMode?: "exactIn" | "exactOut"
    isCalculating?: boolean
    onModeClick?: () => void
    isInputToken?: boolean // 是否为输入token (用于显示"精确输入"/"精确输出"按钮)
}

export function SwapTokenInput({
    label,
    addressId,
    amountId,
    tokenAddress,
    amount,
    onAddressChange,
    onAmountChange,
    symbol,
    decimals = 18,
    balance,
    excludeAddresses = [],
    swapMode,
    isCalculating = false,
    onModeClick,
    isInputToken = true,
}: SwapTokenInputProps) {
    const { presets, hasPresets } = useTokenPresets()

    const handlePresetSelect = (value: string) => {
        if (value === "custom") {
            onAddressChange("")
        } else {
            onAddressChange(value)
        }
    }

    // 获取当前选中的预设（如果有）
    const selectedPreset = presets.find(p => p.address.toLowerCase() === tokenAddress.toLowerCase())

    // 过滤掉被排除的代币（比如另一个token已选择的ETH）
    // 特别处理：如果排除了 ETH 也要排除 WETH（因为它们在交易中等价）
    const filteredPresets = presets.filter(p => {
        // 检查是否在排除列表中（直接地址匹配）
        const isDirectExcluded = excludeAddresses.some(excludeAddr =>
            excludeAddr && p.address.toLowerCase() === excludeAddr.toLowerCase()
        )

        if (isDirectExcluded) return false

        // 如果排除列表中有原生代币(0xEee...)，也要排除对应链的WETH
        const hasNativePlaceholder = excludeAddresses.some(addr =>
            addr && addr.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER.toLowerCase()
        )
        if (hasNativePlaceholder && p.symbol === "WETH") return false

        // 反之，如果排除列表中有WETH，也要排除原生代币
        const excludedWETH = excludeAddresses.some(addr => {
            const excludedPreset = presets.find(preset =>
                preset.address.toLowerCase() === addr?.toLowerCase()
            )
            return excludedPreset?.symbol === "WETH"
        })
        if (excludedWETH && p.isNative) return false

        return true
    })

    // 检查当前token是否为原生代币（通过isNative标志）
    const isNativeToken = selectedPreset?.isNative || false

    // 确定是否应该禁用数量输入
    const shouldDisableAmount = isInputToken
        ? (swapMode === "exactOut" && isCalculating)
        : (swapMode === "exactIn" && isCalculating)

    return (
        <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
                <Label>{label}</Label>
                {onModeClick && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onModeClick}
                        className={
                            (isInputToken && swapMode === "exactIn") || (!isInputToken && swapMode === "exactOut")
                                ? "bg-background"
                                : ""
                        }
                    >
                        {isInputToken ? "精确输入" : "精确输出"}
                    </Button>
                )}
            </div>

            {/* Token 地址选择 */}
            <div className="grid gap-2">
                <div className="flex gap-2">
                    {/* 快速选择下拉框 */}
                    {hasPresets && (
                        <select
                            className="flex h-10 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-32"
                            onChange={(e) => handlePresetSelect(e.target.value)}
                            value={selectedPreset ? selectedPreset.address : "custom"}
                        >
                            <option value="custom">✏️ 自定义</option>
                            {filteredPresets.map((preset) => (
                                <option key={preset.address} value={preset.address}>
                                    {preset.icon || (preset.isNative ? "⚡" : "💎")} {preset.symbol}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* 地址输入框 - 如果选择了原生代币则隐藏 */}
                    {!isNativeToken && (
                        <Input
                            id={addressId}
                            placeholder={selectedPreset ? selectedPreset.symbol : "输入代币地址 0x..."}
                            value={tokenAddress}
                            onChange={(e) => onAddressChange(e.target.value)}
                            className="flex-1"
                        />
                    )}
                </div>

                {/* Token 信息显示 */}
                {(symbol || selectedPreset) && (
                    <div className="flex items-center gap-2 text-sm">
                        {selectedPreset && (
                            <span className="text-lg">{selectedPreset.icon || "💎"}</span>
                        )}
                        <span className="font-semibold text-foreground">
                            {symbol || selectedPreset?.symbol}
                            {selectedPreset?.name && symbol && (
                                <span className="ml-1 text-xs text-muted-foreground">({selectedPreset.name})</span>
                            )}
                        </span>
                        {symbol && (
                            <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                    余额: <span className="font-medium text-foreground">
                                        {balance ? formatUnits(balance, decimals) : "—"}
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 数量输入 */}
            <Input
                id={amountId}
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => {
                    onAmountChange(e.target.value)
                }}
                disabled={shouldDisableAmount}
                min="0"
                step="0.000001"
                className="text-2xl h-14"
            />
        </div>
    )
}
