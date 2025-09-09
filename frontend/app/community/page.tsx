import CommunityFeatureCard from '@/app/components/community/CommunityFeatureCard';
import CommunityHero from '@/app/components/community/CommunityHero';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Faq from '@/app/components/ui/Faq';

// Community feature data - consistent with homepage
const COMMUNITY_FEATURES = [
  {
    id: 'expert-qa',
    title: '专家答疑',
    description: '业界大咖在线解答',
    detailedDescription: '汇聚AI营销领域的资深专家和实战大咖，为您提供专业的技术指导和实践建议。无论是策略制定还是技术实施，都能获得权威解答。',
    iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'case-sharing',
    title: '案例分享',
    description: '真实成功案例分析',
    detailedDescription: '深度剖析真实的AI营销成功案例，从策略制定到执行细节，从数据分析到效果评估，帮您借鉴成功经验，避免常见陷阱。',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    id: 'tech-discussion',
    title: '技术探讨',
    description: '最新AI营销技术',
    detailedDescription: '紧跟AI技术发展前沿，探讨最新的算法应用、工具使用和技术趋势。与技术专家和同行深入交流，提升技术认知和应用能力。',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 'product-creation',
    title: '产品共创',
    description: '参与产品设计与优化',
    detailedDescription: '作为DAO社区的核心价值，用户不仅是使用者，更是产品的共创者。参与需求讨论、功能设计，让产品更贴合实际业务场景。',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
  },
  {
    id: 'online-offline',
    title: '线上线下',
    description: '丰富的活动形式',
    detailedDescription: '线上研讨会、专家讲座、实战工作坊；线下聚会、行业峰会、商务沙龙。多元化的活动形式，满足不同层次的学习和交流需求。',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    id: 'networking',
    title: '人脉拓展',
    description: '连接同行精英',
    detailedDescription: '汇聚各行业的营销精英和创业者，建立有价值的商业人脉网络。在这里不仅能学习成长，更能找到合作伙伴和商业机会。',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  }
];

// FAQ data consistent with community focus
const COMMUNITY_FAQ_ITEMS = [
  {
    question: '如何加入销岛(S DAO)社区？',
    answer: '点击"立即登岛"按钮即可加入我们的社区。作为DAO组织，我们欢迎所有对AI营销感兴趣的专业人士和企业加入，共同推动行业发展。'
  },
  {
    question: '社区内有哪些核心活动？',
    answer: '我们定期举办专家答疑、案例分享会、技术讨论、产品共创会议等。同时组织线上线下的各类活动，为成员提供全方位的学习和交流机会。'
  },
  {
    question: 'DAO组织模式有什么特殊之处？',
    answer: 'DAO（去中心化自治组织）让每位成员都能参与社区治理和产品决策。通过用户共建模式，确保产品功能真正满足市场需求，实现知识共享和持续进化。'
  },
  {
    question: '社区成员可以获得什么价值？',
    answer: '除了专业知识学习和人脉拓展，成员还能参与产品共创，享受产品优先体验权、专家一对一指导、独家资源访问等特权，真正成为AI营销领域的先行者。'
  }
];

const CommunityPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
            <Header />
            <main className="flex-1">
                {/* Hero Section with proper community styling */}
                <CommunityHero />

                {/* Community Features Section */}
                <section className="py-16 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                                社区特色与价值
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                六大核心功能板块，构建全方位的AI营销学习和交流平台
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {COMMUNITY_FEATURES.map((feature) => (
                                <CommunityFeatureCard
                                    key={feature.id}
                                    title={feature.title}
                                    description={feature.description}
                                    detailedDescription={feature.detailedDescription}
                                    iconPath={feature.iconPath}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section using pricing page style */}
                <section className="bg-white py-12 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Faq title="常见问题解答" items={COMMUNITY_FAQ_ITEMS} />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CommunityPage;
