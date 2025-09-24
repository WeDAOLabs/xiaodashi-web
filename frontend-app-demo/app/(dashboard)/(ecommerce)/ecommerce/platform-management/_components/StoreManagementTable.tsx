'use client';

import React, { useState, useCallback } from 'react';
import { Edit, BarChart3, Trash2 } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card'; // 不再需要
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Store, TableSelection } from './types';

// 店铺数据
const stores: Store[] = [
  {
    id: 'store-1',
    name: '品牌旗舰店',
    storeId: 'JD0001',
    platform: '京东',
    gmv: '¥250,000',
    orders: 1200,
    conversionRate: '4.8%',
    hotProduct: '智能炒菜锅',
    riskLevel: 'low',
    aiInsight: '售后问题集中在操作复杂，建议优化商品详情页的视频教程。'
  },
  {
    id: 'store-2',
    name: '潮流服饰专卖店',
    storeId: 'TB00123',
    platform: '淘宝',
    gmv: '¥150,000',
    orders: 8500,
    conversionRate: '9.2%',
    hotProduct: '联名款T恤',
    riskLevel: 'medium',
    aiInsight: '发现一款"复古风牛仔裤"有爆款潜力，建议加大直通车投入。'
  },
  {
    id: 'store-3',
    name: '生活优选',
    storeId: 'DY55566',
    platform: '抖音',
    gmv: '¥480,000',
    orders: 22000,
    conversionRate: '15.1%',
    hotProduct: '香薰加湿器',
    riskLevel: 'low',
    aiInsight: '库存积压的"手动榨汁机"可与热销品捆绑销售，快速清仓。'
  },
  {
    id: 'store-4',
    name: '官方自营店',
    storeId: 'JD0002',
    platform: '京东',
    gmv: '¥180,000',
    orders: 950,
    conversionRate: '5.5%',
    hotProduct: '智能门锁',
    riskLevel: 'high',
    aiInsight: '差评主要来自安装服务，建议与第三方服务商加强合作与培训。'
  }
];

interface StoreRowProps {
  store: Store;
  isSelected: boolean;
  onSelect: (storeId: string, selected: boolean) => void;
}

const StoreRow: React.FC<StoreRowProps> = React.memo(({ store, isSelected, onSelect }) => {
  const getRiskBadgeClass = (level: Store['riskLevel']) => {
    switch (level) {
      case 'low':
        return 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]';
      case 'medium':
        return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]';
      case 'high':
        return 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]';
    }
  };

  const getRiskText = (level: Store['riskLevel']) => {
    switch (level) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
    }
  };

  return (
    <TableRow className="hover:bg-[var(--bg-secondary)] transition-colors">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(store.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-[var(--text-primary)]">{store.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">ID: {store.storeId}</div>
        </div>
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">{store.platform}</TableCell>
      <TableCell className="font-semibold text-[var(--text-primary)]">{store.gmv}</TableCell>
      <TableCell className="text-[var(--text-secondary)]">{store.orders.toLocaleString()}</TableCell>
      <TableCell className="text-[var(--text-secondary)]">{store.conversionRate}</TableCell>
      <TableCell
        className="max-w-[150px] truncate text-[var(--text-secondary)]"
        title={store.hotProduct}
        role="cell"
        aria-label={`热销商品: ${store.hotProduct}`}
      >
        {store.hotProduct}
      </TableCell>
      <TableCell className="max-w-[200px]">
        <Badge className={getRiskBadgeClass(store.riskLevel)}>
          {getRiskText(store.riskLevel)}
        </Badge>
        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
          {store.aiInsight}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] hover:bg-[var(--color-primary-50)]"
          >
            <Edit className="w-4 h-4 mr-1" />
            管理
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] hover:bg-[var(--color-primary-50)]"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            查看数据
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-danger-600)] hover:text-[var(--color-danger-800)] hover:bg-[var(--color-danger-50)]"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

StoreRow.displayName = 'StoreRow';

const StoreManagementTable: React.FC = () => {
  const [selection, setSelection] = useState<TableSelection>({
    selectedStores: [],
    allSelected: false
  });

  const handleSelectAll = (checked: boolean) => {
    setSelection({
      selectedStores: checked ? stores.map(store => store.id) : [],
      allSelected: checked
    });
  };

  const handleSelectStore = useCallback((storeId: string, selected: boolean) => {
    setSelection(prev => {
      const newSelectedStores = selected
        ? [...prev.selectedStores, storeId]
        : prev.selectedStores.filter(id => id !== storeId);

      return {
        selectedStores: newSelectedStores,
        allSelected: newSelectedStores.length === stores.length
      };
    });
  }, []);

  const selectedCount = selection.selectedStores.length;

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">店铺详情管理</h2>
        <Button
          variant="outline"
          disabled={selectedCount === 0}
          className={selectedCount > 0 ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : ''}
        >
          对比已选店铺 ({selectedCount})
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-[var(--border-secondary)] shadow-sm bg-[var(--bg-primary)]">
        {/* 表格头部背景 */}
        <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selection.allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">店铺名称</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">平台</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">GMV</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">订单数</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">转化率</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">热销商品</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">AI洞察与风险</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">操作</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
        </div>

        {/* 表格主体 */}
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {stores.map((store) => (
                <StoreRow
                  key={store.id}
                  store={store}
                  isSelected={selection.selectedStores.includes(store.id)}
                  onSelect={handleSelectStore}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 表格底部背景 */}
        <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] px-4 py-3">
          <p className="text-sm text-[var(--text-secondary)]">
            共显示 {stores.length} 家店铺
          </p>
        </div>
      </div>
    </section>
  );
};

export default StoreManagementTable;