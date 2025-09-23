'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageRegionFormProps {
  className?: string;
}

interface LanguageRegionSettings {
  language: string;
  timezone: string;
}

const LanguageRegionForm: React.FC<LanguageRegionFormProps> = ({ className }) => {
  const initialSettings: LanguageRegionSettings = {
    language: 'zh-CN',
    timezone: 'GMT+8'
  };

  const [settings, setSettings] = useState<LanguageRegionSettings>(initialSettings);

  // 检查表单是否有变更
  const hasChanges = useMemo(() => {
    return (
      settings.language !== initialSettings.language ||
      settings.timezone !== initialSettings.timezone
    );
  }, [settings, initialSettings]);

  const handleSettingChange = (field: keyof LanguageRegionSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // 这里可以添加保存逻辑
    console.log('保存语言地区设置:', settings);
  };

  return (
    <div className={`bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-sm ${className || ''}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">语言和地区</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">管理您的语言和时区设置。</p>
      </div>

      <div className="border-t border-[var(--border-secondary)] p-6 space-y-6">
        {/* 语言设置 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <Label htmlFor="language" className="text-sm font-medium text-[var(--text-primary)] pt-2">语言</Label>
          <div className="md:col-span-2">
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-shadow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="ja-JP">日本語</SelectItem>
                <SelectItem value="ko-KR">한국어</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 时区设置 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <Label htmlFor="timezone" className="text-sm font-medium text-[var(--text-primary)] pt-2">时区</Label>
          <div className="md:col-span-2">
            <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
              <SelectTrigger className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-shadow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT-8">(GMT-08:00) Pacific Time</SelectItem>
                <SelectItem value="GMT+0">(GMT+00:00) Greenwich Mean Time</SelectItem>
                <SelectItem value="GMT+8">(GMT+08:00) Beijing, Hong Kong</SelectItem>
                <SelectItem value="GMT+9">(GMT+09:00) Tokyo, Seoul</SelectItem>
                <SelectItem value="GMT-5">(GMT-05:00) Eastern Time</SelectItem>
                <SelectItem value="GMT+1">(GMT+01:00) Central European Time</SelectItem>
              </SelectContent>
            </Select>
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

export default LanguageRegionForm;