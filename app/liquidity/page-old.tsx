// "use client"

// import { useEffect, useState } from "react"
// import {
//     useAccount,
//     useBalance,
//     useSendTransaction,
//     useWaitForTransactionReceipt,
//     useReadContract,
//     useWriteContract,
//     usePublicClient,
// } from "wagmi"
// import { BaseError, encodeDeployData, formatEther, formatUnits, isAddress, maxUint256, parseEther, parseUnits } from "viem"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { wethAbi, wethBytecode } from "@/lib/WETH-contract"
// import { erc20Abi } from "@/lib/erc20-contract"
// import { uniswapV2FactoryAbil, uniswapV2Bytecode as factoryBytecode } from "@/lib/uniswapV2Factory"
// import { uniswapV2RouterAbi, uniswapV2Bytecode as routerBytecode } from "@/lib/uniswapV2Router"
// import {
//     Droplets,
//     CheckCircle2,
//     Copy,
//     Check,
//     Loader2,
//     Wallet,
//     ArrowDownUp,
//     ArrowDown,
//     ArrowUp,
//     Factory,
//     History,
//     Trash2,
//     Coins,
// } from "lucide-react"

// const WETH_STORAGE_KEY = "deployed-weth-address"
// const FACTORY_STORAGE_KEY = "deployed-factory-address"
// const ROUTER_STORAGE_KEY = "deployed-router-address"
// const HISTORY_KEY = "token-create-history"
// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// interface TokenRecord {
//     name: string
//     symbol: string
//     decimals: string
//     supply: string
//     contractAddress: string
//     createdAt: string
// }

// function loadHistory(): TokenRecord[] {
//     if (typeof window === "undefined") return []
//     try {
//         const raw = localStorage.getItem(HISTORY_KEY)
//         return raw ? JSON.parse(raw) : []
//     } catch {
//         return []
//     }
// }

// function saveHistory(records: TokenRecord[]) {
//     localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
// }

// function loadStoredAddress(key: string): string | null {
//     if (typeof window === "undefined") return null
//     return localStorage.getItem(key)
// }

// function saveStoredAddress(key: string, addr: string) {
//     localStorage.setItem(key, addr)
// }

// export default function LiquidityPage() {
//     const { address, isConnected } = useAccount()
//     const publicClient = usePublicClient()
//     const [copied, setCopied] = useState<string | null>(null)
//     const [savedWethAddress, setSavedWethAddress] = useState<string | null>(null)
//     const [isWethReset, setIsWethReset] = useState(false)
//     const [depositAmount, setDepositAmount] = useState("")
//     const [withdrawAmount, setWithdrawAmount] = useState("")
//     const [savedFactoryAddress, setSavedFactoryAddress] = useState<string | null>(null)
//     const [isFactoryReset, setIsFactoryReset] = useState(false)
//     const [feeToSetter, setFeeToSetter] = useState("")
//     const [savedRouterAddress, setSavedRouterAddress] = useState<string | null>(null)
//     const [isRouterReset, setIsRouterReset] = useState(false)
//     const [routerFactoryInput, setRouterFactoryInput] = useState("")
//     const [routerWethInput, setRouterWethInput] = useState("")
//     // 添加流动性状态
//     const [tokenA, setTokenA] = useState("")
//     const [tokenB, setTokenB] = useState("")
//     const [amountA, setAmountA] = useState("")
//     const [amountB, setAmountB] = useState("")
//     const [addLiquiditySimError, setAddLiquiditySimError] = useState<string | null>(null)
//     const [diagnosticIssues, setDiagnosticIssues] = useState<string[]>([])
//     const [history, setHistory] = useState<TokenRecord[]>([])

//     useEffect(() => {
//         setSavedWethAddress(loadStoredAddress(WETH_STORAGE_KEY))
//         setSavedFactoryAddress(loadStoredAddress(FACTORY_STORAGE_KEY))
//         setSavedRouterAddress(loadStoredAddress(ROUTER_STORAGE_KEY))
//         setHistory(loadHistory())
//     }, [])

//     useEffect(() => {
//         if (!isConnected) {
//             if (typeof window !== "undefined") {
//                 localStorage.removeItem(WETH_STORAGE_KEY)
//                 localStorage.removeItem(FACTORY_STORAGE_KEY)
//                 localStorage.removeItem(ROUTER_STORAGE_KEY)
//                 localStorage.removeItem(HISTORY_KEY)
//             }
//             setCopied(null)
//             setSavedWethAddress(null)
//             setIsWethReset(false)
//             setDepositAmount("")
//             setWithdrawAmount("")
//             setSavedFactoryAddress(null)
//             setIsFactoryReset(false)
//             setFeeToSetter("")
//             setSavedRouterAddress(null)
//             setIsRouterReset(false)
//             setRouterFactoryInput("")
//             setRouterWethInput("")
//             setTokenA("")
//             setTokenB("")
//             setAmountA("")
//             setAmountB("")
//             setHistory([])
//             setAddLiquiditySimError(null)
//             setDiagnosticIssues([])
//             return
//         }

//         setSavedWethAddress(loadStoredAddress(WETH_STORAGE_KEY))
//         setSavedFactoryAddress(loadStoredAddress(FACTORY_STORAGE_KEY))
//         setSavedRouterAddress(loadStoredAddress(ROUTER_STORAGE_KEY))
//         setHistory(loadHistory())
//     }, [isConnected])

//     // ========== WETH 部署 ==========
//     const {
//         sendTransaction: sendDeployWeth,
//         data: wethDeployHash,
//         isPending: isDeployingWeth,
//         error: wethDeployError,
//     } = useSendTransaction()

//     const { data: wethReceipt, isLoading: isWaitingWeth } = useWaitForTransactionReceipt({
//         hash: wethDeployHash,
//     })

//     const wethAddress = isWethReset ? null : (wethReceipt?.contractAddress ?? savedWethAddress)
//     const wethAddr = wethAddress as `0x${string}` | undefined

//     // 部署成功后持久化
//     useEffect(() => {
//         if (wethReceipt?.contractAddress) {
//             saveStoredAddress(WETH_STORAGE_KEY, wethReceipt.contractAddress)
//             setSavedWethAddress(wethReceipt.contractAddress)
//             setIsWethReset(false)
//         }
//     }, [wethReceipt?.contractAddress])

//     // ========== WETH 合约信息 ==========
//     const { data: wethName } = useReadContract({
//         address: wethAddr,
//         abi: wethAbi,
//         functionName: "name",
//         query: { enabled: !!wethAddr },
//     })

//     const { data: wethSymbol } = useReadContract({
//         address: wethAddr,
//         abi: wethAbi,
//         functionName: "symbol",
//         query: { enabled: !!wethAddr },
//     })

//     const { data: wethTotalSupply, refetch: refetchTotalSupply } = useReadContract({
//         address: wethAddr,
//         abi: wethAbi,
//         functionName: "totalSupply",
//         query: { enabled: !!wethAddr },
//     })

//     // 用户 WETH 余额
//     const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
//         address: wethAddr,
//         abi: wethAbi,
//         functionName: "balanceOf",
//         args: address ? [address] : undefined,
//         query: { enabled: !!wethAddr && !!address },
//     })

//     // 用户 ETH 余额
//     const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
//         address,
//         query: { enabled: !!address },
//     })

//     // ========== Deposit: ETH → WETH ==========
//     const {
//         writeContract: writeDeposit,
//         data: depositHash,
//         isPending: isDepositPending,
//         error: depositError,
//     } = useWriteContract()

//     const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
//         hash: depositHash,
//     })

//     // deposit 成功后刷新余额
//     useEffect(() => {
//         if (isDepositSuccess) {
//             refetchEthBalance()
//             refetchWethBalance()
//             refetchTotalSupply()
//             setDepositAmount("")
//         }
//     }, [isDepositSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

