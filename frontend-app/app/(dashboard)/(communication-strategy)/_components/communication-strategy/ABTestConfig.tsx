import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ABTestConfig: React.FC = () => {
  return (
    <div className="border border-[var(--border-primary)] rounded-lg p-4">
      <h3 className="font-semibold text-[var(--text-primary)]">A/B测试配置</h3>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">测试目标</label>
          <Input
            type="text"
            value="点击率"
            readOnly
            className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)]">测试受众分配</label>
            <Input
              type="text"
              value="版本 A 50%"
              readOnly
              className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] invisible">.</label>
            <Input
              type="text"
              value="版本 B 50%"
              readOnly
              className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">测试周期</label>
          <Input
            type="text"
            value="24小时"
            readOnly
            className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">目标客户群</label>
          <Input
            type="text"
            value="生日月用户 (约 5,000 人)"
            readOnly
            className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]"
          />
        </div>
      </div>

      <Button className="mt-4 w-full py-2.5 bg-[var(--color-success-600)] text-white rounded-lg font-semibold hover:bg-[var(--color-success-700)] transition-colors">
        启动A/B测试
      </Button>
    </div>
  );
};

export default ABTestConfig;