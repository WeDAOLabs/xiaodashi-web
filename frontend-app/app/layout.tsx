import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const notoSansSC = localFont({
  src: [
    {
      path: "../fonts/noto-sans-sc-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noto-sans-sc-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noto-sans-sc-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/noto-sans-sc-900.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

const splineSans = localFont({
  src: [
    {
      path: "../fonts/spline-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/spline-sans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/spline-sans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-spline-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "小大师 AI 营销平台 - 应用产品平台",
  description: "智能营销解决方案，助力企业数字化转型",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSansSC.variable} ${splineSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
