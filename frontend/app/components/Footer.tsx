'use client';

import Link from 'next/link';
import { useState } from 'react';
import ContactSalesModal from './ContactSalesModal';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
              href="/customer-stories"
              className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
            >
              客户案例
            </Link>
            <Link
              href="/community"
              className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
            >
              社区
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary-color)]"
            >
              联系我们
            </button>
          </div>
          <p className="mt-6 text-center text-sm font-normal leading-normal text-[var(--text-secondary)]">
            © 2025 互远AI,保留所有权利。
          </p>
        </div>
      </footer>
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Footer;
