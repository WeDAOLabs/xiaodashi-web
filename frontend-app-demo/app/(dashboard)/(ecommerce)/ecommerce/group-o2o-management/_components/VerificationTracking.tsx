'use client';

import React from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerificationRecord, VerificationStats } from './types';
import EfficiencyChart from './EfficiencyChart';

// 示例数据
const verificationStats: VerificationStats = {
  todayVerifications: 1280,
  verificationRate: 85.2,
  pendingVerifications: 3456,
  todayChange: '+12.5%',
  rateChange: '+1.8%',
  pendingChange: '-5.2%'
};

const verificationRecords: VerificationRecord[] = [
  {
    id: 'vr-1',
    productName: '豪华双人海鲜自助餐',
    verificationCode: '***1234',
    customerName: '张三',
    verificationDate: '2023-10-26 18:30',
    status: 'verified'
  },
  {
    id: 'vr-2',
    productName: '100元代金券',
    verificationCode: '***5678',
    customerName: '李四',
    verificationDate: null,
    status: 'pending'
  },
  {
    id: 'vr-3',
    productName: '单人美发造型',
    verificationCode: '***9012',
    customerName: '王五',
    verificationDate: null,
    status: 'expired'
  },
  {
    id: 'vr-4',
    productName: '100元代金券',
    verificationCode: '***3456',
    customerName: '赵六',
    verificationDate: '2023-10-25 12:15',
    status: 'verified'
  },
  {
    id: 'vr-5',
    productName: '自提蛋糕券（8寸）',
    verificationCode: '***7890',
    customerName: '孙七',
    verificationDate: null,
    status: 'pending'
  }
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, change, isPositive }) => (
  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
    <p className="text-sm text-[var(--text-secondary)]">{title}</p>
    <p className="text-2xl font-semibold text-[var(--text-primary)] mt-1">{value}</p>
    <div className="flex items-center text-xs mt-1">
      {isPositive ? (
        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
      ) : (
        <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
      )}
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {change} vs {title.includes('今日') ? '昨日' : '上周'}
      </span>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

interface VerificationRowProps {
  record: VerificationRecord;
}

const VerificationRow: React.FC<VerificationRowProps> = React.memo(({ record }) => {
  const getStatusBadge = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">
            已核销
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">
            待核销
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]">
            已过期
          </Badge>
        );
    }
  };

  return (
    <TableRow className="hover:bg-[var(--bg-secondary)] transition-colors">
      <TableCell className="font-medium text-[var(--text-primary)]">
        {record.productName}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {record.verificationCode}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {record.customerName}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {record.verificationDate || '-'}
      </TableCell>
      <TableCell>
        {getStatusBadge(record.status)}
      </TableCell>
    </TableRow>
  );
});

VerificationRow.displayName = 'VerificationRow';

const VerificationTracking: React.FC = () => {
  return (
    <section className="space-y-6">
      <Card className="shadow-sm border border-[var(--border-secondary)]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">核销与履约追踪</h2>
            <Button variant="outline" className="text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新核销状态
            </Button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="今日核销数量"
              value={verificationStats.todayVerifications.toLocaleString()}
              change={verificationStats.todayChange}
              isPositive={true}
            />
            <StatCard
              title="核销率"
              value={`${verificationStats.verificationRate}%`}
              change={verificationStats.rateChange}
              isPositive={true}
            />
            <StatCard
              title="待核销券量"
              value={verificationStats.pendingVerifications.toLocaleString()}
              change={verificationStats.pendingChange}
              isPositive={false}
            />
          </div>

          {/* 核销状态列表 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">核销状态列表</h3>
            <div className="rounded-lg overflow-hidden border border-[var(--border-secondary)]">
              <Table>
                <TableHeader className="bg-[var(--bg-secondary)]">
                  <TableRow className="border-none">
                    <TableHead className="font-semibold text-[var(--text-secondary)]">产品名称</TableHead>
                    <TableHead className="font-semibold text-[var(--text-secondary)]">核销码</TableHead>
                    <TableHead className="font-semibold text-[var(--text-secondary)]">顾客</TableHead>
                    <TableHead className="font-semibold text-[var(--text-secondary)]">核销日期</TableHead>
                    <TableHead className="font-semibold text-[var(--text-secondary)]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationRecords.map((record) => (
                    <VerificationRow key={record.id} record={record} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 履约效率分析 */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">履约效率分析</h3>
            <EfficiencyChart />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default VerificationTracking;