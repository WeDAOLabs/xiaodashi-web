import React from 'react';
import MetricCard from './MetricCard';

interface MetricData {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
}

interface MetricsGridProps {
  metrics: MetricData[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={`metric-${metric.title}-${index}`}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            subtitle={metric.subtitle}
          />
        ))}
      </div>
    </section>
  );
};

export default MetricsGrid;