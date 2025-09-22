'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Download, History } from 'lucide-react';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

interface RoiRankingTableProps {
  filters: FilterState;
}

interface RankingItem {
  rank: number;
  name: string;
  roi: string;
  gmv: string;
  changePercent: number;
  isPositive: boolean;
}

const mockData: RankingItem[] = [
  { rank: 1, name: '七夕限定礼盒', roi: '1:5.8', gmv: '¥80W', changePercent: 10, isPositive: true },
  { rank: 2, name: '会员日专属券', roi: '1:4.5', gmv: '¥50W', changePercent: 5, isPositive: true },
  { rank: 3, name: '新品上市早鸟价', roi: '1:4.2', gmv: '¥45W', changePercent: -2, isPositive: false },
  { rank: 4, name: '直播间秒杀活动', roi: '1:3.9', gmv: '¥38W', changePercent: 8, isPositive: true },
  { rank: 5, name: '社群团购专享', roi: '1:3.5', gmv: '¥32W', changePercent: 15, isPositive: true },
];

const TrendIcon: React.FC<{ isPositive: boolean; percentage: number }> = ({ isPositive, percentage }) => {
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]';

  return (
    <div className={`flex items-center text-sm ${colorClass}`}>
      <IconComponent className="w-4 h-4 mr-1" />
      <span className="font-semibold">{Math.abs(percentage)}%</span>
    </div>
  );
};

const RoiRankingTable: React.FC<RoiRankingTableProps> = ({ filters }) => {
  const getTitle = () => {
    const typeMap = {
      activity: '活动',
      channel: '渠道',
      content: '内容',
      product: '商品'
    };

    const metricMap = {
      roi: 'ROI',
      gmv: 'GMV',
      conversion: '转化率',
      interaction: '互动率'
    };

    const periodMap = {
      week: '本周',
      month: '本月',
      quarter: '本季度'
    };

    return `内部营销${typeMap[filters.listType]} ${metricMap[filters.metric]} 榜 (${periodMap[filters.period]})`;
  };

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{getTitle()}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <History className="w-4 h-4" />
              查看历史数据
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-100)]">
              <Download className="w-4 h-4" />
              导出榜单
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="text-xs font-semibold text-[var(--text-secondary)]">
                <TableHead className="w-16">排名</TableHead>
                <TableHead className="w-2/5">活动名称</TableHead>
                <TableHead className="w-1/6">ROI</TableHead>
                <TableHead className="w-1/6">GMV</TableHead>
                <TableHead className="w-1/6">环比变化</TableHead>
                <TableHead className="w-16 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow
                  key={item.rank}
                  className="hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <TableCell className="text-sm font-bold text-[var(--text-primary)]">
                    {item.rank}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">
                    {item.roi}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">
                    {item.gmv}
                  </TableCell>
                  <TableCell>
                    <TrendIcon isPositive={item.isPositive} percentage={item.changePercent} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
                    >
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiRankingTable;