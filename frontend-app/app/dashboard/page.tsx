import BriefingCard from '@/components/dashboard/BriefingCard';
import FeatureCard from '@/components/dashboard/FeatureCard';
import HealthChart from '@/components/dashboard/HealthChart';
import MetricCard from '@/components/dashboard/MetricCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import TopicTrackingTable from '@/components/dashboard/TopicTrackingTable';
import TrendCardEnhanced from '@/components/dashboard/TrendCardEnhanced';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

// 科学营销知识图谱功能卡片数据
const marketingFeatures = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: '营销策略制定',
    description: 'AI驱动的营销战略规划与执行'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: '内容创意生成',
    description: '智能文案、图片与视频内容创作'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h.008v.008h-.008v-.008zM12 4.5h.008v.008H12V4.5z" />
      </svg>
    ),
    title: '竞品分析报告',
    description: '多维度竞争对手数据监测'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962.343 1.087.835l.383 1.437M7.5 14.25L5.106 5.106A2.25 2.25 0 002.856 3H2.25m9.75 11.25h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: '电商运营优化',
    description: '店铺流量与转化率提升方案'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 16.695 16.695 0 003.007.319m0 0a2.966 2.966 0 003.348 0c1.01-.101 2.016-.2 3.007-.319m2.2-13.037A6 6 0 016 9v.75a8.967 8.967 0 016-2.292c2.89 0 5.516 1.71 6.72 4.292M6 9a6 6 0 016-6z" />
      </svg>
    ),
    title: '用户画像分析',
    description: '用户行为与需求深度洞察'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: '舆情监控',
    description: '全网声量与口碑实时追踪'
  }
];

// 竞争对手内容数据
const competitorPosts = [
  {
    imageUrl: 'https://picsum.photos/seed/house1/400/300',
    title: '夏日清新妆容教程',
    author: '化妆师安娜',
    stats: '◎ 11.2万浏览 · 1500点赞'
  },
  {
    imageUrl: 'https://picsum.photos/seed/house2/400/300',
    title: '夏日清新妆容教程',
    author: '化妆师安娜',
    stats: '◎ 11.2万浏览 · 1500点赞'
  },
  {
    imageUrl: 'https://picsum.photos/seed/house3/400/300',
    title: '夏日清新妆容教程',
    author: '化妆师安娜',
    stats: '◎ 11.2万浏览 · 1500点赞'
  },
  {
    imageUrl: 'https://picsum.photos/seed/house4/400/300',
    title: '夏日清新妆容教程',
    author: '化妆师安娜',
    stats: '◎ 11.2万浏览 · 1500点赞'
  },
];

// 战略目标进度数据
const strategicGoals = [
  { title: 'Q3营收增长目标', percentage: 78, target: '¥500万', achieved: '¥390万' },
  { title: '新用户获取目标', percentage: 65, target: '10,000人', achieved: '6,500人' },
  { title: '产品迭代计划', percentage: 92, target: '12个功能', achieved: '11个功能' }
];

// 知识图谱健康度指标数据
const healthMetrics = [
  { label: '数据完整性', value: '94%' },
  { label: '更新频率', value: '7天/次' },
  { label: '覆盖率', value: '87%' },
  { label: '应用效果', value: '91分' }
];

// 行业趋势数据
const industryTrends = [
  {
    imageUrl: 'https://picsum.photos/seed/building/400/300',
    title: '智能家居市场快速增长',
    description: '智能家居产品需求激增，新兴品牌崛起',
    metrics: [
      { label: '活跃用户', value: '148万+' }
    ]
  },
  {
    imageUrl: 'https://picsum.photos/seed/gadget/400/300',
    title: '消费电子行业趋势向好',
    description: '消费电子行业整体趋势向好，智能家居产品需求激增，新兴品牌崛起',
    metrics: [
      { label: '市场规模', value: '¥586亿' },
      { label: '同比增长', value: '18.7%' }
    ]
  },
  {
    imageUrl: 'https://picsum.photos/seed/game/400/300',
    title: '竞争对手"TechGenius"推出新款智能手表',
    description: '竞争对手"TechGenius"推出新款智能手表, 主打健康监测功能, 市场反响热烈',
    progressMetrics: [
      { label: '市场份额', value: '35%', percentage: 35 },
      { label: '用户评价', value: '4.3/5分', percentage: 86 }
    ]
  }
];

// 热门话题数据
const hotTopics = [
  { topic: '极简主义生活', heat: 87.5, trend: 12.3, trendDirection: 'up' as const, relevance: 4 },
  { topic: '可持续时尚', heat: 76.2, trend: 8.7, trendDirection: 'up' as const, relevance: 3 },
  { topic: '数字游民生活', heat: 68.9, trend: 5.4, trendDirection: 'up' as const, relevance: 3 },
  { topic: '健身科技', heat: 45.3, trend: 3.1, trendDirection: 'down' as const, relevance: 3 },
  { topic: 'AI辅助创作', heat: 92.1, trend: 23.7, trendDirection: 'up' as const, relevance: 5 }
];

const DashboardPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '#' },
    { label: '文案', href: '#', current: true }
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {/* 科学营销知识图谱与功能导航 */}
      <section className="px-4 mb-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">业务场景直达</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketingFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* 战略目标达成进度 和 知识图谱健康度 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4 mb-8">
        {/* 战略目标达成进度 */}
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[var(--text-primary)]">战略目标达成进度</h3>
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] h-6 w-6 p-0">...</Button>
            </div>
            <div className="space-y-6">
              {strategicGoals.map((goal, index) => (
                <ProgressCard key={index} {...goal} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 知识图谱健康度 */}
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">知识图谱健康度</h3>
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] h-6 w-6 p-0">...</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {healthMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
            <HealthChart />
          </CardContent>
        </Card>
      </div>

      {/* 今日简报 */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">今日简报</h2>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">核心竞争对手分析</h3>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="text-sm px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mr-2 text-[var(--text-primary)]"
            >
              小红书
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-[var(--text-primary)]"
            >
              抖音
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {competitorPosts.map((post, index) => (
            <BriefingCard key={index} {...post} />
          ))}
        </div>
      </section>

      {/* 行业趋势速览 */}
      <section className="px-4 mb-8">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">行业趋势速览</h3>
        <div className="space-y-6">
          {industryTrends.map((trend, index) => (
            <TrendCardEnhanced key={index} {...trend} />
          ))}
        </div>
      </section>

      {/* 热门话题追踪 */}
      <div className="px-4 mb-8">
        <TopicTrackingTable topics={hotTopics} />
      </div>

      <p className="text-center text-sm font-normal leading-normal text-[var(--text-secondary)] pb-3 pt-1 px-4">© 2025 智赢. 所有权利。|隐私政策|用户协议</p>
    </DashboardLayout>
  );
};

export default DashboardPage;