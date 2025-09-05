const Community = () => (
  <section className="rounded-2xl bg-gray-50 p-12 text-center">
    <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      加入我们的社区
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-lg font-normal leading-relaxed text-[var(--text-secondary)]">
      与成千上万的智商180的AI全域营销大师的用户交流，分享营销洞见，洞悉行业最新趋势。我们的社区是您学习与合作的宝贵平台。
    </p>
    <div className="mt-8 flex justify-center">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-gray-800 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 hover:bg-gray-700">
        <span className="truncate">立即加入</span>
      </button>
    </div>
  </section>
);

export default Community;
