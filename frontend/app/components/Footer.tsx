import Link from 'next/link';

const Footer = () => (
  <footer className="bg-gray-50 py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link
          href="/"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          首页
        </Link>
        <Link
          href="/products"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          产品
        </Link>
        <Link
          href="/solutions"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          解决方案
        </Link>
        <Link
          href="#"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          客户案例
        </Link>
        <Link
          href="#"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          定价
        </Link>
        <Link
          href="#"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          联系我们
        </Link>
        <Link
          href="#"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          隐私政策
        </Link>
        <Link
          href="#"
          className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
        >
          服务条款
        </Link>
      </div>
      <p className="mt-6 text-center text-sm font-normal leading-normal text-[var(--text-secondary)]">
        © 2025 智商180的AI全域营销大师。保留所有权利。
      </p>
    </div>
  </footer>
);

export default Footer;
