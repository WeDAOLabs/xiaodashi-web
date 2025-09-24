'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SearchBar from './_components/SearchBar';
import HelpTopicCard from './_components/HelpTopicCard';
import FAQSection from './_components/FAQSection';
import ContactSupport from './_components/ContactSupport';

const SupportPage: React.FC = () => {
  return (
    <DashboardLayout
      title="帮助与支持"
      breadcrumbs={[
        { label: '帮助与支持', href: '/support', current: true }
      ]}
    >
      <section className="px-4 mb-8">
        <p className="text-[var(--text-secondary)] mb-6">我们随时为您服务。在这里查找答案或联系我们。</p>
        <div className="space-y-10">
          {/* Search Bar */}
          <SearchBar />

          {/* Topics Section */}
          <div>
            <h2 className="text-lg font-semibold mb-5 text-[var(--text-primary)]">浏览帮助主题</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <HelpTopicCard
                title="入门指南"
                description="了解如何设置您的账户并开始使用我们的平台。"
                icon="BookOpen"
              />
              <HelpTopicCard
                title="账户管理"
                description="管理您的个人资料、团队成员和安全设置。"
                icon="User"
              />
              <HelpTopicCard
                title="营销活动"
                description="创建、管理和分析您的AI营销活动。"
                icon="Send"
              />
              <HelpTopicCard
                title="计费与订阅"
                description="查看您的订阅详情、发票和付款方式。"
                icon="CreditCard"
              />
              <HelpTopicCard
                title="技术支持"
                description="遇到技术问题？在这里寻找解决方案。"
                icon="Settings"
              />
              <HelpTopicCard
                title="联系我们"
                description="获取有关我们产品和服务的更多信息。"
                icon="MessageCircle"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <FAQSection />

          {/* Contact Section */}
          <ContactSupport />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default SupportPage;