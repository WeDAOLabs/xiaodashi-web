'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Play, RefreshCw, Download } from 'lucide-react';

interface SimulationParams {
  budget: number;
  audienceSize: number;
  duration: number;
}

interface SimulationResult {
  metric: string;
  current: number;
  predicted: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

interface StrategySimulatorProps {
  title?: string;
}

const defaultParams: SimulationParams = {
  budget: 50,
  audienceSize: 70,
  duration: 14
};

const simulationResults: SimulationResult[] = [
  {
    metric: '预计GMV',
    current: 125000,
    predicted: 156000,
    change: '+24.8%',
    changeType: 'positive'
  },
  {
    metric: '预计ROI',
    current: 3.2,
    predicted: 4.1,
    change: '+28.1%',
    changeType: 'positive'
  },
  {
    metric: '预计转化率',
    current: 2.8,
    predicted: 3.6,
    change: '+28.6%',
    changeType: 'positive'
  },
  {
    metric: '预计获客成本',
    current: 85,
    predicted: 72,
    change: '-15.3%',
    changeType: 'positive'
  }
];

const chartData = [
  { name: '当前策略', value: 125000, color: 'var(--color-chart-2)' },
  { name: '优化策略', value: 156000, color: 'var(--color-chart-1)' }
];

const chartConfig = {
  value: {
    label: 'GMV (元)',
  },
};

const StrategySimulator: React.FC<StrategySimulatorProps> = ({
  title = '策略模拟器'
}) => {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleParamChange = (param: keyof SimulationParams, value: number[]): void => {
    setParams(prev => ({
      ...prev,
      [param]: value[0]
    }));
  };

  const handleSimulate = async (): Promise<void> => {
    setIsSimulating(true);
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSimulating(false);
  };

  const handleReset = (): void => {
    setParams(defaultParams);
  };

  const formatValue = (metric: string, value: number): string => {
    switch (metric) {
      case '预计GMV':
        return `¥${(value / 10000).toFixed(1)}万`;
      case '预计ROI':
        return `${value.toFixed(1)}:1`;
      case '预计转化率':
        return `${value.toFixed(1)}%`;
      case '预计获客成本':
        return `¥${value.toFixed(0)}`;
      default:
        return value.toString();
    }
  };

  return (
    <Card className="bg-[var(--bg-primary)] shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 参数调整区域 */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-[var(--text-primary)]">调整策略参数</h3>

          {/* 预算调整 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                预算调整
              </label>
              <Badge variant="outline" className="text-xs">
                {params.budget > 50 ? '+' : params.budget < 50 ? '' : ''}{params.budget - 50}%
              </Badge>
            </div>
            <Slider
              value={[params.budget]}
              onValueChange={(value) => handleParamChange('budget', value)}
              max={150}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>-90%</span>
              <span>基线</span>
              <span>+100%</span>
            </div>
          </div>

          {/* 受众规模调整 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                受众规模
              </label>
              <Badge variant="outline" className="text-xs">
                {params.audienceSize > 50 ? '+' : params.audienceSize < 50 ? '' : ''}{params.audienceSize - 50}%
              </Badge>
            </div>
            <Slider
              value={[params.audienceSize]}
              onValueChange={(value) => handleParamChange('audienceSize', value)}
              max={200}
              min={20}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>-60%</span>
              <span>基线</span>
              <span>+300%</span>
            </div>
          </div>

          {/* 投放周期调整 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                投放周期
              </label>
              <Badge variant="outline" className="text-xs">
                {params.duration}天
              </Badge>
            </div>
            <Slider
              value={[params.duration]}
              onValueChange={(value) => handleParamChange('duration', value)}
              max={60}
              min={7}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>7天</span>
              <span>30天</span>
              <span>60天</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex-1 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                模拟中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                开始模拟
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-4"
          >
            重置
          </Button>
        </div>

        {/* 模拟结果 */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-[var(--text-primary)]">预测结果</h3>

          {/* GMV对比图表 */}
          <div className="h-32 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    fill="var(--color-chart-1)"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`¥${(value / 10000).toFixed(1)}万`, 'GMV']}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* 指标对比 */}
          <div className="grid grid-cols-2 gap-3">
            {simulationResults.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-secondary)]"
              >
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  {result.metric}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {formatValue(result.metric, result.predicted)}
                  </span>
                  <span className={`text-xs font-medium ${
                    result.changeType === 'positive'
                      ? 'text-[var(--color-chart-1)]'
                      : result.changeType === 'negative'
                      ? 'text-[var(--color-chart-5)]'
                      : 'text-[var(--text-secondary)]'
                  }`}>
                    {result.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 额外操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            下载报告
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategySimulator;