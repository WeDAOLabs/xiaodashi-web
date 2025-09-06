import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import FeatureSection from '@/app/components/FeatureSection';
import Testimonial from '@/app/components/customer-stories/Testimonial';
import PageHero from '@/app/components/ui/PageHero';

const stories = [
  {
    tag: '科技行业',
    title: '提升用户参与度',
    description: '一家领先的科技公司难以在社交媒体上有效吸引目标受众，导致用户增长停滞。通过智商180的AI全域营销大师的内容优化和精准受众定位，该企业能够推送更具相关性的内容，并在最佳时间与用户互动。',
    features: [
      '<strong>挑战:</strong> 一家领先的科技公司难以在社交媒体上有效吸引目标受众，导致用户增长停滞。',
      '<strong>解决方案:</strong> 通过智商180的AI全域营销大师的内容优化和精准受众定位，该企业能够推送更具相关性的内容，并在最佳时间与用户互动。',
      '<strong>成果:</strong> 在短短三个月内，用户参与率提升了40%，潜在客户开发增加了25%，显著增强了品牌影响力。',
    ],
    image: '/customer-story-1.png',
    imageAlt: '科技创新企业',
  },
  {
    tag: '电子商务',
    title: '推动销售额增长',
    description: '一家在线零售商面临高网站流量但转化率低下的问题，无法有效将访客转化为付费客户。利用智商180的AI全域营销大师的个性化产品推荐引擎和自动化电子邮件营销，根据用户行为推送定制化营销信息。',
    features: [
        '<strong>挑战:</strong> 一家在线零售商面临高网站流量但转化率低下的问题，无法有效将访客转化为付费客户。',
        '<strong>解决方案:</strong> 利用智商180的AI全域营销大师的个性化产品推荐引擎和自动化电子邮件营销，根据用户行为推送定制化营销信息。',
        '<strong>成果:</strong> 实现了转化率提高30%，平均订单价值增长了20%，为公司带来了可观的收入增长。',
    ],
    image: '/customer-story-2.png',
    imageAlt: '电商零售商',
    reverse: true,
  },
  {
    tag: '金融服务',
    title: '优化营销投资回报',
    description: '一家金融服务公司希望在不增加预算的情况下，提高营销活动的效率和获客质量。采用智商180的AI全域营销大师的预测分析功能，精准识别高价值客户群体，并优化广告投放策略，最大化预算效益。',
    features: [
        '<strong>挑战:</strong> 一家金融服务公司希望在不增加预算的情况下，提高营销活动的效率和获客质量。',
        '<strong>解决方案:</strong> 采用智商180的AI全域营销大师的预测分析功能，精准识别高价值客户群体，并优化广告投放策略，最大化预算效益。',
        '<strong>成果:</strong> 在保持潜在客户流量稳定的同时，成功将每次获客成本降低了15%，显著提升了营销投资回报率。',
    ],
    image: '/customer-story-3.png',
    imageAlt: '金融服务公司',
  },
];

const testimonials = [
  {
    quote: '“智商180的AI全域营销大师彻底改变了我们的营销策略。其洞察力和自动化功能显著提高了我们的活动表现和投资回报率。”',
    author: '陈莎拉',
    title: '市场总监, 科技创新公司',
    avatarUrl: '/testimonial-4.png',
  },
  {
    quote: '“智商180的AI全域营销大师提供的AI工具对我们销售增长起到了关键作用。我们看到了切实的成果和更高效的营销流程。”',
    author: '李大卫',
    title: '首席执行官, 电商零售有限公司',
    avatarUrl: '/testimonial-5.png',
  },
  {
    quote: '“借助智商180的AI全域营销大师，我们得以优化营销支出并取得更好的成果。他们的预测分析对我们的业务来说是一个颠覆性的改变。”',
    author: '王艾米丽',
    title: '市场部主管, 金融服务集团',
    avatarUrl: '/testimonial-6.png',
  },
];

const CustomerStoriesPage = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <PageHero
            title={<>客户的成功，<br />我们的动力。</>}
            description="各行各业的领先企业通过智商180的AI全域营销大师实现营销目标，探索他们的故事。"
          />

          <section className="pb-20 sm:pb-32">
            <div className="container mx-auto px-6">
              <div className="space-y-24">
                {stories.map((story) => (
                  <FeatureSection key={story.title} {...story} />
                ))}
              </div>
            </div>
          </section>

          <div className="py-24 md:py-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                听听我们的客户怎么说
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
              {testimonials.map((testimonial) => (
                <Testimonial key={testimonial.author} {...testimonial} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CustomerStoriesPage;