//     // ========== Withdraw: WETH → ETH ==========
//     const {
//         writeContract: writeWithdraw,
//         data: withdrawHash,
//         isPending: isWithdrawPending,
//         error: withdrawError,
//     } = useWriteContract()

//     const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
//         hash: withdrawHash,
//     })

//     // withdraw 成功后刷新余额
//     useEffect(() => {
//         if (isWithdrawSuccess) {
//             refetchEthBalance()
//             refetchWethBalance()
//             refetchTotalSupply()
//             setWithdrawAmount("")
//         }
//     }, [isWithdrawSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

//     // ========== Factory 部署 ==========
//     const {
//         sendTransaction: sendDeployFactory,
//         data: factoryDeployHash,
//         isPending: isDeployingFactory,
//         error: factoryDeployError,
//     } = useSendTransaction()

//     const { data: factoryReceipt, isLoading: isWaitingFactory } = useWaitForTransactionReceipt({
//         hash: factoryDeployHash,
//     })

//     const factoryAddress = isFactoryReset ? null : (factoryReceipt?.contractAddress ?? savedFactoryAddress)
//     const factoryAddr = factoryAddress as `0x${string}` | undefined

//     // 部署成功后持久化
//     useEffect(() => {
//         if (factoryReceipt?.contractAddress) {
//             saveStoredAddress(FACTORY_STORAGE_KEY, factoryReceipt.contractAddress)
//             setSavedFactoryAddress(factoryReceipt.contractAddress)
//             setIsFactoryReset(false)
//         }
//     }, [factoryReceipt?.contractAddress])

//     // 读取 Factory 合约信息
//     const { data: factoryFeeToSetter } = useReadContract({
//         address: factoryAddr,
//         abi: uniswapV2FactoryAbil,
//         functionName: "feeToSetter",
//         query: { enabled: !!factoryAddr },
//     })

//     const { data: factoryFeeTo } = useReadContract({
//         address: factoryAddr,
//         abi: uniswapV2FactoryAbil,
//         functionName: "feeTo",
//         query: { enabled: !!factoryAddr },
//     })

//     const { data: factoryPairsLength } = useReadContract({
//         address: factoryAddr,
//         abi: uniswapV2FactoryAbil,
//         functionName: "allPairsLength",
//         query: { enabled: !!factoryAddr },
//     })

//     // Router 输入框自动填充
//     useEffect(() => {
//         if (factoryAddress && !routerFactoryInput) {
//             setRouterFactoryInput(factoryAddress)
//         }
//         if (wethAddress && !routerWethInput) {
//             setRouterWethInput(wethAddress)
//         }
//     }, [factoryAddress, wethAddress]) // eslint-disable-line react-hooks/exhaustive-deps

//     // ========== Router 部署 ==========
//     const {
//         sendTransaction: sendDeployRouter,
//         data: routerDeployHash,
//         isPending: isDeployingRouter,
//         error: routerDeployError,
//     } = useSendTransaction()

//     const { data: routerReceipt, isLoading: isWaitingRouter } = useWaitForTransactionReceipt({
//         hash: routerDeployHash,
//     })

//     const routerAddress = isRouterReset ? null : (routerReceipt?.contractAddress ?? savedRouterAddress)
//     const routerAddr = routerAddress as `0x${string}` | undefined

//     // 部署成功后持久化
//     useEffect(() => {
//         if (routerReceipt?.contractAddress) {
//             saveStoredAddress(ROUTER_STORAGE_KEY, routerReceipt.contractAddress)
//             setSavedRouterAddress(routerReceipt.contractAddress)
//             setIsRouterReset(false)
//         }
//     }, [routerReceipt?.contractAddress])

//     // 读取 Router 合约信息
//     const { data: routerFactory } = useReadContract({
//         address: routerAddr,
//         abi: uniswapV2RouterAbi,
//         functionName: "factory",
//         query: { enabled: !!routerAddr },
//     })

//     const { data: routerWETH } = useReadContract({
//         address: routerAddr,
//         abi: uniswapV2RouterAbi,
//         functionName: "WETH",
//         query: { enabled: !!routerAddr },
//     })

//     // ========== Add Liquidity ==========
//     const tokenAAddr = isAddress(tokenA) ? (tokenA as `0x${string}`) : undefined
//     const tokenBAddr = isAddress(tokenB) ? (tokenB as `0x${string}`) : undefined

//     const { data: tokenADecimals } = useReadContract({
//         address: tokenAAddr,
//         abi: erc20Abi,
//         functionName: "decimals",
//         query: { enabled: !!tokenAAddr },
//     })

//     const { data: tokenBDecimals } = useReadContract({
//         address: tokenBAddr,
//         abi: erc20Abi,
//         functionName: "decimals",
//         query: { enabled: !!tokenBAddr },
//     })

//     const tokenADecimalsNumber = tokenADecimals !== undefined ? Number(tokenADecimals) : undefined
//     const tokenBDecimalsNumber = tokenBDecimals !== undefined ? Number(tokenBDecimals) : undefined

//     const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
//         address: tokenAAddr,
//         abi: erc20Abi,
//         functionName: "allowance",
//         args: address && routerAddr ? [address, routerAddr] : undefined,
//         query: { enabled: !!tokenAAddr && !!address && !!routerAddr },
//     })

//     const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
//         address: tokenBAddr,
//         abi: erc20Abi,
//         functionName: "allowance",
//         args: address && routerAddr ? [address, routerAddr] : undefined,
//         query: { enabled: !!tokenBAddr && !!address && !!routerAddr },
//     })

//     const { data: balanceA } = useReadContract({
//         address: tokenAAddr,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: address ? [address] : undefined,
//         query: { enabled: !!tokenAAddr && !!address },
//     })

//     const { data: balanceB } = useReadContract({
//         address: tokenBAddr,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: address ? [address] : undefined,
//         query: { enabled: !!tokenBAddr && !!address },
//     })

//     const {
//         writeContract: writeAddLiquidity,
//         data: addLiquidityHash,
//         isPending: isAddLiquidityPending,
//         error: addLiquidityError,
//     } = useWriteContract()

//     const { isLoading: isAddLiquidityConfirming, isSuccess: isAddLiquiditySuccess } = useWaitForTransactionReceipt({
//         hash: addLiquidityHash,
//     })

//     useEffect(() => {
//         if (isAddLiquiditySuccess) {
//             setAmountA("")
//             setAmountB("")
//         }
//     }, [isAddLiquiditySuccess])

//     const {
//         writeContract: writeApproveA,
//         data: approveAHash,
//         isPending: isApproveAPending,
//         error: approveAError,
//     } = useWriteContract()

//     const {
//         writeContract: writeApproveB,
//         data: approveBHash,
//         isPending: isApproveBPending,
//         error: approveBError,
//     } = useWriteContract()

//     const { isLoading: isApproveAConfirming, isSuccess: isApproveASuccess } = useWaitForTransactionReceipt({
//         hash: approveAHash,
//     })

//     const { isLoading: isApproveBConfirming, isSuccess: isApproveBSuccess } = useWaitForTransactionReceipt({
//         hash: approveBHash,
//     })

//     useEffect(() => {
//         if (isApproveASuccess) refetchAllowanceA()
//     }, [isApproveASuccess]) // eslint-disable-line react-hooks/exhaustive-deps

//     useEffect(() => {
//         if (isApproveBSuccess) refetchAllowanceB()
//     }, [isApproveBSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

//     // ========== Handlers ==========
//     function parseTokenAmount(amount: string, decimals: number | undefined) {
//         if (!amount) return null
//         try {
//             return parseUnits(amount, decimals ?? 18)
//         } catch {
//             return null
//         }
//     }

