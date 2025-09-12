
import ChevronRightIcon from '@/app/components/ChevronRightIcon';
import FeatureSection from '@/app/components/FeatureSection';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import PageHero from '@/app/components/ui/PageHero';

export default function SolutionsPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <PageHero
            title="强大功能，为您的营销赋能"
            description="探索 智商180的AI全域营销大师 平台的各项核心功能，了解我们如何通过技术创新，帮助您实现营销目标。"
          />
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-24">
              <FeatureSection
                tag="智能内容创作"
                title="AI 生成，让内容创作更高效"
                description="利用先进的自然语言处理技术，智商180的AI全域营销大师 能够根据您的需求，快速生成多样化、高质量的营销文案、社交媒体帖子和博客文章。告别灵感枯竭，轻松应对内容创作挑战。"
                features={[
                  '多场景适用：轻松生成广告语、产品描述、活动推文等多种内容。',
                  '品牌声调定制：AI 学习并模仿您的品牌风格，确保内容一致性。',
                  '优化与迭代：基于效果数据，持续优化内容策略，提升转化率。',
                ]}
                image="/solutions-content-creation.png"
                imageAlt="AI内容创作平台截图"
              />

              <FeatureSection
                tag="营销自动化"
                title="自动化流程，释放团队潜力"
                description="通过自动化的工作流程，简化并加速您的营销活动。从客户触达、培育到转化，智商180的AI全域营销大师 都能帮您自动执行，让您的团队能专注于更具战略性的任务。"
                features={[
                  '智能客户分群：根据用户行为自动划分客群，实现精准沟通。',
                  '自动化邮件与消息推送：在最佳时机，向对的用户发送对的信息。',
                  '跨渠道活动管理：在一个平台集中管理和自动化所有营销渠道。',
                ]}
                image="/solutions-marketing-automation.png"
                imageAlt="营销自动化工作流界面"
                reverse={true}
              />

              <FeatureSection
                tag="数据洞察与分析"
                title="数据驱动，做出更明智的决策"
                description="智商180的AI全域营销大师 将复杂的营销数据转化为直观、易于理解的洞察报告。通过强大的数据分析和预测能力，帮助您准确评估营销效果，发现增长机会，并优化未来策略。"
                features={[
                  '实时效果追踪：监控关键指标，即时了解营销活动表现。',
                  '用户行为分析：深入了解客户旅程，找到优化关键点。',
                  '预测性分析：预测市场趋势和客户行为，提前布局。',
                ]}
                image="/solutions-data-analytics.png"
                imageAlt="数据分析仪表盘"
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gray-100 p-12 text-center md:p-20">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                准备好提升您的营销水平了吗？
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
                立即开始，亲身体验 智商180的AI全域营销大师 如何为您的业务带来变革。申请免费演示，开启智能营销新篇章。
              </p>
              <div className="mt-10">
                <button className="inline-flex items-center justify-center rounded-full bg-[var(--primary-color)] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[var(--accent-color)]">
                  <span>申请产品演示</span>
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
