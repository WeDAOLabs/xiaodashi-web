'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SVGProps, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', text: '首页' },
    { href: '/products', text: '产品' },
    { href: '/solutions', text: '解决方案' },
    { href: '/customer-stories', text: '客户案例' },
    { href: '/pricing', text: '定价' },
    { href: '/community', text: '社区' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-[var(--background-color)] bg-opacity-80 px-4 py-4 backdrop-blur-md sm:px-10">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-8 text-[var(--primary-color)]">
            <Icon />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[var(--text-primary)]">
            智商180的AI全域营销大师
          </h2>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors duration-200 hover:text-[var(--primary-color)]',
                pathname === link.href
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)]'
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-[var(--accent-color)]">
            <span className="truncate">免费试用</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-gray-100 text-[var(--text-primary)] text-sm font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-gray-200">
            <span className="truncate">登录</span>
          </button>
        </div>
        <button
          className="z-50 p-2 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 flex h-screen flex-col bg-[var(--background-color)] lg:hidden">
          <nav className="flex flex-col items-center gap-8 pt-24">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className={cn(
                  'text-lg font-medium transition-colors duration-200 hover:text-[var(--primary-color)]',
                  pathname === link.href
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  );
}

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);
