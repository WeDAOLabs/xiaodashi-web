import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';

const Hero = () => (
  <section className="w-full text-center py-20 md:py-32">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-black leading-tight tracking-tighter text-gray-900 md:text-7xl">
            智能营销，重塑增长
          </h1>
          <p className="mt-6 text-lg font-normal leading-normal text-gray-600 md:text-xl">
            智商180的AI全域营销大师，您的专属营销伙伴。我们用尖端人工智能，为您开启营销新纪元，实现业务指数级增长。
          </p>
        </div>
        <div className="flex gap-4">
          <Button href="#">立即免费试用</Button>
          <Button href="#" variant="secondary">联系销售</Button>
        </div>
        <div className="relative mt-12 w-full max-h-[600px] overflow-hidden rounded-2xl shadow-2xl">
          <Image
            alt="AI Marketing Platform Dashboard"
            className="w-full"
            src="/hero-dashboard.png"
            width={1200}
            height={675}
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
