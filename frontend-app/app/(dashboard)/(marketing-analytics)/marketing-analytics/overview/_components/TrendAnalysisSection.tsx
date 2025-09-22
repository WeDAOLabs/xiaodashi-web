import React from 'react';
import TrendChart, { type ChartType } from './TrendChart';

interface ChartDataPoint {
  month: string;
  value: number;
  secondaryValue?: number;
}

interface TrendChartData {
  title: string;
  chartType: ChartType;
  data: ChartDataPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  formatValue?: (value: number) => string;
  iconType?: 'bar' | 'trend' | 'users';
}

interface TrendAnalysisSectionProps {
  charts: TrendChartData[];
}

const TrendAnalysisSection: React.FC<TrendAnalysisSectionProps> = ({ charts }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
        营销效果趋势分析
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart, index) => (
          <TrendChart
            key={`chart-${chart.title}-${index}`}
            title={chart.title}
            chartType={chart.chartType}
            data={chart.data}
            primaryColor={chart.primaryColor}
            secondaryColor={chart.secondaryColor}
            formatValue={chart.formatValue}
            iconType={chart.iconType}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendAnalysisSection;