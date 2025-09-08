import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const noto_sans_sc = localFont({
  src: [
    { path: '../fonts/noto-sans-sc-400.woff2', weight: '400' },
    { path: '../fonts/noto-sans-sc-500.woff2', weight: '500' },
    { path: '../fonts/noto-sans-sc-700.woff2', weight: '700' },
    { path: '../fonts/noto-sans-sc-900.woff2', weight: '900' },
  ],
  variable: '--font-noto-sans-sc',
});

const spline_sans = localFont({
  src: [
    { path: '../fonts/spline-sans-400.woff2', weight: '400' },
    { path: '../fonts/spline-sans-500.woff2', weight: '500' },
    { path: '../fonts/spline-sans-700.woff2', weight: '700' },
  ],
  variable: '--font-spline-sans',
});

export const metadata: Metadata = {
  title: '智赢·全域营销大师',
  description: '智赢，智商180的AI全域营销大师',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${noto_sans_sc.variable} ${spline_sans.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`font-sans bg-[var(--background-color)] text-[var(--text-primary)]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
