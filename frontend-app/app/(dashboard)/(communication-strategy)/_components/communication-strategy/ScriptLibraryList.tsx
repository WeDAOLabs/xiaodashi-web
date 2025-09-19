import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScriptItem {
  title: string;
  conversionRate: string;
  tags: { text: string; color: string }[];
  content: string;
  usageCount: number;
  rating: number;
  scenario: string;
  createDate: string;
}

const scriptData: ScriptItem[] = [
  {
    title: '生日月专属优惠话术',
    conversionRate: '25%',
    tags: [
      { text: '25%', color: 'bg-[var(--color-success-600)] text-white' },
      { text: '高转化', color: 'bg-[var(--color-info-600)] text-white' },
    ],
    content:
      '亲爱的[客户昵称]，祝您生日快乐！[蛋糕店Logo]您偏爱的草莓季新品蛋糕【莓满辰辰】清新上市啦！[新品图片]这款蛋糕采用当季新鲜草莓，搭配轻盈奶油，酸甜适中，口感细腻。现在下单搭配专属饮品还有8折优惠，生日月特享哦！期待您的光临～',
    usageCount: 1258,
    rating: 4.8,
    scenario: '会员生日祝福',
    createDate: '2023-05-15',
  },
  {
    title: '新品尝鲜邀请话术',
    conversionRate: '18%',
    tags: [
      { text: '18%', color: 'bg-gray-600 text-white' },
      { text: '热门', color: 'bg-[var(--color-danger-600)] text-white' },
    ],
    content:
      '亲爱的[客户昵称]，我们推出了[新品名称]，限时尝鲜8折，搭配[饮品]更美味！这款新品采用[特色原料]，[口感描述]，是[目标人群]的不二之选。点击[链接]即可预订，前50名还能获赠[小礼品]哦！期待您的光临～',
    usageCount: 986,
    rating: 4.6,
    scenario: '新品推荐',
    createDate: '2023-06-02',
  },
  {
    title: '唤醒流失用户话术',
    conversionRate: '15%',
    tags: [
      { text: '15%', color: 'bg-gray-600 text-white' },
      { text: '高转化', color: 'bg-[var(--color-info-600)] text-white' },
    ],
    content:
      '亲爱的[客户昵称]很久没见啦！我们推出了[产品/服务]，特别适合您。私聊我可领取惊喜小礼品哦！最近我们还优化了[产品/服务]，相信您一定会喜欢。点击[链接]查看您的专属优惠，期待您的回归～',
    usageCount: 865,
    rating: 4.5,
    scenario: '用户激活',
    createDate: '2023-04-28',
  },
];

const ScriptCard: React.FC<{ script: ScriptItem }> = ({ script }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-[var(--text-primary)] text-base">{script.title}</h4>
          {script.tags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tag.color}`}
            >
              {tag.text}
            </span>
          ))}
        </div>
        <div className="flex items-center text-[var(--color-primary-500)] font-medium text-sm gap-3">
          <button className="hover:underline" aria-label="查看话术详情">查看</button>
          <button className="hover:underline" aria-label="编辑话术">编辑</button>
          <button className="hover:underline" aria-label="复制话术">复制</button>
        </div>
      </div>

      <p className="text-sm text-[var(--text-primary)] mt-3 leading-relaxed bg-[var(--bg-secondary)] p-3 rounded-md">
        {script.content}
      </p>

      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <span>
            使用次数: <span className="font-medium text-[var(--text-primary)]">{script.usageCount}</span>
          </span>
          <span className="flex items-center gap-1">
            评分:{' '}
            <span className="font-medium text-[var(--text-primary)]">{script.rating}</span>
            <svg
              className="w-4 h-4 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </span>
          <span>
            适用场景: <span className="font-medium text-[var(--text-primary)]">{script.scenario}</span>
          </span>
          <span>
            创建时间: <span className="font-medium text-[var(--text-primary)]">{script.createDate}</span>
          </span>
        </div>
        <button
          className="text-[var(--color-primary-500)] font-semibold hover:underline"
          aria-label="添加到我的话术"
        >
          添加到我的话术
        </button>
      </div>
    </div>
  );
};

const ScriptLibraryList: React.FC = () => {
  return (
    <div>
      {/* 搜索和过滤器 */}
      <div className="flex justify-between items-center mb-4">
        <Input
          type="search"
          placeholder="搜索话术..."
          className="p-2 border border-[var(--border-primary)] rounded-lg bg-white w-64"
        />
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--border-primary)]"
          >
            批量操作
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 bg-white border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-secondary)] flex items-center gap-2"
          >
            默认排序
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>
        </div>
      </div>

      {/* 话术列表 */}
      <div className="space-y-4">
        {scriptData.map((script, index) => (
          <ScriptCard key={index} script={script} />
        ))}
      </div>

      {/* 分页 */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-[var(--text-secondary)]">显示 1 到 3 条, 共 128 条</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] disabled:opacity-50">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-500)] text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            ...
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            43
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptLibraryList;