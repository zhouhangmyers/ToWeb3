"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

    useEffect(() => {
        // 检查用户是否已经同意过
        // const hasAgreed = localStorage.getItem("disclaimer-agreed")
        // 暂时强制显示（测试用）- 部署前记得改回来
        setIsOpen(true)
        // if (!hasAgreed) {
        //     setIsOpen(true)
        // }
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50
        if (scrolledToBottom && !hasScrolledToBottom) {
            setHasScrolledToBottom(true)
        }
    }

    const handleAgree = () => {
        // 记录同意时间和版本
        const agreementData = {
            agreed: true,
            timestamp: new Date().toISOString(),
            version: "1.0",
            userAgent: navigator.userAgent
        }
        localStorage.setItem("disclaimer-agreed", JSON.stringify(agreementData))
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <Card className="w-full max-w-3xl bg-gray-900 border-gray-800 max-h-[85vh] flex flex-col overflow-hidden">
                <CardContent className="p-6 md:p-8 flex flex-col max-h-full">
                    {/* 标题 */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl md:text-2xl font-bold text-white">使用条款与免责声明</h2>
                    </div>

                    {/* 可滚动内容 */}
                    <div
                        className="overflow-y-auto my-4 space-y-4 text-sm text-gray-400 leading-relaxed pr-2 max-h-[50vh]"
                        onScroll={handleScroll}
                    >
                        <p className="text-gray-300 text-base">
                            <span className="text-yellow-400 font-semibold">⚠️ 重要提示：</span>
                            在使用本平台前，请您仔细阅读并充分理解以下条款。点击&quot;我已阅读并同意&quot;即表示您已完全理解并接受本声明的全部内容。
                        </p>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-300 font-semibold mb-2">请特别注意：</p>
                            <p className="text-yellow-400 mb-2">
                                本项目为开源教育项目，仅供学习、研究和技术交流使用，不构成任何投资建议或金融服务。
                            </p>
                            <p className="text-yellow-400 font-semibold">
                                🔒 为避免法律风险，本项目所有功能均在测试网络（如 Sepolia 测试网）上运行，不涉及真实资产交易。
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">一、项目性质</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li><strong className="text-gray-300">非商业用途：</strong>本项目无任何商业盈利行为，完全开源免费。</li>
                                <li><strong className="text-gray-300">教育目的：</strong>本项目仅作为学习 Myswap V2 协议、智能合约交互、Web3 前端开发的技术参考。</li>
                                <li><strong className="text-gray-300">开源透明：</strong>所有源代码公开在 GitHub，接受社区审查。</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">二、风险提示</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li><strong className="text-red-400">区块链风险：</strong>区块链交易具有不可逆性，一旦执行无法撤销。</li>
                                <li><strong className="text-red-400">智能合约风险：</strong>智能合约可能存在未知漏洞或安全隐患，未经专业审计。</li>
                                <li><strong className="text-red-400">资金风险：</strong>请勿使用真实资金操作，任何资金损失由用户自行承担。</li>
                                <li><strong className="text-red-400">网络风险：</strong>建议仅在测试网络（如 Sepolia）上进行实验。</li>
                                <li><strong className="text-red-400">价格波动：</strong>加密货币价格波动剧烈，可能导致重大损失。</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">三、免责条款</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li><strong className="text-gray-300">无担保声明：</strong>本软件按&quot;现状&quot;提供，不提供任何明示或暗示的担保。</li>
                                <li><strong className="text-gray-300">责任限制：</strong>使用本项目产生的任何后果（包括但不限于资金损失、数据丢失、法律责任）由用户自行承担。</li>
                                <li><strong className="text-gray-300">非投资建议：</strong>本平台不提供任何投资建议、财务规划或金融服务。</li>
                                <li><strong className="text-gray-300">技术限制：</strong>作者不对软件的可用性、准确性、完整性或适用性作任何保证。</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">四、法律合规</h3>
                            <p className="text-gray-400">
                                请遵守当地法律法规，不得将本项目用于：
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>非法用途或未经授权的金融活动</li>
                                <li>洗钱、诈骗或其他违法犯罪行为</li>
                                <li>违反当地证券法、反洗钱法等相关法律的活动</li>
                                <li>侵犯他人合法权益的行为</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">五、用户责任</h3>
                            <p className="text-gray-400">使用本平台即表示您：</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>已充分了解区块链和智能合约的技术原理</li>
                                <li>具备相应的技术能力和风险承受能力</li>
                                <li>对自己的操作和决策负完全责任</li>
                                <li>同意自行承担所有风险和后果</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500">
                                <strong className="text-gray-400">版本信息：</strong>本声明版本 1.0，发布日期 2026-02-08<br/>
                                <strong className="text-gray-400">作者：</strong>周航<br/>
                                <strong className="text-gray-400">GitHub开源地址：</strong>
                                <a href="https://github.com/zhouhangmyers/ToWeb3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-1">
                                    https://github.com/zhouhangmyers/ToWeb3
                                </a>
                                <a href="https://github.com/zhouhangmyers/MyswapV2" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-1">
                                    https://github.com/zhouhangmyers/MyswapV2
                                </a>
                                
                            </p>
                        </div>

                        {!hasScrolledToBottom && (
                            <div className="sticky bottom-0 left-0 right-0 bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent pt-8 pb-2 text-center">
                                <p className="text-yellow-400 text-sm animate-bounce">
                                    ↓ 请滚动到底部阅读完整内容 ↓
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 底部按钮 */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                        <Button
                            onClick={handleAgree}
                            disabled={!hasScrolledToBottom}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-base py-6"
                            size="lg"
                        >
                            {hasScrolledToBottom ? "✓ 我已阅读并同意上述条款" : "请先阅读完整内容"}
                        </Button>
                        {!hasScrolledToBottom && (
                            <p className="text-xs text-center text-gray-500">
                                提示：滚动到底部后才能同意
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
