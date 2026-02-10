import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Trash2, Copy, Check, Coins } from "lucide-react"
import type { TokenRecord } from "../hooks/useLocalStorage"

interface TokenHistoryProps {
    history: TokenRecord[]
    onDeleteRecord: (contractAddr: string) => void
    onClearHistory: () => void
}

export function TokenHistory({ history, onDeleteRecord, onClearHistory }: TokenHistoryProps) {
    const [copied, setCopied] = useState<string | null>(null)

    function handleCopy(addr: string) {
        navigator.clipboard.writeText(addr)
        setCopied(addr)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <Card className="sticky top-6 bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-4 h-4" />
                        铸造历史
                    </CardTitle>
                    {history.length > 0 && (
                        <button
                            onClick={onClearHistory}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                            清空
                        </button>
                    )}
                </div>
                <CardDescription>
                    {history.length > 0
                        ? `共 ${history.length} 条记录`
                        : "暂无铸造记录"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                        <Coins className="w-8 h-8 opacity-30" />
                        <p className="text-sm">暂无铸造记录</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {history.map((record) => (
                            <div
                                key={record.contractAddress}
                                className="group relative rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
                            >
                                <button
                                    onClick={() => onDeleteRecord(record.contractAddress)}
                                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                                    title="删除记录"
                                >
                                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                </button>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-semibold">{record.name}</span>
                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {record.symbol}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="font-mono text-xs text-muted-foreground truncate">
                                        {record.contractAddress}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(record.contractAddress)}
                                        className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
                                        title="复制地址"
                                    >
                                        {copied === record.contractAddress
                                            ? <Check className="w-3 h-3 text-green-500" />
                                            : <Copy className="w-3 h-3 text-muted-foreground" />
                                        }
                                    </button>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>发行量: {Number(record.supply).toLocaleString()}</span>
                                    <span>{record.createdAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
