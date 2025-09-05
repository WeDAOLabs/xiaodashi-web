const Showcase = () => (
  <section className="py-24">
    <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)]">
      一览平台风采
    </h2>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <ShowcaseCard imageUrl="/showcase-1.png" />
      <ShowcaseCard imageUrl="/showcase-2.png" />
      <ShowcaseCard imageUrl="/showcase-3.png" />
    </div>
  </section>
);

const ShowcaseCard = ({ imageUrl }) => (
  <div
    className="w-full aspect-video rounded-2xl bg-cover bg-center bg-gray-100"
    style={{ backgroundImage: `url("${imageUrl}")` }}
  ></div>
);

export default Showcase;
