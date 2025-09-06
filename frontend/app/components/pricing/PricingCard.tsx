import CheckIcon from '@/app/components/ui/CheckIcon';
import { Button } from '@/app/components/ui/Button';

interface PricingCardProps {
  planName: string;
  price: string;
  pricePeriod?: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  isCustom?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ planName, price, pricePeriod, description, features, buttonText, isPopular = false, isCustom = false }) => {
  const cardClasses = [
    'relative flex flex-col gap-6 rounded-2xl p-8 bg-[var(--background-color)] border border-[var(--border-color)] transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl',
    isPopular ? 'border-2 border-[var(--primary-color)] shadow-2xl shadow-blue-600/20' : '',
  ].join(' ');

  return (
    <div className={cardClasses}>
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <p className="text-white text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--primary-color)] px-4 py-1">最受欢迎</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">{planName}</h3>
        {isCustom ? (
            <p className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{price}</p>
        ) : (
            <p className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{price}</span>
                {pricePeriod && <span className="text-base font-semibold text-[var(--text-secondary)]">{pricePeriod}</span>}
            </p>
        )}
      </div>
      <p className="text-[var(--text-secondary)] text-base">{description}</p>
      <Button variant={isPopular ? 'primary' : 'ghost'}>{buttonText}</Button>
      <ul className="flex flex-col gap-4 pt-6 border-t border-[var(--border-color)]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-[var(--text-primary)]">
            <CheckIcon className="text-[var(--primary-color)] w-5 h-5 flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: feature }}></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
