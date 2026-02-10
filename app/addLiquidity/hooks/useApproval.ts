import { useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { maxUint256 } from "viem"
import { erc20Abi } from "@/lib/erc20-contract"

export function useApproval(
    tokenAddr: `0x${string}` | undefined,
    routerAddr: `0x${string}` | undefined,
    refetchAllowance: () => void
) {
    const { writeContract, data: approveHash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

    useEffect(() => {
        if (isSuccess) refetchAllowance()
    }, [isSuccess, refetchAllowance])

    const handleApprove = () => {
        if (!tokenAddr || !routerAddr) return
        writeContract({
            address: tokenAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [routerAddr, maxUint256],
        })
    }

    return {
        handleApprove,
        isApproving: isPending || isConfirming,
        isApproved: isSuccess,
    }
}
