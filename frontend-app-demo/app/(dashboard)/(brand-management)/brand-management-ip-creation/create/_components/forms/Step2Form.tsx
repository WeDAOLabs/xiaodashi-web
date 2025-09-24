'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Sparkles, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useIPCreation } from '../IPCreationContext';

// 竞品分析数据类型定义
interface CompetitorAnalysisData {
  name: string;
  influence: number;     // 影响力 (0-100)
  audienceMatch: number; // 受众匹配度 (0-100)
}

export default function Step2Form() {
  const { data, dispatch, nextStep, prevStep } = useIPCreation();

  // 竞品分析示例数据
  const competitorAnalysisData: CompetitorAnalysisData[] = [
    { name: "竞品IP A", influence: 85, audienceMatch: 75 },
    { name: "竞品IP B", influence: 92, audienceMatch: 88 },
    { name: "竞品IP C", influence: 78, audienceMatch: 65 }
  ];

  // 图表配置
  const chartConfig = {
    influence: {
      label: "影响力",
      color: "var(--primary-color)"
    },
    audienceMatch: {
      label: "受众匹配度",
      color: "var(--accent-color)"
    }
  };

  const handleTargetVisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'targetVision', value: e.target.value });
  };

  const handleCoreConceptValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'coreConceptValue', value: e.target.value });
  };

  const handleNext = () => {
    if (data.targetVision.trim()) {
      nextStep();
    }
  };

  const isFormValid = data.targetVision.trim();

  return (
    <div className="space-y-8">
      {/* 目标与愿景 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">目标与愿景</h3>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="target-vision" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              请描述IP的创建初衷、期望达成的目标 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="target-vision"
              rows={4}
              value={data.targetVision}
              onChange={handleTargetVisionChange}
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
              placeholder="例如：希望创建一个能够陪伴年轻人成长的虚拟形象，传递积极向上的价值观..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 目标受众画像 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">目标受众画像</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI建议
          </Button>
        </div>
        <CardContent className="p-4">
          <Alert className="bg-[var(--info-bg)] border-[var(--info-border)] text-[var(--info-color)]">
            <TrendingUp className="w-4 h-4" />
            <AlertDescription className="text-sm whitespace-pre-wrap">
              <strong className="font-bold mb-2 block">AI 优化建议</strong>
              基于您的IP类型&quot;{data.ipType === 'virtual-character' ? '虚拟形象' : data.ipType}&quot;，我们建议目标受众为：
              {'\n'}1. **核心人群 (18-25岁):** 对新鲜虚拟事物接受度高的Z世代，活跃于B站、抖音等平台。他们注重个性和情感连接。
              {'\n'}2. **潜力人群 (26-35岁):** 有一定消费能力的年轻白领，关注生活品质和潮流文化，是IP衍生品的主要消费群体。
              {'\n'}3. **媒体触点建议:** 可在小红书进行种草营销，通过抖音短视频进行内容扩散，并在B站建立深度粉丝社群。
            </AlertDescription>
          </Alert>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            基于市场数据和流行趋势，AI可以提供受众细分和优化建议。
          </p>
        </CardContent>
      </Card>

      {/* IP核心概念与价值主张 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">IP核心概念与价值主张</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI生成创意文案
          </Button>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="core-concept" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              请定义IP的核心价值、个性、世界观或故事背景
            </label>
            <Textarea
              id="core-concept"
              rows={4}
              value={data.coreConceptValue}
              onChange={handleCoreConceptValueChange}
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
              placeholder="描述IP的核心价值和世界观..."
            />
          </div>

          <div className="mt-4 p-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-md space-y-3">
            <h4 className="font-bold text-sm text-[var(--info-color)]">AI 创意文案选项</h4>

            <div className="text-sm text-[var(--text-secondary)] border-b border-[var(--info-border)] pb-2">
              <p><strong>方案一：</strong> {data.ipName}，一个来自赛博都市的神秘伙伴，带着{data.keywords.join('、')}的独特魅力，即将揭开未来的面纱。</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 h-auto mt-1 p-1"
                onClick={() => dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'coreConceptValue',
                  value: `${data.ipName}，一个来自赛博都市的神秘伙伴，带着${data.keywords.join('、')}的独特魅力，即将揭开未来的面纱。`
                })}
              >
                采纳此项
              </Button>
            </div>

            <div className="text-sm text-[var(--text-secondary)] border-b border-[var(--info-border)] pb-2">
              <p><strong>方案二：</strong> 不只是一个形象，{data.ipName}是每个追求独立与梦想者内心的投射。它{data.keywords.join('、')}，为你而来。</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 h-auto mt-1 p-1"
                onClick={() => dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'coreConceptValue',
                  value: `不只是一个形象，${data.ipName}是每个追求独立与梦想者内心的投射。它${data.keywords.join('、')}，为你而来。`
                })}
              >
                采纳此项
              </Button>
            </div>

            <div className="text-sm text-[var(--text-secondary)] pb-2">
              <p><strong>方案三：</strong> 当{data.keywords.join('与')}碰撞，{data.ipName}就此诞生。准备好进入它的奇妙世界了吗？</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 h-auto mt-1 p-1"
                onClick={() => dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'coreConceptValue',
                  value: `当${data.keywords.join('与')}碰撞，${data.ipName}就此诞生。准备好进入它的奇妙世界了吗？`
                })}
              >
                采纳此项
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 竞品IP分析 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">竞品IP分析</h3>
          <Button
            variant="outline"
            size="sm"
          >
            AI对比分析
          </Button>
        </div>
        <CardContent className="p-4">
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={competitorAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-[var(--text-tertiary)]"
              />
              <YAxis
                domain={[0, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-[var(--text-tertiary)]"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="influence"
                fill="var(--color-influence)"
                radius={[2, 2, 0, 0]}
                name="影响力"
              />
              <Bar
                dataKey="audienceMatch"
                fill="var(--color-audienceMatch)"
                radius={[2, 2, 0, 0]}
                name="受众匹配度"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* AI定位报告总结 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">AI定位报告总结</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            生成定位报告
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
            <strong>IP定位报告摘要 ({data.ipName}):</strong>
            {'\n'}- <strong>市场空白:</strong> 当前市场同类型IP多集中于搞笑、治愈系，{data.ipName}的{data.keywords.join('、')}定位具有较高的独特性和识别度。
            {'\n'}- <strong>独特性评估:</strong> 核心卖点清晰，关键词富有想象空间，能够有效吸引目标受众的注意力。
            {'\n'}- <strong>潜在吸引力:</strong> 预计在Z世代群体中能快速建立认知，商业化潜力巨大，特别是在潮玩、数字藏品领域。
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
        >
          上一步
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => console.log('保存当前步骤')}
          >
            保存
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
          >
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
}