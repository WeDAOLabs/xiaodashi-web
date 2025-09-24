'use client';

import { useAuth } from '@/components/layout/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
          <p className="text-gray-600">验证身份中...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, don't render children
  if (!user && !isLoading) {
    return null;
  }

  // If user exists, render children
  return <>{children}</>;
};

export default ProtectedRoute;