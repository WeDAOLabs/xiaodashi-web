import type { Metadata } from 'next';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-sans-sc/900.css';
import '@fontsource/spline-sans/400.css';
import '@fontsource/spline-sans/500.css';
import '@fontsource/spline-sans/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: '智商180的AI全域营销大师',
  description: '智能营销，重塑增长',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`font-sans bg-[var(--background-color)] text-[var(--text-primary)]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
