# 从零开始构建 DeFi 应用：基于 Uniswap V2 的完整开发教程

> 本教程将手把手带你从零开始构建一个完整的去中心化金融（DeFi）应用。你将学习如何使用 Next.js 15 + Wagmi + RainbowKit + Uniswap V2 协议，实现代币铸造、合约部署、流动性管理和代币兑换等功能。

---

## 目录

- [前置知识要求](#前置知识要求)
- [第一章：项目初始化与环境搭建](#第一章项目初始化与环境搭建)
  - [1.1 安装 Node.js 和 pnpm](#11-安装-nodejs-和-pnpm)
  - [1.2 创建 Next.js 项目](#12-创建-nextjs-项目)
  - [1.3 安装 Web3 依赖](#13-安装-web3-依赖)
  - [1.4 安装 UI 组件库](#14-安装-ui-组件库)
  - [1.5 项目目录结构](#15-项目目录结构)
- [第二章：配置 Web3 基础设施](#第二章配置-web3-基础设施)
  - [2.1 配置 Wagmi](#21-配置-wagmi)
  - [2.2 创建 Web3Provider](#22-创建-web3provider)
  - [2.3 创建 ClientProviders](#23-创建-clientproviders)
  - [2.4 配置根布局 Layout](#24-配置根布局-layout)
- [第三章：创建导航和通用组件](#第三章创建导航和通用组件)
  - [3.1 创建 Header 导航组件](#31-创建-header-导航组件)
  - [3.2 创建首页](#32-创建首页)
  - [3.3 安装 shadcn/ui 组件](#33-安装-shadcnui-组件)
- [第四章：准备智能合约 ABI 和 Bytecode](#第四章准备智能合约-abi-和-bytecode)
  - [4.1 什么是 ABI 和 Bytecode](#41-什么是-abi-和-bytecode)
  - [4.2 ERC-20 代币合约](#42-erc-20-代币合约)
  - [4.3 WETH 合约](#43-weth-合约)
  - [4.4 Uniswap V2 Factory 合约](#44-uniswap-v2-factory-合约)
  - [4.5 Uniswap V2 Router 合约](#45-uniswap-v2-router-合约)
- [第五章：实现代币铸造功能](#第五章实现代币铸造功能)
  - [5.1 功能概述](#51-功能概述)
  - [5.2 创建代币铸造页面](#52-创建代币铸造页面)
  - [5.3 核心代码解析](#53-核心代码解析)
- [第六章：实现自定义路由部署（流动性管理）](#第六章实现自定义路由部署流动性管理)
  - [6.1 功能概述](#61-功能概述)
  - [6.2 创建 localStorage 管理 Hook](#62-创建-localstorage-管理-hook)
  - [6.3 创建 WETH 合约 Hook](#63-创建-weth-合约-hook)
  - [6.4 创建 Factory 合约 Hook](#64-创建-factory-合约-hook)
  - [6.5 创建 Router 合约 Hook](#65-创建-router-合约-hook)
  - [6.6 创建 AddLiquidity Hook](#66-创建-addliquidity-hook)
  - [6.7 创建各组件卡片](#67-创建各组件卡片)
  - [6.8 组装流动性管理页面](#68-组装流动性管理页面)
- [第七章：实现添加流动性功能](#第七章实现添加流动性功能)
  - [7.1 功能概述](#71-功能概述)
  - [7.2 创建添加流动性页面](#72-创建添加流动性页面)
  - [7.3 核心代码解析](#73-核心代码解析)
- [第八章：实现代币兑换功能](#第八章实现代币兑换功能)
  - [8.1 功能概述](#81-功能概述)
  - [8.2 创建代币兑换页面](#82-创建代币兑换页面)
  - [8.3 核心代码解析](#83-核心代码解析)
- [第九章：添加免责声明弹窗](#第九章添加免责声明弹窗)
- [第十章：运行与测试](#第十章运行与测试)
  - [10.1 启动开发服务器](#101-启动开发服务器)
  - [10.2 配置 MetaMask 连接测试网](#102-配置-metamask-连接测试网)
  - [10.3 完整测试流程](#103-完整测试流程)
- [附录](#附录)
  - [A. 常见错误与解决方案](#a-常见错误与解决方案)
  - [B. 关键概念词汇表](#b-关键概念词汇表)
  - [C. 技术栈版本参考](#c-技术栈版本参考)

---

## 前置知识要求

在开始本教程之前，建议你具备以下基础知识（不要求精通）：

| 技术 | 要求程度 | 说明 |
|------|---------|------|
| HTML/CSS | 基础 | 知道基本标签和样式 |
| JavaScript | 基础 | 了解变量、函数、异步操作 |
| React | 入门 | 了解组件、useState、useEffect |
| TypeScript | 了解即可 | 知道类型注解的基本语法 |
| 区块链基础 | 了解即可 | 知道什么是区块链、钱包、交易 |

如果你完全是零基础，建议先花 1-2 天学习 React 官方教程：https://react.dev/learn

---

## 第一章：项目初始化与环境搭建

### 1.1 安装 Node.js 和 pnpm

首先确保你的电脑安装了 Node.js（建议 v18 以上）和包管理器。

```bash
# 检查 Node.js 版本
node -v   # 应该显示 v18.x.x 或更高

# 检查 npm 版本
npm -v

# 安装 pnpm（可选，也可以用 npm）
npm install -g pnpm
```

### 1.2 创建 Next.js 项目

```bash
# 使用 create-next-app 创建项目
npx create-next-app@latest web3-front

# 创建时的选项（按照以下选择）：
# ✔ Would you like to use TypeScript? → Yes
# ✔ Would you like to use ESLint? → Yes
# ✔ Would you like to use Tailwind CSS? → Yes
# ✔ Would you like your code inside a `src/` directory? → No
# ✔ Would you like to use App Router? → Yes
# ✔ Would you like to use Turbopack? → Yes
# ✔ Would you like to customize the import alias? → Yes → @/*

# 进入项目目录
cd web3-front
```

> **什么是 Next.js？**
> Next.js 是基于 React 的全栈框架，提供了路由、服务端渲染等功能。我们使用的 App Router 是 Next.js 13+ 引入的新路由系统，文件夹名即路由路径。

### 1.3 安装 Web3 依赖

这是本项目的核心依赖，让我们逐一安装并解释它们的作用：

```bash
# Wagmi - React Hooks 形式的以太坊交互库
# Viem - 底层以太坊操作库（替代 ethers.js）
# RainbowKit - 精美的钱包连接 UI 组件
# TanStack React Query - 状态管理，Wagmi 的依赖项
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

**每个库的作用：**

| 库名 | 作用 | 类比 |
|------|------|------|
| `wagmi` | 提供 React Hooks 与以太坊交互 | 就像 React Query 之于 API 请求 |
| `viem` | 底层以太坊操作（编码、解码、格式化） | 就像 axios 之于 HTTP 请求 |
| `@rainbow-me/rainbowkit` | 钱包连接弹窗 UI | 就像一个登录组件 |
| `@tanstack/react-query` | 异步状态管理 | Wagmi 内部依赖它管理链上数据缓存 |

### 1.4 安装 UI 组件库

```bash
# 安装 shadcn/ui CLI 工具
npx shadcn@latest init

# 选择以下配置：
# ✔ Which style? → New York
# ✔ Which color? → Neutral
# ✔ Would you like to use CSS variables? → Yes

# 安装我们需要的 UI 组件
npx shadcn@latest add button card input label

# 安装图标库
npm install lucide-react
```

> **什么是 shadcn/ui？**
> shadcn/ui 不是传统的 npm 包，而是一套可复制粘贴的组件集合。执行 `npx shadcn add button` 时，它会直接把 Button 组件的源代码复制到你的项目中（`components/ui/button.tsx`），你可以自由修改。

### 1.5 项目目录结构

完成安装后，我们需要创建以下目录结构：

```
web3-front/
├── app/                          # Next.js 页面路由（文件夹名 = URL 路径）
│   ├── layout.tsx               # 根布局（所有页面共享）
│   ├── page.tsx                 # 首页 (/)
│   ├── globals.css              # 全局样式
│   ├── tokenBounding/           # 代币铸造页面
│   │   ├── page.tsx             # (/tokenBounding)
│   │   ├── hooks/               # 该页面专用 Hooks
│   │   │   ├── useTokenDeploy.ts   # 合约部署 & Gas 预估逻辑
│   │   │   └── useTokenHistory.ts  # 铸造历史记录管理
│   │   └── components/          # 该页面专用组件
│   │       ├── StepIndicator.tsx   # 流程步骤条
│   │       ├── TokenForm.tsx       # 代币信息表单
│   │       ├── GasEstimate.tsx     # Gas 费用预估卡片
│   │       ├── DeployResult.tsx    # 部署成功结果卡片
│   │       ├── MintHistory.tsx     # 铸造历史侧栏
│   │       └── FeatureCards.tsx    # 特性说明 & 注意事项
│   ├── swap/                    # 代币兑换页面
│   │   └── page.tsx             # (/swap)
│   ├── addLiquidity/            # 添加流动性页面
│   │   └── page.tsx             # (/addLiquidity)
│   └── liquidity/               # 自定义路由部署页面
│       ├── page.tsx             # (/liquidity)
│       ├── components/          # 该页面专用组件
│       │   ├── WethCard.tsx
│       │   ├── FactoryCard.tsx
│       │   ├── RouterCard.tsx
│       │   ├── AddLiquidityCard.tsx
│       │   └── HistoryPanel.tsx
│       └── hooks/               # 该页面专用 Hooks
│           ├── useLocalStorage.ts
│           ├── useWethContract.ts
│           ├── useFactoryContract.ts
│           ├── useRouterContract.ts
│           └── useAddLiquidity.ts
├── components/                  # 全局共享组件
│   ├── ClientProviders.tsx     # 客户端 Provider 包装器
│   ├── Web3Provider.tsx        # Wagmi + RainbowKit Provider
│   ├── Header.tsx              # 导航栏
│   ├── DisclaimerModal.tsx     # 免责声明弹窗
│   └── ui/                     # shadcn/ui 组件（自动生成）
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/                        # 工具函数和合约配置
│   ├── wagmi.ts               # Wagmi 链配置
│   ├── utils.ts               # 工具函数
│   ├── erc20-contract.ts      # ERC-20 合约 ABI + Bytecode
│   ├── WETH-contract.ts       # WETH 合约 ABI + Bytecode
│   ├── uniswapV2Factory.ts    # Factory 合约 ABI + Bytecode
│   └── uniswapV2Router.ts     # Router 合约 ABI + Bytecode
├── package.json
├── tsconfig.json
└── next.config.ts
```

创建所需的目录：

```bash
# 创建页面目录
mkdir -p app/tokenBounding/hooks app/tokenBounding/components app/swap app/addLiquidity app/liquidity/components app/liquidity/hooks

# 创建 lib 目录（如果不存在）
mkdir -p lib
```

---

## 第二章：配置 Web3 基础设施

这一章是整个项目的**基础架构**，我们需要配置好 Web3 的"水电煤"——让应用能够连接钱包、与区块链通信。

### 2.1 配置 Wagmi

Wagmi 的配置文件定义了你的应用支持哪些区块链网络、使用什么 RPC 节点通信。

创建文件 `lib/wagmi.ts`：

```typescript
// lib/wagmi.ts

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { mainnet, bsc, arbitrum, sepolia, hardhat } from "wagmi/chains"

export const config = getDefaultConfig({
    // 应用名称，会显示在钱包连接弹窗中
    appName: "我的DeFi 应用",

    // WalletConnect 项目 ID
    // 去 https://cloud.walletconnect.com/ 免费注册获取
    projectId: "你的WalletConnect项目ID",

    // 支持的区块链网络
    chains: [mainnet, bsc, arbitrum, sepolia, hardhat],

    // 禁用 SSR 以避免 indexedDB 错误
    // Next.js 默认在服务端预渲染，但 Web3 操作只能在浏览器运行
    ssr: false,

    // 每条链的 RPC 传输配置
    // RPC（Remote Procedure Call）是与区块链节点通信的接口
    transports: {
        [mainnet.id]: http(),          // 以太坊主网（使用默认 RPC）
        [bsc.id]: http(),              // 币安智能链
        [arbitrum.id]: http(),         // Arbitrum L2
        [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),  // Sepolia 测试网
        [hardhat.id]: http("http://127.0.0.1:8545"),  // 本地开发链
    },
})
```

**关键概念解释：**

- **Chain（链）**：每条区块链都有一个唯一的 Chain ID。例如以太坊主网是 1，Sepolia 测试网是 11155111
- **RPC URL**：区块链节点的 API 地址。你的应用通过 RPC 发送交易、查询数据
- **WalletConnect Project ID**：用于支持 WalletConnect 协议（移动端扫码连接钱包）。去 [WalletConnect Cloud](https://cloud.walletconnect.com/) 免费注册
- **SSR**：服务端渲染。Web3 操作需要浏览器环境（MetaMask 等钱包只存在于浏览器中），所以我们禁用 SSR

### 2.2 创建 Web3Provider

Provider 是 React 的一个重要概念——它像一个"水管"，把数据从顶层组件"流"到所有子组件中。

创建文件 `components/Web3Provider.tsx`：

```typescript
// components/Web3Provider.tsx

"use client";  // 告诉 Next.js 这是客户端组件（需要浏览器 API）

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { config } from "@/lib/wagmi";
import { useState } from "react";

// 引入 RainbowKit 的样式（钱包连接弹窗的 CSS）
import "@rainbow-me/rainbowkit/styles.css";

export function Web3Provider({ children }: { children: React.ReactNode }) {
    // 创建 QueryClient 实例
    // useState 确保每个用户会话只创建一次
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,  // 切换浏览器标签页时不自动重新请求
                retry: false,                 // 请求失败不自动重试
            },
        },
    }));

    // 三层 Provider 嵌套：
    // WagmiProvider → 提供区块链连接能力
    // QueryClientProvider → 提供数据缓存能力
    // RainbowKitProvider → 提供钱包连接 UI
    return (
        <WagmiProvider config={config as Config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()} locale="en">
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
```

**为什么要用三层 Provider？**

```
WagmiProvider        → 管理"与哪条链连接"、"用哪个钱包"
  └── QueryClientProvider → 管理"链上数据缓存"、"自动刷新"
        └── RainbowKitProvider → 管理"钱包连接弹窗的主题和语言"
              └── 你的应用组件
```

### 2.3 创建 ClientProviders

由于 Next.js 的 App Router 默认使用服务端渲染（SSR），而 Web3 操作需要浏览器环境，我们需要用 `dynamic import` 确保 Web3Provider 只在客户端加载。

创建文件 `components/ClientProviders.tsx`：

```typescript
// components/ClientProviders.tsx

"use client";

import dynamic from "next/dynamic";
import { DisclaimerModal } from "@/components/DisclaimerModal";

// dynamic import + ssr: false = 只在浏览器端加载
// 这样避免服务端渲染时访问 window、localStorage 等浏览器 API 导致报错
const Web3Provider = dynamic(
  () => import("@/components/Web3Provider").then((mod) => mod.Web3Provider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      {children}
      <DisclaimerModal />
    </Web3Provider>
  );
}
```

> **为什么用 `dynamic` 而不是直接 `import`？**
>
> 直接 import 会导致 Next.js 在服务端执行 `Web3Provider` 的代码。但 Web3Provider 内部用到了 `window`、`indexedDB` 等只存在于浏览器的 API，在服务端执行会报错。`dynamic(..., { ssr: false })` 告诉 Next.js："这个组件只在浏览器端加载和渲染"。

### 2.4 配置根布局 Layout

根布局是所有页面的"外壳"，包含 `<html>` 和 `<body>` 标签。我们在这里引入 Provider、导航栏和底部信息。

编辑文件 `app/layout.tsx`：

```typescript
// app/layout.tsx

import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import "./globals.css";

// 页面元数据（标题、描述等），会显示在浏览器标签页
export const metadata: Metadata = {
  title: "我的 DeFi 应用",
  description: "使用 Next.js + Wagmi 构建",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-black">
        <ClientProviders>
          {/* 顶部导航栏 */}
          <Header />

          {/* 页面内容（由各路由页面填充） */}
          <main>{children}</main>

          {/* 底部免责声明 */}
          <section className="max-w-4xl mx-auto px-6 pb-16 pt-8">
            <Card className="bg-gray-900/30 border-gray-800/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <h3 className="text-lg font-bold text-white">免责声明 & 项目说明</h3>
                  </div>
                  <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                    <p className="text-gray-300">
                      <span className="text-purple-400 font-semibold">⚠️ 重要提示：</span>
                      本项目为开源教育项目，仅供学习、研究和技术交流使用，不构成任何投资建议或金融服务。
                    </p>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-semibold text-sm">
                        🔒 为避免法律风险，本项目所有功能均在测试网络（如 Sepolia 测试网）上运行，不涉及真实资产交易。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 底部页脚 */}
          <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
            <p>Built with Next.js + Wagmi + Uniswap V2</p>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
```

**架构流程图：**

```
<html>
  <body>
    <ClientProviders>           ← 动态加载，仅在浏览器运行
      <Web3Provider>            ← Wagmi + RainbowKit + React Query
        <Header />              ← 导航栏（每个页面都有）
        <main>{children}</main> ← 页面内容（由路由决定）
        <DisclaimerModal />     ← 免责声明弹窗
        <footer />              ← 底部信息
      </Web3Provider>
    </ClientProviders>
  </body>
</html>
```

---

## 第三章：创建导航和通用组件

### 3.1 创建 Header 导航组件

导航栏包含到各功能页面的链接和钱包连接按钮。

创建文件 `components/Header.tsx`：

```typescript
// components/Header.tsx

"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
    return (
        <header className="flex justify-between items-center p-4 border-b bg-black px-10">
            {/* 导航链接 */}
            <Link href="/" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">
                首页
            </Link>
            <Link href="/tokenBounding" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">
                代币铸造
            </Link>
            <Link href="/liquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">
                自定义路由
            </Link>
            <Link href="/addLiquidity" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">
                添加流动性
            </Link>
            <Link href="/swap" className="text-xl font-bold text-white hover:scale-120 hover:text-purple-200">
                代币兑换
            </Link>

            {/* RainbowKit 钱包连接按钮 */}
            {/* 这一行代码就实现了完整的钱包连接功能！ */}
            <ConnectButton />
        </header>
    );
}
```

> **`<ConnectButton />`** 是 RainbowKit 提供的组件，它自动处理了：
> - 显示"连接钱包"按钮
> - 弹出钱包选择弹窗（MetaMask、WalletConnect 等）
> - 连接后显示地址和余额
> - 支持切换网络
> - 支持断开连接

### 3.2 创建首页

首页是应用的入口，展示功能概览和技术栈信息。

创建文件 `app/page.tsx`：

```typescript
// app/page.tsx

"use client"

import Link from "next/link"
import { useAccount } from "wagmi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// 定义四大核心功能
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

export default function HomePage() {
    // useAccount() 是 Wagmi 提供的 Hook
    // 可以获取当前连接的钱包地址和连接状态
    const { isConnected, address } = useAccount()

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero 区域 */}
            <section className="relative overflow-hidden">
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
                        铸造代币、部署路由、提供流动性、代币兑换 —— 一站式 DeFi 操作平台
                    </p>

                    {/* 根据钱包连接状态显示不同内容 */}
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

                    {/* 已连接时显示地址 */}
                    {isConnected && address && (
                        <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            已连接: {address.slice(0, 6)}...{address.slice(-4)}
                        </div>
                    )}
                </div>
            </section>

            {/* 功能卡片 */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
                    <p className="text-gray-400 text-lg">从代币创建到交易兑换，覆盖 DeFi 全流程</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature) => (
                        <Link key={feature.href} href={feature.href}>
                            <Card className={`group cursor-pointer bg-gray-900/50 border-gray-800 ${feature.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full`}>
                                <CardContent className="p-8">
                                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                    <div className="mt-5 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        进入 →
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
```

**代码重点讲解：**

```typescript
const { isConnected, address } = useAccount()
```

`useAccount()` 是 Wagmi 最常用的 Hook 之一。它返回：
- `isConnected`: 布尔值，钱包是否已连接
- `address`: 已连接的钱包地址（`0x...`）
- 还有 `chain`（当前网络）、`connector`（使用的钱包类型）等

### 3.3 安装 shadcn/ui 组件

如果你在 1.4 步骤中还没安装，确保执行以下命令：

```bash
npx shadcn@latest add button card input label
```

这会在 `components/ui/` 目录下生成对应的组件文件。shadcn/ui 组件使用 Tailwind CSS 编写，你可以自由修改样式。

---

## 第四章：准备智能合约 ABI 和 Bytecode

### 4.1 什么是 ABI 和 Bytecode

在与智能合约交互之前，我们需要两样东西：

**ABI（Application Binary Interface）**：
- 类似于 API 文档，描述了合约有哪些函数、参数类型、返回值
- 是一个 JSON 数组
- 用于**调用已部署的合约**

**Bytecode（字节码）**：
- 智能合约编译后的二进制代码
- 是一个超长的十六进制字符串（`0x608060...`）
- 用于**部署新合约**到区块链

```
Solidity 源代码 → 编译 → ABI (接口描述) + Bytecode (可执行代码)
```

**打个比方：**
- ABI 就像餐厅菜单，告诉你有哪些菜可以点
- Bytecode 就像厨房的所有设备和食材，用来开一家新餐厅

### 4.2 ERC-20 代币合约

ERC-20 是以太坊上最常用的代币标准，定义了代币的基本行为：转账、授权、查询余额等。

创建文件 `lib/erc20-contract.ts`：

```typescript
// lib/erc20-contract.ts

// ERC-20 合约 ABI
// 定义了代币合约的所有函数接口
export const erc20Abi = [
    // 构造函数 - 部署合约时调用
    {
        type: "constructor",
        inputs: [
            { name: "name_", type: "string" },       // 代币名称，如 "My Token"
            { name: "symbol_", type: "string" },      // 代币符号，如 "MTK"
            { name: "decimals_", type: "uint8" },     // 小数位数，通常 18
            { name: "totalSupply_", type: "uint256" }, // 总供应量
        ],
    },
    // view 函数（只读，不消耗 Gas）
    {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [{ type: "string" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [{ type: "string" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [{ type: "uint8" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "allowance",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
    },
    // 写入函数（修改链上状态，需要消耗 Gas）
    {
        type: "function",
        name: "transfer",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ type: "bool" }],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "approve",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ type: "bool" }],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "transferFrom",
        inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ type: "bool" }],
        stateMutability: "nonpayable",
    },
] as const

// ERC-20 合约 Bytecode（编译后的字节码）
// 这是一个标准 ERC-20 合约的编译产物
// 你需要用 Solidity 编译器（如 Remix IDE 或 Hardhat）编译你的 ERC-20 合约获得 bytecode
export const erc20Bytecode = "0x..." as `0x${string}`
// 注意：这里省略了实际的 bytecode，因为它非常长
// 你需要将你编译好的 ERC-20 合约 bytecode 填入这里
```

> **如何获取 Bytecode？**
>
> 1. 在 [Remix IDE](https://remix.ethereum.org/) 中编写并编译你的 ERC-20 Solidity 合约
> 2. 编译后，在 "Compilation Details" 中找到 "object" 字段（就是 bytecode）
> 3. 复制该值，加上 `0x` 前缀
>
> 或者，你也可以使用 Hardhat 编译：
> ```bash
> npx hardhat compile
> # bytecode 在 artifacts/contracts/YourToken.sol/YourToken.json 的 "bytecode" 字段
> ```

### 4.3 WETH 合约

WETH（Wrapped ETH）是把 ETH 包装成 ERC-20 格式的代币。在 Uniswap V2 中，所有代币交换都通过 ERC-20 接口进行，而 ETH 本身不是 ERC-20 代币，所以需要先包装。

创建文件 `lib/WETH-contract.ts`：

```typescript
// lib/WETH-contract.ts

export const wethAbi = [
    // 基本 ERC-20 函数
    { type: "function", name: "name", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
    { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
    { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
    { type: "function", name: "totalSupply", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
    { type: "function", name: "balanceOf", inputs: [{ name: "", type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },

    // WETH 特有函数
    // deposit: 存入 ETH，获得等量 WETH
    {
        type: "function",
        name: "deposit",
        inputs: [],
        outputs: [],
        stateMutability: "payable",  // payable 表示可以接收 ETH
    },
    // withdraw: 销毁 WETH，取回等量 ETH
    {
        type: "function",
        name: "withdraw",
        inputs: [{ name: "wad", type: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
    },

    // ERC-20 标准函数
    { type: "function", name: "approve", inputs: [{ name: "guy", type: "address" }, { name: "wad", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
    { type: "function", name: "transfer", inputs: [{ name: "dst", type: "address" }, { name: "wad", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
    { type: "function", name: "transferFrom", inputs: [{ name: "src", type: "address" }, { name: "dst", type: "address" }, { name: "wad", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
    { type: "function", name: "allowance", inputs: [{ name: "", type: "address" }, { name: "", type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },

    // 接收 ETH（直接转 ETH 到合约地址时自动调用 deposit）
    { type: "receive", stateMutability: "payable" },
] as const

// WETH 合约的 Bytecode
export const wethBytecode = "0x..." as `0x${string}`
// 同样需要编译获取
```

### 4.4 Uniswap V2 Factory 合约

Factory（工厂合约）负责创建和管理交易对（Pair）。每当你需要一个新的代币交易对时，Factory 会部署一个新的 Pair 合约。

创建文件 `lib/uniswapV2Factory.ts`：

```typescript
// lib/uniswapV2Factory.ts

export const uniswapV2FactoryAbil = [
    // 构造函数
    {
        type: "constructor",
        inputs: [
            { name: "_feeToSetter", type: "address" }  // 有权设置手续费接收地址的管理员
        ],
    },
    // 创建交易对
    {
        type: "function",
        name: "createPair",
        inputs: [
            { name: "tokenA", type: "address" },
            { name: "tokenB", type: "address" },
        ],
        outputs: [{ name: "pair", type: "address" }],
        stateMutability: "nonpayable",
    },
    // 查询交易对地址
    {
        type: "function",
        name: "getPair",
        inputs: [
            { name: "", type: "address" },
            { name: "", type: "address" },
        ],
        outputs: [{ type: "address" }],
        stateMutability: "view",
    },
    // 查询所有交易对数量
    {
        type: "function",
        name: "allPairsLength",
        inputs: [],
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
    },
    // 手续费管理
    {
        type: "function",
        name: "feeTo",
        inputs: [],
        outputs: [{ type: "address" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "feeToSetter",
        inputs: [],
        outputs: [{ type: "address" }],
        stateMutability: "view",
    },
    // 事件
    {
        type: "event",
        name: "PairCreated",
        inputs: [
            { name: "token0", type: "address", indexed: true },
            { name: "token1", type: "address", indexed: true },
            { name: "pair", type: "address", indexed: false },
            { name: "", type: "uint256", indexed: false },
        ],
    },
] as const

export const uniswapV2Bytecode = "0x..." as `0x${string}`
```

### 4.5 Uniswap V2 Router 合约

Router（路由合约）是用户直接交互的合约，它封装了添加流动性和代币兑换的复杂逻辑。

创建文件 `lib/uniswapV2Router.ts`：

```typescript
// lib/uniswapV2Router.ts
// 注意：Router ABI 通常很长（近千行），这里只展示核心函数

export const uniswapV2RouterAbi = [
    // 构造函数
    {
        type: "constructor",
        inputs: [
            { name: "_factory", type: "address" },  // Factory 合约地址
            { name: "_WETH", type: "address" },      // WETH 合约地址
        ],
    },
    // 查询 Factory 和 WETH 地址
    { type: "function", name: "factory", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
    { type: "function", name: "WETH", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },

    // ===== 添加流动性 =====
    {
        type: "function",
        name: "addLiquidity",
        inputs: [
            { name: "tokenA", type: "address" },
            { name: "tokenB", type: "address" },
            { name: "amountADesired", type: "uint256" },  // 期望存入的 A 数量
            { name: "amountBDesired", type: "uint256" },  // 期望存入的 B 数量
            { name: "amountAMin", type: "uint256" },      // 最少接受的 A 数量（滑点保护）
            { name: "amountBMin", type: "uint256" },      // 最少接受的 B 数量（滑点保护）
            { name: "to", type: "address" },               // LP Token 接收地址
            { name: "deadline", type: "uint256" },         // 交易截止时间
        ],
        outputs: [
            { name: "amountA", type: "uint256" },
            { name: "amountB", type: "uint256" },
            { name: "liquidity", type: "uint256" },
        ],
        stateMutability: "nonpayable",
    },

    // ===== 代币兑换 =====
    // 精确输入模式：我要卖出确定数量的 Token A
    {
        type: "function",
        name: "swapExactTokensForTokens",
        inputs: [
            { name: "amountIn", type: "uint256" },     // 精确的输入数量
            { name: "amountOutMin", type: "uint256" },  // 最少要获得的输出数量
            { name: "path", type: "address[]" },        // 兑换路径 [tokenA, tokenB]
            { name: "to", type: "address" },
            { name: "deadline", type: "uint256" },
        ],
        outputs: [{ name: "amounts", type: "uint256[]" }],
        stateMutability: "nonpayable",
    },
    // 精确输出模式：我要买入确定数量的 Token B
    {
        type: "function",
        name: "swapTokensForExactTokens",
        inputs: [
            { name: "amountOut", type: "uint256" },   // 精确的输出数量
            { name: "amountInMax", type: "uint256" },  // 最多愿意花费的输入数量
            { name: "path", type: "address[]" },
            { name: "to", type: "address" },
            { name: "deadline", type: "uint256" },
        ],
        outputs: [{ name: "amounts", type: "uint256[]" }],
        stateMutability: "nonpayable",
    },

    // ===== 价格查询 =====
    // 给定输入数量，计算能获得多少输出
    {
        type: "function",
        name: "getAmountsOut",
        inputs: [
            { name: "amountIn", type: "uint256" },
            { name: "path", type: "address[]" },
        ],
        outputs: [{ name: "amounts", type: "uint256[]" }],
        stateMutability: "view",
    },
    // 给定输出数量，计算需要多少输入
    {
        type: "function",
        name: "getAmountsIn",
        inputs: [
            { name: "amountOut", type: "uint256" },
            { name: "path", type: "address[]" },
        ],
        outputs: [{ name: "amounts", type: "uint256[]" }],
        stateMutability: "view",
    },
] as const

export const uniswapV2Bytecode = "0x..." as `0x${string}`
```

> **Uniswap V2 架构简图：**
>
> ```
> 用户
>  │
>  ▼
> Router（路由合约）── 用户直接交互的入口
>  │
>  ▼
> Factory（工厂合约）── 创建和管理交易对
>  │
>  ▼
> Pair（交易对合约）── 持有两种代币的流动性池
>  │
>  ├── Token A（ERC-20）
>  └── Token B（ERC-20）
> ```

---

## 第五章：实现代币铸造功能

### 5.1 功能概述

代币铸造页面让用户可以：
1. 填写代币信息（名称、符号、小数位数、发行量）
2. 预估 Gas 费用
3. 一键部署到区块链
4. 查看部署结果（合约地址、持有余额）
5. 管理铸造历史记录（本地持久化）

### 5.2 文件结构设计

这个页面代码量较大，我们将其拆分为 **2 个自定义 Hook** 和 **5 个 UI 组件**，由 `page.tsx` 作为组合层串联：

```
app/tokenBounding/
├── page.tsx                 # 页面入口，组合 Hooks 和组件
├── hooks/
│   ├── useTokenDeploy.ts    # 合约部署 & Gas 预估逻辑
│   └── useTokenHistory.ts   # 铸造历史记录（localStorage）
└── components/
    ├── StepIndicator.tsx    # 流程步骤条（填写信息 → 确认交易 → 部署完成）
    ├── TokenForm.tsx        # 代币信息填写表单
    ├── GasEstimate.tsx      # Gas 费用预估卡片
    ├── DeployResult.tsx     # 部署成功结果展示
    ├── MintHistory.tsx      # 铸造历史侧栏
    └── FeatureCards.tsx     # 特性说明卡片 & 注意事项
```

> **为什么要拆分？**
> - **关注点分离**：Hook 负责状态逻辑，组件负责 UI 渲染
> - **可维护性**：每个文件只做一件事，修改时不会影响其他部分
> - **可复用性**：`useTokenHistory` 等 Hook 可在其他页面复用
> - 这与 `liquidity/` 页面的组织方式保持一致

### 5.3 创建历史记录 Hook — `useTokenHistory.ts`

创建文件 `app/tokenBounding/hooks/useTokenHistory.ts`：

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"

// 历史记录的数据类型
export interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

const HISTORY_KEY = "token-create-history"

// 从 localStorage 加载历史记录
function loadHistory(): TokenRecord[] {
    if (typeof window === "undefined") return []  // SSR 环境下没有 window
    try {
        const raw = localStorage.getItem(HISTORY_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

// 保存历史记录到 localStorage
function saveHistory(records: TokenRecord[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useTokenHistory() {
    const [history, setHistory] = useState<TokenRecord[]>([])

    // 组件挂载时从 localStorage 加载
    useEffect(() => {
        setHistory(loadHistory())
    }, [])

    // 添加一条记录（自动去重，按合约地址判断）
    const addRecord = useCallback((record: TokenRecord) => {
        setHistory((prev) => {
            if (prev.some((r) => r.contractAddress === record.contractAddress)) return prev
            const next = [record, ...prev]
            saveHistory(next)
            return next
        })
    }, [])

    // 删除单条记录
    const deleteRecord = useCallback((contractAddr: string) => {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }, [])

    // 清空所有记录
    const clearHistory = useCallback(() => {
        setHistory([])
        saveHistory([])
    }, [])

    return { history, addRecord, deleteRecord, clearHistory }
}
```

> **知识点：为什么用 `useCallback`？**
>
> `addRecord`、`deleteRecord`、`clearHistory` 被包裹在 `useCallback` 中，保证函数引用稳定。
> 当这些函数作为 props 传给子组件时，不会导致子组件不必要的重渲染。

### 5.4 创建部署逻辑 Hook — `useTokenDeploy.ts`

创建文件 `app/tokenBounding/hooks/useTokenDeploy.ts`：

```typescript
"use client"

import { useMemo } from "react"
import {
    useAccount,                    // 获取钱包地址和连接状态
    useBalance,                    // 查询 ETH 余额
    useEstimateGas,                // 预估 Gas 消耗
    useGasPrice,                   // 获取当前 Gas 价格
    useSendTransaction,            // 发送交易（部署合约）
    useWaitForTransactionReceipt,  // 等待交易确认
    useReadContract,               // 读取合约数据
} from "wagmi"
import { encodeDeployData, parseUnits } from "viem"
import { erc20Abi, erc20Bytecode } from "@/lib/erc20-contract"

interface UseTokenDeployParams {
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    initialSupply: string
}

export function useTokenDeploy({
    tokenName, tokenSymbol, tokenDecimals, initialSupply
}: UseTokenDeployParams) {
    const { address, isConnected } = useAccount()

    // ===== 核心：发送部署交易 =====
    const {
        sendTransaction,
        data: deployHash,       // 交易哈希
        isPending: isDeploying, // 是否正在等待用户确认
        error: deployError,     // 部署错误
    } = useSendTransaction()

    // ===== 等待交易上链确认 =====
    const {
        data: receipt,          // 交易回执
        isLoading: isWaiting,   // 是否正在等待确认
    } = useWaitForTransactionReceipt({
        hash: deployHash,       // 监听这个交易哈希
    })

    // 从回执中获取合约地址
    const contractAddress = receipt?.contractAddress

    // ===== 部署成功后查询代币余额 =====
    const { data: balance } = useReadContract({
        address: contractAddress ?? undefined,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!contractAddress && !!address,
        },
    })

    // ===== 构建部署数据，用于预估 Gas =====
    const deployData = useMemo(() => {
        if (!tokenName || !tokenSymbol || !initialSupply) return undefined
        try {
            // parseUnits: 将用户输入转为链上大数
            // 例如：用户输入 "1000"，decimals=18
            // → 实际值 = 1000 * 10^18 = 1000000000000000000000
            const supplyWithDecimals = parseUnits(initialSupply, Number(tokenDecimals))

            // encodeDeployData: 将 ABI + Bytecode + 构造函数参数编码为一个数据包
            return encodeDeployData({
                abi: erc20Abi,
                bytecode: erc20Bytecode,
                args: [tokenName, tokenSymbol, Number(tokenDecimals), supplyWithDecimals],
            })
        } catch {
            return undefined
        }
    }, [tokenName, tokenSymbol, tokenDecimals, initialSupply])

    // 查询 ETH 余额
    const { data: ethBalance } = useBalance({
        address,
        query: { enabled: !!address },
    })

    // 查询 Gas 价格（每 12 秒刷新一次）
    const { data: gasPrice } = useGasPrice({
        query: { refetchInterval: 12_000 },
    })

    // 预估 Gas 消耗
    const { data: gasEstimate } = useEstimateGas({
        data: deployData,
        query: { enabled: !!deployData && !!address },
    })

    // 计算总费用 = Gas 用量 × Gas 价格
    const estimatedCost = gasEstimate && gasPrice ? gasEstimate * gasPrice : undefined

    // 步骤状态：0=填写信息, 1=确认交易, 2=部署完成
    const currentStep = contractAddress ? 2 : isDeploying || isWaiting ? 1 : 0

    // 发送部署交易
    function handleDeploy() {
        if (!tokenName || !tokenSymbol || !initialSupply) return
        const supplyWithDecimals = parseUnits(initialSupply, Number(tokenDecimals))
        const data = encodeDeployData({
            abi: erc20Abi,
            bytecode: erc20Bytecode,
            args: [tokenName, tokenSymbol, Number(tokenDecimals), supplyWithDecimals],
        })
        // 发送交易！部署合约 = 发送一个没有 to 地址的交易
        sendTransaction({ data })
    }

    return {
        address,
        isConnected,
        isDeploying,
        isWaiting,
        deployError,
        contractAddress,
        balance,
        deployData,
        ethBalance,
        gasPrice,
        gasEstimate,
        estimatedCost,
        currentStep,
        handleDeploy,
    }
}
```

> **交易的生命周期：**
> ```
> 用户点击"部署" → sendTransaction() 调用
>        ↓
> MetaMask 弹出确认 → isPending = true
>        ↓
> 用户确认交易 → 交易发送到区块链 → deployHash 有值
>        ↓
> 等待矿工打包 → isWaiting = true
>        ↓
> 交易被打包到区块 → receipt 有值 → contractAddress 可用
> ```

> **部署合约的原理：**
>
> 在以太坊中，部署合约就是发送一笔特殊的交易：
> - `to` 字段为空（表示这是创建新合约）
> - `data` 字段包含合约字节码 + 构造函数参数
> - 矿工执行 `data` 中的代码，部署合约到一个新地址
> - 交易回执中的 `contractAddress` 就是新合约的地址

> **Gas 费用 101：**
> - **Gas**：衡量交易复杂度的单位。越复杂的操作需要越多 Gas
> - **Gas Price**：每单位 Gas 的价格，单位是 Gwei（1 Gwei = 10^-9 ETH）
> - **总费用** = Gas 用量 × Gas 价格
> - 例如：Gas 用量 = 1,500,000，Gas Price = 20 Gwei → 费用 = 0.03 ETH

### 5.5 创建 UI 组件

#### 5.5.1 流程步骤条 — `StepIndicator.tsx`

创建文件 `app/tokenBounding/components/StepIndicator.tsx`：

```tsx
import { FileText, Send, CheckCircle2, Check } from "lucide-react"

const steps = [
    { icon: FileText, label: "填写信息" },
    { icon: Send, label: "确认交易" },
    { icon: CheckCircle2, label: "部署完成" },
]

interface StepIndicatorProps {
    currentStep: number  // 0=填写信息, 1=确认交易, 2=部署完成
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-2 w-full max-w-md">
            {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isDone = index < currentStep
                return (
                    <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full
                                    border-2 transition-all ${
                                    isDone
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : isActive
                                          ? "border-primary text-primary"
                                          : "border-muted text-muted-foreground"
                                }`}
                            >
                                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span
                                className={`text-xs font-medium ${
                                    isDone || isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {/* 步骤之间的连接线 */}
                        {index < steps.length - 1 && (
                            <div
                                className={`h-0.5 flex-1 mx-2 mb-5 transition-all ${
                                    index < currentStep ? "bg-primary" : "bg-muted"
                                }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
```

> **设计思路：** 步骤条用 `currentStep` 数值来控制三种视觉状态——已完成（绿色填充）、进行中（边框高亮）、未开始（灰色）。

#### 5.5.2 代币信息表单 — `TokenForm.tsx`

创建文件 `app/tokenBounding/components/TokenForm.tsx`：

```tsx
import { Button } from "@/components/ui/button"
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, Type, Hash, Settings } from "lucide-react"

interface TokenFormProps {
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    initialSupply: string
    onTokenNameChange: (value: string) => void
    onTokenSymbolChange: (value: string) => void
    onTokenDecimalsChange: (value: string) => void
    onInitialSupplyChange: (value: string) => void
    onDeploy: () => void
    isConnected: boolean
    isDeploying: boolean
    isWaiting: boolean
    deployError: Error | null
}

export function TokenForm({
    tokenName, tokenSymbol, tokenDecimals, initialSupply,
    onTokenNameChange, onTokenSymbolChange, onTokenDecimalsChange,
    onInitialSupplyChange, onDeploy,
    isConnected, isDeploying, isWaiting, deployError,
}: TokenFormProps) {
    return (
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle>代币创建</CardTitle>
                <CardDescription>填写以下信息来创建你的 ERC-20 代币</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* 代币名称 */}
                    <div className="grid gap-2">
                        <Label htmlFor="tokenName" className="flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5 text-muted-foreground" />
                            代币名称
                        </Label>
                        <Input
                            id="tokenName"
                            placeholder="例如：MyToken"
                            value={tokenName}
                            onChange={(e) => onTokenNameChange(e.target.value)}
                        />
                    </div>
                    {/* 代币符号 */}
                    <div className="grid gap-2">
                        <Label htmlFor="tokenSymbol" className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                            代币符号
                        </Label>
                        <Input
                            id="tokenSymbol"
                            placeholder="例如：MTK"
                            value={tokenSymbol}
                            onChange={(e) => onTokenSymbolChange(e.target.value)}
                        />
                    </div>
                    {/* 小数位数 */}
                    <div className="grid gap-2">
                        <Label htmlFor="tokenDecimals" className="flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                            小数位数
                        </Label>
                        <Input
                            id="tokenDecimals"
                            type="number" min="0" max="18"
                            value={tokenDecimals}
                            onChange={(e) => onTokenDecimalsChange(e.target.value)}
                        />
                    </div>
                    {/* 初始发行量 */}
                    <div className="grid gap-2">
                        <Label htmlFor="initialSupply" className="flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                            初始数量
                        </Label>
                        <Input
                            id="initialSupply"
                            type="number"
                            placeholder="例如：1000000"
                            value={initialSupply}
                            onChange={(e) => onInitialSupplyChange(e.target.value)}
                        />
                    </div>
                    {/* 错误提示 */}
                    {deployError && (
                        <p className="text-sm text-red-500">
                            部署失败：{deployError.message.slice(0, 100)}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                {/* 按钮根据状态显示不同文案 */}
                <Button
                    className="w-full"
                    onClick={onDeploy}
                    disabled={!isConnected || isDeploying || isWaiting
                        || !tokenName || !tokenSymbol || !initialSupply}
                >
                    {!isConnected
                        ? "请先连接钱包"
                        : isDeploying
                          ? "确认交易中..."
                          : isWaiting
                            ? "部署中..."
                            : "一键创建"}
                </Button>
            </CardFooter>
        </Card>
    )
}
```

> **状态驱动的按钮：** 注意按钮的文案和 `disabled` 状态是由多个条件动态决定的——
> 未连接钱包、正在确认、正在部署、表单未填写，都会影响按钮行为。

#### 5.5.3 Gas 费用预估 — `GasEstimate.tsx`

创建文件 `app/tokenBounding/components/GasEstimate.tsx`：

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel, Wallet } from "lucide-react"
import { formatEther, formatGwei } from "viem"

interface GasEstimateProps {
    ethBalance: { value: bigint } | undefined
    gasPrice: bigint | undefined
    gasEstimate: bigint | undefined
    estimatedCost: bigint | undefined
    deployData: `0x${string}` | undefined
}

export function GasEstimate({
    ethBalance, gasPrice, gasEstimate, estimatedCost, deployData
}: GasEstimateProps) {
    return (
        <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    费用预估
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5" />
                            ETH 余额
                        </span>
                        <span className="font-mono">
                            {ethBalance
                                ? `${parseFloat(formatEther(ethBalance.value)).toFixed(6)} ETH`
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Price</span>
                        <span className="font-mono">
                            {gasPrice
                                ? `${parseFloat(formatGwei(gasPrice)).toFixed(2)} Gwei`
                                : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">预估 Gas</span>
                        <span className="font-mono">
                            {gasEstimate
                                ? gasEstimate.toLocaleString()
                                : deployData ? "估算中..." : "请填写表单"}
                        </span>
                    </div>
                    <div className="border-t pt-2.5 flex justify-between font-medium">
                        <span>预估总费用</span>
                        <span className="font-mono">
                            {estimatedCost
                                ? `${parseFloat(formatEther(estimatedCost)).toFixed(6)} ETH`
                                : "—"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
```

#### 5.5.4 部署结果展示 — `DeployResult.tsx`

创建文件 `app/tokenBounding/components/DeployResult.tsx`：

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Copy, Check } from "lucide-react"
import { formatUnits } from "viem"

interface DeployResultProps {
    contractAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    balance: bigint | undefined
    copied: string | null
    onCopy: (addr: string) => void
}

export function DeployResult({
    contractAddress, tokenName, tokenSymbol, tokenDecimals,
    balance, copied, onCopy,
}: DeployResultProps) {
    return (
        <Card className="w-full max-w-md border-green-500/30 bg-gray-900/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    部署成功
                </CardTitle>
                <CardDescription>你的代币已成功部署到区块链</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 text-sm">
                    {/* 合约地址（可复制） */}
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">合约地址</span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs break-all max-w-48 text-right">
                                {contractAddress}
                            </span>
                            <button
                                onClick={() => onCopy(contractAddress)}
                                className="p-1 rounded hover:bg-muted transition-colors"
                            >
                                {copied === contractAddress
                                    ? <Check className="w-3.5 h-3.5 text-green-500" />
                                    : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">代币名称</span>
                        <span>{tokenName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">代币符号</span>
                        <span>{tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">小数位数</span>
                        <span>{tokenDecimals}</span>
                    </div>
                    {/* 持有数量：通过 useReadContract 读取链上 balanceOf */}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">持有数量</span>
                        <span className="font-semibold">
                            {balance !== undefined
                                ? `${formatUnits(balance, Number(tokenDecimals))} ${tokenSymbol}`
                                : "加载中..."}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
```

#### 5.5.5 铸造历史侧栏 — `MintHistory.tsx`

创建文件 `app/tokenBounding/components/MintHistory.tsx`：

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Coins, Trash2, Copy, Check } from "lucide-react"
import { TokenRecord } from "../hooks/useTokenHistory"

interface MintHistoryProps {
    history: TokenRecord[]
    copied: string | null
    onCopy: (addr: string) => void
    onDelete: (contractAddr: string) => void
    onClear: () => void
}

export function MintHistory({ history, copied, onCopy, onDelete, onClear }: MintHistoryProps) {
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
                            onClick={onClear}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                            清空
                        </button>
                    )}
                </div>
                <CardDescription>
                    {history.length > 0 ? `共 ${history.length} 条记录` : "暂无铸造记录"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                        <Coins className="w-8 h-8 opacity-30" />
                        <p className="text-sm">创建你的第一个代币吧</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {history.map((record) => (
                            <div
                                key={record.contractAddress}
                                className="group relative rounded-lg border p-3 text-sm
                                    hover:bg-muted/50 transition-colors"
                            >
                                {/* 悬浮时显示删除按钮 */}
                                <button
                                    onClick={() => onDelete(record.contractAddress)}
                                    className="absolute top-2 right-2 p-1 rounded opacity-0
                                        group-hover:opacity-100 hover:bg-muted transition-all"
                                >
                                    <Trash2 className="w-3 h-3 text-muted-foreground
                                        hover:text-destructive" />
                                </button>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-semibold">{record.name}</span>
                                    <span className="text-xs text-muted-foreground bg-muted
                                        px-1.5 py-0.5 rounded">
                                        {record.symbol}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="font-mono text-xs text-muted-foreground truncate">
                                        {record.contractAddress}
                                    </span>
                                    <button
                                        onClick={() => onCopy(record.contractAddress)}
                                        className="p-0.5 rounded hover:bg-muted transition-colors
                                            shrink-0"
                                    >
                                        {copied === record.contractAddress
                                            ? <Check className="w-3 h-3 text-green-500" />
                                            : <Copy className="w-3 h-3 text-muted-foreground" />}
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
```

#### 5.5.6 特性说明与注意事项 — `FeatureCards.tsx`

创建文件 `app/tokenBounding/components/FeatureCards.tsx`：

```tsx
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
            {/* 三列特性卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <Card key={feature.title} className="text-center bg-gray-900/50 border-gray-800">
                            <CardContent className="pt-6 flex flex-col items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12
                                    rounded-full bg-primary/10">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* 注意事项横幅 */}
            <div className="flex items-start gap-3 w-full p-4 rounded-lg border
                border-yellow-500/30 bg-yellow-500/10">
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
```

### 5.6 组合页面 — `page.tsx`

最后，创建 `app/tokenBounding/page.tsx`，将所有 Hooks 和组件组合在一起：

```tsx
"use client"

import { useEffect, useState } from "react"
import { useTokenDeploy } from "./hooks/useTokenDeploy"
import { useTokenHistory } from "./hooks/useTokenHistory"
import { StepIndicator } from "./components/StepIndicator"
import { TokenForm } from "./components/TokenForm"
import { GasEstimate } from "./components/GasEstimate"
import { DeployResult } from "./components/DeployResult"
import { MintHistory } from "./components/MintHistory"
import { FeatureCards } from "./components/FeatureCards"

export default function TokenCreate() {
    // ===== 表单状态（由页面持有，传给子组件和 Hook） =====
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenDecimals, setTokenDecimals] = useState("18")
    const [initialSupply, setInitialSupply] = useState("")
    const [copied, setCopied] = useState<string | null>(null)

    // ===== 部署逻辑 Hook =====
    const {
        isConnected, isDeploying, isWaiting, deployError,
        contractAddress, balance, deployData,
        ethBalance, gasPrice, gasEstimate, estimatedCost,
        currentStep, handleDeploy,
    } = useTokenDeploy({ tokenName, tokenSymbol, tokenDecimals, initialSupply })

    // ===== 历史记录 Hook =====
    const { history, addRecord, deleteRecord, clearHistory } = useTokenHistory()

    // 部署成功后自动写入历史记录
    useEffect(() => {
        if (!contractAddress) return
        addRecord({
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            supply: initialSupply,
            contractAddress,
            createdAt: new Date().toLocaleString("zh-CN"),
        })
    }, [contractAddress]) // eslint-disable-line react-hooks/exhaustive-deps

    // 复制地址到剪贴板
    function handleCopy(addr: string) {
        navigator.clipboard.writeText(addr)
        setCopied(addr)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题区 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    代币铸造工坊
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    在这里创建属于你自己的 ERC-20 代币，只需填写基本信息即可一键部署到区块链。
                </p>
            </div>

            {/* 两栏布局：左边创建流程 + 右边历史记录 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：创建流程 */}
                <div className="flex flex-col items-center gap-8 flex-1 min-w-0">
                    <StepIndicator currentStep={currentStep} />

                    <TokenForm
                        tokenName={tokenName}
                        tokenSymbol={tokenSymbol}
                        tokenDecimals={tokenDecimals}
                        initialSupply={initialSupply}
                        onTokenNameChange={setTokenName}
                        onTokenSymbolChange={setTokenSymbol}
                        onTokenDecimalsChange={setTokenDecimals}
                        onInitialSupplyChange={setInitialSupply}
                        onDeploy={handleDeploy}
                        isConnected={isConnected}
                        isDeploying={isDeploying}
                        isWaiting={isWaiting}
                        deployError={deployError}
                    />

                    {/* 已连接钱包时显示 Gas 预估 */}
                    {isConnected && (
                        <GasEstimate
                            ethBalance={ethBalance}
                            gasPrice={gasPrice}
                            gasEstimate={gasEstimate}
                            estimatedCost={estimatedCost}
                            deployData={deployData}
                        />
                    )}

                    {/* 部署成功后显示结果 */}
                    {contractAddress && (
                        <DeployResult
                            contractAddress={contractAddress}
                            tokenName={tokenName}
                            tokenSymbol={tokenSymbol}
                            tokenDecimals={tokenDecimals}
                            balance={balance as bigint | undefined}
                            copied={copied}
                            onCopy={handleCopy}
                        />
                    )}
                </div>

                {/* 右栏：铸造历史记录 */}
                <div className="w-full lg:w-80 shrink-0">
                    <MintHistory
                        history={history}
                        copied={copied}
                        onCopy={handleCopy}
                        onDelete={deleteRecord}
                        onClear={clearHistory}
                    />
                </div>
            </div>

            {/* 底部：特性说明 + 注意事项 */}
            <FeatureCards />
        </div>
    )
}
```

### 5.7 核心流程图

```
[用户填写表单] ← TokenForm 组件
     ↓
[encodeDeployData] → 将 ABI + Bytecode + 参数编码为 data  ← useTokenDeploy Hook
     ↓
[useEstimateGas] → 预估需要多少 Gas → GasEstimate 组件展示
     ↓
[用户点击"创建"] → sendTransaction({ data })
     ↓
[MetaMask 弹出确认] → StepIndicator 显示"确认交易"
     ↓
[useWaitForTransactionReceipt] → 等待交易上链
     ↓
[receipt.contractAddress] → 获取合约地址 → DeployResult 组件展示
     ↓
[useReadContract("balanceOf")] → 读取代币余额
     ↓
[addRecord] → 保存到 localStorage → MintHistory 组件展示
```

### 5.8 重要的 Wagmi Hooks 速查表

| Hook | 用途 | 示例 |
|------|------|------|
| `useAccount()` | 获取钱包信息 | `{ address, isConnected }` |
| `useBalance()` | 查询 ETH 余额 | `{ data: { value, formatted } }` |
| `useGasPrice()` | 获取当前 Gas 价格 | `{ data: 20000000000n }` |
| `useEstimateGas()` | 预估 Gas 消耗 | `{ data: 1500000n }` |
| `useSendTransaction()` | 发送交易 | `{ sendTransaction, data: hash }` |
| `useWaitForTransactionReceipt()` | 等待交易确认 | `{ data: receipt }` |
| `useReadContract()` | 读取合约数据（view） | `{ data: result }` |
| `useWriteContract()` | 调用合约写入函数 | `{ writeContract, data: hash }` |

---

## 第六章：实现自定义路由部署（流动性管理）

### 6.1 功能概述

这个页面实现了 Uniswap V2 完整基础设施的部署，分 4 步：

```
Step 1: 部署 WETH 合约     → 包装以太坊
Step 2: 部署 Factory 合约  → 交易对工厂
Step 3: 部署 Router 合约   → 路由合约（依赖 WETH 和 Factory）
Step 4: 添加流动性          → 使用已部署的合约
```

为了保持代码整洁，我们采用 **自定义 Hooks** 模式——每个合约的逻辑封装到单独的 Hook 中。

### 6.2 创建 localStorage 管理 Hook

这个 Hook 统一管理所有 localStorage 操作。

创建文件 `app/liquidity/hooks/useLocalStorage.ts`：

```typescript
// app/liquidity/hooks/useLocalStorage.ts

import { useState, useEffect } from "react"

// 代币铸造历史记录类型
export interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

// localStorage 的 key 常量
const WETH_STORAGE_KEY = "deployed-weth-address"
const FACTORY_STORAGE_KEY = "deployed-factory-address"
const ROUTER_STORAGE_KEY = "deployed-router-address"
const HISTORY_KEY = "token-create-history"

// 工具函数
function loadFromStorage(key: string): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
}

function saveToStorage(key: string, value: string) {
    if (typeof window === "undefined") return
    localStorage.setItem(key, value)
}

function removeFromStorage(key: string) {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
}

function loadHistory(): TokenRecord[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(HISTORY_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveHistory(records: TokenRecord[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useLocalStorage() {
    const [wethAddress, setWethAddress] = useState<string | null>(null)
    const [factoryAddress, setFactoryAddress] = useState<string | null>(null)
    const [routerAddress, setRouterAddress] = useState<string | null>(null)
    const [history, setHistory] = useState<TokenRecord[]>([])

    // 组件挂载时从 localStorage 加载数据
    useEffect(() => {
        setWethAddress(loadFromStorage(WETH_STORAGE_KEY))
        setFactoryAddress(loadFromStorage(FACTORY_STORAGE_KEY))
        setRouterAddress(loadFromStorage(ROUTER_STORAGE_KEY))
        setHistory(loadHistory())
    }, [])

    // 保存地址
    const saveWethAddress = (addr: string) => {
        saveToStorage(WETH_STORAGE_KEY, addr)
        setWethAddress(addr)
    }

    const saveFactoryAddress = (addr: string) => {
        saveToStorage(FACTORY_STORAGE_KEY, addr)
        setFactoryAddress(addr)
    }

    const saveRouterAddress = (addr: string) => {
        saveToStorage(ROUTER_STORAGE_KEY, addr)
        setRouterAddress(addr)
    }

    // 重置地址
    const resetWethAddress = () => { removeFromStorage(WETH_STORAGE_KEY); setWethAddress(null) }
    const resetFactoryAddress = () => { removeFromStorage(FACTORY_STORAGE_KEY); setFactoryAddress(null) }
    const resetRouterAddress = () => { removeFromStorage(ROUTER_STORAGE_KEY); setRouterAddress(null) }

    // 历史记录操作
    const deleteHistoryRecord = (contractAddr: string) => {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }

    const clearHistory = () => { setHistory([]); saveHistory([]) }

    const clearAll = () => {
        removeFromStorage(WETH_STORAGE_KEY)
        removeFromStorage(FACTORY_STORAGE_KEY)
        removeFromStorage(ROUTER_STORAGE_KEY)
        removeFromStorage(HISTORY_KEY)
        setWethAddress(null)
        setFactoryAddress(null)
        setRouterAddress(null)
        setHistory([])
    }

    return {
        wethAddress, factoryAddress, routerAddress, history,
        saveWethAddress, saveFactoryAddress, saveRouterAddress,
        resetWethAddress, resetFactoryAddress, resetRouterAddress,
        deleteHistoryRecord, clearHistory, clearAll,
    }
}
```

> **为什么用 localStorage？**
>
> 部署合约后，我们需要记住合约地址。如果不保存，刷新页面后地址就丢失了，需要重新部署。localStorage 是浏览器提供的简单持久化存储，适合存储少量数据。

### 6.3 创建 WETH 合约 Hook

这个 Hook 封装了 WETH 合约的部署和交互逻辑。

创建文件 `app/liquidity/hooks/useWethContract.ts`：

```typescript
// app/liquidity/hooks/useWethContract.ts

import { useState, useEffect } from "react"
import {
    useAccount, useBalance,
    useSendTransaction, useWaitForTransactionReceipt,
    useReadContract, useWriteContract,
} from "wagmi"
import { encodeDeployData, parseEther } from "viem"
import { wethAbi, wethBytecode } from "@/lib/WETH-contract"

interface UseWethContractProps {
    savedAddress: string | null           // 从 localStorage 读取的已保存地址
    onAddressSaved: (address: string) => void  // 保存地址的回调
}

export function useWethContract({ savedAddress, onAddressSaved }: UseWethContractProps) {
    const { address } = useAccount()
    const [isReset, setIsReset] = useState(false)
    const [depositAmount, setDepositAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")

    // ===== 部署 WETH =====
    const {
        sendTransaction: sendDeployWeth,
        data: wethDeployHash,
        isPending: isDeployingWeth,
        error: wethDeployError,
    } = useSendTransaction()

    const { data: wethReceipt, isLoading: isWaitingWeth } = useWaitForTransactionReceipt({
        hash: wethDeployHash,
    })

    // 合约地址：优先用刚部署的，其次用已保存的
    const wethAddress = isReset ? null : (wethReceipt?.contractAddress ?? savedAddress)
    const wethAddr = wethAddress as `0x${string}` | undefined

    // 部署成功后自动保存地址
    useEffect(() => {
        if (wethReceipt?.contractAddress) {
            onAddressSaved(wethReceipt.contractAddress)
            setIsReset(false)
        }
    }, [wethReceipt?.contractAddress, onAddressSaved])

    // ===== 读取合约信息 =====
    const { data: wethName } = useReadContract({
        address: wethAddr, abi: wethAbi, functionName: "name",
        query: { enabled: !!wethAddr },
    })

    const { data: wethSymbol } = useReadContract({
        address: wethAddr, abi: wethAbi, functionName: "symbol",
        query: { enabled: !!wethAddr },
    })

    const { data: wethTotalSupply, refetch: refetchTotalSupply } = useReadContract({
        address: wethAddr, abi: wethAbi, functionName: "totalSupply",
        query: { enabled: !!wethAddr },
    })

    const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
        address: wethAddr, abi: wethAbi, functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!wethAddr && !!address },
    })

    const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
        address, query: { enabled: !!address },
    })

    // ===== Deposit: ETH → WETH =====
    const { writeContract: writeDeposit, data: depositHash, isPending: isDepositPending, error: depositError } = useWriteContract()
    const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash })

    // deposit 成功后刷新余额
    useEffect(() => {
        if (isDepositSuccess) {
            refetchEthBalance()
            refetchWethBalance()
            refetchTotalSupply()
            setDepositAmount("")
        }
    }, [isDepositSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    // ===== Withdraw: WETH → ETH =====
    const { writeContract: writeWithdraw, data: withdrawHash, isPending: isWithdrawPending, error: withdrawError } = useWriteContract()
    const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash })

    useEffect(() => {
        if (isWithdrawSuccess) {
            refetchEthBalance()
            refetchWethBalance()
            refetchTotalSupply()
            setWithdrawAmount("")
        }
    }, [isWithdrawSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    // ===== 操作函数 =====
    const deployWeth = () => {
        const data = encodeDeployData({ abi: wethAbi, bytecode: wethBytecode })
        sendDeployWeth({ data })
    }

    const deposit = (amount: string) => {
        if (!wethAddr || !amount) return
        writeDeposit({
            address: wethAddr,
            abi: wethAbi,
            functionName: "deposit",
            value: parseEther(amount),  // 将 ETH 数量转为 wei
        })
    }

    const withdraw = (amount: string) => {
        if (!wethAddr || !amount) return
        writeWithdraw({
            address: wethAddr,
            abi: wethAbi,
            functionName: "withdraw",
            args: [parseEther(amount)],
        })
    }

    const resetWeth = () => { setIsReset(true) }

    return {
        wethAddress, isDeploying: isDeployingWeth, isWaiting: isWaitingWeth,
        wethName, wethSymbol, wethTotalSupply, wethBalance, ethBalance,
        depositAmount, setDepositAmount, withdrawAmount, setWithdrawAmount,
        isDepositPending, isDepositConfirming, isWithdrawPending, isWithdrawConfirming,
        deployError: wethDeployError, depositError, withdrawError,
        deployWeth, deposit, withdraw, resetWeth,
    }
}
```

> **WETH 的工作原理：**
>
> ```
> deposit(): 用户发送 1 ETH → 合约铸造 1 WETH 给用户
> withdraw(): 用户发送 1 WETH → 合约销毁 WETH 并退还 1 ETH
> ```
>
> 这样 ETH 就变成了标准的 ERC-20 代币，可以在 Uniswap 中使用。

### 6.4 创建 Factory 合约 Hook

创建文件 `app/liquidity/hooks/useFactoryContract.ts`：

```typescript
// app/liquidity/hooks/useFactoryContract.ts

import { useState, useEffect } from "react"
import { useSendTransaction, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { encodeDeployData, isAddress } from "viem"
import { uniswapV2FactoryAbil, uniswapV2Bytecode as factoryBytecode } from "@/lib/uniswapV2Factory"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface UseFactoryContractProps {
    savedAddress: string | null
    onAddressSaved: (address: string) => void
}

export function useFactoryContract({ savedAddress, onAddressSaved }: UseFactoryContractProps) {
    const [isReset, setIsReset] = useState(false)
    const [feeToSetter, setFeeToSetter] = useState("")

    // 部署交易
    const { sendTransaction: sendDeployFactory, data: factoryDeployHash, isPending: isDeployingFactory, error: factoryDeployError } = useSendTransaction()
    const { data: factoryReceipt, isLoading: isWaitingFactory } = useWaitForTransactionReceipt({ hash: factoryDeployHash })

    const factoryAddress = isReset ? null : (factoryReceipt?.contractAddress ?? savedAddress)
    const factoryAddr = factoryAddress as `0x${string}` | undefined

    // 部署成功后保存
    useEffect(() => {
        if (factoryReceipt?.contractAddress) {
            onAddressSaved(factoryReceipt.contractAddress)
            setIsReset(false)
        }
    }, [factoryReceipt?.contractAddress, onAddressSaved])

    // 读取合约信息
    const { data: factoryFeeToSetter } = useReadContract({
        address: factoryAddr, abi: uniswapV2FactoryAbil, functionName: "feeToSetter",
        query: { enabled: !!factoryAddr },
    })

    const { data: factoryFeeTo } = useReadContract({
        address: factoryAddr, abi: uniswapV2FactoryAbil, functionName: "feeTo",
        query: { enabled: !!factoryAddr },
    })

    const { data: factoryPairsLength } = useReadContract({
        address: factoryAddr, abi: uniswapV2FactoryAbil, functionName: "allPairsLength",
        query: { enabled: !!factoryAddr },
    })

    // 部署函数
    const deployFactory = (feeToSetterAddr: string) => {
        const setter = feeToSetterAddr.trim() || ZERO_ADDRESS
        if (setter !== ZERO_ADDRESS && !isAddress(setter)) return

        const data = encodeDeployData({
            abi: uniswapV2FactoryAbil,
            bytecode: factoryBytecode,
            args: [setter as `0x${string}`],
        })
        sendDeployFactory({ data })
    }

    const resetFactory = () => { setIsReset(true) }

    return {
        factoryAddress, isDeploying: isDeployingFactory, isWaiting: isWaitingFactory,
        factoryFeeToSetter, factoryFeeTo, factoryPairsLength: factoryPairsLength as bigint | undefined,
        feeToSetter, setFeeToSetter, deployFactory, resetFactory,
        deployError: factoryDeployError,
    }
}
```

### 6.5 创建 Router 合约 Hook

Router 合约依赖 Factory 和 WETH 的地址。

创建文件 `app/liquidity/hooks/useRouterContract.ts`：

```typescript
// app/liquidity/hooks/useRouterContract.ts

import { useState, useEffect } from "react"
import { useSendTransaction, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { encodeDeployData, isAddress } from "viem"
import { uniswapV2RouterAbi, uniswapV2Bytecode as routerBytecode } from "@/lib/uniswapV2Router"

interface UseRouterContractProps {
    savedAddress: string | null
    onAddressSaved: (address: string) => void
    factoryAddress: string | null  // 来自 Factory Hook
    wethAddress: string | null     // 来自 WETH Hook
}

export function useRouterContract({ savedAddress, onAddressSaved, factoryAddress, wethAddress }: UseRouterContractProps) {
    const [isReset, setIsReset] = useState(false)
    const [routerFactoryInput, setRouterFactoryInput] = useState("")
    const [routerWethInput, setRouterWethInput] = useState("")

    // 自动填充：当 Factory 和 WETH 部署完成后，自动填入地址
    useEffect(() => {
        if (factoryAddress && !routerFactoryInput) setRouterFactoryInput(factoryAddress)
        if (wethAddress && !routerWethInput) setRouterWethInput(wethAddress)
    }, [factoryAddress, wethAddress]) // eslint-disable-line react-hooks/exhaustive-deps

    // 部署交易
    const { sendTransaction: sendDeployRouter, data: routerDeployHash, isPending: isDeployingRouter, error: routerDeployError } = useSendTransaction()
    const { data: routerReceipt, isLoading: isWaitingRouter } = useWaitForTransactionReceipt({ hash: routerDeployHash })

    const routerAddress = isReset ? null : (routerReceipt?.contractAddress ?? savedAddress)
    const routerAddr = routerAddress as `0x${string}` | undefined

    useEffect(() => {
        if (routerReceipt?.contractAddress) {
            onAddressSaved(routerReceipt.contractAddress)
            setIsReset(false)
        }
    }, [routerReceipt?.contractAddress, onAddressSaved])

    // 读取合约信息
    const { data: routerFactory } = useReadContract({
        address: routerAddr, abi: uniswapV2RouterAbi, functionName: "factory",
        query: { enabled: !!routerAddr },
    })
    const { data: routerWETH } = useReadContract({
        address: routerAddr, abi: uniswapV2RouterAbi, functionName: "WETH",
        query: { enabled: !!routerAddr },
    })

    // 部署 Router
    const deployRouter = (factory: string, weth: string) => {
        if (!isAddress(factory.trim()) || !isAddress(weth.trim())) return
        const data = encodeDeployData({
            abi: uniswapV2RouterAbi,
            bytecode: routerBytecode,
            args: [factory.trim() as `0x${string}`, weth.trim() as `0x${string}`],
        })
        sendDeployRouter({ data })
    }

    const resetRouter = () => { setIsReset(true) }

    return {
        routerAddress, isDeploying: isDeployingRouter, isWaiting: isWaitingRouter,
        routerFactory, routerWETH,
        routerFactoryInput, setRouterFactoryInput, routerWethInput, setRouterWethInput,
        deployRouter, resetRouter, deployError: routerDeployError,
    }
}
```

### 6.6 创建 AddLiquidity Hook

这个 Hook 处理添加流动性的完整逻辑，包括代币授权、余额检查、交易模拟和执行。

创建文件 `app/liquidity/hooks/useAddLiquidity.ts`：

```typescript
// app/liquidity/hooks/useAddLiquidity.ts

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
import { isAddress, parseUnits, maxUint256, BaseError } from "viem"
import { erc20Abi } from "@/lib/erc20-contract"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import { uniswapV2FactoryAbil } from "@/lib/uniswapV2Factory"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export function useAddLiquidity({ routerAddress, factoryAddress, wethAddress }: {
    routerAddress: string | null
    factoryAddress: string | null
    wethAddress: string | null
}) {
    const { address } = useAccount()
    const publicClient = usePublicClient()

    const [tokenA, setTokenA] = useState("")
    const [tokenB, setTokenB] = useState("")
    const [amountA, setAmountA] = useState("")
    const [amountB, setAmountB] = useState("")
    const [addLiquiditySimError, setAddLiquiditySimError] = useState<string | null>(null)

    const routerAddr = routerAddress as `0x${string}` | undefined
    const tokenAAddr = isAddress(tokenA) ? (tokenA as `0x${string}`) : undefined
    const tokenBAddr = isAddress(tokenB) ? (tokenB as `0x${string}`) : undefined

    // 读取代币精度
    const { data: tokenADecimals } = useReadContract({
        address: tokenAAddr, abi: erc20Abi, functionName: "decimals",
        query: { enabled: !!tokenAAddr },
    })
    const { data: tokenBDecimals } = useReadContract({
        address: tokenBAddr, abi: erc20Abi, functionName: "decimals",
        query: { enabled: !!tokenBAddr },
    })

    const tokenADecimalsNumber = tokenADecimals !== undefined ? Number(tokenADecimals) : undefined
    const tokenBDecimalsNumber = tokenBDecimals !== undefined ? Number(tokenBDecimals) : undefined

    // 读取授权额度和余额
    const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
        address: tokenAAddr, abi: erc20Abi, functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenAAddr && !!address && !!routerAddr },
    })
    const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
        address: tokenBAddr, abi: erc20Abi, functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenBAddr && !!address && !!routerAddr },
    })
    const { data: balanceA } = useReadContract({
        address: tokenAAddr, abi: erc20Abi, functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenAAddr && !!address },
    })
    const { data: balanceB } = useReadContract({
        address: tokenBAddr, abi: erc20Abi, functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenBAddr && !!address },
    })

    // 写操作：添加流动性
    const { writeContract: writeAddLiquidity, data: addLiquidityHash, isPending: isAddLiquidityPending } = useWriteContract()
    const { isLoading: isAddLiquidityConfirming, isSuccess: isAddLiquiditySuccess } = useWaitForTransactionReceipt({ hash: addLiquidityHash })

    // 成功后清空表单
    useEffect(() => {
        if (isAddLiquiditySuccess) { setAmountA(""); setAmountB("") }
    }, [isAddLiquiditySuccess])

    // 授权操作
    const { writeContract: writeApproveA, data: approveAHash, isPending: isApproveAPending, error: approveAError } = useWriteContract()
    const { isLoading: isApproveAConfirming, isSuccess: isApproveASuccess } = useWaitForTransactionReceipt({ hash: approveAHash })
    const { writeContract: writeApproveB, data: approveBHash, isPending: isApproveBPending, error: approveBError } = useWriteContract()
    const { isLoading: isApproveBConfirming, isSuccess: isApproveBSuccess } = useWaitForTransactionReceipt({ hash: approveBHash })

    useEffect(() => { if (isApproveASuccess) refetchAllowanceA() }, [isApproveASuccess]) // eslint-disable-line
    useEffect(() => { if (isApproveBSuccess) refetchAllowanceB() }, [isApproveBSuccess]) // eslint-disable-line

    // ===== 核心：添加流动性 =====
    async function handleAddLiquidity() {
        if (!routerAddr || !tokenAAddr || !tokenBAddr || !amountA || !amountB || !address) return

        const parsedA = parseUnits(amountA, tokenADecimalsNumber ?? 18)
        const parsedB = parseUnits(amountB, tokenBDecimalsNumber ?? 18)
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20分钟有效期

        // 先模拟交易（不消耗 Gas），检查是否会成功
        if (publicClient) {
            try {
                await publicClient.simulateContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "addLiquidity",
                    args: [tokenAAddr, tokenBAddr, parsedA, parsedB, BigInt(0), BigInt(0), address, BigInt(deadline)],
                    account: address,
                })
                setAddLiquiditySimError(null)
            } catch (err) {
                setAddLiquiditySimError(err instanceof BaseError ? err.message : "交易模拟失败")
                return  // 模拟失败则不执行真实交易
            }
        }

        // 执行真实交易
        writeAddLiquidity({
            address: routerAddr,
            abi: uniswapV2RouterAbi,
            functionName: "addLiquidity",
            args: [tokenAAddr, tokenBAddr, parsedA, parsedB, BigInt(0), BigInt(0), address, BigInt(deadline)],
        })
    }

    // 授权函数
    function handleApproveTokenA() {
        if (!tokenAAddr || !routerAddr) return
        writeApproveA({
            address: tokenAAddr, abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],  // 授权最大额度
        })
    }

    function handleApproveTokenB() {
        if (!tokenBAddr || !routerAddr) return
        writeApproveB({
            address: tokenBAddr, abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    return {
        tokenA, setTokenA, tokenB, setTokenB, amountA, setAmountA, amountB, setAmountB,
        tokenADecimalsNumber, tokenBDecimalsNumber, allowanceA, allowanceB, balanceA, balanceB,
        isAddLiquidityPending, isAddLiquidityConfirming, addLiquiditySimError,
        isApproveAPending, isApproveAConfirming, isApproveBPending, isApproveBConfirming,
        approveAError, approveBError,
        handleAddLiquidity, handleApproveTokenA, handleApproveTokenB,
    }
}
```

> **什么是 Approve（授权）？**
>
> ERC-20 代币有一个安全机制：你不能直接让别的合约花你的代币。你需要先"授权"那个合约可以使用你多少代币。
>
> ```
> 流程：
> 1. 用户调用 tokenA.approve(routerAddress, 金额)
>    → "我允许 Router 合约使用我最多 X 个 Token A"
>
> 2. Router 内部调用 tokenA.transferFrom(用户, pair合约, 金额)
>    → Router 代替用户将 Token A 转入流动性池
> ```
>
> `maxUint256` 表示授权无限额度，避免每次操作都要重新授权。

### 6.7 创建各组件卡片

由于组件代码较长，这里展示每个组件的核心结构。你需要为每个步骤创建对应的卡片组件。

**WethCard (`app/liquidity/components/WethCard.tsx`)**：显示 WETH 合约信息，支持部署、存取款操作。

**FactoryCard (`app/liquidity/components/FactoryCard.tsx`)**：显示 Factory 合约信息，支持部署。

**RouterCard (`app/liquidity/components/RouterCard.tsx`)**：显示 Router 合约信息，支持部署（自动填充 Factory 和 WETH 地址）。

**AddLiquidityCard (`app/liquidity/components/AddLiquidityCard.tsx`)**：显示添加流动性的表单。

**HistoryPanel (`app/liquidity/components/HistoryPanel.tsx`)**：显示代币铸造历史记录。

每个组件都是一个 Card，接收 Hook 返回的状态和操作函数作为 props。

### 6.8 组装流动性管理页面

创建文件 `app/liquidity/page.tsx`：

```typescript
// app/liquidity/page.tsx

"use client"

import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useWethContract } from "./hooks/useWethContract"
import { useFactoryContract } from "./hooks/useFactoryContract"
import { useRouterContract } from "./hooks/useRouterContract"
import { useAddLiquidity } from "./hooks/useAddLiquidity"
import { WethCard } from "./components/WethCard"
import { FactoryCard } from "./components/FactoryCard"
import { RouterCard } from "./components/RouterCard"
import { AddLiquidityCard } from "./components/AddLiquidityCard"
import { HistoryPanel } from "./components/HistoryPanel"

export default function LiquidityPage() {
    const { isConnected } = useAccount()
    const localStorage = useLocalStorage()

    // ===== 使用自定义 Hooks =====
    // 每个 Hook 管理一个合约的完整生命周期
    const weth = useWethContract({
        savedAddress: localStorage.wethAddress,
        onAddressSaved: localStorage.saveWethAddress,
    })

    const factory = useFactoryContract({
        savedAddress: localStorage.factoryAddress,
        onAddressSaved: localStorage.saveFactoryAddress,
    })

    // Router 依赖 Factory 和 WETH 的地址
    const router = useRouterContract({
        savedAddress: localStorage.routerAddress,
        onAddressSaved: localStorage.saveRouterAddress,
        factoryAddress: factory.factoryAddress,
        wethAddress: weth.wethAddress,
    })

    const addLiquidity = useAddLiquidity({
        routerAddress: router.routerAddress,
        factoryAddress: factory.factoryAddress,
        wethAddress: weth.wethAddress,
    })

    // 断开钱包时清空所有数据
    useEffect(() => {
        if (!isConnected) localStorage.clearAll()
    }, [isConnected]) // eslint-disable-line

    return (
        <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto min-h-screen text-white">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">流动性管理</h1>
                <p className="text-muted-foreground">
                    在测试网上部署 Uniswap V2 合约基础设施，然后为代币对添加流动性。
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full flex flex-col gap-8 items-center flex-1 min-w-0">
                    {/* 步骤 1: 部署 WETH */}
                    <WethCard {...weth} isConnected={isConnected}
                        onReset={() => { weth.resetWeth(); localStorage.resetWethAddress() }}
                    />

                    {/* 步骤 2: 部署 Factory */}
                    <FactoryCard {...factory} isConnected={isConnected}
                        wethAddress={weth.wethAddress}
                        onReset={() => { factory.resetFactory(); localStorage.resetFactoryAddress() }}
                    />

                    {/* 步骤 3: 部署 Router */}
                    <RouterCard {...router} isConnected={isConnected}
                        factoryAddress={factory.factoryAddress}
                        wethAddress={weth.wethAddress}
                        onReset={() => { router.resetRouter(); localStorage.resetRouterAddress() }}
                    />

                    {/* 步骤 4: 添加流动性 */}
                    <AddLiquidityCard {...addLiquidity}
                        isConnected={isConnected}
                        routerAddress={router.routerAddress}
                        factoryAddress={factory.factoryAddress}
                        wethAddress={weth.wethAddress}
                    />
                </div>

                {/* 右侧：铸造历史 */}
                <HistoryPanel
                    history={localStorage.history}
                    onDeleteRecord={localStorage.deleteHistoryRecord}
                    onClearHistory={localStorage.clearHistory}
                />
            </div>
        </div>
    )
}
```

> **Hook 之间的依赖关系：**
>
> ```
> useLocalStorage → 管理持久化存储
>     ↓ 提供 savedAddress
> useWethContract → 部署/管理 WETH
>     ↓ 提供 wethAddress
> useFactoryContract → 部署/管理 Factory
>     ↓ 提供 factoryAddress
> useRouterContract → 部署 Router（需要 factory + WETH 地址）
>     ↓ 提供 routerAddress
> useAddLiquidity → 添加流动性（需要 router + factory + WETH 地址）
> ```

---

## 第七章：实现添加流动性功能

### 7.1 功能概述

添加流动性页面允许用户为已有的 Router 添加流动性，支持：
- 选择自定义 Router 或外部 Router
- 输入两个代币地址和数量
- 自动检测交易对是否存在
- 授权代币
- 执行添加流动性操作

### 7.2 创建添加流动性页面

创建文件 `app/addLiquidity/page.tsx`。

核心逻辑与第六章的 `useAddLiquidity` Hook 类似，但这里是独立页面，所以把所有逻辑写在一个文件中。

### 7.3 核心代码解析

**添加流动性的完整流程：**

```
1. 选择 Router（自定义或外部）
     ↓
2. 通过 Router 读取 Factory 地址
     ↓
3. 输入 Token A 和 Token B 地址
     ↓
4. 自动读取代币信息（符号、精度、余额）
     ↓
5. 通过 Factory.getPair() 检查交易对是否存在
     ↓
6. 输入存入数量
     ↓
7. 检查并授权（approve）两个代币给 Router
     ↓
8. 调用 Router.addLiquidity()
     ↓
9. 交易确认 → 流动性添加成功！
```

**关键代码：检查交易对是否存在**

```typescript
// 通过 Factory 的 getPair 函数检查
const pair = await publicClient.readContract({
    address: factoryAddress as `0x${string}`,
    abi: uniswapV2FactoryAbil,
    functionName: "getPair",
    args: [tokenAAddr, tokenBAddr],
})

// 如果返回零地址，说明交易对不存在
if (pair === ZERO_ADDRESS) {
    // addLiquidity 会自动创建交易对
    console.log("交易对不存在，将自动创建")
}
```

---

## 第八章：实现代币兑换功能

### 8.1 功能概述

代币兑换是 DeFi 的核心功能。本页面实现了：

- 两种兑换模式：精确输入（我要卖多少）和精确输出（我要买多少）
- 实时价格计算
- 滑点保护
- 代币授权

### 8.2 创建代币兑换页面

创建文件 `app/swap/page.tsx`。

### 8.3 核心代码解析

**价格计算原理（AMM 自动做市商）：**

Uniswap V2 使用 `x * y = k` 恒定乘积公式：

```
假设流动性池中有：
  Token A: 1000 个
  Token B: 2000 个
  k = 1000 * 2000 = 2,000,000

如果我要用 100 个 Token A 换 Token B：
  新的 Token A 数量 = 1000 + 100 = 1100
  新的 Token B 数量 = k / 1100 = 2,000,000 / 1100 ≈ 1818.18
  我能获得的 Token B = 2000 - 1818.18 ≈ 181.82 个

注意：不是简单的 100 * 2 = 200！
      因为交易越大，价格滑动越大（这就是"滑点"）
```

**实时价格计算代码：**

```typescript
// 精确输入模式：我输入 X 个 Token A，能获得多少 Token B？
const amounts = await publicClient.readContract({
    address: routerAddr,
    abi: uniswapV2RouterAbi,
    functionName: "getAmountsOut",
    args: [parsedAmountIn, [tokenInAddr, tokenOutAddr]],
})
// amounts[0] = 输入数量，amounts[1] = 可获得的输出数量

// 精确输出模式：我要获得 Y 个 Token B，需要花费多少 Token A？
const amounts = await publicClient.readContract({
    address: routerAddr,
    abi: uniswapV2RouterAbi,
    functionName: "getAmountsIn",
    args: [parsedAmountOut, [tokenInAddr, tokenOutAddr]],
})
// amounts[0] = 需要的输入数量，amounts[1] = 输出数量
```

**滑点保护：**

```typescript
const slippagePercent = parseFloat(slippage) / 100  // 如 0.5% = 0.005

if (swapMode === "exactIn") {
    // 精确输入模式：设置最小输出数量
    const amountOutMin = amountOut * (1 - slippagePercent)
    // 意思是：如果实际获得的数量 < amountOutMin，交易自动失败

    writeSwap({
        functionName: "swapExactTokensForTokens",
        args: [amountIn, amountOutMin, path, address, deadline],
    })
} else {
    // 精确输出模式：设置最大输入数量
    const amountInMax = amountIn * (1 + slippagePercent)
    // 意思是：如果需要花费的数量 > amountInMax，交易自动失败

    writeSwap({
        functionName: "swapTokensForExactTokens",
        args: [amountOut, amountInMax, path, address, deadline],
    })
}
```

> **什么是滑点？**
>
> 滑点是你预期价格和实际成交价格之间的差异。
>
> - 设置 0.5% 滑点：我预计获得 100 个代币，实际最少获得 99.5 个
> - 设置越小：价格保护越强，但交易可能更容易失败
> - 设置越大：交易更容易成功，但可能在价格波动时损失更多
>
> **Deadline（截止时间）** 也是一种保护：如果交易在截止时间前没有被打包，自动取消。防止矿工恶意延迟你的交易。

---

## 第九章：添加免责声明弹窗

为了合规和教育目的，我们添加一个免责声明弹窗。

创建文件 `components/DisclaimerModal.tsx`：

```typescript
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
        const hasAgreed = localStorage.getItem("disclaimer-agreed")
        if (!hasAgreed) {
            setIsOpen(true)
        }
    }, [])

    // 监听滚动到底部
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50
        if (scrolledToBottom && !hasScrolledToBottom) {
            setHasScrolledToBottom(true)
        }
    }

    const handleAgree = () => {
        // 记录同意
        localStorage.setItem("disclaimer-agreed", JSON.stringify({
            agreed: true,
            timestamp: new Date().toISOString(),
            version: "1.0",
        }))
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
                    <div className="overflow-y-auto my-4 space-y-4 text-sm text-gray-400 leading-relaxed pr-2 max-h-[50vh]" onScroll={handleScroll}>
                        {/* 免责声明内容... */}
                        <p className="text-gray-300 text-base">
                            <span className="text-yellow-400 font-semibold">⚠️ 重要提示：</span>
                            在使用本平台前，请您仔细阅读并充分理解以下条款。
                        </p>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-300 font-semibold mb-2">请特别注意：</p>
                            <p className="text-yellow-400 mb-2">本项目为开源教育项目，仅供学习使用。</p>
                            <p className="text-yellow-400 font-semibold">
                                🔒 为避免法律风险，本项目所有功能均在测试网络上运行，不涉及真实资产交易。
                            </p>
                        </div>

                        {/* 更多条款内容... */}
                    </div>

                    {/* 按钮 */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                        <Button
                            onClick={handleAgree}
                            disabled={!hasScrolledToBottom}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
                            size="lg"
                        >
                            {hasScrolledToBottom ? "✓ 我已阅读并同意" : "请先阅读完整内容"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
```

**设计要点：**
- 用户必须滚动到底部才能点击同意按钮
- 同意后保存到 localStorage，下次不再弹出
- 使用 `position: fixed` 覆盖整个页面

---

## 第十章：运行与测试

### 10.1 启动开发服务器

```bash
# 在项目目录下运行
npm run dev

# 或使用 pnpm
pnpm dev

# 打开浏览器访问 http://localhost:3000
```

### 10.2 配置 MetaMask 连接测试网

1. **安装 MetaMask 浏览器插件**
   - 访问 https://metamask.io/download/
   - 安装并创建或导入钱包

2. **切换到 Sepolia 测试网**
   - 点击 MetaMask 顶部的网络选择器
   - 选择 "Sepolia test network"
   - 如果没有，点击 "Add network" → 搜索 Sepolia

3. **获取测试 ETH**
   - 访问 Sepolia 水龙头：https://sepoliafaucet.com/
   - 输入你的钱包地址
   - 领取测试 ETH（每天可领取一次）

4. **或使用 Hardhat 本地网络**
   ```bash
   # 安装 Hardhat
   npm install -D hardhat

   # 启动本地节点（会给你 20 个测试账户，每个 10000 ETH）
   npx hardhat node

   # 在 MetaMask 中添加自定义网络：
   # 网络名称：Hardhat
   # RPC URL：http://127.0.0.1:8545
   # Chain ID：31337
   # 货币符号：ETH
   ```

### 10.3 完整测试流程

按照以下顺序测试所有功能：

```
Step 1: 连接钱包
└── 点击右上角 "Connect Wallet" → 选择 MetaMask → 确认连接

Step 2: 铸造测试代币
└── 代币铸造 → 输入名称/符号/数量 → 创建
└── 至少铸造 2 种不同的代币（用于后续添加流动性和兑换）
└── 记下两个代币的合约地址

Step 3: 部署 Uniswap V2 基础设施
└── 自定义路由页面 → 依次部署 WETH → Factory → Router

Step 4: 添加流动性
└── 添加流动性 → 选择自定义 Router
└── 输入两个代币地址 → 授权 → 添加流动性

Step 5: 代币兑换
└── 代币兑换 → 选择自定义 Router
└── 输入代币地址 → 输入数量 → 授权 → 兑换
```

---

## 附录

### A. 常见错误与解决方案

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `indexedDB` 错误 | SSR 环境下访问浏览器 API | 确保 wagmi 配置 `ssr: false` |
| `ChainMismatchError` | 钱包网络和配置不匹配 | 切换到正确的网络 |
| `InsufficientFundsError` | ETH 余额不足 | 获取更多测试 ETH |
| `User rejected` | 用户在 MetaMask 中拒绝了交易 | 重新点击并确认 |
| `execution reverted` | 合约执行失败 | 检查参数是否正确、授权是否足够 |
| `CALL_EXCEPTION` | 调用了不存在的合约函数 | 检查合约地址和 ABI 是否正确 |
| Hydration 错误 | 服务端和客户端渲染不一致 | 使用 `"use client"` 和 `dynamic import` |

### B. 关键概念词汇表

| 术语 | 英文 | 解释 |
|------|------|------|
| 智能合约 | Smart Contract | 部署在区块链上的自动执行程序 |
| ABI | Application Binary Interface | 合约的接口描述文件 |
| Gas | Gas | 交易费用的计量单位 |
| Wei | Wei | ETH 的最小单位（1 ETH = 10^18 Wei） |
| Gwei | Gwei | Gas 价格常用单位（1 Gwei = 10^9 Wei） |
| ERC-20 | ERC-20 | 以太坊代币标准 |
| WETH | Wrapped ETH | ERC-20 格式的 ETH |
| AMM | Automated Market Maker | 自动做市商，Uniswap 的核心机制 |
| 流动性 | Liquidity | 交易池中的代币储备 |
| LP | Liquidity Provider | 流动性提供者 |
| 滑点 | Slippage | 预期价格与实际成交价格的偏差 |
| 授权 | Approve | 允许合约使用你的代币 |
| 交易对 | Pair | 两种代币组成的交易池 |
| Factory | Factory | 创建和管理交易对的工厂合约 |
| Router | Router | 用户交互的路由合约 |

### C. 技术栈版本参考

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.5.12 | React 全栈框架 |
| React | 19.1.0 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Wagmi | 2.19.5 | 以太坊 React Hooks |
| Viem | 2.45.1 | 底层以太坊操作 |
| RainbowKit | 2.2.10 | 钱包连接 UI |
| React Query | 5.90.20 | 异步状态管理 |
| Tailwind CSS | 4.x | CSS 框架 |
| shadcn/ui | 3.8.4 | UI 组件库 |
| Lucide React | 0.563.0 | 图标库 |

---

> **恭喜你完成了本教程！** 你已经学会了如何从零构建一个完整的 DeFi 应用。继续探索和实验，Web3 的世界等待你的发现！
>
> 作者：周航
> GitHub：https://github.com/zhouhangmyers/ToWeb3
