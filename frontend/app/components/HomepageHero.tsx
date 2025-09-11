'use client';

import { Button } from '@/app/components/ui/Button';
import { useState } from 'react';
import ContactSalesModal from './ContactSalesModal';
import Typewriter from 'typewriter-effect';
import clsx from 'clsx';

const HomepageHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  return (
    <>
      <section className="w-full text-center min-h-screen flex items-center justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-black leading-tight tracking-tighter text-gray-900 md:text-7xl whitespace-nowrap h-24 md:h-28">
                <Typewriter
                  options={{
                    delay: 80,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString('智赢，')
                      .pauseFor(300)
                      .typeString('智商180的')
                      .pauseFor(300)
                      .typeString('AI全域营销大师')
                      .callFunction((state) => {
                        state.elements.cursor.style.display = 'none';
                        setIsTypingFinished(true);
                      })
                      .start();
                  }}
                />
              </h1>
              <p className={clsx(
                "mt-6 text-lg font-normal leading-normal text-gray-600 md:text-xl transition-all duration-500 ease-out delay-300",
                isTypingFinished ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}>
                AI 赋能决策，数据驱动增长。我们不止是工具，更是您事业成功的营销大脑。
              </p>
            </div>
            <div className={clsx(
              "flex gap-4 transition-all duration-500 ease-out delay-500",
              isTypingFinished ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}>
              <Button onClick={() => setIsModalOpen(true)}>立即免费试用</Button>
              <Button onClick={() => setIsModalOpen(true)} variant="secondary">联系销售</Button>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default HomepageHero;
