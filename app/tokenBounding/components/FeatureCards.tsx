import { Card, CardContent } from "@/components/ui/card"
import { Shield, Sliders, Zap, AlertTriangle } from "lucide-react"

const features = [
    {
        icon: Shield,
        title: "ERC-20 标准",
        description: "完全兼容 ERC-20 标准，支持所有主流钱包和去中心化交易所",
    },
    {
        icon: Sliders,
        title: "自定义参数",
        description: "自由设置代币名称、符号、精度和初始发行量",
    },
    {
        icon: Zap,
        title: "即时部署",
        description: "一键部署到区块链网络，无需编写任何智能合约代码",
    },
]

export function FeatureCards() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <Card key={feature.title} className="text-center bg-gray-900/50 border-gray-800">
                            <CardContent className="pt-6 flex flex-col items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="flex items-start gap-3 w-full p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                    <p className="font-medium">注意事项</p>
                    <ul className="text-muted-foreground space-y-0.5">
                        <li>部署合约需要消耗 Gas 费用，请确保钱包中有足够的 ETH</li>
                        <li>请确认已连接到正确的网络（主网 / 测试网）</li>
                        <li>合约部署后，代币参数将无法更改</li>
                    </ul>
                </div>
            </div>
        </>
    )
}
