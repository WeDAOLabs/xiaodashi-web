import Image from 'next/image';

const Hero = () => (
  <section className="w-full text-center py-20 md:py-32">
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-black leading-tight tracking-tighter text-[var(--text-primary)] md:text-7xl">
          智能营销，重塑增长
        </h1>
        <p className="mt-6 text-lg font-normal leading-normal text-[var(--text-secondary)] md:text-xl">
          智商180的AI全域营销大师，您的专属营销伙伴。我们用尖端人工智能，为您开启营销新纪元，实现业务指数级增长。
        </p>
      </div>
      <div className="flex gap-4">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-[var(--accent-color)]">
          <span className="truncate">立即免费试用</span>
        </button>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-transparent text-[var(--primary-color)] text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:underline">
          <span className="truncate">联系销售</span>
        </button>
      </div>
      <div className="mt-12 w-full">
        <Image
          alt="AI Marketing Platform Dashboard"
          className="w-full rounded-2xl"
          src="/hero-dashboard.png"
          width={1200}
          height={675}
        />
      </div>
    </div>
  </section>
);

export default Hero;
