"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SlippageSettingsProps {
    slippage: string
    onSlippageChange: (value: string) => void
}

const SLIPPAGE_PRESETS = ["0.1", "0.5", "1.0"]

export function SlippageSettings({ slippage, onSlippageChange }: SlippageSettingsProps) {
    return (
        <div className="p-4 bg-muted rounded-lg space-y-3">
            <Label>滑点容差（%）</Label>
            <div className="flex gap-2">
                {SLIPPAGE_PRESETS.map((value) => (
                    <Button
                        key={value}
                        variant={slippage === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSlippageChange(value)}
                    >
                        {value}%
                    </Button>
                ))}
                <Input
                    type="number"
                    placeholder="自定义"
                    value={slippage}
                    onChange={(e) => onSlippageChange(e.target.value)}
                    className="w-24"
                    min="0"
                    max="50"
                    step="0.1"
                />
            </div>
            <p className="text-xs text-muted-foreground">
                滑点越高，交易越容易成功，但可能获得更少的代币
            </p>
        </div>
    )
}
