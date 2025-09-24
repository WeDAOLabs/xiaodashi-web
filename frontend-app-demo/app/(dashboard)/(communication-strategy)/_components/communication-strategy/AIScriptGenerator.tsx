import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AIScriptGenerator: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState('亲和');

  const styles = ['亲和', '专业', '幽默', '正式'];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">客户画像选择</label>
          <Input
            type="text"
            value="高价值客户"
            readOnly
            className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">沟通场景选择</label>
          <Input
            type="text"
            value="新品推荐"
            readOnly
            className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">话术主题或简要意图</label>
        <textarea
          rows={2}
          className="mt-1 w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] resize-none text-sm"
          placeholder="例如：草莓蛋糕新品推荐给生日月用户"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">话术风格选择</label>
        <div className="flex gap-2 mt-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedStyle === style
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <Button className="mt-4 w-full py-2.5 bg-[var(--color-primary-500)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-600)] transition-colors flex items-center justify-center gap-2">
        生成多条话术
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </Button>

      {/* 生成的话术版本 */}
      <div className="mt-6 space-y-4">
        <div className="border border-[var(--color-success-100)] bg-[var(--color-success-50)] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--color-success-600)]">版本 A - AI推荐话术</span>
            <span className="text-xs text-[var(--color-success-600)]">预计转化率: 22%</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
            亲爱的[客户昵称]，祝您生日快乐！[蛋糕店Logo]您偏爱的草莓季新品蛋糕【莓满辰辰】清新上市啦！[新品图片]这款蛋糕采用当季新鲜草莓，搭配轻盈奶油，酸甜适中，口感细腻。现在下单搭配专属饮品还有8折优惠，生日月特享哦！期待您的光临～
          </p>
          <div className="text-right mt-3 space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="px-4 py-1.5 text-sm rounded-lg bg-white border border-gray-300 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            >
              编辑
            </Button>
            <Button
              size="sm"
              className="px-4 py-1.5 text-sm rounded-lg bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-700)]"
            >
              选择此版本
            </Button>
          </div>
        </div>

        <div className="border border-gray-300 bg-[var(--bg-secondary)] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--text-primary)]">版本 B - AI推荐话术</span>
            <span className="text-xs text-[var(--text-secondary)]">预计转化率: 18%</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
            [客户昵称]生日快乐！为您特别推荐我们的季节限定【草莓盛宴】蛋糕，精选新鲜草莓与进口奶油，每一口都是幸福的味道。生日专属福利：下单即享8折优惠，并赠送精美生日蜡烛套装。点击[链接]即可订购，让我们的生日蛋糕增添甜蜜回忆！
          </p>
          <div className="text-right mt-3 space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="px-4 py-1.5 text-sm rounded-lg bg-white border border-gray-300 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            >
              编辑
            </Button>
            <Button
              size="sm"
              className="px-4 py-1.5 text-sm rounded-lg bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-700)]"
            >
              选择此版本
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScriptGenerator;