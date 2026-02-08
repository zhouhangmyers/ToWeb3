import { useState, useEffect } from "react"

export interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

const WETH_STORAGE_KEY = "deployed-weth-address"
const FACTORY_STORAGE_KEY = "deployed-factory-address"
const ROUTER_STORAGE_KEY = "deployed-router-address"
const HISTORY_KEY = "token-create-history"

function loadFromStorage(key: string): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
}

function saveToStorage(key: string, value: string) {
    if (typeof window === "undefined") return
    localStorage.setItem(key, value)
}

function removeFromStorage(key: string) {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
}

function loadHistory(): TokenRecord[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(HISTORY_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveHistory(records: TokenRecord[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useLocalStorage() {
    const [wethAddress, setWethAddress] = useState<string | null>(null)
    const [factoryAddress, setFactoryAddress] = useState<string | null>(null)
    const [routerAddress, setRouterAddress] = useState<string | null>(null)
    const [history, setHistory] = useState<TokenRecord[]>([])

    // 初始化加载
    useEffect(() => {
        setWethAddress(loadFromStorage(WETH_STORAGE_KEY))
        setFactoryAddress(loadFromStorage(FACTORY_STORAGE_KEY))
        setRouterAddress(loadFromStorage(ROUTER_STORAGE_KEY))
        setHistory(loadHistory())
    }, [])

    const saveWethAddress = (addr: string) => {
        saveToStorage(WETH_STORAGE_KEY, addr)
        setWethAddress(addr)
    }

    const saveFactoryAddress = (addr: string) => {
        saveToStorage(FACTORY_STORAGE_KEY, addr)
        setFactoryAddress(addr)
    }

    const saveRouterAddress = (addr: string) => {
        saveToStorage(ROUTER_STORAGE_KEY, addr)
        setRouterAddress(addr)
    }

    const resetWethAddress = () => {
        removeFromStorage(WETH_STORAGE_KEY)
        setWethAddress(null)
    }

    const resetFactoryAddress = () => {
        removeFromStorage(FACTORY_STORAGE_KEY)
        setFactoryAddress(null)
    }

    const resetRouterAddress = () => {
        removeFromStorage(ROUTER_STORAGE_KEY)
        setRouterAddress(null)
    }

    const addHistoryRecord = (record: TokenRecord) => {
        setHistory((prev) => {
            // 避免重复写入同一合约地址
            if (prev.some((r) => r.contractAddress === record.contractAddress)) return prev
            const next = [record, ...prev]
            saveHistory(next)
            return next
        })
    }

    const deleteHistoryRecord = (contractAddr: string) => {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }

    const clearHistory = () => {
        setHistory([])
        saveHistory([])
    }

    const clearAll = () => {
        removeFromStorage(WETH_STORAGE_KEY)
        removeFromStorage(FACTORY_STORAGE_KEY)
        removeFromStorage(ROUTER_STORAGE_KEY)
        removeFromStorage(HISTORY_KEY)
        setWethAddress(null)
        setFactoryAddress(null)
        setRouterAddress(null)
        setHistory([])
    }

    return {
        // 地址
        wethAddress,
        factoryAddress,
        routerAddress,

        // 历史
        history,

        // 保存方法
        saveWethAddress,
        saveFactoryAddress,
        saveRouterAddress,

        // 重置方法
        resetWethAddress,
        resetFactoryAddress,
        resetRouterAddress,

        // 历史记录方法
        addHistoryRecord,
        deleteHistoryRecord,
        clearHistory,

        // 清空所有
        clearAll,
    }
}
