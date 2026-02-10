"use client"

import { useMemo } from "react"
import {
    useAccount,
    useBalance,
    useEstimateGas,
    useGasPrice,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi"
import { encodeDeployData, parseUnits } from "viem"
import { erc20Abi, erc20Bytecode } from "@/lib/erc20-contract"

interface UseTokenDeployParams {
    tokenName: string
    tokenSymbol: string
    tokenDecimals: string
    initialSupply: string
}

export function useTokenDeploy({ tokenName, tokenSymbol, tokenDecimals, initialSupply }: UseTokenDeployParams) {
    const { address, isConnected } = useAccount()

    const { sendTransaction, data: deployHash, isPending: isDeploying, error: deployError } = useSendTransaction()

    const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
        hash: deployHash,
    })

    const contractAddress = receipt?.contractAddress

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

    const currentStep = contractAddress ? 2 : isDeploying || isWaiting ? 1 : 0

    function handleDeploy() {
        if (!tokenName || !tokenSymbol || !initialSupply) return
        const supplyWithDecimals = parseUnits(initialSupply, Number(tokenDecimals))
        const data = encodeDeployData({
            abi: erc20Abi,
            bytecode: erc20Bytecode,
            args: [tokenName, tokenSymbol, Number(tokenDecimals), supplyWithDecimals],
        })
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
