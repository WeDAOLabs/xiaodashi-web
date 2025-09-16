import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryItem {
  name: string;
  count: number;
}

const categories: CategoryItem[] = [
  { name: '全部话术', count: 128 },
  { name: '新品推荐话术', count: 32 },
  { name: '会员生日话术', count: 24 },
  { name: '活动通知话术', count: 28 },
  { name: '售后关怀话术', count: 16 },
];

const myScripts: CategoryItem[] = [
  { name: '我的草稿', count: 5 },
  { name: '已采纳话术', count: 18 },
  { name: '我创建的话术', count: 12 },
];

const ScriptCategories: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">话术分类</h3>
      <ul className="space-y-1 text-sm">
        {categories.map((category, index) => (
          <li key={index}>
            <a
              href="#"
              className="flex justify-between p-2 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
            >
              <span>{category.name}</span>
              <span>{category.count}</span>
            </a>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-[var(--text-primary)] mt-4 mb-2">我的话术</h3>
      <ul className="space-y-1 text-sm">
        {myScripts.map((script, index) => (
          <li key={index}>
            <a
              href="#"
              className="flex justify-between p-2 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
            >
              <span>{script.name}</span>
              <span>{script.count}</span>
            </a>
          </li>
        ))}
      </ul>

      <Button
        className="w-full mt-4 py-2 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-100)] transition-colors"
        aria-label="训练AI模型"
      >
        训练AI模型
      </Button>
    </div>
  );
};

export default ScriptCategories;