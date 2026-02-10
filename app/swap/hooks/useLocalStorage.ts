"use client"

import type { TokenRecord } from "../../addLiquidity/hooks/useLocalStorage"
import { useState, useEffect } from "react"

export const ROUTER_STORAGE_KEY = "deployed-router-address"
export const HISTORY_KEY = "token-create-history"


function loadHistory(): TokenRecord[] {
    if (typeof window === "undefined") return []

    try {
        const raw = localStorage.getItem(HISTORY_KEY)
        return raw ? JSON.parse(raw) : []
    }
    catch {
        return []
    }
}

function saveHistory(records: TokenRecord[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useRouterAddress() {
    const [customRouterAddress, setCustomRouterAddress] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(ROUTER_STORAGE_KEY)
            setCustomRouterAddress(saved)
        }
    }, [])

    return customRouterAddress
}


export function useTokenHistory() {
    const [history, setHistory] = useState<TokenRecord[]>([])

    useEffect(() => {
        setHistory(loadHistory())
    }, [])

    const deleteRecord = (addr: string) => {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== addr)
            saveHistory(next)
            return next
        })
    }

    const clearHistory = () => {
        setHistory([])
        saveHistory([])
    }

    return {
        history,
        deleteRecord,
        clearHistory,
    }
}