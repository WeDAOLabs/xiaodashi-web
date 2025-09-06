import Image from 'next/image';
import ChevronRightIcon from './ChevronRightIcon';
import { Button } from './ui/Button';
import PageHero from './ui/PageHero';

const Tools = () => {
  return (
    <>
      <PageHero
        title="AI 营销，从未如此简单"
        description="体验我们顶尖的 AI 营销工具套件。免费试用，释放您的营销潜力。"
      >
        <Button href="#">开始免费试用</Button>
        <Button href="#tools" variant="secondary" className="flex items-center gap-1">
          探索工具
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </PageHero>
      <section className="py-20 md:py-28 bg-gray-50" id="tools">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-5xl">
              探索我们的五大AI工具
            </h2>
            <p className="mt-4 text-lg font-light text-gray-600">
              每一款工具都旨在解决您营销中的特定挑战，助您事半功倍。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-white p-8 md:col-span-2">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-900 md:text-4xl">
                    AI 内容生成器
                  </h3>
                  <p className="mt-2 max-w-md text-base font-light text-gray-600 md:text-lg">
                    无论是博客文章、社交媒体帖子还是广告文案，都能在数秒内生成引人入-胜的内容。
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button href="#" variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button href="#">
                    立即体验
                  </Button>
                </div>
              </div>
              <Image
                alt="AI 内容生成器"
                src="/product-content-generator.png"
                fill
                className="absolute inset-0 h-full w-full object-cover opacity-5"
              />
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  AI 社交媒体管家
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-gray-600">
                  智能规划和发布内容，实时互动，全面提升您的社交媒体影响力。
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button href="#" variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button href="#">
                    立即体验
                  </Button>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  AI 邮件营销助手
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-gray-600">
                  个性化邮件模板，智能发送时间优化，显著提高邮件打开率和转化率。
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button href="#" variant="secondary" className="flex items-center gap-1">
                    了解更多
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  <Button href="#">
                    立即体验
                  </Button>
                </div>
              </div>
            </div>
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-gray-800 p-8 text-white md:col-span-2">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold md:text-4xl">
                  AI SEO 优化器 &amp; 分析仪表盘
                </h3>
                <p className="mt-2 max-w-xl text-base font-light text-gray-400 md:text-lg">
                  从关键词策略到内容优化，全方位提升搜索引擎排名。在一个仪表盘中，洞察所有营销活动数据。
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="#">
                    探索 SEO 工具
                  </Button>
                  <Button href="#" variant="secondary" className="rounded-full border border-gray-600 bg-transparent px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-gray-700">
                    查看分析仪表盘
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 top-0 grid w-1/2 grid-cols-2 gap-2 p-4 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="relative h-full w-full">
                  <Image
                    src="/product-seo-1.png"
                    alt="SEO Tool Preview 1"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src="/product-seo-2.png"
                    alt="SEO Tool Preview 2"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tools;
