'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const users: User[] = [
  {
    id: '1',
    name: '刘明',
    role: '超级管理员',
    avatar: 'https://picsum.photos/id/1005/100/100'
  },
  {
    id: '2',
    name: '王芳',
    role: '市场总监',
    avatar: 'https://picsum.photos/id/1011/100/100'
  },
  {
    id: '3',
    name: '赵强',
    role: '数据分析师',
    avatar: 'https://picsum.photos/id/1025/100/100'
  }
];

const permissions = [
  '定义营销数据查看权限',
  '报表导出权限',
  '策略配置权限'
];

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded-lg">
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p className="font-semibold text-[var(--text-primary)] text-sm">{user.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{user.role}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="px-3 py-1.5 text-xs">
        编辑
      </Button>
    </div>
  );
};

const PermissionManager: React.FC = () => {
  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-5 flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">权限与用户管理</h3>
        </div>

        {/* 用户列表 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">用户列表</h4>
          <div className="space-y-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        {/* 角色与权限配置 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">角色与权限配置</h4>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            {permissions.map((permission, index) => (
              <p key={index} className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                {permission}
              </p>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            添加新用户
          </Button>
          <Button variant="outline" size="sm">
            编辑用户权限
          </Button>
          <Button variant="outline" size="sm">
            创建新角色
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionManager;