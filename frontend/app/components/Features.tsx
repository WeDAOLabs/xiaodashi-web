const Features = () => (
  <section className="py-24">
    <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      五大核心AI营销工具
    </h2>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <FeatureCard
        title="内容创作助手"
        description="AI赋能，轻松创作高质量营销内容。"
        imageUrl="/feature-content-creation.png"
      />
      <FeatureCard
        title="自动化邮件营销"
        description="个性化触达，自动化提升邮件营销效果。"
        imageUrl="/feature-email-marketing.png"
      />
      <FeatureCard
        title="社交媒体管理"
        description="AI洞察，优化社交媒体运营策略。"
        imageUrl="/feature-social-media.png"
      />
      <FeatureCard
        title="SEO优化"
        description="AI驱动策略，提升搜索引擎排名。"
        imageUrl="/feature-seo.png"
      />
      <FeatureCard
        title="数据分析仪表盘"
        description="实时追踪，深度分析营销表现。"
        imageUrl="/feature-analytics.png"
      />
    </div>
  </section>
);

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const FeatureCard = ({ title, description, imageUrl }: FeatureCardProps) => (
  <div className="flex flex-col items-center text-center gap-4">
    <div
      className="w-full aspect-square rounded-xl bg-cover bg-center bg-gray-100"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
    <div>
      <p className="text-lg font-medium leading-normal text-[var(--text-primary)]">
        {title}
      </p>
      <p className="text-base font-normal leading-normal text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  </div>
);

export default Features;