//     function formatViemError(err: unknown) {
//         if (err instanceof BaseError) {
//             // 尝试提取更详细的错误信息
//             const fullMessage = err.message || err.shortMessage
//             // 如果有具体的 revert reason，显示它
//             if (err.cause && typeof err.cause === "object" && "reason" in err.cause) {
//                 return `${err.shortMessage || "交易失败"}\n原因: ${err.cause.reason}`
//             }
//             return fullMessage
//         }
//         if (err && typeof err === "object" && "message" in err && typeof err.message === "string") return err.message
//         return "交易模拟失败"
//     }

//     async function handleAddLiquidity() {
//         if (!routerAddr || !tokenAAddr || !tokenBAddr || !amountA || !amountB || !address) return
//         const parsedA = parseTokenAmount(amountA, tokenADecimalsNumber)
//         const parsedB = parseTokenAmount(amountB, tokenBDecimalsNumber)
//         if (parsedA === null || parsedB === null) return
//         const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

//         if (publicClient) {
//             try {
//                 // 详细的预检查
//                 console.log("=== 添加流动性预检查 ===")
//                 console.log("Router:", routerAddr)
//                 console.log("Token A:", tokenAAddr, "Amount:", parsedA.toString())
//                 console.log("Token B:", tokenBAddr, "Amount:", parsedB.toString())
//                 console.log("User:", address)

//                 // 检查授权
//                 const allowanceAResult = await publicClient.readContract({
//                     address: tokenAAddr,
//                     abi: erc20Abi,
//                     functionName: "allowance",
//                     args: [address, routerAddr],
//                 })
//                 console.log("Token A Allowance:", allowanceAResult.toString())
//                 if (allowanceAResult < parsedA) {
//                     console.error("❌ Token A 授权不足!")
//                     setAddLiquiditySimError(`Token A 授权不足: 需要 ${parsedA.toString()}, 实际 ${allowanceAResult.toString()}`)
//                     return
//                 }

//                 const allowanceBResult = await publicClient.readContract({
//                     address: tokenBAddr,
//                     abi: erc20Abi,
//                     functionName: "allowance",
//                     args: [address, routerAddr],
//                 })
//                 console.log("Token B Allowance:", allowanceBResult.toString())
//                 if (allowanceBResult < parsedB) {
//                     console.error("❌ Token B 授权不足!")
//                     setAddLiquiditySimError(`Token B 授权不足: 需要 ${parsedB.toString()}, 实际 ${allowanceBResult.toString()}`)
//                     return
//                 }

//                 // 检查余额
//                 const balanceAResult = await publicClient.readContract({
//                     address: tokenAAddr,
//                     abi: erc20Abi,
//                     functionName: "balanceOf",
//                     args: [address],
//                 })
//                 console.log("Token A Balance:", balanceAResult.toString())
//                 if (balanceAResult < parsedA) {
//                     console.error("❌ Token A 余额不足!")
//                     setAddLiquiditySimError(`Token A 余额不足: 需要 ${parsedA.toString()}, 实际 ${balanceAResult.toString()}`)
//                     return
//                 }

//                 const balanceBResult = await publicClient.readContract({
//                     address: tokenBAddr,
//                     abi: erc20Abi,
//                     functionName: "balanceOf",
//                     args: [address],
//                 })
//                 console.log("Token B Balance:", balanceBResult.toString())
//                 if (balanceBResult < parsedB) {
//                     console.error("❌ Token B 余额不足!")
//                     setAddLiquiditySimError(`Token B 余额不足: 需要 ${parsedB.toString()}, 实际 ${balanceBResult.toString()}`)
//                     return
//                 }

//                 // 检查 Router 合约是否存在
//                 const routerCode = await publicClient.getBytecode({ address: routerAddr })
//                 if (!routerCode || routerCode === '0x') {
//                     console.error("❌ Router 地址没有合约代码!")
//                     setAddLiquiditySimError(`Router 地址 ${routerAddr} 不是有效的合约！请重置并重新部署 Router。`)
//                     return
//                 }
//                 console.log("✓ Router 合约存在")

//                 // 检查 Router 配置
//                 const routerFactoryAddr = await publicClient.readContract({
//                     address: routerAddr,
//                     abi: uniswapV2RouterAbi,
//                     functionName: "factory",
//                 })
//                 console.log("Router Factory:", routerFactoryAddr)

//                 const routerWethAddr = await publicClient.readContract({
//                     address: routerAddr,
//                     abi: uniswapV2RouterAbi,
//                     functionName: "WETH",
//                 })
//                 console.log("Router WETH:", routerWethAddr)

//                 if (factoryAddress && (routerFactoryAddr as string).toLowerCase() !== factoryAddress.toLowerCase()) {
//                     console.error("❌ Router Factory 地址不匹配!")
//                     setAddLiquiditySimError(`Router Factory 地址不匹配: Router=${routerFactoryAddr}, 期望=${factoryAddress}`)
//                     return
//                 }

//                 if (wethAddress && (routerWethAddr as string).toLowerCase() !== wethAddress.toLowerCase()) {
//                     console.error("❌ Router WETH 地址不匹配!")
//                     setAddLiquiditySimError(`Router WETH 地址不匹配: Router=${routerWethAddr}, 期望=${wethAddress}`)
//                     return
//                 }

//                 // 检查交易对是否存在
//                 try {
//                     const pairAddress = await publicClient.readContract({
//                         address: factoryAddress as `0x${string}`,
//                         abi: uniswapV2FactoryAbil,
//                         functionName: "getPair",
//                         args: [tokenAAddr, tokenBAddr],
//                     }) as string
//                     console.log("交易对地址:", pairAddress)
//                     if (pairAddress === ZERO_ADDRESS) {
//                         console.log("⚠️ 交易对不存在，将自动创建")

//                         // 测试 Factory 的 createPair 功能
//                         console.log("测试 Factory createPair 功能...")
//                         try {
//                             await publicClient.simulateContract({
//                                 address: factoryAddress as `0x${string}`,
//                                 abi: uniswapV2FactoryAbil,
//                                 functionName: "createPair",
//                                 args: [tokenAAddr, tokenBAddr],
//                                 account: address,
//                             })
//                             console.log("✓ Factory createPair 测试成功")
//                         } catch (e) {
//                             console.error("❌ Factory createPair 测试失败:", e)
//                             setAddLiquiditySimError(`Factory 无法创建交易对: ${e instanceof Error ? e.message : String(e)}`)
//                             return
//                         }
//                     } else {
//                         console.log("✓ 交易对已存在")
//                     }
//                 } catch (e) {
//                     console.error("无法查询交易对:", e)
//                 }

//                 // 测试 token transferFrom (Router 使用的是 transferFrom 而不是 transfer)
//                 console.log("测试 Token A 的 transferFrom 功能...")
//                 try {
//                     // 模拟 Router 调用 transferFrom
//                     await publicClient.simulateContract({
//                         address: tokenAAddr,
//                         abi: erc20Abi,
//                         functionName: "transferFrom",
//                         args: [address, routerAddr, parsedA],
//                         account: routerAddr, // 从 Router 的角度调用
//                     })
//                     console.log("✓ Token A transferFrom 测试成功")
//                 } catch (e) {
//                     console.error("❌ Token A transferFrom 测试失败:", e)
//                     console.log("尝试使用用户身份测试 transferFrom...")
//                     try {
//                         await publicClient.simulateContract({
//                             address: tokenAAddr,
//                             abi: erc20Abi,
//                             functionName: "transfer",
//                             args: [routerAddr, parsedA],
//                             account: address,
//                         })
//                         console.log("✓ Token A transfer (用户身份) 测试成功")
//                     } catch (e2) {
//                         console.error("❌ Token A transfer (用户身份) 也失败:", e2)
//                         setAddLiquiditySimError(`Token A 无法转账: ${e instanceof Error ? e.message : String(e)}`)
//                         return
//                     }
//                 }

