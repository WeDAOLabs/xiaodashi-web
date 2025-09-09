import { Button } from '@/app/components/ui/Button';
import CheckIcon from '@/app/components/ui/CheckIcon';

export interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  onSelectPlan?: () => void;
}

const PlanCard = ({ name, price, period, description, features, isRecommended, onSelectPlan }: PlanProps) => {
  const cardClasses = [
    'relative flex flex-col gap-6 rounded-2xl p-6 sm:p-8 bg-[var(--background-color)] transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-2xl',
    isRecommended 
      ? 'border-2 border-[var(--primary-color)] shadow-2xl shadow-blue-600/20' 
      : 'border border-[var(--border-color)]'
  ].join(' ');

  return (
    <div className={cardClasses}>
      {isRecommended && (
        <div className="absolute top-0 right-4 sm:right-8 -translate-y-1/2">
          <p className="text-white text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--primary-color)] px-3 sm:px-4 py-1">
            最受欢迎
          </p>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
          {name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {price}
          </span>
          {period && (
            <span className="text-sm font-medium text-[var(--text-secondary)] tracking-normal">
              {period}
            </span>
          )}
        </div>
      </div>
      <p className="text-[var(--text-secondary)] text-base h-12 leading-6">
        {description}
      </p>
      <Button 
        variant={isRecommended ? 'primary' : 'ghost'}
        onClick={onSelectPlan}
      >
        选择此方案
      </Button>
      <ul className="flex flex-col gap-4 pt-6 border-t border-[var(--border-color)]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-[var(--text-primary)]">
            <CheckIcon className="text-[var(--primary-color)] w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanCard;