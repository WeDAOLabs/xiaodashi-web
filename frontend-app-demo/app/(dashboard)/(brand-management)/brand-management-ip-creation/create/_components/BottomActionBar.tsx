'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Rocket } from 'lucide-react';
import { useIPCreation } from './IPCreationContext';

export default function BottomActionBar() {
  const { data, saveProgress, currentStep } = useIPCreation();

  const handleSaveDraft = () => {
    saveProgress();
    // 显示保存成功提示
    console.log('草稿已保存');
  };

  const handleExportPlan = () => {
    // 导出IP打造方案逻辑
    console.log('导出IP打造方案', data);
  };

  const handlePublishIP = () => {
    // 发布IP逻辑
    console.log('发布IP', data);
  };

  const isComplete = currentStep === 5 && data.publishStrategy && data.riskAssessment;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-t border-[var(--border-primary)] z-10 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-20 gap-4">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            保存草稿
          </Button>

          <Button
            variant="outline"
            onClick={handleExportPlan}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出IP打造方案
          </Button>

          <Button
            onClick={handlePublishIP}
            disabled={!isComplete}
            className="flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            发布IP
          </Button>
        </div>
      </div>
    </div>
  );
}