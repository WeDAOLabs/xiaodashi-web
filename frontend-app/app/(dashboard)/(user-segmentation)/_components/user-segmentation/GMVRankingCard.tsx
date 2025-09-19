import React from 'react';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GMVRankingCardProps {}

interface RankingUser {
  rank: number;
  name: string;
  avatar: string;
  description: string;
  amount: string;
}

const totalGMVData: RankingUser[] = [
  {
    rank: 1,
    name: '大单采购者',
    avatar: '/images/avatars/user-11.svg',
    description: '公司采购・累计采购32次',
    amount: '¥5,800'
  },
  {
    rank: 2,
    name: '公司团建',
    avatar: '/images/avatars/user-12.svg',
    description: '团队活动・累计采购18次',
    amount: '¥3,200'
  },
  {
    rank: 3,
    name: '甜品爱好者',
    avatar: '/images/avatars/user-13.svg',
    description: '个人消费・累计采购24次',
    amount: '¥4,150'
  },
  {
    rank: 4,
    name: '婚礼策划师',
    avatar: '/images/avatars/user-14.svg',
    description: '婚礼甜品台・累计采购8次',
    amount: '¥3,800'
  },
  {
    rank: 5,
    name: '企业福利采购',
    avatar: '/images/avatars/user-15.svg',
    description: '员工福利・累计采购12次',
    amount: '¥2,980'
  }
];

const monthlyGrowthData: RankingUser[] = [
  {
    rank: 1,
    name: '婚礼筹备',
    avatar: '/images/avatars/user-21.svg',
    description: '近期增长・环比↑280%',
    amount: '¥2,100'
  },
  {
    rank: 2,
    name: '节日庆典',
    avatar: '/images/avatars/user-22.svg',
    description: '节日采购・环比↑150%',
    amount: '¥1,850'
  },
  {
    rank: 3,
    name: '企业年会',
    avatar: '/images/avatars/user-23.svg',
    description: '年会活动・环比↑120%',
    amount: '¥1,680'
  },
  {
    rank: 4,
    name: '新品尝鲜',
    avatar: '/images/avatars/user-24.svg',
    description: '新品推广・环比↑120%',
    amount: '¥1,420'
  },
  {
    rank: 5,
    name: '会员专享',
    avatar: '/images/avatars/user-25.svg',
    description: '会员活动・环比↑80%',
    amount: '¥1,250'
  }
];

const RankingList: React.FC<{ title: string; data: RankingUser[] }> = ({ title, data }) => (
  <div>
    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">{title}</h3>
    <div className="space-y-3">
      {data.map((user) => (
        <div key={user.rank} className="flex items-center gap-3">
          <span
            className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
              user.rank <= 3
                ? 'bg-orange-400 text-white'
                : 'bg-gray-200 text-[var(--text-secondary)]'
            }`}
          >
            {user.rank}
          </span>
          <Image
            src={user.avatar}
            alt={`${user.name}的头像`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/images/avatars/default-avatar.svg';
            }}
          />
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)] text-sm">{user.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user.description}</p>
          </div>
          <span className="font-bold text-[var(--text-primary)] text-base">{user.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

const GMVRankingCard: React.FC<GMVRankingCardProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm mt-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">GMV贡献排行榜</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RankingList title="累计GMV排行榜" data={totalGMVData} />
        <RankingList title="月度GMV增长榜" data={monthlyGrowthData} />
      </div>
    </div>
  );
};

export default GMVRankingCard;