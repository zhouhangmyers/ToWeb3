import { useState, useEffect } from "react"
import {
    useAccount,
    useBalance,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useReadContract,
    useWriteContract,
} from "wagmi"
import { encodeDeployData, parseEther } from "viem"
import { wethAbi, wethBytecode } from "@/lib/WETH-contract"
import { useSepoliaGuard } from "@/lib/useSepoliaGuard"

interface UseWethContractProps {
    savedAddress: string | null
    onAddressSaved: (address: string) => void
}

export function useWethContract({ savedAddress, onAddressSaved }: UseWethContractProps) {
    const { address } = useAccount()
    const { assertSepolia, isWrongNetwork, message } = useSepoliaGuard()
    const [isReset, setIsReset] = useState(false)
    const [depositAmount, setDepositAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")

    // 部署 WETH
    const {
        sendTransaction: sendDeployWeth,
        data: wethDeployHash,
        isPending: isDeployingWeth,
        error: wethDeployError,
    } = useSendTransaction()

    const { data: wethReceipt, isLoading: isWaitingWeth } = useWaitForTransactionReceipt({
        hash: wethDeployHash,
    })

    const wethAddress = isReset ? null : (wethReceipt?.contractAddress ?? savedAddress)
    const wethAddr = wethAddress as `0x${string}` | undefined

    // 部署成功后持久化
    useEffect(() => {
        if (wethReceipt?.contractAddress) {
            onAddressSaved(wethReceipt.contractAddress)
            setIsReset(false)
        }
    }, [wethReceipt?.contractAddress, onAddressSaved])

    // 读取 WETH 合约信息
    const { data: wethName } = useReadContract({
        address: wethAddr,
        abi: wethAbi,
        functionName: "name",
        query: { enabled: !!wethAddr },
    })

    const { data: wethSymbol } = useReadContract({
        address: wethAddr,
        abi: wethAbi,
        functionName: "symbol",
        query: { enabled: !!wethAddr },
    })

    const { data: wethTotalSupply, refetch: refetchTotalSupply } = useReadContract({
        address: wethAddr,
        abi: wethAbi,
        functionName: "totalSupply",
        query: { enabled: !!wethAddr },
    })

    // 用户 WETH 余额
    const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
        address: wethAddr,
        abi: wethAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!wethAddr && !!address },
    })

    // 用户 ETH 余额
    const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
        address,
        query: { enabled: !!address },
    })

    // Deposit: ETH → WETH
    const {
        writeContract: writeDeposit,
        data: depositHash,
        isPending: isDepositPending,
        error: depositError,
    } = useWriteContract()

    const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
        hash: depositHash,
    })

    // deposit 成功后刷新余额
    useEffect(() => {
        if (isDepositSuccess) {
            refetchEthBalance()
            refetchWethBalance()
            refetchTotalSupply()
            setDepositAmount("")
        }
    }, [isDepositSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    // Withdraw: WETH → ETH
    const {
        writeContract: writeWithdraw,
        data: withdrawHash,
        isPending: isWithdrawPending,
        error: withdrawError,
    } = useWriteContract()

    const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
        hash: withdrawHash,
    })

    // withdraw 成功后刷新余额
    useEffect(() => {
        if (isWithdrawSuccess) {
            refetchEthBalance()
            refetchWethBalance()
            refetchTotalSupply()
            setWithdrawAmount("")
        }
    }, [isWithdrawSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    // 部署 WETH 合约
    const deployWeth = () => {
        if (!assertSepolia()) return
        const data = encodeDeployData({
            abi: wethAbi,
            bytecode: wethBytecode,
        })
        sendDeployWeth({ data })
    }

    // Deposit ETH to WETH
    const deposit = (amount: string) => {
        if (!wethAddr || !amount) return
        if (!assertSepolia()) return
        writeDeposit({
            address: wethAddr,
            abi: wethAbi,
            functionName: "deposit",
            value: parseEther(amount),
        })
    }

    // Withdraw WETH to ETH
    const withdraw = (amount: string) => {
        if (!wethAddr || !amount) return
        if (!assertSepolia()) return
        writeWithdraw({
            address: wethAddr,
            abi: wethAbi,
            functionName: "withdraw",
            args: [parseEther(amount)],
        })
    }

    // 重置 WETH 地址
    const resetWeth = () => {
        setIsReset(true)
    }

    return {
        // 地址和状态
        wethAddress,
        isDeploying: isDeployingWeth,
        isWaiting: isWaitingWeth,
        isReset,

        // 合约信息
        wethName,
        wethSymbol,
        wethTotalSupply: wethTotalSupply as bigint | undefined,
        wethBalance: wethBalance as bigint | undefined,
        ethBalance,

        // Deposit 状态
        depositAmount,
        setDepositAmount,
        isDepositPending,
        isDepositConfirming,
        depositError,

        // Withdraw 状态
        withdrawAmount,
        setWithdrawAmount,
        isWithdrawPending,
        isWithdrawConfirming,
        withdrawError,

        // 操作方法
        deployWeth,
        deposit,
        withdraw,
        resetWeth,

        // 错误
        deployError: wethDeployError,
        networkError: isWrongNetwork ? message : null,

        // Refetch 方法
        refetchWethBalance,
        refetchEthBalance,
        refetchTotalSupply,
    }
}
