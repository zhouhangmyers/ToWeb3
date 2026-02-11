"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export function Header() {
    const [open, setOpen] = useState(false);
    const { isConnected, chainId, address } = useAccount();
    const { switchChain, isPending } = useSwitchChain();

    const preferredChain = sepolia;
    const isUnsupported = isConnected && chainId !== undefined && chainId !== preferredChain.id;

    return (
        <header className="border-b bg-black px-4 md:px-10">
            <div className="flex items-center justify-between py-4">
                <Link href="/" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">首页</Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/tokenBounding" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">代币铸造</Link>
                    <Link href="/liquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">自定义路由</Link>
                    <Link href="/addLiquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">添加流动性</Link>
                    <Link href="/swap" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">代币兑换</Link>
                </nav>

                <div className="hidden md:block">
                    <ConnectButton />
                </div>

                <button
                    type="button"
                    className="md:hidden text-white border border-white/20 rounded px-3 py-2"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label="打开菜单"
                >
                    菜单
                </button>
            </div>

            <div className="pb-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-300">
                    {isConnected && address ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                已连接
                            </span>
                            <span className="text-gray-400">
                                地址: {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded border ${chainId === sepolia.id ? "border-green-500/40 text-green-300" : "border-red-500/40 text-red-300"}`}
                            >
                                {chainId === sepolia.id ? "Sepolia" : `Chain ${chainId ?? "-"}`}
                            </span>
                        </div>
                    ) : (
                        <div className="text-gray-400">未连接钱包</div>
                    )}
                </div>
            </div>

            {isUnsupported && (
                <div className="pb-4">
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        当前网络不受支持，请切换到 Sepolia：
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-100 hover:bg-red-500/20 disabled:opacity-60"
                                onClick={() => switchChain({ chainId: preferredChain.id })}
                                disabled={isPending}
                            >
                                {preferredChain.name}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {open && (
                <div className="md:hidden pb-4">
                    <div className="flex flex-col gap-3">
                        <Link href="/tokenBounding" className="text-base font-semibold text-white hover:text-purple-200" onClick={() => setOpen(false)}>代币铸造</Link>
                        <Link href="/liquidity" className="text-base font-semibold text-white hover:text-purple-200" onClick={() => setOpen(false)}>自定义路由</Link>
                        <Link href="/addLiquidity" className="text-base font-semibold text-white hover:text-purple-200" onClick={() => setOpen(false)}>添加流动性</Link>
                        <Link href="/swap" className="text-base font-semibold text-white hover:text-purple-200" onClick={() => setOpen(false)}>代币兑换</Link>
                        <div className="pt-2">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
