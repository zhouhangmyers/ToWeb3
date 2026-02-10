import { useState, useEffect } from "react"
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    usePublicClient,
} from "wagmi"
import { isAddress, parseUnits, maxUint256, BaseError } from "viem"
import { erc20Abi } from "@/lib/erc20-contract"
import { uniswapV2RouterAbi } from "@/lib/uniswapV2Router"
import { uniswapV2FactoryAbil } from "@/lib/uniswapV2Factory"
import { useSepoliaGuard } from "@/lib/useSepoliaGuard"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface UseAddLiquidityProps {
    routerAddress: string | null
    factoryAddress: string | null
    wethAddress: string | null
}

export function useAddLiquidity({ routerAddress, factoryAddress, wethAddress }: UseAddLiquidityProps) {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { assertSepolia } = useSepoliaGuard()

    const [tokenA, setTokenA] = useState("")
    const [tokenB, setTokenB] = useState("")
    const [amountA, setAmountA] = useState("")
    const [amountB, setAmountB] = useState("")
    const [addLiquiditySimError, setAddLiquiditySimError] = useState<string | null>(null)

    const routerAddr = routerAddress as `0x${string}` | undefined
    const tokenAAddr = isAddress(tokenA) ? (tokenA as `0x${string}`) : undefined
    const tokenBAddr = isAddress(tokenB) ? (tokenB as `0x${string}`) : undefined

    // 读取 Token Decimals
    const { data: tokenADecimals } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenAAddr },
    })

    const { data: tokenBDecimals } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenBAddr },
    })

    const tokenADecimalsNumber = tokenADecimals !== undefined ? Number(tokenADecimals) : undefined
    const tokenBDecimalsNumber = tokenBDecimals !== undefined ? Number(tokenBDecimals) : undefined

    // 读取 Allowance
    const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenAAddr && !!address && !!routerAddr },
    })

    const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && routerAddr ? [address, routerAddr] : undefined,
        query: { enabled: !!tokenBAddr && !!address && !!routerAddr },
    })

    // 读取 Balance
    const { data: balanceA } = useReadContract({
        address: tokenAAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenAAddr && !!address },
    })

    const { data: balanceB } = useReadContract({
        address: tokenBAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!tokenBAddr && !!address },
    })

    // Add Liquidity 写操作
    const {
        writeContract: writeAddLiquidity,
        data: addLiquidityHash,
        isPending: isAddLiquidityPending,
        error: addLiquidityError,
    } = useWriteContract()

    const { isLoading: isAddLiquidityConfirming, isSuccess: isAddLiquiditySuccess } = useWaitForTransactionReceipt({
        hash: addLiquidityHash,
    })

    useEffect(() => {
        if (isAddLiquiditySuccess) {
            setAmountA("")
            setAmountB("")
        }
    }, [isAddLiquiditySuccess])

    // Approve Token A
    const {
        writeContract: writeApproveA,
        data: approveAHash,
        isPending: isApproveAPending,
        error: approveAError,
    } = useWriteContract()

    const { isLoading: isApproveAConfirming, isSuccess: isApproveASuccess } = useWaitForTransactionReceipt({
        hash: approveAHash,
    })

    // Approve Token B
    const {
        writeContract: writeApproveB,
        data: approveBHash,
        isPending: isApproveBPending,
        error: approveBError,
    } = useWriteContract()

    const { isLoading: isApproveBConfirming, isSuccess: isApproveBSuccess } = useWaitForTransactionReceipt({
        hash: approveBHash,
    })

    useEffect(() => {
        if (isApproveASuccess) refetchAllowanceA()
    }, [isApproveASuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isApproveBSuccess) refetchAllowanceB()
    }, [isApproveBSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    // 工具函数
    function parseTokenAmount(amount: string, decimals: number | undefined) {
        if (!amount) return null
        try {
            return parseUnits(amount, decimals ?? 18)
        } catch {
            return null
        }
    }

    function formatViemError(err: unknown) {
        if (err instanceof BaseError) {
            const fullMessage = err.message || err.shortMessage
            if (err.cause && typeof err.cause === "object" && "reason" in err.cause) {
                return `${err.shortMessage || "交易失败"}\n原因: ${err.cause.reason}`
            }
            return fullMessage
        }
        if (err && typeof err === "object" && "message" in err && typeof err.message === "string") return err.message
        return "交易模拟失败"
    }

    // 处理函数
    async function handleAddLiquidity() {
        if (!routerAddr || !tokenAAddr || !tokenBAddr || !amountA || !amountB || !address) return
        if (!assertSepolia(setAddLiquiditySimError)) return
        const parsedA = parseTokenAmount(amountA, tokenADecimalsNumber)
        const parsedB = parseTokenAmount(amountB, tokenBDecimalsNumber)
        if (parsedA === null || parsedB === null) return
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

        if (publicClient) {
            try {
                console.log("=== 添加流动性预检查 ===")
                console.log("Router:", routerAddr)
                console.log("Token A:", tokenAAddr, "Amount:", parsedA.toString())
                console.log("Token B:", tokenBAddr, "Amount:", parsedB.toString())

                // 检查授权
                const allowanceAResult = await publicClient.readContract({
                    address: tokenAAddr,
                    abi: erc20Abi,
                    functionName: "allowance",
                    args: [address, routerAddr],
                })
                if (allowanceAResult < parsedA) {
                    setAddLiquiditySimError(`Token A 授权不足: 需要 ${parsedA.toString()}, 实际 ${allowanceAResult.toString()}`)
                    return
                }

                const allowanceBResult = await publicClient.readContract({
                    address: tokenBAddr,
                    abi: erc20Abi,
                    functionName: "allowance",
                    args: [address, routerAddr],
                })
                if (allowanceBResult < parsedB) {
                    setAddLiquiditySimError(`Token B 授权不足: 需要 ${parsedB.toString()}, 实际 ${allowanceBResult.toString()}`)
                    return
                }

                // 检查余额
                const balanceAResult = await publicClient.readContract({
                    address: tokenAAddr,
                    abi: erc20Abi,
                    functionName: "balanceOf",
                    args: [address],
                })
                if (balanceAResult < parsedA) {
                    setAddLiquiditySimError(`Token A 余额不足: 需要 ${parsedA.toString()}, 实际 ${balanceAResult.toString()}`)
                    return
                }

                const balanceBResult = await publicClient.readContract({
                    address: tokenBAddr,
                    abi: erc20Abi,
                    functionName: "balanceOf",
                    args: [address],
                })
                if (balanceBResult < parsedB) {
                    setAddLiquiditySimError(`Token B 余额不足: 需要 ${parsedB.toString()}, 实际 ${balanceBResult.toString()}`)
                    return
                }

                // 检查 Router 合约
                const routerCode = await publicClient.getBytecode({ address: routerAddr })
                if (!routerCode || routerCode === '0x') {
                    setAddLiquiditySimError(`Router 地址 ${routerAddr} 不是有效的合约！`)
                    return
                }

                // 检查 Router 配置
                const routerFactoryAddr = await publicClient.readContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "factory",
                })

                const routerWethAddr = await publicClient.readContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "WETH",
                })

                if (factoryAddress && (routerFactoryAddr as string).toLowerCase() !== factoryAddress.toLowerCase()) {
                    setAddLiquiditySimError(`Router Factory 地址不匹配: Router=${routerFactoryAddr}, 期望=${factoryAddress}`)
                    return
                }

                if (wethAddress && (routerWethAddr as string).toLowerCase() !== wethAddress.toLowerCase()) {
                    setAddLiquiditySimError(`Router WETH 地址不匹配: Router=${routerWethAddr}, 期望=${wethAddress}`)
                    return
                }

                // 检查交易对
                if (factoryAddress) {
                    try {
                        const pairAddress = await publicClient.readContract({
                            address: factoryAddress as `0x${string}`,
                            abi: uniswapV2FactoryAbil,
                            functionName: "getPair",
                            args: [tokenAAddr, tokenBAddr],
                        }) as string

                        if (pairAddress === ZERO_ADDRESS) {
                            console.log("交易对不存在，将自动创建")
                            await publicClient.simulateContract({
                                address: factoryAddress as `0x${string}`,
                                abi: uniswapV2FactoryAbil,
                                functionName: "createPair",
                                args: [tokenAAddr, tokenBAddr],
                                account: address,
                            })
                        }
                    } catch (e) {
                        console.error("交易对检查失败:", e)
                    }
                }

                // 模拟交易
                await publicClient.simulateContract({
                    address: routerAddr,
                    abi: uniswapV2RouterAbi,
                    functionName: "addLiquidity",
                    args: [
                        tokenAAddr,
                        tokenBAddr,
                        parsedA,
                        parsedB,
                        BigInt(0),
                        BigInt(0),
                        address,
                        BigInt(deadline),
                    ],
                    account: address,
                })

                console.log("模拟成功!")
                setAddLiquiditySimError(null)
            } catch (err) {
                console.error("模拟失败:", err)
                const errorMsg = formatViemError(err)
                setAddLiquiditySimError(errorMsg)
                return
            }
        }

        writeAddLiquidity({
            address: routerAddr,
            abi: uniswapV2RouterAbi,
            functionName: "addLiquidity",
            args: [
                tokenAAddr,
                tokenBAddr,
                parsedA,
                parsedB,
                BigInt(0),
                BigInt(0),
                address,
                BigInt(deadline),
            ],
        })
    }

    function handleApproveTokenA() {
        if (!tokenAAddr || !routerAddr) return
        if (!assertSepolia(setAddLiquiditySimError)) return
        writeApproveA({
            address: tokenAAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    function handleApproveTokenB() {
        if (!tokenBAddr || !routerAddr) return
        if (!assertSepolia(setAddLiquiditySimError)) return
        writeApproveB({
            address: tokenBAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    return {
        // 状态
        tokenA,
        setTokenA,
        tokenB,
        setTokenB,
        amountA,
        setAmountA,
        amountB,
        setAmountB,

        // Token 信息
        tokenAAddr,
        tokenBAddr,
        tokenADecimalsNumber,
        tokenBDecimalsNumber,
        allowanceA,
        allowanceB,
        balanceA,
        balanceB,

        // Add Liquidity 状态
        isAddLiquidityPending,
        isAddLiquidityConfirming,
        addLiquidityError,
        addLiquiditySimError,

        // Approve 状态
        isApproveAPending,
        isApproveAConfirming,
        isApproveBPending,
        isApproveBConfirming,
        approveAError,
        approveBError,

        // 操作方法
        handleAddLiquidity,
        handleApproveTokenA,
        handleApproveTokenB,

        // Refetch 方法
        refetchAllowanceA,
        refetchAllowanceB,
    }
}
