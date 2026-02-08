"use client"

import { useEffect, useMemo, useState } from "react"
import { useAccount, useBalance, useEstimateGas, useGasPrice, useSendTransaction, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { encodeDeployData, formatEther, formatGwei, formatUnits, parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { erc20Abi, erc20Bytecode } from "@/lib/erc20-contract"
import {
    Coins,
    FileText,
    Send,
    CheckCircle2,
    Type,
    Hash,
    Settings,
    Copy,
    Check,
    Shield,
    Sliders,
    Zap,
    AlertTriangle,
    Fuel,
    Wallet,
    History,
    Trash2,
} from "lucide-react"

interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

const HISTORY_KEY = "token-create-history"

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
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export default function TokenCreate() {
    const { address, isConnected } = useAccount()

    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenDecimals, setTokenDecimals] = useState("18")
    const [initialSupply, setInitialSupply] = useState("")
    const [copied, setCopied] = useState<string | null>(null)
    const [history, setHistory] = useState<TokenRecord[]>([])

    // 挂载时加载历史记录
    useEffect(() => {
        setHistory(loadHistory())
    }, [])

    const { sendTransaction, data: deployHash, isPending: isDeploying, error: deployError } = useSendTransaction()

    const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
        hash: deployHash,
    })

    const contractAddress = receipt?.contractAddress

    // 部署成功后写入历史
    useEffect(() => {
        if (!contractAddress) return
        const record: TokenRecord = {
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            supply: initialSupply,
            contractAddress,
            createdAt: new Date().toLocaleString("zh-CN"),
        }
        setHistory((prev) => {
            // 避免重复写入同一合约地址
            if (prev.some((r) => r.contractAddress === contractAddress)) return prev
            const next = [record, ...prev]
            saveHistory(next)
            return next
        })
    }, [contractAddress]) // eslint-disable-line react-hooks/exhaustive-deps

    const { data: balance } = useReadContract({
        address: contractAddress ?? undefined,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!contractAddress && !!address,
        },
    })

    // 构建部署 data 用于预估 gas
    const deployData = useMemo(() => {
        if (!tokenName || !tokenSymbol || !initialSupply) return undefined
        try {
            // 使用 parseUnits 将用户输入转换为包含小数位数的实际数值
            // 例如：用户输入 10，decimals=18，实际是 10 * 10^18
            const supplyWithDecimals = parseUnits(initialSupply, Number(tokenDecimals))
            return encodeDeployData({
                abi: erc20Abi,
                bytecode: erc20Bytecode,
                args: [tokenName, tokenSymbol, Number(tokenDecimals), supplyWithDecimals],
            })
        } catch {
            return undefined
        }
    }, [tokenName, tokenSymbol, tokenDecimals, initialSupply])

    const { data: ethBalance } = useBalance({
        address,
        query: { enabled: !!address },
    })

    const { data: gasPrice } = useGasPrice({
        query: { refetchInterval: 12_000 },
    })

    const { data: gasEstimate } = useEstimateGas({
        data: deployData,
        query: { enabled: !!deployData && !!address },
    })

    const estimatedCost = gasEstimate && gasPrice ? gasEstimate * gasPrice : undefined

    // 步骤状态
    const currentStep = contractAddress ? 2 : isDeploying || isWaiting ? 1 : 0

    function handleDeploy() {
        if (!tokenName || !tokenSymbol || !initialSupply) return
        // 使用 parseUnits 将用户输入转换为包含小数位数的实际数值
        const supplyWithDecimals = parseUnits(initialSupply, Number(tokenDecimals))
        const data = encodeDeployData({
            abi: erc20Abi,
            bytecode: erc20Bytecode,
            args: [tokenName, tokenSymbol, Number(tokenDecimals), supplyWithDecimals],
        })
        sendTransaction({ data })
    }

    function handleCopy(addr: string) {
        navigator.clipboard.writeText(addr)
        setCopied(addr)
        setTimeout(() => setCopied(null), 2000)
    }

    function handleDeleteRecord(contractAddr: string) {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }

    function handleClearHistory() {
        setHistory([])
        saveHistory([])
    }

    const steps = [
        { icon: FileText, label: "填写信息" },
        { icon: Send, label: "确认交易" },
        { icon: CheckCircle2, label: "部署完成" },
    ]

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

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题区 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">代币铸造工坊</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    在这里创建属于你自己的 ERC-20 代币，只需填写基本信息即可一键部署到区块链。
                </p>
            </div>

            {/* 两栏布局：左边创建流程 + 右边历史记录 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：创建流程 */}
                <div className="flex flex-col items-center gap-8 flex-1 min-w-0">
                    {/* 流程步骤条 */}
                    <div className="flex items-center gap-2 w-full max-w-md">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = index === currentStep
                            const isDone = index < currentStep
                            return (
                                <div key={step.label} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
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

                    {/* 代币创建表单 */}
                    <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle>代币创建</CardTitle>
                            <CardDescription>填写以下信息来创建你的 ERC-20 代币</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tokenName" className="flex items-center gap-1.5">
                                        <Type className="w-3.5 h-3.5 text-muted-foreground" />
                                        代币名称
                                    </Label>
                                    <Input
                                        id="tokenName"
                                        placeholder="例如：MyToken"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tokenSymbol" className="flex items-center gap-1.5">
                                        <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                        代币符号
                                    </Label>
                                    <Input
                                        id="tokenSymbol"
                                        placeholder="例如：MTK"
                                        value={tokenSymbol}
                                        onChange={(e) => setTokenSymbol(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tokenDecimals" className="flex items-center gap-1.5">
                                        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                                        小数位数
                                    </Label>
                                    <Input
                                        id="tokenDecimals"
                                        type="number"
                                        min="0"
                                        max="18"
                                        value={tokenDecimals}
                                        onChange={(e) => setTokenDecimals(e.target.value)}
                                    />
                                </div>
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
                                        onChange={(e) => setInitialSupply(e.target.value)}
                                    />
                                </div>
                                {deployError && (
                                    <p className="text-sm text-red-500">
                                        部署失败：{deployError.message.slice(0, 100)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleDeploy}
                                disabled={!isConnected || isDeploying || isWaiting || !tokenName || !tokenSymbol || !initialSupply}
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

                    {/* Gas 预估信息 */}
                    {isConnected && (
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
                    )}

                    {/* 部署结果卡片 */}
                    {contractAddress && (
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">合约地址</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs break-all max-w-48 text-right">
                                                {contractAddress}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(contractAddress)}
                                                className="p-1 rounded hover:bg-muted transition-colors"
                                                title="复制地址"
                                            >
                                                {copied === contractAddress
                                                    ? <Check className="w-3.5 h-3.5 text-green-500" />
                                                    : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                                }
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
                    )}
                </div>

                {/* 右栏：铸造历史记录 */}
                <div className="w-full lg:w-80 shrink-0">
                    <Card className="sticky top-6 bg-gray-900/50 border-gray-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    铸造历史
                                </CardTitle>
                                {history.length > 0 && (
                                    <button
                                        onClick={handleClearHistory}
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
                                    <p className="text-sm">创建你的第一个代币吧</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                    {history.map((record) => (
                                        <div
                                            key={record.contractAddress}
                                            className="group relative rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
                                        >
                                            <button
                                                onClick={() => handleDeleteRecord(record.contractAddress)}
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
                </div>
            </div>

            {/* 特性说明卡片组 */}
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

            {/* 注意事项 */}
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
        </div>
    )
}
