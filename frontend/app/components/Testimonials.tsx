const Testimonials = () => (
  <section className="py-24">
    <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      客户成功案例
    </h2>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <TestimonialCard
        title="营销团队实现30%增长"
        description="了解某营销团队如何利用智商180的AI全域营销大师简化营销活动，实现业务显著增长。"
        imageUrl="/testimonial-1.png"
      />
      <TestimonialCard
        title="电商企业销售额翻倍"
        description="探索一家电商企业如何利用我们的平台将销售额翻倍，拓展市场版图。"
        imageUrl="/testimonial-2.png"
      />
      <TestimonialCard
        title="科技初创公司潜客增长50%"
        description="见证一家科技初创公司如何通过我们的AI工具，将潜在客户生成量提升50%。"
        imageUrl="/testimonial-3.png"
      />
    </div>
  </section>
);

const TestimonialCard = ({ title, description, imageUrl }) => (
  <div className="flex flex-col gap-4">
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

export default Testimonials;