//                 console.log("测试 Token B 的 transferFrom 功能...")
//                 try {
//                     await publicClient.simulateContract({
//                         address: tokenBAddr,
//                         abi: erc20Abi,
//                         functionName: "transferFrom",
//                         args: [address, routerAddr, parsedB],
//                         account: routerAddr,
//                     })
//                     console.log("✓ Token B transferFrom 测试成功")
//                 } catch (e) {
//                     console.error("❌ Token B transferFrom 测试失败:", e)
//                     console.log("尝试使用用户身份测试 transferFrom...")
//                     try {
//                         await publicClient.simulateContract({
//                             address: tokenBAddr,
//                             abi: erc20Abi,
//                             functionName: "transfer",
//                             args: [routerAddr, parsedB],
//                             account: address,
//                         })
//                         console.log("✓ Token B transfer (用户身份) 测试成功")
//                     } catch (e2) {
//                         console.error("❌ Token B transfer (用户身份) 也失败:", e2)
//                         setAddLiquiditySimError(`Token B 无法转账: ${e instanceof Error ? e.message : String(e)}`)
//                         return
//                     }
//                 }

//                 // 模拟交易
//                 console.log("开始模拟交易...")
//                 await publicClient.simulateContract({
//                     address: routerAddr,
//                     abi: uniswapV2RouterAbi,
//                     functionName: "addLiquidity",
//                     args: [
//                         tokenAAddr,
//                         tokenBAddr,
//                         parsedA,
//                         parsedB,
//                         BigInt(0),
//                         BigInt(0),
//                         address,
//                         BigInt(deadline),
//                     ],
//                     account: address,
//                 })
//                 console.log("模拟成功!")
//                 setAddLiquiditySimError(null)
//             } catch (err) {
//                 console.error("模拟失败:", err)
//                 const errorMsg = formatViemError(err)
//                 console.error("错误信息:", errorMsg)
//                 setAddLiquiditySimError(errorMsg)
//                 return
//             }
//         }
//         writeAddLiquidity({
//             address: routerAddr,
//             abi: uniswapV2RouterAbi,
//             functionName: "addLiquidity",
//             args: [
//                 tokenAAddr,
//                 tokenBAddr,
//                 parsedA,
//                 parsedB,
//                 BigInt(0), // amountAMin: 0 for now (no slippage protection)
//                 BigInt(0), // amountBMin: 0 for now
//                 address,
//                 BigInt(deadline),
//             ],
//         })
//     }


//     function handleApproveTokenA() {
//         if (!tokenAAddr || !routerAddr) return
//         writeApproveA({
//             address: tokenAAddr,
//             abi: erc20Abi,
//             functionName: "approve",
//             args: [routerAddr, maxUint256],
//         })
//     }

//     function handleApproveTokenB() {
//         if (!tokenBAddr || !routerAddr) return
//         writeApproveB({
//             address: tokenBAddr,
//             abi: erc20Abi,
//             functionName: "approve",
//             args: [routerAddr, maxUint256],
//         })
//     }
//     function handleDeployRouter() {
//         const factory = routerFactoryInput.trim()
//         const weth = routerWethInput.trim()
//         if (!factory || !weth) return

//         // 验证地址是否与当前部署的 Factory 和 WETH 一致
//         if (factoryAddress && factory.toLowerCase() !== factoryAddress.toLowerCase()) {
//             alert(`警告：输入的 Factory 地址 (${factory}) 与当前部署的 Factory 地址 (${factoryAddress}) 不一致！这将导致添加流动性失败。请使用当前部署的地址。`)
//             return
//         }
//         if (wethAddress && weth.toLowerCase() !== wethAddress.toLowerCase()) {
//             alert(`警告：输入的 WETH 地址 (${weth}) 与当前部署的 WETH 地址 (${wethAddress}) 不一致！这将导致添加流动性失败。请使用当前部署的地址。`)
//             return
//         }

//         const data = encodeDeployData({
//             abi: uniswapV2RouterAbi,
//             bytecode: routerBytecode,
//             args: [factory, weth],
//         })
//         sendDeployRouter({ data })
//     }

//     function handleDeployFactory() {
//         const setter = feeToSetter.trim() || address
//         if (!setter) return
//         const data = encodeDeployData({
//             abi: uniswapV2FactoryAbil,
//             bytecode: factoryBytecode,
//             args: [setter],
//         })
//         sendDeployFactory({ data })
//     }

//     function handleDeployWeth() {
//         sendDeployWeth({ data: wethBytecode })
//     }

//     function handleDeposit() {
//         if (!wethAddr || !depositAmount) return
//         writeDeposit({
//             address: wethAddr,
//             abi: wethAbi,
//             functionName: "deposit",
//             value: parseEther(depositAmount),
//         })
//     }

//     function handleWithdraw() {
//         if (!wethAddr || !withdrawAmount) return
//         writeWithdraw({
//             address: wethAddr,
//             abi: wethAbi,
//             functionName: "withdraw",
//             args: [parseEther(withdrawAmount)],
//         })
//     }

//     function handleCopy(text: string) {
//         navigator.clipboard.writeText(text)
//         setCopied(text)
//         setTimeout(() => setCopied(null), 2000)
//     }

//     function handleDeleteRecord(contractAddress: string) {
//         setHistory((prev) => {
//             const next = prev.filter((item) => item.contractAddress !== contractAddress)
//             saveHistory(next)
//             return next
//         })
//     }

//     function handleClearHistory() {
//         setHistory([])
//         saveHistory([])
//     }

//     function handleResetAddress(key: string, setSaved: (v: null) => void, setReset: (v: boolean) => void) {
//         localStorage.removeItem(key)
//         setSaved(null)
//         setReset(true)
//     }

//     function handleMaxDeposit() {
//         if (ethBalance) {
//             // 留一点 gas 费
//             const max = ethBalance.value > parseEther("0.01")
//                 ? ethBalance.value - parseEther("0.01")
//                 : ethBalance.value
//             setDepositAmount(formatEther(max))
//         }
//     }

//     function handleMaxWithdraw() {
//         if (wethBalance !== undefined) {
//             setWithdrawAmount(formatEther(wethBalance as bigint))
//         }
//     }

//     function formatAllowance(
//         value: bigint | undefined,
//         decimals: number | undefined,
//         fallbackLabel: string,
//     ) {
//         if (value === undefined) return "0"
//         if (decimals === undefined) return fallbackLabel
//         return formatUnits(value, decimals)
//     }

//     function formatBalance(value: bigint | undefined, decimals: number | undefined) {
//         if (value === undefined) return "0"
//         if (decimals === undefined) return "未知"
//         return formatUnits(value, decimals)
//     }

//     const parsedAmountA = parseTokenAmount(amountA, tokenADecimalsNumber)
//     const parsedAmountB = parseTokenAmount(amountB, tokenBDecimalsNumber)
//     const isAllowanceAEnough =
//         parsedAmountA !== null && allowanceA !== undefined && allowanceA >= parsedAmountA
//     const isAllowanceBEnough =
//         parsedAmountB !== null && allowanceB !== undefined && allowanceB >= parsedAmountB
//     const isBalanceAEnough =
//         parsedAmountA !== null && balanceA !== undefined && balanceA >= parsedAmountA
//     const isBalanceBEnough =
//         parsedAmountB !== null && balanceB !== undefined && balanceB >= parsedAmountB

//     const isApproveABusy = isApproveAPending || isApproveAConfirming
//     const isApproveBBusy = isApproveBPending || isApproveBConfirming

//     const isDepositBusy = isDepositPending || isDepositConfirming
//     const isWithdrawBusy = isWithdrawPending || isWithdrawConfirming

//     useEffect(() => {
//         let cancelled = false
//         async function runDiagnostics() {
//             const issues: string[] = []

