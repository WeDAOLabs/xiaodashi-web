'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChevronRightIcon from './ChevronRightIcon';
import { Button } from './ui/Button';
import PageHero from './ui/PageHero';
import ContactSalesModal from './ContactSalesModal';

const strategies = [
  {
    title: '战略与决策中枢',
    description: '基于深度数据洞察，为您提供从战略规划、市场分析到效果评估的全链路决策支持。',
    imageUrl: '/feature-analytics.png',
  },
  {
    title: '品牌与创意资产',
    description: '智能化管理品牌IP与数字资产，AI驱动高效、高质量的内容创作，构建强大品牌护城河。',
    imageUrl: '/feature-content-creation.png',
  },
  {
    title: '增长与运营执行',
    description: '打通公域与私域，覆盖电商与销售，用AI驱动用户增长和运营转化的每一个关键环节。',
    imageUrl: '/feature-social-media.png',
  },
  {
    title: '赋能与效率提升',
    description: '构建企业智能知识库，打破信息壁垒，全面提升组织协同与运营效率。',
    imageUrl: '/feature-email-marketing.png',
    secondaryImageUrl: '/solutions-data-analytics.png', // Placeholder for the second image in the last card
  },
];

const Tools = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHero
        title="AI驱动增长，从未如此轻松"
        description="我们的每一项功能，都为您的增长而设计。探索四大策略如何协同作用，驱动您的业务迈向新高度。"
      >
        <Button onClick={() => setIsModalOpen(true)}>立即体验</Button>
        <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="flex items-center gap-1">
          探索策略
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </PageHero>
      <section className="py-20 md:py-28 bg-gray-50" id="tools">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-5xl">
              探索我们的四大增长策略
            </h2>
            <p className="mt-4 text-lg font-light text-gray-600">
              每一种策略都旨在解决您业务中的核心挑战，助您精准导航，高效增长。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Strategy 1 (Large) */}
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-white p-8 md:col-span-2">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-900 md:text-4xl">
                    {strategies[0].title}
                  </h3>
                  <p className="mt-2 max-w-md text-base font-light text-gray-600 md:text-lg">
                    {strategies[0].description}
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)}>
                    立即体验
                  </Button>
                </div>
              </div>
              <Image
                alt={strategies[0].title}
                src={strategies[0].imageUrl}
                fill
                className="absolute inset-0 h-full w-full object-cover opacity-5 transition-opacity group-hover:opacity-10"
              />
            </div>

            {/* Strategy 2 (Small) */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  {strategies[1].title}
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-gray-600">
                  {strategies[1].description}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)}>
                    立即体验
                  </Button>
                </div>
              </div>
            </div>

            {/* Strategy 3 (Small) */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  {strategies[2].title}
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-gray-600">
                  {strategies[2].description}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)}>
                    立即体验
                  </Button>
                </div>
              </div>
            </div>

            {/* Strategy 4 (Large) */}
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-gray-800 p-8 text-white md:col-span-2">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold md:text-4xl">
                  {strategies[3].title}
                </h3>
                <p className="mt-2 max-w-xl text-base font-light text-gray-400 md:text-lg">
                  {strategies[3].description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="rounded-full border border-gray-600 bg-transparent px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-gray-700">
                    了解更多
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)}>
                    立即体验
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 top-0 grid w-1/2 grid-cols-2 gap-2 p-4 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="relative h-full w-full">
                  <Image
                    src={strategies[3].imageUrl}
                    alt={strategies[3].title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src={strategies[3].secondaryImageUrl!}
                    alt={strategies[3].title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && <ContactSalesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Tools;