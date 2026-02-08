# 从零实现「一键创建 ERC20 代币」— 完整教程

## 你将学到什么

从一个空白页面出发，一步步搭建一个可以在链上部署 ERC20 代币的前端应用。包括：
- 编写 / 获取 ERC20 合约的 ABI 和 bytecode
- 配置 wagmi 连接本地 anvil 节点
- 用 wagmi hooks 实现合约部署 + 余额读取
- 解决实际开发中会遇到的 CORS、chain ID、MetaMask 等问题

---

## 第一步：准备 ERC20 合约的 ABI 和 Bytecode

部署合约需要两样东西：
- **ABI**：合约的接口描述，告诉前端合约有哪些函数、参数是什么类型
- **Bytecode**：合约编译后的创建字节码（creation bytecode），是 EVM 实际执行的代码

### 获取方式（二选一）

**方式一：用 Foundry（推荐）**

在你的 Foundry 项目中编写好 Solidity 合约后：

```bash
# 编译
forge build

# ABI 和 bytecode 在 out/ 目录下
# 比如 out/SimpleERC20.sol/SimpleERC20.json
# JSON 文件里包含 abi 和 bytecode 两个字段，直接拿来用
```

也可以单独查看：

```bash
forge inspect SimpleERC20 abi
forge inspect SimpleERC20 bytecode
```

**方式二：用 solcjs**

```bash
npx solc --abi --bin --optimize -o output SimpleERC20.sol
# 在 output/ 下生成 .abi 和 .bin 文件
```

### 合约结构

我们用一个精简的 ERC20 合约，构造函数接收 4 个参数：

```solidity
constructor(string _name, string _symbol, uint8 _decimals, uint256 _initialSupply)
```

它做两件事：
1. 设置代币的 name、symbol、decimals
2. 将 `initialSupply * 10^decimals` 的代币全部 mint 给 `msg.sender`（谁部署就给谁）

### 创建合约文件

新建 `lib/erc20-contract.ts`，把 ABI 和 bytecode 放进去：

```typescript
export const erc20Abi = [
    {
        inputs: [
            { name: "_name", type: "string" },
            { name: "_symbol", type: "string" },
            { name: "_decimals", type: "uint8" },
            { name: "_initialSupply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    // ... 其他函数（transfer, approve, transferFrom 等）
] as const  // ← as const 很重要！wagmi 需要精确类型推导

export const erc20Bytecode = "0x6080604052..." as `0x${string}`
//                                                  ↑ viem 要求的类型
```

> **关键点**：`as const` 让 TypeScript 把 ABI 当作字面量类型，wagmi 才能自动推导出 `balanceOf` 返回 `bigint`、`name` 返回 `string` 等。没有 `as const` 的话类型推导会失败。

---

## 第二步：配置 wagmi 连接本地 anvil 节点

### 启动 anvil

```bash
anvil --host 0.0.0.0 --allow-origin '*'
```

两个参数缺一不可：
- `--host 0.0.0.0`：监听所有网络接口（WSL2 环境下必须，否则 Windows 浏览器访问不到）
- `--allow-origin '*'`：允许跨域请求（浏览器 `localhost:3000` → anvil `127.0.0.1:8545` 属于跨域）

> 不加 `--allow-origin` 会报：`Access to fetch at 'http://127.0.0.1:8545/' from origin 'http://localhost:3000' has been blocked by CORS policy`

### 配置 wagmi

```typescript
// lib/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { mainnet, sepolia, hardhat } from "wagmi/chains"

export const config = getDefaultConfig({
    appName: "我的DeFi 应用",
    projectId: "你的WalletConnect项目ID",
    chains: [mainnet, sepolia, hardhat],
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhat.id]: http("http://127.0.0.1:8545"),
    },
})
```

### 踩坑记录

**坑 1：每条链必须配 transport**

```typescript
// ❌ 只配了 localhost，mainnet 和 sepolia 缺失 → 运行时报错
transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
}

// ✅ 每条链都要有
transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
}
```

**坑 2：chain ID 必须匹配**

| 链 | Chain ID |
|----|----------|
| wagmi 的 `localhost` | **1337** |
| wagmi 的 `hardhat` | **31337** |
| anvil 默认 | **31337** |

所以用 anvil 时要用 `hardhat`（31337），不要用 `localhost`（1337）。

如果需要自定义链，用 viem 的 `defineChain`（不是 wagmi 的）：

```typescript
import { defineChain } from "viem"  // ✅ 从 viem 导入

const anvil = defineChain({
    id: 31337,
    name: "Anvil",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: { http: ["http://127.0.0.1:8545"] },
    },
})
```

---

## 第三步：编写代币创建页面

### 3.1 整体结构

页面是 `"use client"` 组件，由两张卡片组成：
- 上方：表单卡片（输入代币信息 + 一键创建按钮）
- 下方：信息卡片（部署成功后显示合约地址和余额）

```
┌─────────────────────────┐
│ 代币创建                 │  ← 始终显示
│  代币名称 [________]     │
│  代币符号 [________]     │
│  小数位数 [___18___]     │
│  初始数量 [________]     │
│  [    一键创建     ]     │
└─────────────────────────┘

┌─────────────────────────┐
│ 代币信息                 │  ← 部署成功后才显示
│  合约地址  0xAbC...123   │
│  代币名称  MyToken       │
│  代币符号  MTK           │
│  小数位数  18            │
│  持有数量  1000000 MTK   │
└─────────────────────────┘
```

### 3.2 状态管理

