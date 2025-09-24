'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, Shield, Bell, CreditCard, Plug } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import LanguageRegionForm from './LanguageRegionForm';
import DangerZone from './DangerZone';

interface SettingsTabsProps {
  className?: string;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ className }) => {
  return (
    <div className={className}>
      <Tabs defaultValue="profile" className="w-full">
        {/* 标签页导航 */}
        <div className="mb-8 border-b border-[var(--border-secondary)]">
          <TabsList className="border-b border-[var(--border-secondary)] bg-transparent h-auto p-0 rounded-none w-full justify-start">
            <TabsTrigger
              value="profile"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-500)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300 bg-transparent"
            >
              <User className="w-5 h-5" />
              个人资料
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-500)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300 bg-transparent"
            >
              <Shield className="w-5 h-5" />
              安全
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-500)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300 bg-transparent"
            >
              <Bell className="w-5 h-5" />
              通知
            </TabsTrigger>

            <TabsTrigger
              value="billing"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-500)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300 bg-transparent"
            >
              <CreditCard className="w-5 h-5" />
              账单
            </TabsTrigger>

            <TabsTrigger
              value="integrations"
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-500)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300 bg-transparent"
            >
              <Plug className="w-5 h-5" />
              集成
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-8">
          <TabsContent value="profile" className="space-y-8">
            <PersonalInfoForm />
            <LanguageRegionForm />
            <DangerZone />
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">安全设置</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">管理您的密码和安全选项。</p>
              <div className="mt-4 text-center py-8">
                <p className="text-[var(--text-tertiary)]">安全设置功能开发中...</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-8">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">通知设置</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">管理您的通知偏好。</p>
              <div className="mt-4 text-center py-8">
                <p className="text-[var(--text-tertiary)]">通知设置功能开发中...</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-8">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">账单设置</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">管理您的订阅和账单信息。</p>
              <div className="mt-4 text-center py-8">
                <p className="text-[var(--text-tertiary)]">账单设置功能开发中...</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-8">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">集成设置</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">管理第三方应用和服务集成。</p>
              <div className="mt-4 text-center py-8">
                <p className="text-[var(--text-tertiary)]">集成设置功能开发中...</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsTabs;