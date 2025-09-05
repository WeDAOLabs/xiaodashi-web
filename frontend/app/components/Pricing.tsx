const Pricing = () => (
  <section className="rounded-2xl bg-gray-50 p-12 text-center">
    <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      选择适合您的方案
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-lg font-normal leading-relaxed text-[var(--text-secondary)]">
      我们的方案灵活多样，旨在与您的业务共同成长，在每个阶段都提供卓越价值。如需企业级定制解决方案，请联系我们的销售团队。
    </p>
    <div className="mt-8 flex justify-center">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-[var(--accent-color)]">
        <span className="truncate">查看定价方案</span>
      </button>
    </div>
  </section>
);

export default Pricing;
