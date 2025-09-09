export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-heading-primary mb-6">
            小大师 AI 营销平台
          </h1>
          <p className="text-body-secondary mb-8 max-w-2xl mx-auto">
            欢迎来到应用产品平台！这里是智能营销解决方案的核心应用平台，
            为您提供全方位的数字化营销工具和服务。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-gradient-primary px-8 py-3 rounded-full">
              开始使用
            </button>
            <button className="px-8 py-3 border border-[var(--border-primary)] rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
              了解更多
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-feature">
            <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
              智能内容生成
            </h3>
            <p className="text-[var(--text-secondary)]">
              基于AI技术，自动生成高质量的营销内容和创意素材
            </p>
          </div>
          
          <div className="card-feature">
            <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
              数据分析洞察
            </h3>
            <p className="text-[var(--text-secondary)]">
              深度分析营销数据，提供精准的决策建议和优化方案
            </p>
          </div>
          
          <div className="card-feature">
            <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
              自动化营销
            </h3>
            <p className="text-[var(--text-secondary)]">
              全流程自动化营销工具，提升效率，降低运营成本
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
