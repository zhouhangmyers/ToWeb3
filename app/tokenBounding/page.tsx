"use client"

import { useEffect, useState } from "react"
import { useTokenDeploy } from "./hooks/useTokenDeploy"
import { useTokenHistory } from "./hooks/useTokenHistory"
import { StepIndicator } from "./components/StepIndicator"
import { TokenForm } from "./components/TokenForm"
import { GasEstimate } from "./components/GasEstimate"
import { DeployResult } from "./components/DeployResult"
import { MintHistory } from "./components/MintHistory"
import { FeatureCards } from "./components/FeatureCards"

export default function TokenCreate() {
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenDecimals, setTokenDecimals] = useState("18")
    const [initialSupply, setInitialSupply] = useState("")
    const [copied, setCopied] = useState<string | null>(null)

    const {
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
    } = useTokenDeploy({ tokenName, tokenSymbol, tokenDecimals, initialSupply })

    const { history, addRecord, deleteRecord, clearHistory } = useTokenHistory()

    // 部署成功后写入历史
    useEffect(() => {
        if (!contractAddress) return
        addRecord({
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            supply: initialSupply,
            contractAddress,
            createdAt: new Date().toLocaleString("zh-CN"),
        })
    }, [contractAddress]) // eslint-disable-line react-hooks/exhaustive-deps

    function handleCopy(addr: string) {
        navigator.clipboard.writeText(addr)
        setCopied(addr)
        setTimeout(() => setCopied(null), 2000)
    }

    

    return (
        <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto min-h-screen text-white">
            {/* 页面标题区 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">代币铸造工坊</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    在这里创建属于你自己的 ERC-20 代币，只需填写基本信息即可一键部署到区块链。
                </p>
            </div>

            {/* 两栏布局：左边创建流程 + 右边历史记录 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：创建流程 */}
                <div className="flex flex-col items-center gap-8 flex-1 min-w-0">
                    <StepIndicator currentStep={currentStep} />

                    <TokenForm
                        tokenName={tokenName}
                        tokenSymbol={tokenSymbol}
                        tokenDecimals={tokenDecimals}
                        initialSupply={initialSupply}
                        onTokenNameChange={setTokenName}
                        onTokenSymbolChange={setTokenSymbol}
                        onTokenDecimalsChange={setTokenDecimals}
                        onInitialSupplyChange={setInitialSupply}
                        onDeploy={handleDeploy}
                        isConnected={isConnected}
                        isDeploying={isDeploying}
                        isWaiting={isWaiting}
                        deployError={deployError}
                    />

                    {isConnected && (
                        <GasEstimate
                            ethBalance={ethBalance}
                            gasPrice={gasPrice}
                            gasEstimate={gasEstimate}
                            estimatedCost={estimatedCost}
                            deployData={deployData}
                        />
                    )}

                    {contractAddress && (
                        <DeployResult
                            contractAddress={contractAddress}
                            tokenName={tokenName}
                            tokenSymbol={tokenSymbol}
                            tokenDecimals={tokenDecimals}
                            balance={balance as bigint | undefined}
                            copied={copied}
                            onCopy={handleCopy}
                        />
                    )}
                </div>

                {/* 右栏：铸造历史记录 */}
                <div className="w-full lg:w-80 shrink-0">
                    <MintHistory
                        history={history}
                        copied={copied}
                        onCopy={handleCopy}
                        onDelete={deleteRecord}
                        onClear={clearHistory}
                    />
                </div>
            </div>

            <FeatureCards />
        </div>
    )
}
