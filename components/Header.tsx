"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
    return (
        <header className="flex justify-between items-center p-4 border-b bg-black px-10">
            <Link href="/" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">首页</Link>
            <Link href="/tokenBounding" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">代币铸造</Link>
            <Link href="/liquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">自定义路由</Link>
            <Link href="/addLiquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200" >添加流动性</Link>
            <Link href="/swap" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">代币兑换</Link>
            <ConnectButton />
        </header>
    );
}
