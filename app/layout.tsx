import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的 DeFi 应用",
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
        </ClientProviders>
      </body>
    </html>
  );
}