'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ChannelData {
  channel: string;
  investment: string;
  output: string;
  roi: string;
  roiValue: number;
  conversionRate: string;
  conversionValue: number;
  ltv: string;
  status: 'high' | 'medium' | 'low';
}

interface ComparisonChartProps {
  title?: string;
  data?: ChannelData[];
}

const defaultData: ChannelData[] = [
  {
    channel: '搜索引擎SEM',
    investment: '￥50W',
    output: '￥200W',
    roi: '1:4',
    roiValue: 4,
    conversionRate: '2.5%',
    conversionValue: 2.5,
    ltv: '￥400',
    status: 'high'
  },
  {
    channel: '短视频信息流',
    investment: '￥30W',
    output: '￥100W',
    roi: '1:3.3',
    roiValue: 3.3,
    conversionRate: '1.8%',
    conversionValue: 1.8,
    ltv: '￥320',
    status: 'medium'
  },
  {
    channel: '微信公众号',
    investment: '￥10W',
    output: '￥60W',
    roi: '1:6',
    roiValue: 6,
    conversionRate: '3.0%',
    conversionValue: 3.0,
    ltv: '￥500',
    status: 'high'
  },
  {
    channel: '社交媒体推广',
    investment: '￥25W',
    output: '￥75W',
    roi: '1:3',
    roiValue: 3,
    conversionRate: '1.5%',
    conversionValue: 1.5,
    ltv: '￥280',
    status: 'medium'
  },
  {
    channel: 'KOL合作',
    investment: '￥20W',
    output: '￥72W',
    roi: '1:3.6',
    roiValue: 3.6,
    conversionRate: '2.2%',
    conversionValue: 2.2,
    ltv: '￥360',
    status: 'medium'
  }
];

const chartData = defaultData.map(item => ({
  channel: item.channel,
  roi: item.roiValue,
  conversion: item.conversionValue
}));

const chartConfig = {
  roi: {
    label: 'ROI',
    color: 'var(--color-chart-2)',
  },
  conversion: {
    label: '转化率(%)',
    color: 'var(--color-chart-1)',
  },
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title = '渠道效果对比分析',
  data = defaultData
}) => {
  const getStatusBadge = (status: string, roi: string) => {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-semibold';
    switch (status) {
      case 'high':
        return (
          <Badge className={`${baseClasses} bg-[var(--color-success-50)] text-[var(--color-success-600)]`}>
            {roi}
          </Badge>
        );
      case 'medium':
        return (
          <Badge className={`${baseClasses} bg-[var(--color-warning-50)] text-[var(--color-warning-600)]`}>
            {roi}
          </Badge>
        );
      default:
        return (
          <Badge className={`${baseClasses} bg-[var(--color-danger-50)] text-[var(--color-danger-600)]`}>
            {roi}
          </Badge>
        );
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] p-5 lg:p-6 rounded-lg shadow-sm border border-[var(--border-secondary)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm font-semibold">
            优化建议
          </Button>
          <Button variant="outline" className="text-sm font-semibold">
            导出数据
          </Button>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="h-72 w-full mb-6">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis
                dataKey="channel"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="roi"
                fill="var(--color-roi)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="conversion"
                fill="var(--color-conversion)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--bg-tertiary)]">
              <TableHead className="font-medium">渠道名称</TableHead>
              <TableHead className="font-medium">投入</TableHead>
              <TableHead className="font-medium">产出</TableHead>
              <TableHead className="font-medium">ROI</TableHead>
              <TableHead className="font-medium">转化率</TableHead>
              <TableHead className="font-medium">用户LTV</TableHead>
              <TableHead className="font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-[var(--bg-tertiary)]">
                <TableCell className="font-medium text-[var(--text-primary)]">
                  {item.channel}
                </TableCell>
                <TableCell>{item.investment}</TableCell>
                <TableCell>{item.output}</TableCell>
                <TableCell>
                  {getStatusBadge(item.status, item.roi)}
                </TableCell>
                <TableCell>{item.conversionRate}</TableCell>
                <TableCell>{item.ltv}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="font-medium text-[var(--color-primary-600)] hover:underline p-0 h-auto"
                  >
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComparisonChart;