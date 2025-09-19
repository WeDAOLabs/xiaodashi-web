import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RepurchaseUserTableProps {}

interface UserData {
  rank: number;
  name: string;
  avatar: string;
  repurchaseCount: number;
  totalGMV: string;
  lastRepurchase: string;
  preferences: { label: string; color: string }[];
}

const userData: UserData[] = [
  {
    rank: 1,
    name: '小蛋糕爱吃者',
    avatar: '/images/avatars/user-1.svg',
    repurchaseCount: 12,
    totalGMV: '¥2,860',
    lastRepurchase: '2025-08-30',
    preferences: [
      { label: '草莓慕斯', color: 'bg-red-100 text-red-600' },
      { label: '巧克力', color: 'bg-purple-100 text-purple-600' }
    ]
  },
  {
    rank: 2,
    name: '下午茶常客',
    avatar: '/images/avatars/user-2.svg',
    repurchaseCount: 9,
    totalGMV: '¥1,980',
    lastRepurchase: '2025-09-02',
    preferences: [
      { label: '芝士蛋糕', color: 'bg-yellow-100 text-yellow-600' },
      { label: '抹茶', color: 'bg-green-100 text-green-600' }
    ]
  },
  {
    rank: 3,
    name: '甜品鉴赏家',
    avatar: '/images/avatars/user-3.svg',
    repurchaseCount: 8,
    totalGMV: '¥3,240',
    lastRepurchase: '2025-08-28',
    preferences: [
      { label: '红丝绒', color: 'bg-red-100 text-red-600' },
      { label: '蓝莓', color: 'bg-blue-100 text-blue-600' }
    ]
  },
  {
    rank: 4,
    name: '烘焙达人',
    avatar: '/images/avatars/user-4.svg',
    repurchaseCount: 7,
    totalGMV: '¥1,650',
    lastRepurchase: '2025-09-01',
    preferences: [
      { label: '巧克力', color: 'bg-purple-100 text-purple-600' },
      { label: '焦糖', color: 'bg-yellow-100 text-yellow-600' }
    ]
  },
  {
    rank: 5,
    name: '健康生活家',
    avatar: '/images/avatars/user-5.svg',
    repurchaseCount: 6,
    totalGMV: '¥1,420',
    lastRepurchase: '2025-08-25',
    preferences: [
      { label: '低糖', color: 'bg-green-100 text-green-600' },
      { label: '水果', color: 'bg-blue-100 text-blue-600' }
    ]
  }
];

const RepurchaseUserTable: React.FC<RepurchaseUserTableProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">复购用户详情榜单</h2>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <span>复购次数排行榜</span>
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">排名</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">用户昵称</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">复购次数</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">累计GMV</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">最近复购</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)]">偏好品类</TableHead>
              <TableHead className="py-2 px-3 font-medium text-[var(--text-secondary)] text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.rank} className="border-b border-[var(--border-primary)]">
                <TableCell className="py-3 px-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      user.rank <= 3
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 text-[var(--text-secondary)]'
                    }`}
                  >
                    {user.rank}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.avatar}
                      alt={`${user.name}的头像`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/images/avatars/default-avatar.svg';
                      }}
                    />
                    <span className="font-semibold text-[var(--text-primary)]">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-3">{user.repurchaseCount}次</TableCell>
                <TableCell className="py-3 px-3">{user.totalGMV}</TableCell>
                <TableCell className="py-3 px-3">{user.lastRepurchase}</TableCell>
                <TableCell className="py-3 px-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {user.preferences.map((pref, idx) => (
                      <Badge key={idx} className={`text-xs font-medium px-2 py-1 rounded-md ${pref.color}`}>
                        {pref.label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-3 text-center">
                  <Button variant="link" className="text-blue-600 font-medium px-2">详情</Button>
                  <Button variant="link" className="text-blue-600 font-medium px-2">标签</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-[var(--text-secondary)]">显示 1 到 5 条, 共 128 条</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" disabled>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button size="sm" className="w-7 h-7 p-0 bg-[var(--primary-color)] text-white text-xs font-medium">
            1
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 hover:bg-gray-100 text-xs">
            2
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 hover:bg-gray-100 text-xs">
            3
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RepurchaseUserTable;