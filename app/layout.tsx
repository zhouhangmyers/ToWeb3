import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import "./globals.css";

export const metadata: Metadata = {
  title: "一站式 web3 开源工具箱 - ToWeb3",
  description: "使用 Next.js + Wagmi 构建",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-black">
        <ClientProviders>
          <Header />
          <main>{children}</main>

          {/* 免责声明与作者信息 */}
          <section className="max-w-4xl mx-auto px-6 pb-16 pt-8">
            <Card className="bg-gray-900/30 border-gray-800/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  {/* 标题 */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <h3 className="text-lg font-bold text-white">免责声明 & 项目说明</h3>
                  </div>

                  {/* 声明内容 */}
                  <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                    <p className="text-gray-300">
                      <span className="text-purple-400 font-semibold">⚠️ 重要提示：</span>
                      本项目为个人开源项目，仅供学习、研究和技术交流使用，不构成任何投资建议或金融服务。
                    </p>

                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-semibold text-sm">
                        🔒 为避免法律风险，本项目所有功能均在测试网络（如 Sepolia 测试网）上运行，不涉及真实资产交易。
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 py-2">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span><strong className="text-gray-300">非商业用途：</strong>本项目无任何商业盈利行为，完全开源免费。</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span><strong className="text-gray-300">风险提示：</strong>区块链交易存在风险，请勿使用真实资金操作。</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span><strong className="text-gray-300">测试环境：</strong>建议仅在测试网络（如 Sepolia）上进行实验。</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span><strong className="text-gray-300">自负责任：</strong>使用本项目产生的任何后果由用户自行承担。</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                      本项目代码仅作为学习 Myswap V2 协议、智能合约交互、Web3 前端开发的技术参考。
                      请遵守当地法律法规，不得用于非法用途或未经授权的金融活动。
                    </p>
                  </div>

                  {/* GitHub 链接 */}
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">开源项目</p>
                          <p className="text-sm font-medium text-gray-300">ToWeb3 - DeFi Toolkit</p>
                        </div>
                      </div>
                      <a
                        href="https://github.com/zhouhangmyers/ToWeb3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        查看源码
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
            <p>Built with Next.js + Wagmi + Uniswap V2</p>
            <p className="mt-2 text-xs text-gray-700">作者：周航</p>
            <p className="mt-1 text-xs text-gray-700">© 2026 toweb3.fun. All rights reserved. For educational purposes only.</p>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}