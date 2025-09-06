import { Button } from '@/app/components/ui/Button';

const Pricing = () => (
  <section className="rounded-2xl bg-gray-50 p-8 text-center sm:p-12">
    <h2 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 sm:text-4xl">
      选择适合您的方案
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-gray-600 sm:text-lg">
      我们的方案灵活多样，旨在与您的业务共同成长，在每个阶段都提供卓越价值。如需企业级定制解决方案，请联系我们的销售团队。
    </p>
    <div className="mt-8 flex justify-center">
      <Button href="/pricing">查看定价方案</Button>
    </div>
  </section>
);

export default Pricing;
