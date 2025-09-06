import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import ComparisonTable from '@/app/components/pricing/ComparisonTable';
import Faq from '@/app/components/pricing/Faq';
import PricingCard from '@/app/components/pricing/PricingCard';

const pricingPlans = [
  {
    planName: '个人版',
    price: '免费',
    description: '适合刚起步的个人或小型团队，体验AI营销的魅力。',
    features: [
      '基础AI内容生成',
      '1 个社交媒体账户',
      '社区支持',
    ],
    buttonText: '免费开始',
  },
  {
    planName: '专业版',
    price: '¥16,999',
    pricePeriod: '/月',
    description: '为成长型企业设计，提供更强大的AI工具和数据分析。',
    features: [
      '<strong>个人版</strong>所有功能',
      '高级数据分析和报告',
      '多达 10 个社交媒体账户',
      '优先邮件支持',
    ],
    buttonText: '选择专业版',
    isPopular: true,
  },
  {
    planName: '企业版',
    price: '定制',
    description: '为大型企业量身定制，提供专属服务和无限可能。',
    features: [
      '<strong>专业版</strong>所有功能',
      '专属客户成功经理',
      '定制化集成和API访问',
      '企业级安全和支持',
    ],
    buttonText: '联系销售',
    isCustom: true,
  },
];

const PricingPage = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight">适合您业务的定价方案。</h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">从免费的基础版到功能强大的企业版，智商180的AI全域营销大师提供多种方案，助您实现营销目标。</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.planName} {...plan} />
            ))}
          </div>
          <ComparisonTable />
          <Faq />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
