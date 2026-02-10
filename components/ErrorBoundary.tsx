"use client"

import React, { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                    <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-300 mb-2">
                                    页面出现错误
                                </h3>
                                <p className="text-sm text-red-400 mb-4">
                                    {this.state.error?.message || '未知错误'}
                                </p>
                                <button
                                    onClick={() => {
                                        this.setState({ hasError: false, error: undefined })
                                        window.location.reload()
                                    }}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    刷新页面
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
