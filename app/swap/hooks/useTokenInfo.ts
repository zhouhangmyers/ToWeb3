import { useReadContract } from "wagmi"
import { isAddress } from "viem"
import { erc20Abi } from "@/lib/erc20-contract"

/**
 * 读取 Token 信息：decimals, symbol, balance, allowance
 */
export function useTokenInfo(
    tokenAddress: string,
    userAddress: `0x${string}` | undefined,
    routerAddress: `0x${string}` | undefined
) {
    const tokenAddr = isAddress(tokenAddress) ? (tokenAddress as `0x${string}`) : undefined

    const { data: decimals } = useReadContract({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "decimals",
        query: { enabled: !!tokenAddr },
    })

    const { data: symbol } = useReadContract({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "symbol",
        query: { enabled: !!tokenAddr },
    })

    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: userAddress ? [userAddress] : undefined,
        query: { enabled: !!tokenAddr && !!userAddress },
    })

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: userAddress && routerAddress ? [userAddress, routerAddress] : undefined,
        query: { enabled: !!tokenAddr && !!userAddress && !!routerAddress },
    })

    return {
        tokenAddr,
        decimals,
        symbol,
        balance,
        allowance,
        refetchBalance,
        refetchAllowance,
    }
}
