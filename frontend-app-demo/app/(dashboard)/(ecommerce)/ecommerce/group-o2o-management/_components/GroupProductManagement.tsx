'use client';

import React from 'react';
import { Plus, Edit, MessageSquare, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GroupProduct, AIPricingSuggestion } from './types';

// 示例数据
const groupProducts: GroupProduct[] = [
  {
    id: 'gp-1',
    name: '豪华双人海鲜自助餐',
    platform: '美团',
    type: 'package',
    price: '¥298.00',
    sales: 1204,
    status: 'active'
  },
  {
    id: 'gp-2',
    name: '100元代金券',
    platform: '大众点评',
    type: 'voucher',
    price: '¥88.00',
    sales: 5890,
    status: 'active'
  },
  {
    id: 'gp-3',
    name: '单人美发造型',
    platform: '美团',
    type: 'service',
    price: '¥158.00',
    sales: 450,
    status: 'active'
  },
  {
    id: 'gp-4',
    name: '密室逃脱单人票',
    platform: '大众点评',
    type: 'package',
    price: '¥98.00',
    sales: 888,
    status: 'inactive'
  },
  {
    id: 'gp-5',
    name: '自提蛋糕券（8寸）',
    platform: '美团',
    type: 'voucher',
    price: '¥188.00',
    sales: 2130,
    status: 'active'
  }
];

const aiSuggestion: AIPricingSuggestion = {
  productName: '豪华双人海鲜自助餐',
  recommendedPrice: '¥288',
  conversionImprovement: '15%',
  reasoning: '此价格可提升约15%的点击转化率。'
};

interface ProductRowProps {
  product: GroupProduct;
}

const ProductRow: React.FC<ProductRowProps> = React.memo(({ product }) => {
  const getTypeText = (type: GroupProduct['type']) => {
    switch (type) {
      case 'package': return '套餐';
      case 'voucher': return '代金券';
      case 'service': return '服务';
    }
  };

  const getStatusBadge = (status: GroupProduct['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">
            在售
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)]">
            下架
          </Badge>
        );
    }
  };

  return (
    <TableRow className="hover:bg-[var(--bg-secondary)] transition-colors">
      <TableCell className="font-medium text-[var(--text-primary)]">
        {product.name}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {product.platform}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {getTypeText(product.type)}
      </TableCell>
      <TableCell className="font-semibold text-[var(--text-primary)]">
        {product.price}
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {product.sales.toLocaleString()}
      </TableCell>
      <TableCell>
        {getStatusBadge(product.status)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] hover:bg-[var(--color-primary-50)]">
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] hover:bg-[var(--color-primary-50)]">
            <MessageSquare className="w-4 h-4 mr-1" />
            查看评价
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

ProductRow.displayName = 'ProductRow';

const GroupProductManagement: React.FC = () => {
  return (
    <section className="space-y-6">
      <Card className="shadow-sm border border-[var(--border-secondary)]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">团购产品管理</h2>
            <Button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white">
              <Plus className="w-4 h-4 mr-2" />
              新增团购产品
            </Button>
          </div>

          <div className="rounded-lg overflow-hidden border border-[var(--border-secondary)]">
            <Table>
              <TableHeader className="bg-[var(--bg-secondary)]">
                <TableRow className="border-none">
                  <TableHead className="font-semibold text-[var(--text-secondary)]">产品名称</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">平台</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">类型</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">价格</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">销量</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">状态</TableHead>
                  <TableHead className="font-semibold text-[var(--text-secondary)]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupProducts.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* AI定价建议卡片 */}
          <div className="mt-6 bg-gradient-to-r from-[var(--primary-color)] to-[var(--color-primary-700)] rounded-lg p-6 text-white">
            <div className="flex items-start">
              <Lightbulb className="w-8 h-8 mr-4 text-yellow-300 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">AI 定价建议</h3>
                <p className="text-sm opacity-90 mt-1">基于市场竞品和AI预测，为您推荐最优价格组合。</p>
              </div>
            </div>
            <div className="mt-4 bg-white/20 p-4 rounded-md">
              <p className="font-semibold">
                &lsquo;{aiSuggestion.productName}&rsquo; 推荐价格:
                <span className="text-2xl font-bold ml-2 text-yellow-300">
                  {aiSuggestion.recommendedPrice}
                </span>
              </p>
              <p className="text-xs opacity-80 mt-1">{aiSuggestion.reasoning}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GroupProductManagement;