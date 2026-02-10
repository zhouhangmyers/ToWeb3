"use client"

import { useState, useEffect, useCallback } from "react"

export interface TokenRecord {
    name: string
    symbol: string
    decimals: string
    supply: string
    contractAddress: string
    createdAt: string
}

const HISTORY_KEY = "token-create-history"

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
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useTokenHistory() {
    const [history, setHistory] = useState<TokenRecord[]>([])

    useEffect(() => {
        setHistory(loadHistory())
    }, [])

    const addRecord = useCallback((record: TokenRecord) => {
        setHistory((prev) => {
            if (prev.some((r) => r.contractAddress === record.contractAddress)) return prev
            const next = [record, ...prev]
            saveHistory(next)
            return next
        })
    }, [])

    const deleteRecord = useCallback((contractAddr: string) => {
        setHistory((prev) => {
            const next = prev.filter((r) => r.contractAddress !== contractAddr)
            saveHistory(next)
            return next
        })
    }, [])

    const clearHistory = useCallback(() => {
        setHistory([])
        saveHistory([])
    }, [])

    return { history, addRecord, deleteRecord, clearHistory }
}
