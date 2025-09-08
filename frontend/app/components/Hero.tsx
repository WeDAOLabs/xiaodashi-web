'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';
import ContactSalesModal from './ContactSalesModal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="w-full text-center py-20 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-black leading-tight tracking-tighter text-gray-900 md:text-7xl whitespace-nowrap">
                智赢，智商180的AI全域营销大师
              </h1>
              <p className="mt-6 text-lg font-normal leading-normal text-gray-600 md:text-xl">
                AI 赋能决策，数据驱动增长。我们不止是工具，更是您事业成功的营销大脑。
              </p>
            </div>
            <div className="flex gap-4">
              <Button href="#">立即免费试用</Button>
              <Button onClick={() => setIsModalOpen(true)} variant="secondary">联系销售</Button>
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
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Hero;
