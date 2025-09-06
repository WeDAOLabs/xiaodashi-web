import React from 'react';

interface PageHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, children }) => {
  return (
    <section className="w-full text-center py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black leading-tight tracking-tighter text-gray-900 md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 text-lg font-normal leading-normal text-gray-600 md:text-xl">
            {description}
          </p>
          {children && <div className="mt-8 flex justify-center gap-4">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
