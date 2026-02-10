import { useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { maxUint256 } from "viem"
import { erc20Abi } from "@/lib/erc20-contract"

/**
 * Token 授权操作 hook
 */
export function useApproval(
    tokenAddress: `0x${string}` | undefined,
    routerAddress: `0x${string}` | undefined,
    refetchAllowance: () => void
) {
    const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

    const handleApprove = () => {
        if (!tokenAddress || !routerAddress) return
        writeApprove({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddress, maxUint256],
        })
    }

    // 授权成功后刷新授权额度
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance()
        }
    }, [isApproveSuccess, refetchAllowance])

    return {
        handleApprove,
        isApproving: isApprovePending || isApproveConfirming,
        isApproveSuccess,
    }
}