//             if (!routerAddr) issues.push("Router 地址未设置")
//             if (!tokenAAddr) issues.push("Token A 地址无效")
//             if (!tokenBAddr) issues.push("Token B 地址无效")
//             if (tokenAAddr && tokenBAddr && tokenAAddr.toLowerCase() === tokenBAddr.toLowerCase()) {
//                 issues.push("Token A 和 Token B 地址相同")
//             }
//             if (routerFactory && factoryAddress && (routerFactory as string).toLowerCase() !== factoryAddress.toLowerCase()) {
//                 issues.push("Router 的 factory 与当前 Factory 地址不一致")
//             }
//             if (routerWETH && wethAddress && (routerWETH as string).toLowerCase() !== wethAddress.toLowerCase()) {
//                 issues.push("Router 的 WETH 与当前 WETH 地址不一致")
//             }
//             if (amountA && !isBalanceAEnough) issues.push("Token A 余额不足")
//             if (amountB && !isBalanceBEnough) issues.push("Token B 余额不足")
//             if (amountA && !isAllowanceAEnough) issues.push("Token A 授权不足")
//             if (amountB && !isAllowanceBEnough) issues.push("Token B 授权不足")

//             if (publicClient) {
//                 if (tokenAAddr) {
//                     const codeA = await publicClient.getBytecode({ address: tokenAAddr })
//                     if (!codeA) issues.push("Token A 地址没有合约代码")
//                 }
//                 if (tokenBAddr) {
//                     const codeB = await publicClient.getBytecode({ address: tokenBAddr })
//                     if (!codeB) issues.push("Token B 地址没有合约代码")
//                 }
//                 if (factoryAddress && tokenAAddr && tokenBAddr) {
//                     try {
//                         const pairAddress = await publicClient.readContract({
//                             address: factoryAddress,
//                             abi: uniswapV2FactoryAbil,
//                             functionName: "getPair",
//                             args: [tokenAAddr, tokenBAddr],
//                         }) as string
//                         if (pairAddress === ZERO_ADDRESS) {
//                             issues.push("提示：当前交易对不存在，添加时会自动创建")
//                         } else {
//                             const pairCode = await publicClient.getBytecode({ address: pairAddress })
//                             if (!pairCode) issues.push("Pair 地址没有合约代码")
//                         }
//                     } catch {
//                         issues.push("无法读取 Factory 的交易对信息")
//                     }
//                 }
//             }

//             if (!cancelled) setDiagnosticIssues(issues)
//         }

//         runDiagnostics()
//         return () => {
//             cancelled = true
//         }
//     }, [
//         publicClient,
//         routerAddr,
//         tokenAAddr,
//         tokenBAddr,
//         factoryAddress,
//         wethAddress,
//         routerFactory,
//         routerWETH,
//         amountA,
//         amountB,
//         isBalanceAEnough,
//         isBalanceBEnough,
//         isAllowanceAEnough,
//         isAllowanceBEnough,
//     ])

//     return (
//         <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto">
//             {/* 页面标题 */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
//                     <Droplets className="w-8 h-8" />
//                     添加流动性
//                 </h1>
//                 <p className="text-muted-foreground max-w-lg mx-auto">
//                     在本地链上部署 Uniswap V2 合约基础设施，然后为代币对添加流动性。
//                 </p>
//             </div>

//             {/* 两栏布局：左边流程 + 右边铸造历史 */}
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* 左栏：流程 */}
//                 <div className="flex flex-col items-center gap-8 flex-1 min-w-0">
//                     {/* 部署进度总览 */}
//                     <div className="flex items-center gap-3 w-full max-w-md">
//                         <StepBadge step={1} label="WETH" done={!!wethAddress} active={!wethAddress} />
//                         <div className={`h-0.5 flex-1 ${wethAddress ? "bg-primary" : "bg-muted"}`} />
//                         <StepBadge step={2} label="Factory" done={!!factoryAddress} active={!!wethAddress && !factoryAddress} />
//                         <div className={`h-0.5 flex-1 ${factoryAddress ? "bg-primary" : "bg-muted"}`} />
//                         <StepBadge step={3} label="Router" done={!!factoryAddress && !!routerAddress} active={!!factoryAddress && !routerAddress} />
//                     </div>

//                     {/* 部署流程 */}
//                     <div className="w-full flex flex-col gap-8 items-center">
//                         {/* 第一步：部署 WETH */}
//                         <Card className="w-full max-w-sm">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     {wethAddress
//                                         ? <CheckCircle2 className="w-5 h-5 text-green-500" />
//                                         : <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
//                                     }
//                                     部署 WETH 合约
//                                 </CardTitle>
//                                 <CardDescription>
//                                     WETH（Wrapped Ether）是 ETH 的 ERC-20 包装版本，Router 合约需要它来处理 ETH 交易。
//                                 </CardDescription>
//                             </CardHeader>

