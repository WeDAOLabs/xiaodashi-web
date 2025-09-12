'use client';

import ContactSalesModal from '@/app/components/ContactSalesModal';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import ComparisonTable from '@/app/components/pricing/ComparisonTable';
import PlanCard, { type PlanProps } from '@/app/components/pricing/PlanCard';
import Faq from '@/app/components/ui/Faq';
import PageHero from '@/app/components/ui/PageHero';
import { useState } from 'react';

const pricingPlans: PlanProps[] = [
  {
    name: '超级个体',
    price: '即将发布',
    period: '',
    description: '适合个人，提供超级个体AI营销工具',
    features: [
      '基础内容创作工具',
      '简单营销策略建议',
      '基础数据分析',
      '邮件支持',
      '月度使用报告'
    ]
  },
  {
    name: '企业半自动化',
    price: '联系咨询',
    period: '价格',
    description: '适合小型企业，AI辅助决策和营销执行',
    features: [
      '高级内容创作与优化',
      '智能营销策略规划',
      '深度数据分析与洞察',
      '多渠道营销自动化',
      '专属客户经理',
      '7x24小时技术支持'
    ],
    isRecommended: true
  },
  {
    name: '企业全自动化',
    price: '定制报价',
    period: '',
    description: '适合中大型企业，全AI自动化营销解决方案',
    features: [
      '全链路AI营销自动化',
      '高级战略与决策支持',
      '企业级品牌资产管理',
      '全渠道智能运营',
      '定制化解决方案',
      '专业团队驻场服务'
    ]
  }
];

const pricingFaqItems = [
    {
      question: '如何选择适合我们公司的方案？',
      answer: '我们提供三种方案：超级个体适合个人和小团队；企业半自动化适合小型企业，提供AI辅助决策；企业全自动化适合中大型企业，实现全链路AI营销自动化。您可以根据团队规模和业务需求选择。'
    },
    {
      question: '“即将发布”和“联系咨询”是什么意思？',
      answer: '超级个体方案目前在最后完善中，即将正式上线。企业级方案需要根据您的具体业务需求进行定制，请点击“选择此方案”联系我们的专业顾问，获取详细报价和解决方案。'
    },
    {
      question: 'AI营销工具是否需要技术基础？',
      answer: '不需要。我们的AI营销平台专为非技术用户设计，提供直观的可视化界面和一键式操作。我们还提供完整的培训和技术支持，确保您能快速上手。'
    },
    {
      question: '可以先试用吗？如何保证效果？',
      answer: '我们支持免费试用和演示。您可以通过联系我们的销售团队预约产品演示，了解具体功能和适用场景。我们的客户成功案例显示，使用我们的AI营销解决方案可以显著提升营销效果和降低成本。'
    },
    {
      question: '数据安全和隐私保护如何？',
      answer: '我们采用企业级安全标准，所有数据传输和存储都经过加密处理。我们严格遵守数据保护法规，不会泄露或滥用您的业务数据。同时，您可以自主控制数据的使用范围和权限。'
    },
    {
      question: '如何获得技术支持？',
      answer: '我们提供多层次的技术支持：超级个体方案提供邮件支持；企业半自动化提供7x24小时在线支持和专属客户经理；企业全自动化还包括专业团队驻场服务。'
    }
];

const PricingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <PageHero 
          title="选择适合您的方案"
          description="我们的方案灵活多样，旨在与您的业务共同成长，在每个阶段都提供卓越价值。"
        />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PlanCard 
                key={plan.name} 
                {...plan} 
                onSelectPlan={() => setIsModalOpen(true)}
              />
            ))}
          </div>
          <ComparisonTable />
        </section>
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Faq title="常见问题" items={pricingFaqItems} />
            </div>
        </section>
      </main>
      <Footer />
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PricingPage;
