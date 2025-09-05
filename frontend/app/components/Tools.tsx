import Image from 'next/image';
import Link from 'next/link';
import ChevronRightIcon from './ChevronRightIcon';

const Tools = () => {
  return (
    <>
      <section className="bg-zinc-50 py-20 text-center md:py-32">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-black leading-tight tracking-tighter text-[var(--text-primary)] md:text-7xl">
            AI 营销，从未如此简单。
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-normal text-[var(--text-secondary)] md:text-xl">
            体验我们顶尖的 AI 营销工具套件。免费试用，释放您的营销潜力。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#"
              className="rounded-full bg-[var(--primary-color)] px-6 py-3 text-base font-normal text-white transition-opacity hover:opacity-90"
            >
              开始免费试用
            </Link>
            <Link
              href="#tools"
              className="apple-link flex items-center gap-1 px-6 py-3 text-base font-normal"
            >
              探索工具
              <ChevronRightIcon className="text-xl" />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-28" id="tools">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-5xl">
              探索我们的五大AI工具
            </h2>
            <p className="mt-4 text-lg font-light text-[var(--text-secondary)]">
              每一款工具都旨在解决您营销中的特定挑战，助您事半功倍。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-zinc-100 p-8 md:col-span-2">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)] md:text-4xl">
                    AI 内容生成器
                  </h3>
                  <p className="mt-2 max-w-md text-base font-light text-[var(--text-secondary)] md:text-lg">
                    无论是博客文章、社交媒体帖子还是广告文案，都能在数秒内生成引人入胜的内容。
                  </p>
                  <Link
                    href="#"
                    className="apple-link mt-6 inline-flex items-center gap-1 text-base font-normal"
                  >
                    了解更多
                    <ChevronRightIcon className="text-lg" />
                  </Link>
                </div>
                <div className="mt-8 text-right">
                  <Link
                    href="#"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-[var(--text-primary)] shadow-md transition-transform group-hover:scale-105"
                  >
                    立即体验
                  </Link>
                </div>
              </div>
              <Image
                alt="AI 内容生成器"
                src="/product-content-generator.png"
                fill
                className="absolute inset-0 h-full w-full object-cover opacity-10"
              />
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-100 p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                  AI 社交媒体管家
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-[var(--text-secondary)]">
                  智能规划和发布内容，实时互动，全面提升您的社交媒体影响力。
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <Link
                    href="#"
                    className="apple-link inline-flex items-center gap-1 text-base font-normal"
                  >
                    了解更多
                    <ChevronRightIcon className="text-lg" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-[var(--text-primary)] shadow-md transition-transform group-hover:scale-105"
                  >
                    立即体验
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-100 p-8">
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                  AI 邮件营销助手
                </h3>
                <p className="mt-2 flex-grow text-base font-light text-[var(--text-secondary)]">
                  个性化邮件模板，智能发送时间优化，显著提高邮件打开率和转化率。
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <Link
                    href="#"
                    className="apple-link inline-flex items-center gap-1 text-base font-normal"
                  >
                    了解更多
                    <ChevronRightIcon className="text-lg" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-[var(--text-primary)] shadow-md transition-transform group-hover:scale-105"
                  >
                    立即体验
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-zinc-800 p-8 text-white md:col-span-2">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold md:text-4xl">
                  AI SEO 优化器 &amp; 分析仪表盘
                </h3>
                <p className="mt-2 max-w-xl text-base font-light text-zinc-400 md:text-lg">
                  从关键词策略到内容优化，全方位提升搜索引擎排名。在一个仪表盘中，洞察所有营销活动数据。
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-[var(--text-primary)] shadow-md transition-transform hover:scale-105"
                  >
                    探索 SEO 工具
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full border border-zinc-600 bg-transparent px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-zinc-700"
                  >
                    查看分析仪表盘
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 top-0 grid w-1/2 grid-cols-2 gap-2 p-4 opacity-30 transition-opacity group-hover:opacity-50">
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
