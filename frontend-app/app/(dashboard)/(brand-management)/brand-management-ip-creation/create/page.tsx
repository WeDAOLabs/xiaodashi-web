'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateIPPage() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到第一步
    router.replace('/brand-management-ip-creation/create/step1');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)] mx-auto"></div>
        <p className="mt-4 text-[var(--text-secondary)]">正在初始化IP创建流程...</p>
      </div>
    </div>
  );
}