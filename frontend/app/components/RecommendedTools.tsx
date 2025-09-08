const recommendedTools = [
  {
    category: "图像工具",
    name: "即梦",
    description: "输入一句话，即刻将您的想象力变为专业级画作与设计稿。",
    imageUrl: "/showcase-1.png"
  },
  {
    category: "视频工具",
    name: "可灵AI",
    description: "仅用文字描述，即可生成电影质感的AI视频，颠覆传统视频创作流程。",
    imageUrl: "/showcase-2.png"
  },
  {
    category: "音频工具",
    name: "Suno",
    description: "无需任何乐理知识，轻松创作旋律、歌曲和人声，让人人都是音乐家。",
    imageUrl: "/showcase-3.png"
  }
];

interface ShowcaseCardProps {
  category: string;
  name: string;
  description: string;
  imageUrl: string;
}

const ShowcaseCard = ({ category, name, description, imageUrl }: ShowcaseCardProps) => (
  <div>
    <div
      className="w-full aspect-video rounded-2xl bg-cover bg-center bg-gray-100 shadow-lg"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
    <div className="mt-4 text-center">
      <p className="text-sm font-medium text-[var(--primary-color)]">{category}</p>
      <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">{name}</p>
      <p className="mt-2 text-base text-[var(--text-secondary)]">{description}</p>
    </div>
  </div>
);

const RecommendedTools = () => (
  <section className="py-24">
    <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      增长工具推荐TOP3
    </h2>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {recommendedTools.map(tool => (
        <ShowcaseCard
          key={tool.name}
          category={tool.category}
          name={tool.name}
          description={tool.description}
          imageUrl={tool.imageUrl}
        />
      ))}
    </div>
  </section>
);

export default RecommendedTools;