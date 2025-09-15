import Image from 'next/image';
import React from 'react';
import AutoIcon from './icons/industries/AutoIcon';
import ECommerceIcon from './icons/industries/ECommerceIcon';
import EducationIcon from './icons/industries/EducationIcon';
import FinanceIcon from './icons/industries/FinanceIcon';
import HealthBeautyIcon from './icons/industries/HealthBeautyIcon';
import LifestyleIcon from './icons/industries/LifestyleIcon';
import NewRetailIcon from './icons/industries/NewRetailIcon';
import PharmaIcon from './icons/industries/PharmaIcon';
import SuperIndividualIcon from './icons/industries/SuperIndividualIcon';

const testimonialsData = [
  {
    industry: '医药行业',
    title: '应对高监管与渠道线上迁移，实现合规高效的数字化营销与用户管理。',
    imageUrl: '/testimonial-1.png',
    icon: PharmaIcon,
    stats: [
      { value: '20-35%', label: '线上销售额增长' },
      { value: '30-50%', label: '内容审核效率提升' },
      { value: '2x', label: '用户互动提升' },
    ],
  },
  {
    industry: '新零售',
    title: '融合线上线下全渠道，提升门店运营效率和会员价值。',
    imageUrl: '/testimonial-2.png',
    icon: NewRetailIcon,
    stats: [
      { value: '15-25%', label: '全渠道销售额提升' },
      { value: '10-18%', label: '会员复购率提升' },
      { value: '20%', label: '门店效率提升' },
    ],
  },
  {
    industry: '电商行业',
    title: '降低获客成本，提升商品管理效率，实现用户精细化运营。',
    imageUrl: '/testimonial-3.png',
    icon: ECommerceIcon,
    stats: [
      { value: '15-25%', label: '全链路转化率提升' },
      { value: '10-20%', label: '营销ROI提升' },
      { value: '3x', label: '选品效率提升' },
    ],
  },
  {
    industry: '教育行业',
    title: '精准招生获客，提升学员转化率和续费率，优化教学管理。',
    imageUrl: '/testimonial-1.png',
    icon: EducationIcon,
    stats: [
        { value: '15-25%', label: '招生转化率提升' },
        { value: '20-30%', label: '学员续费率增长' },
        { value: '80%', label: '教育IP打造' },
    ],
  },
  {
    industry: '金融行业',
    title: '精准获客，提升客户匹配度与风险控制，优化金融产品服务。',
    imageUrl: '/testimonial-2.png',
    icon: FinanceIcon,
    stats: [
      { value: '15-25%', label: '客户获取成本降低' },
      { value: '15-20%', label: '客户LTV增长' },
      { value: '5x', label: '智能风控识别' },
    ],
  },
  {
    industry: '健康美业',
    title: '降低获客成本，提升服务体验，建立品牌信任度与口碑。',
    imageUrl: '/testimonial-3.png',
    icon: HealthBeautyIcon,
    stats: [
      { value: '15-25%', label: '获客转化率提升' },
      { value: '15-20%', label: '客户LTV增长' },
      { value: '90%', label: '服务运营效率优化' },
    ],
  },
  {
    industry: '汽车行业',
    title: '提升获客效率，优化销售线索转化，构建客户全生命周期价值。',
    imageUrl: '/testimonial-1.png',
    icon: AutoIcon,
    stats: [
      { value: '15-25%', label: '获客转化率提升' },
      { value: '20-35%', label: '电商GMV增长' },
      { value: '3x', label: '销售线索转化' },
    ],
  },
  {
    industry: '生活服务行业',
    title: '降低获客成本，提升客户复购率与LTV，优化线下门店运营效率。',
    imageUrl: '/testimonial-2.png',
    icon: LifestyleIcon,
    stats: [
      { value: '15-25%', label: '线上线索转化率提升' },
      { value: '20-35%', label: '电商GMV增长' },
      { value: '95%', label: '多门店协同效率' },
    ],
  },
  {
    industry: '超级个体',
    title: '突破专业知识到内容产出的鸿沟，系统化打造个人IP与提升变现效率。',
    imageUrl: '/testimonial-3.png',
    icon: SuperIndividualIcon,
    stats: [
      { value: '30-50%', label: '内容生产效率提升' },
      { value: '20-35%', label: '私域转化率提升' },
      { value: '10x', label: '个人IP影响力' },
    ],
  },
];

const Testimonials = () => (
  <section className="py-24">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold leading-tight tracking-tighter text-[var(--text-primary)] md:text-5xl text-center mb-12">
        岂止于高度定制和模块化，<br/>更有全模块无缝集成、全链路自动化流转的强大效能加持
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            industry={testimonial.industry}
            title={testimonial.title}
            imageUrl={testimonial.imageUrl}
            stats={testimonial.stats}
            icon={testimonial.icon}
          />
        ))}
      </div>
      
    </div>
  </section>
);

interface TestimonialCardProps {
  industry: string;
  title: string;
  imageUrl: string;
  stats: {
    value: string;
    label: string;
  }[];
  icon: React.ElementType;
}

const TestimonialCard = ({ industry, title, imageUrl, stats, icon: Icon }: TestimonialCardProps) => (
    <div className="testimonial-card">
        <Image src={imageUrl} alt={title} className="testimonial-card__image" width={400} height={200} />
        <div className="testimonial-card__content">
            <div className="card-title-iconic">
                <Icon className="w-5 h-5 stroke-[var(--primary-color)]" />
                <span>{industry}</span>
            </div>
            <span className="testimonial-card__quote">“{title}”</span>
        </div>
        <div className="testimonial-card__stats">
            {stats.map((stat, index) => (
                <React.Fragment key={index}>
                    <div className="testimonial-card__stat-group">
                        <div className="testimonial-card__stat-item">
                            <span className="testimonial-card__stat-title">{stat.value}</span>
                            <span className="testimonial-card__stat-description">{stat.label}</span>
                        </div>
                    </div>
                    {index < stats.length - 1 && <div className="testimonial-card__stat-divider"></div>}
                </React.Fragment>
            ))}
        </div>
  </div>
);

export default Testimonials;