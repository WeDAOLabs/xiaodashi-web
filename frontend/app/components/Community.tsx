import { Button } from '@/app/components/ui/Button';

// Community feature data - following KISS principle for easy maintenance
const COMMUNITY_FEATURES = [
  {
    id: 'expert-qa',
    title: '专家答疑',
    description: '业界大咖在线解答',
    iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'case-sharing',
    title: '案例分享',
    description: '真实成功案例分析',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    id: 'tech-discussion',
    title: '技术探讨',
    description: '最新AI营销技术',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 'product-creation',
    title: '产品共创',
    description: '参与产品设计与优化',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 'online-offline',
    title: '线上线下',
    description: '丰富的活动形式',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    id: 'networking',
    title: '人脉拓展',
    description: '连接同行精英',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
];

// Modular feature card component - high cohesion, low coupling
interface FeatureCardProps {
  title: string;
  description: string;
  iconPath: string;
}

const FeatureCard = ({ title, description, iconPath }: FeatureCardProps) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
    <div className="text-[var(--primary-color)] mb-2">
      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Main community component - clean and modular
const Community = () => (
  <section className="section-container text-center bg-gray-50">
    {/* 标题区域 */}
    <div className="mb-8">
      <h2 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 sm:text-4xl mb-2">
        销岛 (S DAO)：AI营销人的共振之地
      </h2>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
        DAO组织模式 · 用户共建 · 知识共享 · 持续进化
      </div>
    </div>

    {/* 主要内容 */}
    <p className="mx-auto mt-6 max-w-4xl text-base font-normal leading-relaxed text-gray-700 sm:text-lg mb-8">
      不仅仅是使用工具，更要融入社群。在这里，您将获取前沿知识、拓展人脉、与专家交流，
      共同推动营销智能化发展。加入我们，成为未来营销的共创者。
    </p>

    {/* 社区特色 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {COMMUNITY_FEATURES.map((feature) => (
        <FeatureCard
          key={feature.id}
          title={feature.title}
          description={feature.description}
          iconPath={feature.iconPath}
        />
      ))}
    </div>

    {/* CTA按钮 */}
    <div className="mt-8 flex justify-center">
      <Button 
        href="/community" 
        className="btn-gradient-primary text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        立即登岛，开启共创之旅
      </Button>
    </div>
  </section>
);

export default Community;