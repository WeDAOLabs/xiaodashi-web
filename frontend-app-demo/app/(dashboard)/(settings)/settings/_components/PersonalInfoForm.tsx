'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/layout/AuthContext';
import Image from 'next/image';

interface PersonalInfoFormProps {
  className?: string;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  avatar: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ className }) => {
  const { user } = useAuth();

  const initialPersonalInfo: PersonalInfo = useMemo(() => ({
    fullName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '/images/dashboard/avatar.png'
  }), [user]);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo);

  // 当用户数据变更时，更新表单状态
  useEffect(() => {
    setPersonalInfo(initialPersonalInfo);
  }, [initialPersonalInfo]);

  // 检查表单是否有变更
  const hasChanges = useMemo(() => {
    return (
      personalInfo.fullName !== initialPersonalInfo.fullName ||
      personalInfo.email !== initialPersonalInfo.email ||
      personalInfo.avatar !== initialPersonalInfo.avatar
    );
  }, [personalInfo, initialPersonalInfo]);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // 这里可以添加保存逻辑
    console.log('保存个人信息:', personalInfo);
  };

  const handleAvatarChange = () => {
    // 这里可以添加头像上传逻辑
    console.log('更改头像');
  };

  const handleAvatarRemove = () => {
    // 这里可以添加头像移除逻辑
    console.log('移除头像');
  };

  return (
    <div className={`bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm ${className || ''}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">个人信息</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">更新您的照片和个人详细信息。</p>
      </div>

      <div className="border-t border-[var(--border-secondary)] p-6 space-y-6">
        {/* 头像设置 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <Label htmlFor="avatar" className="text-sm font-medium text-[var(--text-primary)] pt-2">您的照片</Label>
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <Image
                src={personalInfo.avatar}
                alt="User Avatar"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/images/dashboard/avatar.png';
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAvatarChange}
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-2 rounded-lg hover:bg-[var(--border-primary)] transition-colors text-sm font-semibold"
                >
                  更改
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAvatarRemove}
                  className="text-[var(--text-secondary)] px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm font-semibold"
                >
                  移除
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 姓名字段 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <Label htmlFor="fullName" className="text-sm font-medium text-[var(--text-primary)] pt-2">姓名</Label>
          <div className="md:col-span-2">
            <Input
              type="text"
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        {/* 邮箱字段 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <Label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)] pt-2">电子邮箱</Label>
          <div className="md:col-span-2">
            <Input
              type="email"
              id="email"
              value={personalInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-shadow disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed"
              disabled
            />
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="bg-[var(--bg-tertiary)] border-t border-[var(--border-secondary)] px-6 py-4 flex justify-end rounded-b-lg">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-5 py-2 rounded-lg transition-colors text-sm font-semibold ${
            hasChanges
              ? 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]'
              : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] cursor-not-allowed'
          }`}
        >
          保存更改
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;