'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Users, Eye, Lightbulb, ShoppingCart, Heart, Megaphone } from 'lucide-react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import PersonaList from '../_components/consumer-insights/PersonaList';
import OverviewStats from '../_components/consumer-insights/OverviewStats';
import PersonaDetailInfo from '../_components/consumer-insights/PersonaDetailInfo';
import InterestRadarChart from '../_components/consumer-insights/InterestRadarChart';
import AIEmotionAnalysis from '../_components/consumer-insights/AIEmotionAnalysis';
import UserJourneyMap from '../_components/consumer-insights/UserJourneyMap';

// 示例数据
const MOCK_PERSONAS = [
  {
    id: '1',
    name: '都市白领李明',
    avatar: '/images/personas/li-ming.jpg',
    tags: [
      { label: '科技爱好者', color: 'blue' },
      { label: '品质生活', color: 'green' },
      { label: '健身达人', color: 'purple' }
    ]
  },
  {
    id: '2',
    name: '时尚学生张华',
    avatar: '/images/personas/zhang-hua.jpg',
    tags: [
      { label: '潮流追随者', color: 'pink' },
      { label: '社交达人', color: 'blue' },
      { label: '性价比看重', color: 'orange' }
    ]
  }
];

const MOCK_INTEREST_DATA = [
  { category: '科技产品', value: 90, fullMark: 100 },
  { category: '户外运动', value: 65, fullMark: 100 },
  { category: '美食烹饪', value: 45, fullMark: 100 },
  { category: '金融理财', value: 80, fullMark: 100 },
  { category: '旅行', value: 70, fullMark: 100 }
];


const MOCK_EMOTION_TREND = [
  { month: '1月', positive: 76, negative: 12, neutral: 20 },
  { month: '2月', positive: 72, negative: 15, neutral: 25 },
  { month: '3月', positive: 84, negative: 10, neutral: 18 },
  { month: '4月', positive: 90, negative: 5, neutral: 12 },
  { month: '5月', positive: 87, negative: 8, neutral: 15 },
  { month: '6月', positive: 92, negative: 3, neutral: 10 }
];

const MOCK_JOURNEY_STAGES = [
  {
    id: '1',
    icon: Eye,
    title: '认知',
    description: '通过科技媒体、社交平台KOL了解品牌',
    emoji: '👁️'
  },
  {
    id: '2',
    icon: Lightbulb,
    title: '兴趣',
    description: '主动搜索评测视频，对比竞品参数',
    emoji: '💡'
  },
  {
    id: '3',
    icon: ShoppingCart,
    title: '购买',
    description: '官网下单，注重金融方案和交付体验',
    emoji: '🛒'
  },
  {
    id: '4',
    icon: Heart,
    title: '忠诚',
    description: '参与车主社区，分享用车经验',
    emoji: '❤️'
  },
  {
    id: '5',
    icon: Megaphone,
    title: '推荐',
    description: '向朋友推荐，成为品牌"自来水"',
    emoji: '📢'
  }
];

const ConsumerInsightsPage: React.FC = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('1');

  const selectedPersona = MOCK_PERSONAS.find(p => p.id === selectedPersonaId);

  const breadcrumbs = [
    { label: '智能市场洞察与竞品分析', href: '/market-intelligence' },
    { label: '消费者洞察与细分', href: '/market-intelligence-consumer-insights' }
  ];


  return (
    <ToolPageLayout
      title="消费者洞察与细分"
      description="深度分析目标用户行为模式，构建精准用户画像，为营销策略提供数据支撑"
      breadcrumbs={breadcrumbs}
      className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0"
    >
      {/* Main Content Area */}
      <div className="xl:col-span-3 space-y-6 min-h-0">
        {/* Overview Stats */}
        <OverviewStats
          totalPersonas={12}
          latestInsights={48}
          aiPrediction="Z世代用户对'可持续发展'概念的关注度持续上升，将影响其消费决策。"
        />

        {/* Persona Detail Section */}
        {selectedPersona && (
          <div className="space-y-6">
            {/* Persona Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedPersona.name}</h2>
                <p className="text-[var(--text-secondary)]">详细消费者洞察与行为分析</p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1.5" />
                  编辑画像属性
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1.5" />
                  查看相关用户UGC
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-1.5" />
                  导出报告
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <PersonaDetailInfo
                  personalInfo={{
                    age: 32,
                    location: '上海',
                    occupation: '互联网产品经理',
                    income: '¥ 40-50万/年'
                  }}
                  consumerBehavior={{
                    shoppingPreference: '线上购物为主，注重效率和体验',
                    priceSensitivity: '中等，愿意为高品质和创新付费',
                    brandLoyalty: '较高，倾向于信赖和复购特定品牌'
                  }}
                />

                <InterestRadarChart
                  title="兴趣偏好"
                  data={MOCK_INTEREST_DATA}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <AIEmotionAnalysis
                  topic="电动汽车"
                  emotionTrendData={MOCK_EMOTION_TREND}
                />

                <UserJourneyMap
                  title="用户旅程图"
                  stages={MOCK_JOURNEY_STAGES}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Persona List Card */}
      <div className="xl:col-span-1">
        <PersonaList
          personas={MOCK_PERSONAS}
          selectedPersonaId={selectedPersonaId}
          onPersonaSelect={setSelectedPersonaId}
        />
      </div>
    </ToolPageLayout>
  );
};

export default ConsumerInsightsPage;