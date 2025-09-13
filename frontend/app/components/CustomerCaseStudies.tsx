
import Image from 'next/image';
import Link from 'next/link';
import './CustomerCaseStudies.css';

interface CustomerCaseStudy {
  title: string;
  link: string;
  imageUrl: string;
  source: string;
  date: string;
  tags: string[];
}

const customerCaseStudiesData: CustomerCaseStudy[] = [
  {
    title: 'AI赋能医药巨头：私域增长与京东代运营双引擎驱动',
    link: '/customer-stories',
    imageUrl: '/images/customer-case-studies/the_aigc_explosion.jpg',
    source: '客户案例',
    date: 'Sept 13, 2025',
    tags: ['医药行业', '私域运营', '京东代运营'],
  },
  {
    title: '连锁烘焙品牌：AI智能客服与私域增长的甜蜜升级',
    link: '/customer-stories',
    imageUrl: '/images/customer-case-studies/pioneering_the_ai_crypto_frontier.jpg',
    source: '客户案例',
    date: 'Sept 13, 2025',
    tags: ['连锁烘焙', '智能客服', '私域增长'],
  }
  // Add more case studies here...
];

const SeparatorDot = () => (
  <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="2" r="2" fill="currentColor" />
  </svg>
);

const ArrowIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
        <path d="M4.94011 11.0599L11.06 4.94006" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.94011 4.94006H11.06V11.0599" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const CustomerCaseStudyCard: React.FC<{ study: CustomerCaseStudy }> = ({ study }) => {
  return (
    <Link href={study.link} className="case-study-card group">
      <div className="case-study-card-image-container">
        <Image
          src={study.imageUrl}
          alt={study.title}
          width={500}
          height={300}
          className="case-study-card-image"
        />
      </div>
      <div className="case-study-card-content">
        <div className="case-study-card-meta">
          <span>{study.source}</span>
          <SeparatorDot />
          <span>{study.date}</span>
        </div>
        <h3 className="case-study-card-title">{study.title}</h3>
        <div className="case-study-card-footer">
          <div className="case-study-card-tags">
            {study.tags.map((tag) => (
              <span key={tag} className="case-study-card-tag">{tag}</span>
            ))}
          </div>
          <div className="case-study-card-arrow">
            <ArrowIcon />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CustomerCaseStudies = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)] md:text-5xl text-center mb-12">客户案例</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            了解我们的客户如何通过我们的解决方案取得成功。
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2">
          {customerCaseStudiesData.map((study) => (
            <CustomerCaseStudyCard key={study.title} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerCaseStudies;

