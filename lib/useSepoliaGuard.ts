import { useAccount } from "wagmi"
import { sepolia } from "wagmi/chains"

const MESSAGE = "当前网络不受支持，请切换到 Sepolia"

export function useSepoliaGuard() {
    const { chainId, isConnected } = useAccount()
    const isWrongNetwork = isConnected && chainId !== undefined && chainId !== sepolia.id

    const assertSepolia = (setError?: (message: string) => void) => {
        if (isWrongNetwork) {
            setError?.(MESSAGE)
            return false
        }
        return true
    }

    return {
        isWrongNetwork,
        message: MESSAGE,
        assertSepolia,
    }
}
