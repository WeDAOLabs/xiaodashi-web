import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '智能公域流量投放与优化',
  description: '统一管理和优化各大平台的公域流量投放，通过AI智能分析提升投放效果'
};

interface PublicTrafficLayoutProps {
  children: React.ReactNode;
}

const PublicTrafficLayout: React.FC<PublicTrafficLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default PublicTrafficLayout;