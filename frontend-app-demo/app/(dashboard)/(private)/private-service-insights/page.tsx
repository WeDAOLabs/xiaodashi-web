'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { BreadcrumbItem } from '@/components/layout/types';
import { Button } from '@/components/ui/button';
import SentimentTrendChart from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/SentimentTrendChart';
import FlavorPreferenceChart from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/FlavorPreferenceChart';
import ServiceSatisfactionCard from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/ServiceSatisfactionCard';
import ProductKeywordsCloud from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/ProductKeywordsCloud';
import SentimentAnalysisCard from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/SentimentAnalysisCard';
import ServiceInsightsCard from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/ServiceInsightsCard';
import AIRecommendationCard from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/AIRecommendationCard';
import ActionPlanCard from '@/app/(dashboard)/(product-insights)/_components/product-service-insights/ActionPlanCard';

const ProductServiceInsightsPage: React.FC = () => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '增长与运营执行', href: '#' },
    { label: '智能私域增长与运营', href: '#' },
    { label: '产品与服务优化洞察', href: '/private-service-insights', current: true }
  ];

  return (
    <ToolPageLayout
      title="产品与服务优化洞察"
      description="通过对私域对话数据进行细致分析，为产品研发和服务优化提供科学依据"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* 第一行：情感趋势图表 + 口味偏好图 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SentimentTrendChart />
          <FlavorPreferenceChart />
        </div>

        {/* 第二行：服务满意度 + 产品特点词云 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceSatisfactionCard />
          <ProductKeywordsCloud />
        </div>

        {/* 第三行：情感倾向分析 + 服务痛点亮点 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentAnalysisCard />
          <ServiceInsightsCard />
        </div>

        {/* 第四行：AI建议 + 行动计划 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendationCard />
          <ActionPlanCard />
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="bg-white text-[var(--color-primary-500)] border border-[var(--color-primary-500)]/30 px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary-100)] transition-colors text-sm font-semibold"
          >
            查看完整优化建议报告
          </Button>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default ProductServiceInsightsPage;