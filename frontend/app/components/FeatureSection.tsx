
import Image from 'next/image';

interface FeatureSectionProps {
  tag: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

const CheckIcon = () => (
  <svg
    className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--primary-color)]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default function FeatureSection({
  tag,
  title,
  description,
  features,
  image,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
      <div className={`text-center lg:text-left ${reverse ? 'lg:order-2' : ''}`}>
        <p className="font-semibold text-[var(--primary-color)]">{tag}</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h2>
        <p className="mt-6 text-lg text-gray-600">{description}</p>
        <ul className="mt-8 space-y-4 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: feature }}></span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`w-full ${reverse ? 'lg:order-1' : ''}`}>
        <Image
          alt={imageAlt}
          className="h-auto w-full rounded-3xl"
          src={image}
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}
