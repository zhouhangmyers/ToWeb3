"use client"

import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useWethContract } from "./hooks/useWethContract"
import { useFactoryContract } from "./hooks/useFactoryContract"
import { useRouterContract } from "./hooks/useRouterContract"
import { useAddLiquidity } from "./hooks/useAddLiquidity"
import { WethCard } from "./components/WethCard"
import { FactoryCard } from "./components/FactoryCard"
import { RouterCard } from "./components/RouterCard"
import { AddLiquidityCard } from "./components/AddLiquidityCard"
import { HistoryPanel } from "./components/HistoryPanel"

export default function LiquidityPage() {
    const { address, isConnected } = useAccount()

    // 使用 localStorage hook
    const localStorage = useLocalStorage()

    // 使用合约 hooks
    const weth = useWethContract({
        savedAddress: localStorage.wethAddress,
        onAddressSaved: localStorage.saveWethAddress,
    })

    const factory = useFactoryContract({
        savedAddress: localStorage.factoryAddress,
        onAddressSaved: localStorage.saveFactoryAddress,
    })

    const router = useRouterContract({
        savedAddress: localStorage.routerAddress,
        onAddressSaved: localStorage.saveRouterAddress,
        factoryAddress: factory.factoryAddress,
        wethAddress: weth.wethAddress,
    })

    const addLiquidity = useAddLiquidity({
        routerAddress: router.routerAddress,
        factoryAddress: factory.factoryAddress,
        wethAddress: weth.wethAddress,
    })

    // 断开连接时清空所有数据
    useEffect(() => {
        if (!isConnected) {
            localStorage.clearAll()
        }
    }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto min-h-screen text-white">
            {/* 页面标题 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">流动性管理</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    在本地链上部署 Uniswap V2 合约基础设施，然后为代币对添加流动性。
                </p>
            </div>

            {/* 两栏布局：左边流程 + 右边历史 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左栏：部署和添加流动性流程 */}
                <div className="w-full flex flex-col gap-8 items-center flex-1 min-w-0">
                    {/* 第一步：部署 WETH */}
                    <WethCard
                        isConnected={isConnected}
                        wethAddress={weth.wethAddress}
                        wethName={weth.wethName as string}
                        wethSymbol={weth.wethSymbol as string}
                        wethTotalSupply={weth.wethTotalSupply}
                        wethBalance={weth.wethBalance}
                        ethBalance={weth.ethBalance}
                        depositAmount={weth.depositAmount}
                        setDepositAmount={weth.setDepositAmount}
                        withdrawAmount={weth.withdrawAmount}
                        setWithdrawAmount={weth.setWithdrawAmount}
                        isDeploying={weth.isDeploying}
                        isWaiting={weth.isWaiting}
                        isDepositPending={weth.isDepositPending}
                        isDepositConfirming={weth.isDepositConfirming}
                        isWithdrawPending={weth.isWithdrawPending}
                        isWithdrawConfirming={weth.isWithdrawConfirming}
                        deployError={weth.deployError}
                        depositError={weth.depositError}
                        withdrawError={weth.withdrawError}
                        onDeployWeth={weth.deployWeth}
                        onDeposit={weth.deposit}
                        onWithdraw={weth.withdraw}
                        onReset={() => {
                            weth.resetWeth()
                            localStorage.resetWethAddress()
                        }}
                    />

                    {/* 第二步：部署 Factory */}
                    <FactoryCard
                        isConnected={isConnected}
                        wethAddress={weth.wethAddress}
                        factoryAddress={factory.factoryAddress}
                        factoryFeeToSetter={factory.factoryFeeToSetter as string}
                        factoryFeeTo={factory.factoryFeeTo as string}
                        factoryPairsLength={factory.factoryPairsLength}
                        feeToSetter={factory.feeToSetter}
                        setFeeToSetter={factory.setFeeToSetter}
                        userAddress={address}
                        isDeploying={factory.isDeploying}
                        isWaiting={factory.isWaiting}
                        deployError={factory.deployError}
                        onDeployFactory={factory.deployFactory}
                        onReset={() => {
                            factory.resetFactory()
                            localStorage.resetFactoryAddress()
                        }}
                    />

                    {/* 第三步：部署 Router */}
                    <RouterCard
                        isConnected={isConnected}
                        factoryAddress={factory.factoryAddress}
                        wethAddress={weth.wethAddress}
                        routerAddress={router.routerAddress}
                        routerFactory={router.routerFactory as string}
                        routerWETH={router.routerWETH as string}
                        routerFactoryInput={router.routerFactoryInput}
                        setRouterFactoryInput={router.setRouterFactoryInput}
                        routerWethInput={router.routerWethInput}
                        setRouterWethInput={router.setRouterWethInput}
                        isDeploying={router.isDeploying}
                        isWaiting={router.isWaiting}
                        deployError={router.deployError}
                        onDeployRouter={router.deployRouter}
                        onReset={() => {
                            router.resetRouter()
                            localStorage.resetRouterAddress()
                        }}
                    />

                    {/* 第四步：添加流动性 */}
                    <AddLiquidityCard
                        isConnected={isConnected}
                        routerAddress={router.routerAddress}
                        factoryAddress={factory.factoryAddress}
                        wethAddress={weth.wethAddress}
                        tokenA={addLiquidity.tokenA}
                        setTokenA={addLiquidity.setTokenA}
                        tokenB={addLiquidity.tokenB}
                        setTokenB={addLiquidity.setTokenB}
                        amountA={addLiquidity.amountA}
                        setAmountA={addLiquidity.setAmountA}
                        amountB={addLiquidity.amountB}
                        setAmountB={addLiquidity.setAmountB}
                        tokenADecimalsNumber={addLiquidity.tokenADecimalsNumber}
                        tokenBDecimalsNumber={addLiquidity.tokenBDecimalsNumber}
                        allowanceA={addLiquidity.allowanceA}
                        allowanceB={addLiquidity.allowanceB}
                        balanceA={addLiquidity.balanceA}
                        balanceB={addLiquidity.balanceB}
                        isAddLiquidityPending={addLiquidity.isAddLiquidityPending}
                        isAddLiquidityConfirming={addLiquidity.isAddLiquidityConfirming}
                        isApproveAPending={addLiquidity.isApproveAPending}
                        isApproveAConfirming={addLiquidity.isApproveAConfirming}
                        isApproveBPending={addLiquidity.isApproveBPending}
                        isApproveBConfirming={addLiquidity.isApproveBConfirming}
                        approveAError={addLiquidity.approveAError}
                        approveBError={addLiquidity.approveBError}
                        addLiquiditySimError={addLiquidity.addLiquiditySimError}
                        onApproveTokenA={addLiquidity.handleApproveTokenA}
                        onApproveTokenB={addLiquidity.handleApproveTokenB}
                        onAddLiquidity={addLiquidity.handleAddLiquidity}
                    />
                </div>

                {/* 右栏：铸造历史 */}
                <HistoryPanel
                    history={localStorage.history}
                    onDeleteRecord={localStorage.deleteHistoryRecord}
                    onClearHistory={localStorage.clearHistory}
                />
            </div>
        </div>
    )
}
