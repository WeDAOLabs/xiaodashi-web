'use client';

import BellIcon from '@/components/icons/BellIcon';
import LogoIcon from '@/components/icons/LogoIcon';
import { useAuth } from '@/components/layout/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="app-header">
      <div className="flex items-center gap-4 text-[var(--text-primary)]">
        <div className="size-4">
          <LogoIcon />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">智赢</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-2">
            <button className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--bg-secondary)] px-2.5 text-sm font-bold leading-normal tracking-[0.015em]">
                <BellIcon className="size-5" />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="relative size-10">
                  <Image
                    src={user.avatar || "/images/dashboard/avatar.png"}
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-xs text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative size-10">
                <Image
                  src="/images/dashboard/avatar.png"
                  alt="User Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;