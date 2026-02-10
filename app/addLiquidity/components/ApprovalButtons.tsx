import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ApprovalButtonsProps {
    tokenAAddr?: `0x${string}`
    tokenBAddr?: `0x${string}`
    amountA: string
    amountB: string
    isAllowanceAEnough: boolean
    isAllowanceBEnough: boolean
    isApproveABusy: boolean
    isApproveBBusy: boolean
    isTokenANative?: boolean
    isTokenBNative?: boolean
    handleApproveA: () => void
    handleApproveB: () => void
}

export function ApprovalButtons({
    tokenAAddr,
    tokenBAddr,
    amountA,
    amountB,
    isAllowanceAEnough,
    isAllowanceBEnough,
    isApproveABusy,
    isApproveBBusy,
    isTokenANative,
    isTokenBNative,
    handleApproveA,
    handleApproveB,
}: ApprovalButtonsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Button
                variant="outline"
                onClick={handleApproveA}
                disabled={!tokenAAddr || !amountA || isAllowanceAEnough || isApproveABusy}
            >
                {isTokenANative ? "⚡ 原生代币 (无需授权)" : isAllowanceAEnough ? "✓ Token A 已授权" : isApproveABusy ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        授权中...
                    </>
                ) : "授权 Token A"}
            </Button>
            <Button
                variant="outline"
                onClick={handleApproveB}
                disabled={!tokenBAddr || !amountB || isAllowanceBEnough || isApproveBBusy}
            >
                {isTokenBNative ? "⚡ 原生代币 (无需授权)" : isAllowanceBEnough ? "✓ Token B 已授权" : isApproveBBusy ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        授权中...
                    </>
                ) : "授权 Token B"}
            </Button>
        </div>
    )
}
