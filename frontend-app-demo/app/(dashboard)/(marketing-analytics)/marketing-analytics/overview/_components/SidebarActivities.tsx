import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface ActivityItem {
  name: string;
  metric: string;
  value: string;
  isPositive: boolean;
}

interface SidebarActivitiesProps {
  title: string;
  activities: ActivityItem[];
  isPositive: boolean;
}

const SidebarActivities: React.FC<SidebarActivitiesProps> = ({
  title,
  activities,
  isPositive
}) => {
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <IconComponent className={`w-5 h-5 ${colorClass}`} />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {title}
          </h3>
        </div>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={`${title}-${activity.name}-${index}`} className="group">
              <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors w-full text-left">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {activity.name}
                  </p>
                  <p className={`text-xs font-medium ${colorClass}`}>
                    {activity.metric}: {activity.value}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SidebarActivities;