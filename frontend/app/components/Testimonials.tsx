const Testimonials = () => (
  <section className="py-24">
    <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      客户成功案例
    </h2>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <TestimonialCard
        industry="医药行业"
        title="AI赋能销售代表，核心药品销售额增长35%"
        description="通过我们的AI销售助手，某跨国药企的销售团队能够智能规划拜访路线、获取实时数据洞察，并为每一次客户互动提供个性化沟通策略。最终，其核心产品线的销售额在半年内实现了35%的同比增长。"
        imageUrl="/testimonial-1.png"
      />
      <TestimonialCard
        industry="餐饮连锁行业"
        title="连锁品牌复购率翻倍，单店营收平均增长25%"
        description="一家全国性餐饮连锁品牌，通过我们的私域运营工具与会员分析系统，实现了精细化用户管理，会员复购率在半年内翻倍。"
        imageUrl="/testimonial-2.png"
      />
      <TestimonialCard
        industry="教育培训"
        title="获客成本降低40%，线上课程转化率显著提升"
        description="领先的在线教育平台采用我们的智能投放与内容策略，精准锁定潜在学员，有效降低了获客成本，并显著提升了线上课程的报名转化率。"
        imageUrl="/testimonial-3.png"
      />
    </div>
  </section>
);

interface TestimonialCardProps {
  industry: string;
  title: string;
  description: string;
  imageUrl: string;
}

const TestimonialCard = ({ industry, title, description, imageUrl }: TestimonialCardProps) => (
  <div className="flex flex-col gap-4">
    <div
      className="w-full aspect-square rounded-xl bg-cover bg-center bg-gray-100"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
    <div>
      <p className="label-style">{industry}</p>
      <p className="mt-2 text-lg font-medium leading-normal text-[var(--text-primary)]">
        {title}
      </p>
      <p className="mt-1 text-base font-normal leading-normal text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  </div>
);

export default Testimonials;