import { useState, useEffect } from "react"
import {
    useSendTransaction,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi"
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

    // 部署 Factory
    const {
        sendTransaction: sendDeployFactory,
        data: factoryDeployHash,
        isPending: isDeployingFactory,
        error: factoryDeployError,
    } = useSendTransaction()

    const { data: factoryReceipt, isLoading: isWaitingFactory } = useWaitForTransactionReceipt({
        hash: factoryDeployHash,
    })

    const factoryAddress = isReset ? null : (factoryReceipt?.contractAddress ?? savedAddress)
    const factoryAddr = factoryAddress as `0x${string}` | undefined

    // 部署成功后持久化
    useEffect(() => {
        if (factoryReceipt?.contractAddress) {
            onAddressSaved(factoryReceipt.contractAddress)
            setIsReset(false)
        }
    }, [factoryReceipt?.contractAddress, onAddressSaved])

    // 读取 Factory 合约信息
    const { data: factoryFeeToSetter } = useReadContract({
        address: factoryAddr,
        abi: uniswapV2FactoryAbil,
        functionName: "feeToSetter",
        query: { enabled: !!factoryAddr },
    })

    const { data: factoryFeeTo } = useReadContract({
        address: factoryAddr,
        abi: uniswapV2FactoryAbil,
        functionName: "feeTo",
        query: { enabled: !!factoryAddr },
    })

    const { data: factoryPairsLength } = useReadContract({
        address: factoryAddr,
        abi: uniswapV2FactoryAbil,
        functionName: "allPairsLength",
        query: { enabled: !!factoryAddr },
    })

    // 部署 Factory 合约
    const deployFactory = (feeToSetterAddr: string) => {
        const setter = feeToSetterAddr.trim() || ZERO_ADDRESS
        if (setter !== ZERO_ADDRESS && !isAddress(setter)) {
            return
        }
        const data = encodeDeployData({
            abi: uniswapV2FactoryAbil,
            bytecode: factoryBytecode,
            args: [setter as `0x${string}`],
        })
        sendDeployFactory({ data })
    }

    // 重置 Factory 地址
    const resetFactory = () => {
        setIsReset(true)
    }

    return {
        // 地址和状态
        factoryAddress,
        isDeploying: isDeployingFactory,
        isWaiting: isWaitingFactory,
        isReset,

        // 合约信息
        factoryFeeToSetter,
        factoryFeeTo,
        factoryPairsLength: factoryPairsLength as bigint | undefined,

        // 输入状态
        feeToSetter,
        setFeeToSetter,

        // 操作方法
        deployFactory,
        resetFactory,

        // 错误
        deployError: factoryDeployError,
    }
}
