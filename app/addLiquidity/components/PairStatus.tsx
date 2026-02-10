import { Info, Loader2 } from "lucide-react"

interface PairStatusProps {
    checkingPair: boolean
    pairExists: boolean | null
    pairAddress: string | null
}

export function PairStatus({ checkingPair, pairExists, pairAddress }: PairStatusProps) {
    // 根据不同状态显示不同颜色
    const bgColor = pairExists === false ? "bg-yellow-500/10" : "bg-blue-500/10"
    const borderColor = pairExists === false ? "border-yellow-500/30" : "border-blue-500/30"
    const iconColor = pairExists === false ? "text-yellow-400" : "text-blue-400"

    return (
        <div className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}>
            <div className="flex items-start gap-2">
                <Info className={`w-5 h-5 ${iconColor} mt-0.5`} />
                <div className="flex-1">
                    {checkingPair ? (
                        <p className="text-sm text-blue-300">
                            <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                            检查交易对...
                        </p>
                    ) : pairExists === false ? (
                        <div>
                            <p className="font-medium text-yellow-300">⚠️ 交易对不存在</p>
                            <p className="text-sm text-yellow-400 mt-1">
                                本次将会创建交易对并添加流动性，请注意！
                            </p>
                        </div>
                    ) : pairExists === true ? (
                        <div>
                            <p className="font-medium text-green-300">✓ 交易对已存在</p>
                            <p className="text-xs text-green-400 font-mono mt-1">{pairAddress}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
