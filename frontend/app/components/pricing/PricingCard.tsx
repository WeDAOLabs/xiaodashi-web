import CheckIcon from '@/app/components/ui/CheckIcon';

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
    'relative flex flex-col gap-6 rounded-2xl p-8 bg-white border border-gray-200 transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl',
    isPopular ? 'border-2 border-blue-600 shadow-2xl shadow-blue-600/20' : '',
  ].join(' ');

  const buttonClasses = [
    'w-full rounded-full h-12 px-6 text-base font-semibold transition-colors',
    isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ].join(' ');

  return (
    <div className={cardClasses}>
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2">
          <p className="text-white text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 px-4 py-1">最受欢迎</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{planName}</h3>
        {isCustom ? (
            <p className="text-3xl font-bold tracking-tight text-gray-900">{price}</p>
        ) : (
            <p className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-gray-900">{price}</span>
                {pricePeriod && <span className="text-base font-semibold text-gray-500">{pricePeriod}</span>}
            </p>
        )}
      </div>
      <p className="text-gray-600 text-base">{description}</p>
      <button className={buttonClasses}>{buttonText}</button>
      <ul className="flex flex-col gap-4 pt-6 border-t border-gray-200">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-800">
            <CheckIcon className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: feature }}></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
