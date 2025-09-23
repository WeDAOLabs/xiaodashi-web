'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Settings, FileText } from 'lucide-react';

interface TrendData {
  month: string;
  value: number;
}

interface PredictionCard {
  title: string;
  type: 'chart' | 'metric';
  value?: string;
  subValue?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  chartData?: TrendData[];
  chartColor?: string;
}

interface TrendPredictionCardsProps {
  title?: string;
}

const gmvData: TrendData[] = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 92 },
  { month: 'Jun', value: 88 }
];

const userGrowthData: TrendData[] = [
  { month: 'Jan', value: 11 },
  { month: 'Feb', value: 9 },
  { month: 'Mar', value: 20 },
  { month: 'Apr', value: 15 },
  { month: 'May', value: 25 },
  { month: 'Jun', value: 22 }
];

const predictionCards: PredictionCard[] = [
  {
    title: '未来1个月GMV预测 (万元)',
    type: 'chart',
    chartData: gmvData,
    chartColor: 'var(--color-chart-2)'
  },
  {
    title: '未来1周ROI预测',
    type: 'metric',
    value: '4.5 : 1 ~ 5.2 : 1',
    change: '+5.8%',
    changeType: 'positive',
    subValue: '较上周'
  },
  {
    title: '未来3个月用户增长预测 (千人)',
    type: 'chart',
    chartData: userGrowthData,
    chartColor: 'var(--color-chart-1)'
  }
];

const chartConfig = {
  value: {
    label: '预测值',
    color: 'var(--color-chart-2)',
  },
};

const TrendPredictionCards: React.FC<TrendPredictionCardsProps> = ({
  title = '营销趋势预测'
}) => {
  const renderCard = (card: PredictionCard, index: number) => {
    if (card.type === 'chart') {
      return (
        <Card key={index} className="bg-[var(--bg-primary)] shadow-sm flex flex-col h-full">
          <CardContent className="p-5 flex flex-col h-full">
            <h3 className="text-md font-semibold text-[var(--text-primary)]">{card.title}</h3>
            <div className="flex-grow mt-4 w-full h-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={card.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={card.chartColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={card.chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      hide
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      hide
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={card.chartColor}
                      strokeWidth={2.5}
                      dot={false}
                      fill={`url(#gradient-${index})`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={index} className="bg-[var(--bg-primary)] shadow-sm">
        <CardContent className="p-5">
          <p className="text-md font-semibold text-[var(--text-primary)]">{card.title}</p>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-4">{card.value}</p>
          <div className="flex items-center text-sm mt-2">
            <span className={`font-semibold ${card.changeType === 'positive' ? 'text-[var(--color-chart-1)]' : 'text-[var(--color-chart-5)]'}`}>
              {card.change}
            </span>
            <span className="text-[var(--text-secondary)] ml-1.5">{card.subValue}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            调整预测参数
          </Button>
          <Button
            className="text-sm font-medium flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]"
          >
            <FileText className="w-4 h-4" />
            生成预测报告
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-64">
        {predictionCards.map((card, index) => renderCard(card, index))}
      </div>
    </section>
  );
};

export default TrendPredictionCards;