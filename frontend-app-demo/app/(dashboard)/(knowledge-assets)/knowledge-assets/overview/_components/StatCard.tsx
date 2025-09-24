import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Database,
  FileText,
  Book,
  AlertTriangle,
  Cpu,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: string;
  hasAction?: boolean;
  actionText?: string;
}

const iconMap = {
  database: Database,
  'file-text': FileText,
  book: Book,
  'alert-triangle': AlertTriangle,
  cpu: Cpu,
  zap: Zap,
  sparkles: Sparkles,
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  hasAction = false,
  actionText
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Database;

  return (
    <div className="col-span-1">
      <Card className="p-5 relative group transition-all duration-300 ease-in-out hover:-translate-y-1 shadow-sm bg-[var(--bg-primary)]">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
              <IconComponent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</p>

          <div className="flex items-center text-sm mt-1 h-[20px]">
            {change && (
              <>
                <span className={`font-semibold ${isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
                  {change}
                </span>
                <span className="text-[var(--text-tertiary)] ml-1.5">环比</span>
              </>
            )}
          </div>

          {hasAction && actionText && (
            <button className="text-xs font-semibold mt-4 text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-1">
              {actionText}
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCard;