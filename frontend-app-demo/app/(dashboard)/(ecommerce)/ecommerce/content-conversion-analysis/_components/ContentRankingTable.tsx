'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';

interface ContentItem {
  name: string;
  views: number;
  addToCart: number;
  orders: number;
}

const ContentRankingTable: React.FC = () => {
  const contentData: ContentItem[] = [
    {
      name: '短视频-夏日清凉好物开箱',
      views: 125400,
      addToCart: 8750,
      orders: 2130
    },
    {
      name: '直播切片-主播推荐款',
      views: 89700,
      addToCart: 6120,
      orders: 1450
    },
    {
      name: '商品详情页-美白精华',
      views: 230500,
      addToCart: 15300,
      orders: 980
    },
    {
      name: '种草笔记-平价好物分享',
      views: 65200,
      addToCart: 4500,
      orders: 760
    }
  ];

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--primary-color)]" />
          内容带货力榜单
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[var(--text-tertiary)]">
                <TableHead className="py-2 px-3 font-medium">内容素材</TableHead>
                <TableHead className="py-2 px-3 font-medium">浏览量</TableHead>
                <TableHead className="py-2 px-3 font-medium">加购数</TableHead>
                <TableHead className="py-2 px-3 font-medium">转化订单</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentData.map((item, index) => (
                <TableRow key={index} className="border-b border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)]">
                  <TableCell className="px-3 py-4 font-medium text-[var(--text-primary)]">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-[var(--text-secondary)]">
                    {formatNumber(item.views)}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-[var(--text-secondary)]">
                    {formatNumber(item.addToCart)}
                  </TableCell>
                  <TableCell className="px-3 py-4 font-bold text-[var(--primary-color)]">
                    {formatNumber(item.orders)}
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

export default ContentRankingTable;