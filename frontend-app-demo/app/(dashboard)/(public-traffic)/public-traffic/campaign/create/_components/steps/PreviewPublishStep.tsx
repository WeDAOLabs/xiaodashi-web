'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { StepProps } from '../types/campaign';

// 平台显示名称映射
const platformNames = {
  douyin: '抖音',
  wechat: '微信',
  baidu: '百度',
  xiaohongshu: '小红书',
  meituan: '美团'
};

// 营销目标显示名称映射
const objectiveNames = {
  brand: '品牌曝光',
  traffic: '引流至私域',
  conversion: '商品销售转化',
  leads: '收集线索'
};

// 投放策略显示名称映射
const strategyNames = {
  max_performance: '效果最大化',
  cost_control: '成本控制',
  fast_delivery: '快速跑量'
};

// 受众类型显示名称映射
const audienceTypeNames = {
  ai: 'AI推荐',
  existing: '已有受众包',
  custom: '自定义受众'
};

// 创意来源显示名称映射
const creativeSourceNames = {
  library: '素材中心',
  ai_generate: 'AI智能生成'
};

const PreviewPublishStep: React.FC<StepProps> = ({
  formData,
  onPrev,
  onNavigateToStep
}) => {
  const handleSaveDraft = () => {
    // 保存草稿逻辑
    console.log('保存草稿', formData);
  };

  const handlePublish = () => {
    // 发布逻辑
    console.log('发布计划', formData);
  };

  const handleEditStep = (step: number) => {
    // 使用父组件提供的统一导航函数
    onNavigateToStep?.(step);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">第四步: 预览与发布</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">请最终确认所有设置。AI将进行合规性与潜在风险预警。</p>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* 左侧：计划概览 */}
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">计划概览</h3>
          <dl className="mt-4">
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">投放平台</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>{formData.platform ? platformNames[formData.platform] : '-'}</span>
                <button
                  onClick={() => handleEditStep(1)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">营销目标</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>{formData.objective ? objectiveNames[formData.objective] : '-'}</span>
                <button
                  onClick={() => handleEditStep(1)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">投放策略</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>{formData.strategy ? strategyNames[formData.strategy] : '-'}</span>
                <button
                  onClick={() => handleEditStep(2)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">总预算</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>￥{formData.budget?.total?.toLocaleString() || '-'}</span>
                <button
                  onClick={() => handleEditStep(2)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">日预算</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>￥{formData.budget?.daily?.toLocaleString() || '-'}</span>
                <button
                  onClick={() => handleEditStep(2)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">投放时间</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>
                  {formData.schedule?.startDate && formData.schedule?.endDate
                    ? `${formData.schedule.startDate} 至 ${formData.schedule.endDate}`
                    : '-'}
                </span>
                <button
                  onClick={() => handleEditStep(2)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">受众选择</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>{formData.audience?.type ? audienceTypeNames[formData.audience.type] : '-'}</span>
                <button
                  onClick={() => handleEditStep(3)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--border-secondary)]">
              <dt className="text-sm font-medium text-[var(--text-secondary)]">创意来源</dt>
              <dd className="text-sm text-[var(--text-primary)] text-right flex items-center">
                <span>{formData.creative?.source ? creativeSourceNames[formData.creative.source] : '-'}</span>
                <button
                  onClick={() => handleEditStep(3)}
                  className="ml-4 text-xs text-[var(--accent-color)] hover:underline"
                >
                  修改
                </button>
              </dd>
            </div>
          </dl>
        </div>

        {/* 右侧：AI检查 */}
        <div className="space-y-6">
          {/* AI风险预警 */}
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">AI风险预警</h3>
            <div className="mt-4 rounded-lg border border-[var(--warning-border)] bg-[var(--warning-bg)] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-[var(--warning-color)]" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[var(--warning-color)]">潜在问题</h3>
                  <div className="mt-2 text-sm text-[var(--warning-color)]">
                    <ul className="list-disc space-y-1 pl-5">
                      {formData.budget?.total && formData.budget.total < 3000 && (
                        <li>预算可能不足以覆盖一个完整的投放学习周期。</li>
                      )}
                      {formData.audience?.type === 'custom' && (
                        <li>受众范围可能过窄，建议适当放宽条件以获取更多流量。</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 合规性检查 */}
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">合规性检查</h3>
            <div className="mt-4 rounded-lg border border-[var(--success-border)] bg-[var(--success-bg)] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-[var(--success-color)]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--success-color)]">
                    创意及文案符合平台合规要求
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-10 flex flex-wrap justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPrev}
          className="px-6 py-2.5 text-sm font-semibold"
        >
          上一步
        </Button>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="px-6 py-2.5 text-sm font-semibold"
          >
            保存草稿
          </Button>
          <Button
            onClick={handlePublish}
            className="px-8 py-2.5 text-sm font-semibold"
          >
            发布计划
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPublishStep;