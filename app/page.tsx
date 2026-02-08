// app/page.tsx

"use client"

import Link from "next/link"
import { useAccount } from "wagmi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const features = [
    {
        title: "代币铸造",
        description: "创建并部署您自己的 ERC-20 代币，自定义名称、符号和总供应量。",
        href: "/tokenBounding",
        icon: "🪙",
        gradient: "from-amber-500/20 to-orange-500/20",
        borderColor: "hover:border-amber-500/50",
    },
    {
        title: "自定义路由",
        description: "部署 Uniswap V2 路由合约，配置您的去中心化交易基础设施。",
        href: "/liquidity",
        icon: "🔗",
        gradient: "from-blue-500/20 to-cyan-500/20",
        borderColor: "hover:border-blue-500/50",
    },
    {
        title: "添加流动性",
        description: "为交易对提供流动性，赚取交易手续费收益。",
        href: "/addLiquidity",
        icon: "💧",
        gradient: "from-purple-500/20 to-pink-500/20",
        borderColor: "hover:border-purple-500/50",
    },
    {
        title: "代币兑换",
        description: "通过 Uniswap V2 协议进行代币间的即时兑换，支持滑点保护。",
        href: "/swap",
        icon: "🔄",
        gradient: "from-green-500/20 to-emerald-500/20",
        borderColor: "hover:border-green-500/50",
    },
]

const stats = [
    { label: "支持链", value: "5" },
    { label: "核心功能", value: "4" },
    { label: "协议", value: "Uniswap V2" },
]

export default function HomePage() {
    const { isConnected, address } = useAccount()

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
                        基于 Uniswap V2 协议构建
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                        您的去中心化
                        <br />
                        金融工具箱
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        铸造代币、部署路由、提供流动性、代币兑换 —— 一站式 DeFi 操作平台，
                        让区块链开发与交互变得简单高效。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {isConnected ? (
                            <>
                                <Link href="/swap">
                                    <Button className="px-8 py-6 text-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold cursor-pointer">
                                        开始交易
                                    </Button>
                                </Link>
                                <Link href="/tokenBounding">
                                    <Button variant="outline" className="px-8 py-6 text-lg border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl font-semibold cursor-pointer">
                                        铸造代币
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="text-gray-400 border border-gray-700 rounded-xl px-8 py-4 bg-gray-900/50">
                                请先连接钱包以开始使用 👆
                            </div>
                        )}
                    </div>

                    {isConnected && address && (
                        <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            已连接: {address.slice(0, 6)}...{address.slice(-4)}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-4xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center py-6 rounded-xl border border-gray-800 bg-gray-900/50"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
                    <p className="text-gray-400 text-lg">
                        从代币创建到交易兑换，覆盖 DeFi 全流程
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature) => (
                        <Link key={feature.href} href={feature.href}>
                            <Card
                                className={`group cursor-pointer bg-gray-900/50 border-gray-800 ${feature.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full`}
                            >
                                <CardContent className="p-8">
                                    <div
                                        className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="mt-5 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        进入 →
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-8 md:p-12">
                    <h3 className="text-2xl font-bold mb-6 text-center">技术栈</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "Next.js 15",
                            "React 19",
                            "TypeScript",
                            "Wagmi v2",
                            "Viem",
                            "RainbowKit",
                            "Tailwind CSS",
                            "shadcn/ui",
                            "Uniswap V2",
                            "Solidity",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 text-sm font-medium hover:border-purple-500/50 hover:text-purple-300 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
                <p>Built with Next.js + Wagmi + Uniswap V2</p>
            </footer>
        </div>
    )
}
