'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import PlatformSelector from './PlatformSelector';
import type { TaskType } from '../page';

interface PublishSidebarProps {
  taskType: TaskType;
}

const PublishSidebar: React.FC<PublishSidebarProps> = ({ taskType }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['jingdong']);
  const [configMode, setConfigMode] = useState<'unified' | 'differentiated'>('unified');
  const [publishType, setPublishType] = useState<'now' | 'scheduled'>('now');

  const handlePublish = () => {
    console.log('一键发布', { taskType, selectedPlatforms, configMode, publishType });
  };

  const handleViewStatus = () => {
    console.log('查看发布状态');
  };

  return (
    <Card className="w-96 bg-[var(--bg-primary)] h-full rounded-lg shadow-sm border border-[var(--border-secondary)] flex flex-col">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          发布配置与预览
        </CardTitle>
      </CardHeader>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {/* 平台选择 */}
        <PlatformSelector
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={setSelectedPlatforms}
        />

        {/* 平台规则适配 */}
        <div>
          <h4 className="font-semibold text-[var(--text-primary)] mb-3">平台规则适配</h4>
          <div className="flex border border-[var(--border-primary)] rounded-lg p-1 bg-[var(--bg-secondary)] text-sm">
            <button
              onClick={() => setConfigMode('unified')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                configMode === 'unified'
                  ? 'bg-[var(--bg-primary)] text-[var(--primary-color)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              统一配置
            </button>
            <button
              onClick={() => setConfigMode('differentiated')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                configMode === 'differentiated'
                  ? 'bg-[var(--bg-primary)] text-[var(--primary-color)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              差异化配置
            </button>
          </div>
          <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              在此处设置的内容将应用到所有选中的平台和店铺。
            </p>
          </div>
        </div>

        {/* 发布预览 */}
        <div>
          <h4 className="font-semibold text-[var(--text-primary)] mb-3">发布预览</h4>
          <div className="border border-dashed border-[var(--border-primary)] rounded-lg h-32 flex flex-col items-center justify-center bg-[var(--bg-secondary)]">
            <Eye className="w-8 h-8 text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-tertiary)] mt-2">
              模拟在{selectedPlatforms.includes('jingdong') ? '京东' : '选中平台'}APP上的呈现效果
            </p>
          </div>
          <div className="mt-3 p-3 flex items-center bg-[var(--color-success-50)] border border-[var(--color-success-100)] rounded-lg text-sm text-[var(--color-success-600)]">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>内容符合所有已选平台的发布规则。</span>
          </div>
        </div>
      </div>

      {/* 底部发布区域 */}
      <div className="px-6 py-4 border-t border-[var(--border-secondary)] bg-[var(--bg-primary)] space-y-3">
        <div>
          <Label className="text-sm font-medium text-[var(--text-secondary)]">发布方式</Label>
          <RadioGroup
            value={publishType}
            onValueChange={(value) => setPublishType(value as 'now' | 'scheduled')}
            className="flex items-center space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="publishNow" />
              <Label htmlFor="publishNow" className="text-sm">立即发布</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="publishLater" />
              <Label htmlFor="publishLater" className="text-sm">定时发布</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handlePublish}
          className="w-full flex justify-center items-center bg-[var(--primary-color)] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Send className="w-5 h-5 mr-2" />
          一键发布
        </Button>

        <Button
          variant="ghost"
          onClick={handleViewStatus}
          className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] font-medium"
        >
          查看发布状态
        </Button>
      </div>
    </Card>
  );
};

export default PublishSidebar;