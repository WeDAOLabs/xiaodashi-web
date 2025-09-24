import React from 'react';
import AIInsightCard, { type InsightType } from './AIInsightCard';

interface AIInsightData {
  type: InsightType;
  title: string;
  content: string;
  actions: {
    label: string;
    href?: string;
    onClick?: () => void;
    isPrimary?: boolean;
  }[];
}

interface AIInsightsSectionProps {
  insights: AIInsightData[];
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
        AI洞察与营销预警
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <AIInsightCard
            key={`insight-${insight.type}-${index}`}
            type={insight.type}
            title={insight.title}
            content={insight.content}
            actions={insight.actions}
          />
        ))}
      </div>
    </section>
  );
};

export default AIInsightsSection;