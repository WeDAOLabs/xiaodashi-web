'use client';

import React from 'react';
import { Link2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { O2OAssociation } from './types';

// 示例数据
const o2oAssociations: O2OAssociation[] = [
  {
    id: 'o2o-1',
    groupProductName: '豪华双人海鲜自助餐',
    associatedProduct: '餐厅同款冷冻海鲜礼盒',
    inventorySync: false
  },
  {
    id: 'o2o-2',
    groupProductName: '自提蛋糕券（8寸）',
    associatedProduct: '线上8寸同款蛋糕',
    inventorySync: true
  },
  {
    id: 'o2o-3',
    groupProductName: '单人美发造型',
    associatedProduct: '品牌洗发护发套装',
    inventorySync: false
  }
];

interface AssociationItemProps {
  association: O2OAssociation;
}

const AssociationItem: React.FC<AssociationItemProps> = React.memo(({ association }) => {
  const getSyncStatusBadge = (isSync: boolean) => {
    if (isSync) {
      return (
        <Badge className="bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-100)]">
          库存已协同
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)]">
          库存未协同
        </Badge>
      );
    }
  };

  return (
    <li className="flex items-center justify-between bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-secondary)]">
      <div className="flex items-center">
        <Link2 className="w-5 h-5 text-[var(--primary-color)] mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-[var(--text-primary)]">
            {association.groupProductName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            关联到: {association.associatedProduct}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {getSyncStatusBadge(association.inventorySync)}
        <Button variant="ghost" size="sm" className="text-[var(--text-primary)] hover:bg-[var(--bg-primary)]">
          配置
        </Button>
      </div>
    </li>
  );
});

AssociationItem.displayName = 'AssociationItem';

const O2OConfiguration: React.FC = () => {
  return (
    <section className="space-y-6">
      <Card className="shadow-sm border border-[var(--border-secondary)]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">O2O联动配置</h2>
            <Button variant="outline" className="text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]">
              <Link2 className="w-4 h-4 mr-2" />
              关联电商商品
            </Button>
          </div>

          {/* 团购商品与电商商品关联 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              团购商品与电商商品关联
            </h3>
            <ul className="space-y-3">
              {o2oAssociations.map((association) => (
                <AssociationItem key={association.id} association={association} />
              ))}
            </ul>
          </div>

          {/* O2O营销活动 */}
          <div className="pt-6 border-t border-[var(--border-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              O2O营销活动
            </h3>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">创建新的营销活动</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  例如: 线下消费赠送线上优惠券。
                </p>
              </div>
              <Button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white">
                <Plus className="w-4 h-4 mr-2" />
                创建活动
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default O2OConfiguration;