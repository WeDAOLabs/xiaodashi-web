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
        title="核心定位"
        description="营销决策AI引擎与智能营销架构师"
        imageUrl="/feature-analytics.png"
        items={[
          '营销决策引擎',
          '智能营销架构设计',
          '科学营销知识图谱',
          'Web3社区共建',
          '专家级外脑',
        ]}
      />
      <FeatureCard
        title="团队协作"
        description="数字专家群与企业员工的“完美拍档”"
        imageUrl="/feature-content-creation.png"
        items={[
          'AI营销专家团队',
          '数字人自运行',
          '人机完美搭档',
          '全链路营销协作者',
          '高价值创造',
        ]}
      />
      <FeatureCard
        title="部署模式"
        description="灵活配置，无忧数据，即刻赋能"
        imageUrl="/feature-social-media.png"
        items={[
          '敏捷可插拔',
          '普惠化智能营销',
          '一人公司适用',
          '分段构建数据',
          '降低门槛',
          '定制化',
        ]}
      />
      <FeatureCard
        title="价值交付"
        description="经验智用（Experience-Driven Utility, EDU）模式"
        imageUrl="/feature-email-marketing.png"
        items={[
          '产品服务化',
          '服务产品化',
          '简化上手',
          '重构业务流程',
          '可信营销生态',
        ]}
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
