'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import CircularProgress from '@/components/ui/circular-progress';
import { CheckCircle } from 'lucide-react';

const DataCleaningPanel: React.FC = () => {
  const [attributionModel, setAttributionModel] = React.useState('u-shaped');

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-5 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">数据清洗与转换</h3>
        </div>

        {/* 清洗状态 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">清洗状态</h4>
          <div className="flex items-center gap-6">
            {/* 环形进度图 */}
            <CircularProgress value={95} size="lg" />
            <div className="space-y-1">
              <p className="text-sm text-[var(--text-secondary)]">
                数据质量评分: <span className="font-bold text-[var(--color-success-600)]">良好</span>
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                异常数据: <span className="font-bold text-[var(--text-primary)]">0.2%</span>
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                最后同步: <span className="font-bold text-[var(--text-primary)]">2小时前</span>
              </p>
            </div>
          </div>
        </div>

        {/* 归因模型配置 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">归因模型配置</h4>
          <Select value={attributionModel} onValueChange={setAttributionModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择归因模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">线性归因</SelectItem>
              <SelectItem value="first-touch">首次接触归因</SelectItem>
              <SelectItem value="last-touch">最后接触归因</SelectItem>
              <SelectItem value="u-shaped">U型归因</SelectItem>
              <SelectItem value="time-decay">时间衰减归因</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            当前使用: <span className="font-semibold">U型归因</span> - 首末触点各占40%，中间触点占20%
          </p>
        </div>

        {/* 数据字典验证 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">数据字典验证</h4>
          <div className="flex items-center gap-2 text-sm text-[var(--color-success-600)] bg-[var(--color-success-50)] p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>营销事件埋点一致性校验通过。</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">字段匹配率</span>
              <span className="font-semibold text-[var(--text-primary)]">98.5%</span>
            </div>
            <Progress value={98.5} className="h-2" />
          </div>
        </div>

        {/* 清洗规则摘要 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">当前清洗规则</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]" />
              <span className="text-[var(--text-secondary)]">去除重复记录</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]" />
              <span className="text-[var(--text-secondary)]">标准化时间格式</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary-500)]" />
              <span className="text-[var(--text-secondary)]">异常值检测与处理</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button variant="outline" size="sm">
            配置清洗规则
          </Button>
          <Button variant="outline" size="sm">
            选择归因模型
          </Button>
          <Button size="sm">
            手动触发清洗
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCleaningPanel;