'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ActivityInfo {
  name: string;
  banner: File | null;
  description: string;
  startTime: string;
  endTime: string;
}

interface ActivityInfoFormProps {
  activityInfo: ActivityInfo;
  onInfoChange: (info: ActivityInfo) => void;
}

const ActivityInfoForm: React.FC<ActivityInfoFormProps> = ({
  activityInfo,
  onInfoChange
}) => {
  const [showAiSuggestion] = useState(true);

  const handleInputChange = (field: keyof ActivityInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onInfoChange({
      ...activityInfo,
      [field]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onInfoChange({
      ...activityInfo,
      banner: file
    });
  };

  const handleAiOptimize = () => {
    // TODO: 实现AI优化功能
    console.log('AI智能促销策略推荐');
  };

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          通用活动信息
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="campaignName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                活动名称
              </Label>
              <Input
                id="campaignName"
                placeholder="例如: 夏季清仓大促"
                value={activityInfo.name}
                onChange={handleInputChange('name')}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="campaignBanner" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                活动主图 (Banner)
              </Label>
              <Input
                id="campaignBanner"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="campaignDesc" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              活动描述
            </Label>
            <Textarea
              id="campaignDesc"
              rows={4}
              placeholder="详细描述活动规则和亮点..."
              value={activityInfo.description}
              onChange={handleInputChange('description')}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startTime" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                活动开始时间
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={activityInfo.startTime}
                onChange={handleInputChange('startTime')}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                活动结束时间
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={activityInfo.endTime}
                onChange={handleInputChange('endTime')}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* AI智能推荐区域 */}
        <div className="mt-6 border-t border-[var(--border-secondary)] pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleAiOptimize}
              className="flex items-center text-sm font-semibold bg-[var(--color-primary-50)] text-[var(--primary-color)] border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI智能促销策略推荐
            </Button>
          </div>
          {showAiSuggestion && (
            <div className="mt-4 p-4 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg text-sm text-[var(--color-info-600)]">
              <p className="font-semibold mb-1">AI 建议:</p>
              <p>&quot;满199减20&quot;的优惠券能有效鼓励用户增加购物车价值，从而提高平均订单价值（AOV）。</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInfoForm;