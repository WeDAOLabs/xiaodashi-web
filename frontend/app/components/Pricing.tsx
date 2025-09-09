'use client';

import PlanCard, { type PlanProps } from '@/app/components/pricing/PlanCard';
import { useState } from 'react';
import ContactSalesModal from './ContactSalesModal';

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const plans: PlanProps[] = [
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

  return (
    <section className="rounded-2xl bg-gray-50 p-8 sm:p-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 sm:text-4xl">
          选择适合您的方案
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg">
          我们的方案灵活多样，旨在与您的业务共同成长，在每个阶段都提供卓越价值。
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard 
            key={index} 
            {...plan} 
            onSelectPlan={() => setIsModalOpen(true)}
          />
        ))}
      </div>
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
};

export default Pricing;
