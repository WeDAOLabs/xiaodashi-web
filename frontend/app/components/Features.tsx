import Image from 'next/image';

const Features = () => (
  <section className="py-24">
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)] md:text-5xl">
        每个人都能拥有专家级的数字人营销团队
      </h2>
    </div>
    <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
      <FeatureCard
        title="战略与决策中枢"
        description="基于深度数据洞察，为您提供从战略规划、市场分析到效果评估的全链路决策支持。"
        imageUrl="/feature-analytics.png"
        items={[
          '智能业务与营销战略规划',
          '智能市场洞察与竞品分析',
          '智能营销效果评估与数据分析',
        ]}
      />
      <FeatureCard
        title="品牌与创意资产"
        description="智能化管理品牌IP与数字资产，AI驱动高效、高质量的内容创作，构建强大品牌护城河。"
        imageUrl="/feature-content-creation.png"
        items={['智能品牌与IP资产管理', '智能内容创作与素材中心', '多渠道智能分发与洞察']}
      />
      <FeatureCard
        title="增长与运营执行"
        description="打通公域与私域，覆盖电商与销售，用AI驱动用户增长和运营转化的每一个关键环节。"
        imageUrl="/feature-social-media.png"
        items={[
          '智能公域流量投放与优化',
          '智能私域增长与运营',
          '智能电商与销售转化',
        ]}
      />
      <FeatureCard
        title="赋能与效率提升"
        description="构建企业智能知识库，打破信息壁垒，全面提升组织协同与运营效率。"
        imageUrl="/feature-email-marketing.png"
        items={['企业级智能知识库', '自动化业务流程', '跨部门智能协同']}
      />
    </div>
  </section>
);

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  items: string[];
}

const FeatureCard = ({ title, description, imageUrl, items }: FeatureCardProps) => (
  <div className="overflow-hidden rounded-2xl bg-[var(--bg-secondary)] transition-transform duration-300 hover:-translate-y-1">
    <div className="flex flex-col md:flex-row">
      <div className="relative h-48 w-full md:h-auto md:w-2/5">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col p-6 text-left md:w-3/5">
        <p className="text-lg font-bold text-[var(--text-primary)]">{title}</p>
        <p className="mt-2 text-sm font-normal leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start">
              <svg
                className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-[var(--primary-color)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span className="text-sm text-[var(--text-secondary)]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Features;