四个 `useState` 对应四个输入字段：

```typescript
const [tokenName, setTokenName] = useState("")          // 代币名称
const [tokenSymbol, setTokenSymbol] = useState("")      // 代币符号
const [tokenDecimals, setTokenDecimals] = useState("18") // 小数位，默认18
const [initialSupply, setInitialSupply] = useState("")   // 初始数量
```

### 3.3 三个 wagmi hooks 串联 — 数据像瀑布一样往下流

```
useSendTransaction → deployHash（交易哈希）
        ↓
useWaitForTransactionReceipt(deployHash) → receipt.contractAddress（合约地址）
        ↓
useReadContract(contractAddress, "balanceOf") → balance（余额）
```

每个 hook 的输出是下一个 hook 的输入，wagmi 的响应式机制会自动触发整条链路。

#### Hook 1：`useSendTransaction` — 发送部署交易

```typescript
const { sendTransaction, data: deployHash, isPending, error } = useSendTransaction()
```

点击按钮时，用 `encodeDeployData` 把 bytecode 和构造参数编码到一起，然后发送：

```typescript
function handleDeploy() {
    const data = encodeDeployData({
        abi: erc20Abi,
        bytecode: erc20Bytecode,
        args: [tokenName, tokenSymbol, Number(tokenDecimals), BigInt(initialSupply)],
    })
    sendTransaction({ data })  // 没有 to 字段 = 合约创建交易
}
```

> **为什么用 `useSendTransaction` 而不是 `useDeployContract`？**
> `useDeployContract` 在某些 connector（比如 MetaMask injected）下会报 `Requested resource not available`。用 `useSendTransaction` + `encodeDeployData` 手动编码更可靠，底层走的是标准的 `eth_sendTransaction`。

#### Hook 2：`useWaitForTransactionReceipt` — 等待链上确认

```typescript
const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: deployHash,  // deployHash 有值时自动开始轮询
})
const contractAddress = receipt?.contractAddress
```

当 `deployHash` 有值时，这个 hook 自动轮询链上状态，直到交易被打包进区块。交易回执（receipt）里包含新部署的合约地址。

#### Hook 3：`useReadContract` — 读取代币余额

```typescript
const { data: balance } = useReadContract({
    address: contractAddress ?? undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!contractAddress && !!address },
})
```

关键是 `enabled` 条件 — 只有合约地址和钱包地址都存在时才发起 RPC 调用，避免无效请求。合约部署完成后这个条件自动满足，余额就自动读取并显示了。

### 3.4 按钮状态机

按钮文字根据当前状态自动切换：

```
未连接钱包      → "请先连接钱包"（disabled）
已连接，等待点击 → "一键创建"
点击后等钱包确认 → "确认交易中..."（MetaMask 弹窗中）
钱包确认后等上链 → "部署中..."（等待区块确认）
部署完成        → 回到 "一键创建"，同时下方出现代币信息卡片
```

```typescript
{!isConnected
    ? "请先连接钱包"
    : isDeploying
      ? "确认交易中..."
      : isWaiting
        ? "部署中..."
        : "一键创建"}
```

---

## 第四步：配置 MetaMask

1. 导入 anvil 默认账户的私钥到 MetaMask：
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   （这是 anvil 的第一个测试账户，有 10000 ETH）

2. 在 MetaMask 添加网络：
   - 网络名称：`Hardhat` 或 `Anvil`
   - RPC URL：`http://127.0.0.1:8545`
   - Chain ID：`31337`
   - 货币符号：`ETH`

3. 连接钱包时在 RainbowKit 中选择 **MetaMask（Browser Extension）**，不要用 WalletConnect 扫码

> **踩坑**：如果重启了 anvil，MetaMask 会缓存旧的 nonce，导致交易失败。解决：MetaMask → 设置 → 高级 → 清除活动和 nonce 数据

---

## 第五步：完整数据流回顾

```
用户填写表单（代币名称、符号、小数位、数量）
    ↓
点击「一键创建」
    ↓
encodeDeployData() 将 bytecode + 构造参数 ABI 编码
    ↓
sendTransaction({ data }) 发送合约创建交易（没有 to 地址）
    ↓
MetaMask 弹窗，用户确认
    ↓
交易广播到 anvil 节点
    ↓
返回 deployHash（交易哈希）
    ↓
useWaitForTransactionReceipt 自动轮询链上状态
    ↓
交易打包进区块，拿到 receipt.contractAddress
    ↓
useReadContract 自动触发（enabled 条件满足）
    ↓
调用合约的 balanceOf(部署者地址)
    ↓
formatUnits(balance, decimals) 格式化显示余额
```

---

## 涉及文件清单

| 文件 | 职责 |
|------|------|
| `lib/wagmi.ts` | wagmi 配置：链、RPC transport |
| `lib/erc20-contract.ts` | ERC20 合约的 ABI 和 creation bytecode |
| `app/tokenBounding/page.tsx` | 页面组件：表单 + 部署 + 余额展示 |
| `components/Web3Provider.tsx` | Wagmi + RainbowKit + React Query 的 Provider 包裹 |

## 关键依赖

| 包 | 用途 |
|----|------|
| `wagmi` | React hooks：useAccount, useSendTransaction, useWaitForTransactionReceipt, useReadContract |
| `viem` | encodeDeployData 编码部署数据，formatUnits 格式化大数 |
| `@rainbow-me/rainbowkit` | 钱包连接 UI（ConnectButton） |
| `shadcn/ui` | Card, Input, Label, Button 组件 |
