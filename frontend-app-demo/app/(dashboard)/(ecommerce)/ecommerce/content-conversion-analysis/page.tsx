'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 导入各个组件
import ContentFeatureCard from './_components/ContentFeatureCard';
import ContentRankingTable from './_components/ContentRankingTable';
import ContentGMVLineChart from './_components/charts/ContentGMVLineChart';
import ChannelROIBarChart from './_components/charts/ChannelROIBarChart';
import UserPortraitCard from './_components/UserPortraitCard';
import ConversionFunnelChart from './_components/charts/ConversionFunnelChart';
import PrivateOperationStats from './_components/PrivateOperationStats';
import ABTestResults from './_components/ABTestResults';

const ContentConversionAnalysisPage: React.FC = () => {
  const handleExportData = () => {
    console.log('导出数据');
  };

  const handleGenerateSummary = () => {
    console.log('生成营销总结');
  };

  return (
    <ToolPageLayout
      title="内容转化效果分析"
      description="深入洞察内容、投放、私域的电商转化效果"
      breadcrumbs={[
        { label: '智能电商运营与转化', href: '#' },
        { label: '内容转化效果分析', href: '/ecommerce/content-conversion-analysis', current: true }
      ]}
    >
      <div className="space-y-8">
        {/* 第一板块：内容转化效果分析 */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              内容转化效果分析 (Content Conversion Effect Analysis)
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出数据
              </Button>
              <Button
                onClick={handleGenerateSummary}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                生成营销总结
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ContentFeatureCard />
            <div className="lg:col-span-2">
              <ContentRankingTable />
            </div>
          </div>
          <div className="mt-6">
            <ContentGMVLineChart />
          </div>
        </div>

        {/* 第二板块：公域投放转化归因 */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            公域投放转化归因 (Public Domain Conversion Attribution)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChannelROIBarChart />
            </div>
            <UserPortraitCard />
          </div>
          <div className="mt-6">
            <ConversionFunnelChart />
          </div>
        </div>

        {/* 第三板块：私域运营与A/B测试 */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            私域运营与A/B测试 (Private Domain & A/B Testing)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PrivateOperationStats />
            <ABTestResults />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default ContentConversionAnalysisPage;