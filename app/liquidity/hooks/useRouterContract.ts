import { useState, useEffect } from "react"
import {
    useSendTransaction,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi"
import { encodeDeployData, isAddress } from "viem"
import { uniswapV2RouterAbi, uniswapV2Bytecode as routerBytecode } from "@/lib/uniswapV2Router"
import { useSepoliaGuard } from "@/lib/useSepoliaGuard"

interface UseRouterContractProps {
    savedAddress: string | null
    onAddressSaved: (address: string) => void
    factoryAddress: string | null
    wethAddress: string | null
}

export function useRouterContract({
    savedAddress,
    onAddressSaved,
    factoryAddress,
    wethAddress
}: UseRouterContractProps) {
    const [isReset, setIsReset] = useState(false)
    const [routerFactoryInput, setRouterFactoryInput] = useState("")
    const [routerWethInput, setRouterWethInput] = useState("")
    const { assertSepolia, isWrongNetwork, message } = useSepoliaGuard()

    // 自动填充输入框
    useEffect(() => {
        if (factoryAddress && !routerFactoryInput) {
            setRouterFactoryInput(factoryAddress)
        }
        if (wethAddress && !routerWethInput) {
            setRouterWethInput(wethAddress)
        }
    }, [factoryAddress, wethAddress]) // eslint-disable-line react-hooks/exhaustive-deps

    // 部署 Router
    const {
        sendTransaction: sendDeployRouter,
        data: routerDeployHash,
        isPending: isDeployingRouter,
        error: routerDeployError,
    } = useSendTransaction()

    const { data: routerReceipt, isLoading: isWaitingRouter } = useWaitForTransactionReceipt({
        hash: routerDeployHash,
    })

    const routerAddress = isReset ? null : (routerReceipt?.contractAddress ?? savedAddress)
    const routerAddr = routerAddress as `0x${string}` | undefined

    // 部署成功后持久化
    useEffect(() => {
        if (routerReceipt?.contractAddress) {
            onAddressSaved(routerReceipt.contractAddress)
            setIsReset(false)
        }
    }, [routerReceipt?.contractAddress, onAddressSaved])

    // 读取 Router 合约信息
    const { data: routerFactory } = useReadContract({
        address: routerAddr,
        abi: uniswapV2RouterAbi,
        functionName: "factory",
        query: { enabled: !!routerAddr },
    })

    const { data: routerWETH } = useReadContract({
        address: routerAddr,
        abi: uniswapV2RouterAbi,
        functionName: "WETH",
        query: { enabled: !!routerAddr },
    })

    // 部署 Router 合约
    const deployRouter = (factory: string, weth: string) => {
        const factoryTrimmed = factory.trim()
        const wethTrimmed = weth.trim()

        if (!isAddress(factoryTrimmed) || !isAddress(wethTrimmed)) {
            return
        }
        if (!assertSepolia()) return

        const data = encodeDeployData({
            abi: uniswapV2RouterAbi,
            bytecode: routerBytecode,
            args: [factoryTrimmed as `0x${string}`, wethTrimmed as `0x${string}`],
        })
        sendDeployRouter({ data })
    }

    // 重置 Router 地址
    const resetRouter = () => {
        setIsReset(true)
    }

    return {
        // 地址和状态
        routerAddress,
        isDeploying: isDeployingRouter,
        isWaiting: isWaitingRouter,
        isReset,

        // 合约信息
        routerFactory,
        routerWETH,

        // 输入状态
        routerFactoryInput,
        setRouterFactoryInput,
        routerWethInput,
        setRouterWethInput,

        // 操作方法
        deployRouter,
        resetRouter,

        // 错误
        deployError: routerDeployError,
        networkError: isWrongNetwork ? message : null,
    }
}
