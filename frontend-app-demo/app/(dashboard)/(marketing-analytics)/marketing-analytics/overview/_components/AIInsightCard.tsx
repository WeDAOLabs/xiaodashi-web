import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InsightType = 'warning' | 'info' | 'suggestion';

interface AIInsightAction {
  label: string;
  href?: string;
  onClick?: () => void;
  isPrimary?: boolean;
}

interface AIInsightCardProps {
  type: InsightType;
  title: string;
  content: string;
  actions: AIInsightAction[];
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  type,
  title,
  content,
  actions
}) => {
  const getTypeConfig = (type: InsightType) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          badgeClass: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
          cardClass: 'bg-[var(--color-danger-50)] border-[var(--color-danger-100)]',
          iconColor: 'text-[var(--color-danger-600)]',
          hoverClass: 'hover:bg-[var(--color-danger-100)]'
        };
      case 'info':
        return {
          icon: Info,
          badgeClass: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
          cardClass: 'bg-[var(--color-info-50)] border-[var(--color-info-100)]',
          iconColor: 'text-[var(--color-info-600)]',
          hoverClass: 'hover:bg-[var(--color-info-100)]'
        };
      case 'suggestion':
        return {
          icon: Lightbulb,
          badgeClass: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
          cardClass: 'bg-[var(--color-warning-50)] border-[var(--color-warning-100)]',
          iconColor: 'text-[var(--color-warning-600)]',
          hoverClass: 'hover:bg-[var(--color-warning-100)]'
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  return (
    <Card className={`${config.cardClass} shadow-sm h-full flex flex-col`}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start gap-3">
            <IconComponent className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                {title}
              </Badge>
              <p className="mt-2 text-sm text-[var(--text-primary)] leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {actions.map((action, index) => {
            return action.href ? (
              <Link
                key={`action-${action.label}-${index}`}
                href={action.href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold transition-colors",
                  "px-3 py-1.5 rounded-md",
                  action.isPrimary
                    ? "text-[var(--accent-color)] hover:bg-[var(--color-danger-100)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                )}
              >
                <span>{action.label}</span>
                {action.isPrimary && <ArrowRight className="w-4 h-4" />}
              </Link>
            ) : (
              <Button
                key={`action-${action.label}-${index}`}
                variant={action.isPrimary ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold transition-colors",
                  action.isPrimary
                    ? 'text-[var(--accent-color)]'
                    : 'text-[var(--text-secondary)]',
                  action.isPrimary ? config.hoverClass : 'hover:bg-[var(--bg-tertiary)]'
                )}
                onClick={action.onClick}
              >
                <span>{action.label}</span>
                {action.isPrimary && <ArrowRight className="w-4 h-4" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;