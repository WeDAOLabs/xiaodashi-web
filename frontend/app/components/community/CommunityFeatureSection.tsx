import Image from 'next/image';
import Link from 'next/link';

interface CommunityFeatureSectionProps {
  title: string;
  description: string;
  links: { href: string; text: string }[];
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean;
}

const CommunityFeatureSection: React.FC<CommunityFeatureSectionProps> = ({ title, description, links, imageUrl, imageAlt, reverse = false }) => {
  return (
    <section className="bg-gray-50 py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center`}>
          <div className={`text-center md:text-left ${reverse ? 'md:order-2' : ''}`}>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6 text-lg">{description}</p>
            <div className="flex justify-center md:justify-start space-x-4">
              {links.map(link => (
                <Link key={link.text} href={link.href} className="text-blue-600 hover:underline text-lg">
                  {link.text} →
                </Link>
              ))}
            </div>
          </div>
          <div className={`bg-white rounded-2xl p-8 shadow-sm ${reverse ? 'md:order-1' : ''}`}>
            <Image alt={imageAlt} className="w-full h-auto rounded-lg" src={imageUrl} width={500} height={300} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeatureSection;