//                             {wethAddress ? (
//                                 <CardContent>
//                                     <div className="flex flex-col gap-3 text-sm">
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-muted-foreground">合约地址</span>
//                                             <div className="flex items-center gap-1.5">
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {wethAddress}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleCopy(wethAddress)}
//                                                     className="p-1 rounded hover:bg-muted transition-colors"
//                                                     title="复制地址"
//                                                 >
//                                                     {copied === wethAddress
//                                                         ? <Check className="w-3.5 h-3.5 text-green-500" />
//                                                         : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
//                                                     }
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         {(wethName as string) && (
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground">名称</span>
//                                                 <span>{wethName as string}</span>
//                                             </div>
//                                         )}
//                                         {(wethSymbol as string) && (
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground">符号</span>
//                                                 <span>{wethSymbol as string}</span>
//                                             </div>
//                                         )}
//                                         {wethTotalSupply !== undefined && (
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground">总供应量</span>
//                                                 <span className="font-mono">{formatEther(wethTotalSupply as bigint)} WETH</span>
//                                             </div>
//                                         )}

//                                         {/* 余额区域 */}
//                                         <div className="border-t pt-3 mt-1 flex flex-col gap-2">
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground flex items-center gap-1">
//                                                     <Wallet className="w-3.5 h-3.5" />
//                                                     ETH 余额
//                                                 </span>
//                                                 <span className="font-mono font-semibold">
//                                                     {ethBalance
//                                                         ? `${parseFloat(formatEther(ethBalance.value)).toFixed(6)} ETH`
//                                                         : "—"}
//                                                 </span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground flex items-center gap-1">
//                                                     <ArrowDownUp className="w-3.5 h-3.5" />
//                                                     WETH 余额
//                                                 </span>
//                                                 <span className="font-mono font-semibold">
//                                                     {wethBalance !== undefined
//                                                         ? `${parseFloat(formatEther(wethBalance as bigint)).toFixed(6)} WETH`
//                                                         : "—"}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Deposit: ETH → WETH */}
//                                         <div className="border-t pt-3 mt-1">
//                                             <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
//                                                 <ArrowDown className="w-4 h-4 text-green-500" />
//                                                 存入 ETH → 获得 WETH
//                                             </div>
//                                             <div className="flex gap-2">
//                                                 <div className="relative flex-1">
//                                                     <Input
//                                                         type="number"
//                                                         placeholder="ETH 数量"
//                                                         value={depositAmount}
//                                                         onChange={(e) => setDepositAmount(e.target.value)}
//                                                         min="0"
//                                                         step="0.01"
//                                                     />
//                                                     <button
//                                                         onClick={handleMaxDeposit}
//                                                         className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
//                                                     >
//                                                         MAX
//                                                     </button>
//                                                 </div>
//                                                 <Button
//                                                     onClick={handleDeposit}
//                                                     disabled={!depositAmount || isDepositBusy || parseFloat(depositAmount) <= 0}
//                                                     className="shrink-0"
//                                                 >
//                                                     {isDepositBusy
//                                                         ? <Loader2 className="w-4 h-4 animate-spin" />
//                                                         : "存入"}
//                                                 </Button>
//                                             </div>
//                                             {depositError && (
//                                                 <p className="text-xs text-red-500 mt-1">
//                                                     {depositError.message.slice(0, 80)}
//                                                 </p>
//                                             )}
//                                             {isDepositSuccess && !isDepositBusy && (
//                                                 <p className="text-xs text-green-600 mt-1">存入成功</p>
//                                             )}
//                                         </div>

//                                         {/* Withdraw: WETH → ETH */}
//                                         <div className="border-t pt-3 mt-1">
//                                             <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
//                                                 <ArrowUp className="w-4 h-4 text-blue-500" />
//                                                 取出 WETH → 获得 ETH
//                                             </div>
//                                             <div className="flex gap-2">
//                                                 <div className="relative flex-1">
//                                                     <Input
//                                                         type="number"
//                                                         placeholder="WETH 数量"
//                                                         value={withdrawAmount}
//                                                         onChange={(e) => setWithdrawAmount(e.target.value)}
//                                                         min="0"
//                                                         step="0.01"
//                                                     />
//                                                     <button
//                                                         onClick={handleMaxWithdraw}
//                                                         className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
//                                                     >
//                                                         MAX
//                                                     </button>
//                                                 </div>
//                                                 <Button
//                                                     onClick={handleWithdraw}
//                                                     disabled={!withdrawAmount || isWithdrawBusy || parseFloat(withdrawAmount) <= 0}
//                                                     variant="outline"
//                                                     className="shrink-0"
//                                                 >
//                                                     {isWithdrawBusy
//                                                         ? <Loader2 className="w-4 h-4 animate-spin" />
//                                                         : "取出"}
//                                                 </Button>
//                                             </div>
//                                             {withdrawError && (
//                                                 <p className="text-xs text-red-500 mt-1">
//                                                     {withdrawError.message.slice(0, 80)}
//                                                 </p>
//                                             )}
//                                             {isWithdrawSuccess && !isWithdrawBusy && (
//                                                 <p className="text-xs text-green-600 mt-1">取出成功</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             ) : (
//                                 <>
//                                     <CardContent>
//                                         <p className="text-sm text-muted-foreground">
//                                             WETH 合约无需构造参数，点击下方按钮即可直接部署。部署后地址会自动保存到本地。
//                                         </p>
//                                         {wethDeployError && (
//                                             <p className="text-sm text-red-500 mt-3">
//                                                 部署失败：{wethDeployError.message.slice(0, 100)}
//                                             </p>
//                                         )}
//                                     </CardContent>
//                                     <CardFooter>
//                                         <Button
//                                             className="w-full"
//                                             onClick={handleDeployWeth}
//                                             disabled={!isConnected || isDeployingWeth || isWaitingWeth}
//                                         >
//                                             {!isConnected
//                                                 ? "请先连接钱包"
//                                                 : isDeployingWeth
//                                                     ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
//                                                     : isWaitingWeth
//                                                         ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
//                                                         : "部署 WETH"}
//                                         </Button>
//                                     </CardFooter>
//                                 </>
//                             )}

//                             {/* 已部署时显示重置按钮 */}
//                             {wethAddress && (
//                                 <CardFooter className="flex justify-between">
//                                     <span className="text-xs text-green-600 font-medium">已部署</span>
//                                     <button
//                                         onClick={() => handleResetAddress(WETH_STORAGE_KEY, setSavedWethAddress, setIsWethReset)}
//                                         className="text-xs text-muted-foreground hover:text-destructive transition-colors"
//                                     >
//                                         重置地址
//                                     </button>
//                                 </CardFooter>
//                             )}
//                         </Card>

//                         {/* 第二步：部署 Factory */}
//                         <Card className={`w-full max-w-sm ${!wethAddress ? "opacity-50" : ""}`}>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     {factoryAddress
//                                         ? <CheckCircle2 className="w-5 h-5 text-green-500" />
//                                         : <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${wethAddress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</span>
//                                     }
//                                     部署 Factory 合约
//                                 </CardTitle>
//                                 <CardDescription>
//                                     Uniswap V2 Factory 用于创建交易对。需要传入 feeToSetter 地址（有权设置手续费接收地址的管理员）。
//                                 </CardDescription>
//                             </CardHeader>

//                             {factoryAddress ? (
//                                 <CardContent>
//                                     <div className="flex flex-col gap-3 text-sm">
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-muted-foreground">合约地址</span>
//                                             <div className="flex items-center gap-1.5">
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {factoryAddress}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleCopy(factoryAddress)}
//                                                     className="p-1 rounded hover:bg-muted transition-colors"
//                                                     title="复制地址"
//                                                 >
//                                                     {copied === factoryAddress
//                                                         ? <Check className="w-3.5 h-3.5 text-green-500" />
//                                                         : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
//                                                     }
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         {(factoryFeeToSetter as string) && (
//                                             <div className="flex justify-between items-start">
//                                                 <span className="text-muted-foreground">feeToSetter</span>
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {factoryFeeToSetter as string}
//                                                 </span>
//                                             </div>
//                                         )}
//                                         {factoryFeeTo !== undefined && (
//                                             <div className="flex justify-between items-start">
//                                                 <span className="text-muted-foreground">feeTo</span>
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {(factoryFeeTo as string) === "0x0000000000000000000000000000000000000000"
//                                                         ? "未设置"
//                                                         : factoryFeeTo as string}
//                                                 </span>
//                                             </div>
//                                         )}
//                                         {factoryPairsLength !== undefined && (
//                                             <div className="flex justify-between">
//                                                 <span className="text-muted-foreground">交易对数量</span>
//                                                 <span className="font-mono">{(factoryPairsLength as bigint).toString()}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             ) : (
//                                 <>
//                                     <CardContent>
//                                         <div className="flex flex-col gap-3">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="feeToSetter" className="flex items-center gap-1.5 text-sm">
//                                                     <Factory className="w-3.5 h-3.5 text-muted-foreground" />
//                                                     feeToSetter 地址
//                                                 </Label>
//                                                 <Input
//                                                     id="feeToSetter"
//                                                     placeholder={address || "0x..."}
//                                                     value={feeToSetter}
//                                                     onChange={(e) => setFeeToSetter(e.target.value)}
//                                                     disabled={!wethAddress}
//                                                 />
//                                                 <p className="text-xs text-muted-foreground">
//                                                     留空则默认使用当前钱包地址作为 feeToSetter。
//                                                 </p>
//                                             </div>
//                                             {factoryDeployError && (
//                                                 <p className="text-sm text-red-500">
//                                                     部署失败：{factoryDeployError.message.slice(0, 100)}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter>
//                                         <Button
//                                             className="w-full"
//                                             onClick={handleDeployFactory}
//                                             disabled={!isConnected || !wethAddress || isDeployingFactory || isWaitingFactory}
//                                         >
//                                             {!wethAddress
//                                                 ? "请先部署 WETH"
//                                                 : !isConnected
//                                                     ? "请先连接钱包"
//                                                     : isDeployingFactory
//                                                         ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
//                                                         : isWaitingFactory
//                                                             ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
//                                                             : "部署 Factory"}
//                                         </Button>
//                                     </CardFooter>
//                                 </>
//                             )}

//                             {factoryAddress && (
//                                 <CardFooter className="flex justify-between">
//                                     <span className="text-xs text-green-600 font-medium">已部署</span>
//                                     <button
//                                         onClick={() => handleResetAddress(FACTORY_STORAGE_KEY, setSavedFactoryAddress, setIsFactoryReset)}
//                                         className="text-xs text-muted-foreground hover:text-destructive transition-colors"
//                                     >
//                                         重置地址
//                                     </button>
//                                 </CardFooter>
//                             )}
//                         </Card>

//                         {/* 第三步：部署 Router */}
//                         <Card className={`w-full max-w-sm ${!factoryAddress ? "opacity-50" : ""}`}>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     {routerAddress
//                                         ? <CheckCircle2 className="w-5 h-5 text-green-500" />
//                                         : <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${factoryAddress ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>3</span>
//                                     }
//                                     部署 Router 合约
//                                 </CardTitle>
//                                 <CardDescription>
//                                     Router 合约需要 Factory 地址和 WETH 地址，用于执行代币兑换和添加流动性。
//                                 </CardDescription>
//                             </CardHeader>

//                             {routerAddress ? (
//                                 <CardContent>
//                                     <div className="flex flex-col gap-3 text-sm">
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-muted-foreground">合约地址</span>
//                                             <div className="flex items-center gap-1.5">
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {routerAddress}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleCopy(routerAddress)}
//                                                     className="p-1 rounded hover:bg-muted transition-colors"
//                                                     title="复制地址"
//                                                 >
//                                                     {copied === routerAddress
//                                                         ? <Check className="w-3.5 h-3.5 text-green-500" />
//                                                         : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
//                                                     }
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         {(routerFactory as string) && (
//                                             <div className="flex justify-between items-start">
//                                                 <span className="text-muted-foreground">Factory</span>
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {routerFactory as string}
//                                                 </span>
//                                             </div>
//                                         )}
//                                         {(routerWETH as string) && (
//                                             <div className="flex justify-between items-start">
//                                                 <span className="text-muted-foreground">WETH</span>
//                                                 <span className="font-mono text-xs break-all max-w-48 text-right">
//                                                     {routerWETH as string}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             ) : (
//                                 <>
//                                     <CardContent>
//                                         <div className="flex flex-col gap-3">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="routerFactory" className="text-sm">
//                                                     Factory 地址
//                                                 </Label>
//                                                 <Input
//                                                     id="routerFactory"
//                                                     placeholder="0x..."
//                                                     value={routerFactoryInput}
//                                                     onChange={(e) => setRouterFactoryInput(e.target.value)}
//                                                     disabled={!factoryAddress}
//                                                     className={
//                                                         routerFactoryInput &&
//                                                         factoryAddress &&
//                                                         routerFactoryInput.toLowerCase() !== factoryAddress.toLowerCase()
//                                                             ? "border-red-500"
//                                                             : ""
//                                                     }
//                                                 />
//                                                 {routerFactoryInput &&
//                                                     factoryAddress &&
//                                                     routerFactoryInput.toLowerCase() !== factoryAddress.toLowerCase() && (
//                                                         <p className="text-xs text-red-500">
//                                                             ⚠️ 与当前 Factory 地址不一致，可能导致添加流动性失败
//                                                         </p>
//                                                     )}
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="routerWeth" className="text-sm">
//                                                     WETH 地址
//                                                 </Label>
//                                                 <Input
//                                                     id="routerWeth"
//                                                     placeholder="0x..."
//                                                     value={routerWethInput}
//                                                     onChange={(e) => setRouterWethInput(e.target.value)}
//                                                     disabled={!factoryAddress}
//                                                     className={
//                                                         routerWethInput &&
//                                                         wethAddress &&
//                                                         routerWethInput.toLowerCase() !== wethAddress.toLowerCase()
//                                                             ? "border-red-500"
//                                                             : ""
//                                                     }
//                                                 />
//                                                 {routerWethInput &&
//                                                     wethAddress &&
//                                                     routerWethInput.toLowerCase() !== wethAddress.toLowerCase() && (
//                                                         <p className="text-xs text-red-500">
//                                                             ⚠️ 与当前 WETH 地址不一致，可能导致添加流动性失败
//                                                         </p>
//                                                     )}
//                                             </div>
//                                             <p className="text-xs text-muted-foreground">
//                                                 地址会自动填充前面部署的合约。<strong className="text-foreground">请勿手动修改</strong>，否则会导致添加流动性失败。
//                                             </p>
//                                             {routerDeployError && (
//                                                 <p className="text-sm text-red-500">
//                                                     部署失败：{routerDeployError.message.slice(0, 100)}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </CardContent>
//                                     <CardFooter>
//                                         <Button
//                                             className="w-full"
//                                             onClick={handleDeployRouter}
//                                             disabled={!isConnected || !factoryAddress || isDeployingRouter || isWaitingRouter || !routerFactoryInput || !routerWethInput}
//                                         >
//                                             {!factoryAddress
//                                                 ? "请先部署 Factory"
//                                                 : !isConnected
//                                                     ? "请先连接钱包"
//                                                     : isDeployingRouter
//                                                         ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />确认交易中...</>
//                                                         : isWaitingRouter
//                                                             ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />部署中...</>
//                                                             : "部署 Router"}
//                                         </Button>
//                                     </CardFooter>
//                                 </>
//                             )}

//                             {routerAddress && (
//                                 <CardFooter className="flex justify-between">
//                                     <span className="text-xs text-green-600 font-medium">已部署</span>
//                                     <button
//                                         onClick={() => handleResetAddress(ROUTER_STORAGE_KEY, setSavedRouterAddress, setIsRouterReset)}
//                                         className="text-xs text-muted-foreground hover:text-destructive transition-colors"
//                                     >
//                                         重置地址
//                                     </button>
//                                 </CardFooter>
//                             )}
//                         </Card>

//                         {/* 添加流动性卡片 - 仅在 Router 部署成功后显示 */}
//                         {routerAddress && (
//                             <Card className="w-full max-w-md border-green-500/20">
//                                 <CardHeader>
//                                     <CardTitle className="flex items-center gap-2">
//                                         <Droplets className="w-5 h-5 text-blue-500" />
//                                         添加流动性
//                                     </CardTitle>
//                                     <CardDescription>
//                                         为代币对添加流动性，成为 LP（流动性提供者）。
//                                     </CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     {/* Router 地址不一致警告 */}
//                                     {((routerFactory && factoryAddress && (routerFactory as string).toLowerCase() !== factoryAddress.toLowerCase()) ||
//                                       (routerWETH && wethAddress && (routerWETH as string).toLowerCase() !== wethAddress.toLowerCase())) && (
//                                         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                                             <div className="flex items-start gap-2">
//                                                 <span className="text-red-600 font-semibold text-sm">⚠️ 配置错误</span>
//                                             </div>
//                                             <p className="text-xs text-red-600 mt-1">
//                                                 Router 合约的 Factory 或 WETH 地址与当前部署的地址不一致。
//                                                 请点击 Router 卡片下方的"重置地址"按钮，然后重新部署 Router。
//                                             </p>
//                                             {routerFactory && factoryAddress && (routerFactory as string).toLowerCase() !== factoryAddress.toLowerCase() && (
//                                                 <div className="text-xs text-red-500 mt-2 font-mono">
//                                                     <div>Router Factory: {routerFactory as string}</div>
//                                                     <div>当前 Factory: {factoryAddress}</div>
//                                                 </div>
//                                             )}
//                                             {routerWETH && wethAddress && (routerWETH as string).toLowerCase() !== wethAddress.toLowerCase() && (
//                                                 <div className="text-xs text-red-500 mt-2 font-mono">
//                                                     <div>Router WETH: {routerWETH as string}</div>
//                                                     <div>当前 WETH: {wethAddress}</div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                     <div className="flex flex-col gap-4">
//                                         <div className="grid gap-2">
//                                             <Label htmlFor="tokenA">Token A 地址</Label>
//                                             <Input
//                                                 id="tokenA"
//                                                 placeholder="0x..."
//                                                 value={tokenA}
//                                                 onChange={(e) => setTokenA(e.target.value)}
//                                             />
//                                         </div>
//                                         <div className="grid gap-2">
//                                             <Label htmlFor="amountA">Token A 数量</Label>
//                                             <Input
//                                                 id="amountA"
//                                                 type="number"
//                                                 placeholder="例如：100"
//                                                 value={amountA}
//                                                 onChange={(e) => setAmountA(e.target.value)}
//                                                 min="0"
//                                                 step="0.01"
//                                             />
//                                         </div>
//                                         <div className="grid gap-2">
//                                             <Label htmlFor="tokenB">Token B 地址</Label>
//                                             <Input
//                                                 id="tokenB"
//                                                 placeholder="0x..."
//                                                 value={tokenB}
//                                                 onChange={(e) => setTokenB(e.target.value)}
//                                             />
//                                         </div>
//                                         <div className="grid gap-2">
//                                             <Label htmlFor="amountB">Token B 数量</Label>
//                                             <Input
//                                                 id="amountB"
//                                                 type="number"
//                                                 placeholder="例如：100"
//                                                 value={amountB}
//                                                 onChange={(e) => setAmountB(e.target.value)}
//                                                 min="0"
//                                                 step="0.01"
//                                             />
//                                         </div>
//                                         <div className="grid gap-2 text-xs text-muted-foreground">
//                                             <div>
//                                                 当前授权给 Router 的 Token A：
//                                                 <span className="ml-1 text-foreground">
//                                                     {formatAllowance(allowanceA, tokenADecimalsNumber, "未知")}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 当前授权给 Router 的 Token B：
//                                                 <span className="ml-1 text-foreground">
//                                                     {formatAllowance(allowanceB, tokenBDecimalsNumber, "未知")}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 当前 Token A 余额：
//                                                 <span className="ml-1 text-foreground">
//                                                     {formatBalance(balanceA, tokenADecimalsNumber)}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 当前 Token B 余额：
//                                                 <span className="ml-1 text-foreground">
//                                                     {formatBalance(balanceB, tokenBDecimalsNumber)}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 Token A decimals：
//                                                 <span className="ml-1 text-foreground">
//                                                     {tokenADecimalsNumber ?? "未知"}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 Token B decimals：
//                                                 <span className="ml-1 text-foreground">
//                                                     {tokenBDecimalsNumber ?? "未知"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="grid gap-2">
//                                             <Label className="text-sm text-muted-foreground">授权</Label>
//                                             <div className="flex flex-col gap-2">
//                                                 <Button
//                                                     variant="secondary"
//                                                     onClick={handleApproveTokenA}
//                                                     disabled={
//                                                         !isConnected ||
//                                                         !tokenAAddr ||
//                                                         !amountA ||
//                                                         isAllowanceAEnough ||
//                                                         isApproveABusy
//                                                     }
//                                                 >
//                                                     {isAllowanceAEnough
//                                                         ? "Token A 已授权"
//                                                         : isApproveABusy
//                                                             ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权 Token A 中...</>
//                                                             : "授权 Token A"}
//                                                 </Button>
//                                                 <Button
//                                                     variant="secondary"
//                                                     onClick={handleApproveTokenB}
//                                                     disabled={
//                                                         !isConnected ||
//                                                         !tokenBAddr ||
//                                                         !amountB ||
//                                                         isAllowanceBEnough ||
//                                                         isApproveBBusy
//                                                     }
//                                                 >
//                                                     {isAllowanceBEnough
//                                                         ? "Token B 已授权"
//                                                         : isApproveBBusy
//                                                             ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />授权 Token B 中...</>
//                                                             : "授权 Token B"}
//                                                 </Button>
//                                             </div>
//                                             {(approveAError || approveBError) && (
//                                                 <p className="text-sm text-red-500">
//                                                     授权失败：{(approveAError ?? approveBError)?.message.slice(0, 100)}
//                                                 </p>
//                                             )}
//                                             {addLiquiditySimError && (
//                                                 <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
//                                                     <div className="font-semibold mb-1">❌ 模拟失败</div>
//                                                     <div className="text-xs whitespace-pre-wrap wrap-break-word font-mono">
//                                                         {addLiquiditySimError}
//                                                     </div>
//                                                     <div className="mt-2 text-xs">
//                                                         💡 提示：请打开浏览器控制台（F12）查看详细日志
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {addLiquidityError && (
//                                             <p className="text-sm text-red-500">
//                                                 失败：{addLiquidityError.message.slice(0, 100)}
//                                             </p>
//                                         )}
//                                         {diagnosticIssues.length > 0 && (
//                                             <div className="text-xs text-muted-foreground">
//                                                 {diagnosticIssues.map((item) => (
//                                                     <div key={item}>• {item}</div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                         {isAddLiquiditySuccess && (
//                                             <p className="text-sm text-green-600 flex items-center gap-1">
//                                                 <CheckCircle2 className="w-4 h-4" />
//                                                 流动性添加成功！
//                                             </p>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                                 <CardFooter>
//                                     <Button
//                                         className="w-full"
//                                         onClick={handleAddLiquidity}
//                                         disabled={
//                                             !isConnected ||
//                                             !tokenA ||
//                                             !tokenB ||
//                                             !amountA ||
//                                             !amountB ||
//                                             !isAllowanceAEnough ||
//                                             !isAllowanceBEnough ||
//                                             !isBalanceAEnough ||
//                                             !isBalanceBEnough ||
//                                             isAddLiquidityPending ||
//                                             isAddLiquidityConfirming
//                                         }
//                                     >
//                                         {isAddLiquidityPending || isAddLiquidityConfirming
//                                             ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />添加中...</>
//                                             : "添加流动性"}
//                                     </Button>
//                                 </CardFooter>
//                             </Card>
//                         )}

//                     </div>
//                 </div>

//                 <div className="w-full lg:w-80 shrink-0">
//                     <Card className="sticky top-6">
//                         <CardHeader className="pb-3">
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-base flex items-center gap-2">
//                                     <History className="w-4 h-4" />
//                                     铸造历史
//                                 </CardTitle>
//                                 {history.length > 0 && (
//                                     <button
//                                         onClick={handleClearHistory}
//                                         className="text-xs text-muted-foreground hover:text-destructive transition-colors"
//                                     >
//                                         清空
//                                     </button>
//                                 )}
//                             </div>
//                             <CardDescription>
//                                 {history.length > 0
//                                     ? `共 ${history.length} 条记录`
//                                     : "暂无铸造记录"}
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             {history.length === 0 ? (
//                                 <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
//                                     <Coins className="w-8 h-8 opacity-30" />
//                                     <p className="text-sm">创建你的第一个代币吧</p>
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
//                                     {history.map((record) => (
//                                         <div
//                                             key={record.contractAddress}
//                                             className="group relative rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
//                                         >
//                                             <button
//                                                 onClick={() => handleDeleteRecord(record.contractAddress)}
//                                                 className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
//                                                 title="删除记录"
//                                             >
//                                                 <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
//                                             </button>
//                                             <div className="flex items-center gap-2 mb-1.5">
//                                                 <span className="font-semibold">{record.name}</span>
//                                                 <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
//                                                     {record.symbol}
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center gap-1 mb-1">
//                                                 <span className="font-mono text-xs text-muted-foreground truncate">
//                                                     {record.contractAddress}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleCopy(record.contractAddress)}
//                                                     className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
//                                                     title="复制地址"
//                                                 >
//                                                     {copied === record.contractAddress
//                                                         ? <Check className="w-3 h-3 text-green-500" />
//                                                         : <Copy className="w-3 h-3 text-muted-foreground" />
//                                                     }
//                                                 </button>
//                                             </div>
//                                             <div className="flex justify-between text-xs text-muted-foreground">
//                                                 <span>发行量: {Number(record.supply).toLocaleString()}</span>
//                                                 <span>{record.createdAt}</span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// /** 步骤圆点组件 */
// function StepBadge({ step, label, done, active }: { step: number; label: string; done: boolean; active: boolean }) {
//     return (
//         <div className="flex flex-col items-center gap-1">
//             <div
//                 className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all ${done
//                         ? "bg-primary text-primary-foreground border-primary"
//                         : active
//                             ? "border-primary text-primary"
//                             : "border-muted text-muted-foreground"
//                     }`}
//             >
//                 {done ? <Check className="w-4 h-4" /> : step}
//             </div>
//             <span className={`text-xs ${done || active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
//                 {label}
//             </span>
//         </div>
//     )
// }
