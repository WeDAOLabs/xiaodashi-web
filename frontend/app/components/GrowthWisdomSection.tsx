'use client';


const JarvisSection = () => {
  // 前四个优势
  const advantages = [
    {
      title: "生成式AI驱动的跨模态智慧营销中枢：洞察与内容共生"
    },
    {
      title: "企业级知识图谱与策略自演化引擎：驱动跨周期智能决策"
    },
    {
      title: "营销战略智能拆解与全链路价值归因：重构增长投资的量化艺术"
    },
    {
      title: "全息用户画像与意图洞察：重塑个体级精准触达"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)] md:text-5xl">
          增长需要的不仅是工具，而是智慧
        </h2>
      </div>
      
      <div className="mt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 前四个优势，每行两个 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="rounded-2xl bg-cover bg-center p-8 md:p-12"
                style={{ 
                  backgroundImage: index % 2 === 0 
                    ? 'url(/images/img_put_up_bg.png)' 
                    : 'url(/images/img_atwork.png)' 
                }}
              >
                <h3 className="text-xl font-bold text-white md:text-2xl lg:text-3xl">
                  {advantage.title}
                </h3>
              </div>
            ))}
          </div>
          
          {/* 第五个优势 */}
          <div 
            className="mt-8 rounded-2xl bg-cover bg-center p-8 md:mt-12 md:p-12"
            style={{ backgroundImage: 'url(/images/img_atwork_person.png)' }}
          >
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl lg:text-4xl">
                区块链驱动的可信营销生态：铸就安全合规的商业基石
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JarvisSection;