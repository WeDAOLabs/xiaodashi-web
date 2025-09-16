import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

 
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserProfileFilterProps {}

const UserProfileFilter: React.FC<UserProfileFilterProps> = () => {
  const tagData = [
    { name: '新品尝鲜家', count: 25000 },
    { name: '忠实复购者', count: 18000 },
    { name: '甜点爱好者', count: 30000 },
    { name: '生日月用户', count: 5000 },
    { name: '关注健康用户', count: 10000 }
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">用户画像筛选器</h2>
        <div>
          <Button variant="secondary" className="px-4 py-2 text-sm font-medium rounded-lg">
            重置筛选
          </Button>
          <Button variant="secondary" className="px-4 py-2 ml-2 text-sm font-medium rounded-lg">
            导出用户列表
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
        {/* 基础属性 */}
        <div>
          <h3 className="font-semibold text-[var(--text-secondary)] mb-3">基础属性</h3>
          <div className="space-y-3">
            <div>
              <p className="mb-2">性别</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="px-4 py-1.5 rounded-full bg-gray-200">
                  男
                </Button>
                <Button variant="secondary" size="sm" className="px-4 py-1.5 rounded-full bg-gray-200">
                  女
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-2">年龄段</p>
              <div className="flex flex-col items-start gap-2">
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  18-24岁
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  25-34岁
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  35-44岁
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  45岁以上
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 消费行为 */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-3">消费行为</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="mb-2">购买频次</p>
              <Input
                type="text"
                placeholder="全部频次"
                className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <p className="mb-2">消费能力</p>
              <Input
                type="text"
                placeholder="全部消费能力"
                className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <p className="mb-2">购买偏好</p>
              <div className="flex flex-col items-start gap-2">
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  巧克力
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  草莓
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  芝士
                </Button>
                <Button variant="link" className="p-0 h-auto text-left hover:text-[var(--primary-color)]">
                  抹茶
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 用户标签 */}
        <div>
          <h3 className="font-semibold text-[var(--text-secondary)] mb-3">用户标签</h3>
          <div className="flex flex-col items-start gap-2 text-[var(--text-primary)]">
            {tagData.map((tag, index) => (
              <Button
                key={index}
                variant="link"
                className="p-0 h-auto text-left hover:text-[var(--primary-color)]"
              >
                {tag.name} ({tag.count.toLocaleString()}人)
              </Button>
            ))}
            <Button
              variant="link"
              className="text-[var(--primary-color)] mt-2 p-0 h-auto text-left"
            >
              查看更多标签
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-[var(--primary-color)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
          应用筛选条件
        </Button>
      </div>
    </div>
  );
};

export default UserProfileFilter;