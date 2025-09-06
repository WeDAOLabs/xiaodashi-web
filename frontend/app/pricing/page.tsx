import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PricingCard from '@/app/components/pricing/PricingCard';
import ComparisonTable from '@/app/components/pricing/ComparisonTable';
import Faq from '@/app/components/ui/Faq';
import PageHero from '@/app/components/ui/PageHero';

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

const pricingFaqItems = [
    {
      question: '我该如何订阅？',
      answer: '只需选择您想要的方案，点击“选择”或“免费开始”按钮，然后按照屏幕上的指示完成注册和支付流程即可。整个过程只需几分钟。'
    },
    {
      question: '我可以随时更改或取消我的计划吗？',
      answer: '是的，您可以随时在您的账户设置中轻松升级、降级或取消您的计划。更改将立即生效。'
    },
    {
      question: '支持哪些付款方式？',
      answer: '我们接受所有主流信用卡（Visa, MasterCard, American Express），以及支付宝和微信支付，为您提供灵活便捷的支付选择。'
    }
];

const PricingPage = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <PageHero 
          title="适合您业务的定价方案。"
          description="从免费的基础版到功能强大的企业版，智商180的AI全域营销大师提供多种方案，助您实现营销目标。"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.planName} {...plan} />
            ))}
          </div>
          <ComparisonTable />
          <Faq title="常见问题" items={pricingFaqItems} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
