'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SkuItem {
  id: string;
  color: string;
  size: string;
  skuCode: string;
  salePrice: number;
  marketPrice: number;
  stock: number;
}

interface SkuManagerProps {
  skuList: SkuItem[];
  onSkuListChange: (skuList: SkuItem[]) => void;
}

const SkuManager: React.FC<SkuManagerProps> = ({
  skuList,
  onSkuListChange
}) => {
  const handleSkuChange = (id: string, field: keyof SkuItem, value: string | number) => {
    const updatedList = skuList.map(sku =>
      sku.id === id ? { ...sku, [field]: value } : sku
    );
    onSkuListChange(updatedList);
  };

  const handleAddSku = () => {
    const newSku: SkuItem = {
      id: Date.now().toString(),
      color: '',
      size: '',
      skuCode: '',
      salePrice: 0,
      marketPrice: 0,
      stock: 0
    };
    onSkuListChange([...skuList, newSku]);
  };

  const handleDeleteSku = (id: string) => {
    const updatedList = skuList.filter(sku => sku.id !== id);
    onSkuListChange(updatedList);
  };

  const handleBatchUpdateStock = () => {
    // TODO: 实现批量修改库存功能
    console.log('批量修改库存');
  };

  const handleBatchUpdatePrice = () => {
    // TODO: 实现批量修改价格功能
    console.log('批量修改价格');
  };

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          多规格 SKU 管理
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[var(--text-tertiary)]">
                <TableHead className="py-2 px-3 font-medium">颜色</TableHead>
                <TableHead className="py-2 px-3 font-medium">尺码</TableHead>
                <TableHead className="py-2 px-3 font-medium">SKU编码</TableHead>
                <TableHead className="py-2 px-3 font-medium">销售价</TableHead>
                <TableHead className="py-2 px-3 font-medium">市场价</TableHead>
                <TableHead className="py-2 px-3 font-medium">库存</TableHead>
                <TableHead className="py-2 px-3 font-medium"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skuList.map((sku) => (
                <TableRow key={sku.id} className="border-b border-[var(--border-secondary)]">
                  <TableCell className="p-2">
                    <Input
                      type="text"
                      value={sku.color}
                      onChange={(e) => handleSkuChange(sku.id, 'color', e.target.value)}
                      className="w-24 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="text"
                      value={sku.size}
                      onChange={(e) => handleSkuChange(sku.id, 'size', e.target.value)}
                      className="w-20 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="text"
                      value={sku.skuCode}
                      onChange={(e) => handleSkuChange(sku.id, 'skuCode', e.target.value)}
                      className="w-32 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={sku.salePrice}
                      onChange={(e) => handleSkuChange(sku.id, 'salePrice', parseInt(e.target.value) || 0)}
                      className="w-24 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={sku.marketPrice}
                      onChange={(e) => handleSkuChange(sku.id, 'marketPrice', parseInt(e.target.value) || 0)}
                      className="w-24 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={sku.stock}
                      onChange={(e) => handleSkuChange(sku.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-24 text-sm bg-[var(--bg-secondary)]"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSku(sku.id)}
                      className="text-[var(--color-danger-600)] hover:text-[var(--color-danger-800)] hover:bg-[var(--color-danger-50)]"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleAddSku}
            className="text-[var(--primary-color)] text-sm font-semibold flex items-center hover:bg-[var(--color-primary-50)]"
          >
            <Plus className="w-5 h-5 mr-1" />
            添加规格
          </Button>
          <Button
            variant="ghost"
            onClick={handleBatchUpdateStock}
            className="text-[var(--text-secondary)] text-sm font-semibold hover:text-[var(--text-primary)]"
          >
            批量修改库存
          </Button>
          <Button
            variant="ghost"
            onClick={handleBatchUpdatePrice}
            className="text-[var(--text-secondary)] text-sm font-semibold hover:text-[var(--text-primary)]"
          >
            批量修改价格
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkuManager;