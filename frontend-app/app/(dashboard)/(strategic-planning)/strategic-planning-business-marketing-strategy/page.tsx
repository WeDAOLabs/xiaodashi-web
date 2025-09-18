'use client';

import CompetitorSentimentChart from '@/components/charts/CompetitorSentimentChart';
import EmotionTrendChart from '@/components/charts/EmotionTrendChart';
import InnovationOpportunityChart from '@/components/charts/InnovationOpportunityChart';
import PriorityMatrixChart from '@/components/charts/PriorityMatrixChart';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Download,
  FileText,
  Link,
  Sparkles
} from 'lucide-react';
import React from 'react';

const ProductStrategyPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="AI产品策略与创新反哺"
      description="通过AI深度挖掘用户反馈和市场数据，驱动产品创新与研发策略制定"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '产品策略与创新反哺', href: '/strategic-planning-business-marketing-strategy', current: true }
      ]}
    >
      {/* AI产品创新洞察概览 */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">AI产品创新洞察概览</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">汇总用户高频痛点、未满足的新需求和潜在的产品创新点摘要。</p>
            </div>
            <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
              查看完整洞察报告
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[var(--bg-secondary)] p-6 rounded-lg">
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">核心痛点词云</h4>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 h-48">
                <span style={{fontSize: '2.5rem', color: '#007A7A', opacity: 1, fontWeight: 600}}>续航时间</span>
                <span style={{fontSize: '2.28rem', color: '#008888', opacity: 0.94, fontWeight: 600}}>卡顿</span>
                <span style={{fontSize: '2.18rem', color: '#6e6e73', opacity: 0.92, fontWeight: 600}}>价格高</span>
                <span style={{fontSize: '2.08rem', color: '#1d1d1f', opacity: 0.88, fontWeight: 600}}>发热</span>
                <span style={{fontSize: '1.95rem', color: '#8e8e93', opacity: 0.84, fontWeight: 500}}>兼容性差</span>
                <span style={{fontSize: '1.87rem', color: '#007A7A', opacity: 0.82, fontWeight: 500}}>界面复杂</span>
                <span style={{fontSize: '1.79rem', color: '#008888', opacity: 0.79, fontWeight: 500}}>广告多</span>
                <span style={{fontSize: '1.63rem', color: '#6e6e73', opacity: 0.74, fontWeight: 500}}>售后服务</span>
                <span style={{fontSize: '1.47rem', color: '#1d1d1f', opacity: 0.69, fontWeight: 500}}>功能冗余</span>
                <span style={{fontSize: '1.39rem', color: '#8e8e93', opacity: 0.67, fontWeight: 500}}>更新慢</span>
              </div>
            </div>
            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg flex flex-col justify-center items-center text-center">
              <h4 className="font-semibold text-[var(--text-primary)]">新需求指数</h4>
              <div className="text-5xl font-bold text-[var(--primary-color)] mt-4">82.5</div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">衡量新兴需求的关注度</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-[var(--color-info-600)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--color-info-600)]">AI洞察：用户对&apos;产品X续航时间&apos;表达强烈不满（月提及量1000+次，70%负面情绪）</p>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        {/* 左列 - 用户需求优先级分析 */}
        <div className="lg:col-span-3">
          <Card className="shadow-sm">
            <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">用户需求优先级排序与产品痛点分析</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  查看原始反馈
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  导出痛点列表
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  关联产品Roadmap
                </Button>
              </div>
            </div>
            <CardContent className="p-6 space-y-8">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">需求优先级矩阵</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-4">基于Kano模型，AI自动归类功能点，X轴为重要性，Y轴为满意度。</p>
                <PriorityMatrixChart className="w-full h-72" />
              </div>

              <div className="border-t border-[var(--border-primary)] pt-6">
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">&ldquo;续航能力&rdquo;情绪趋势图</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-4">显示用户对核心痛点的情绪变化趋势。</p>
                <EmotionTrendChart className="w-full h-64" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右列 - 竞品分析 */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">竞品产品策略与差异化分析</h3>
              <div className="flex space-x-2">
                <Button variant="outline">
                  查看竞品详情
                </Button>
                <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
                  提交研发需求
                </Button>
              </div>
            </div>
            <CardContent className="p-6 space-y-8">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">竞品功能对比矩阵</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs text-[var(--text-tertiary)] uppercase bg-[var(--bg-secondary)]">
                      <tr>
                        <th scope="col" className="px-4 py-3">功能点</th>
                        <th scope="col" className="px-4 py-3 text-center">我司产品</th>
                        <th scope="col" className="px-4 py-3 text-center">竞品A</th>
                        <th scope="col" className="px-4 py-3 text-center">竞品B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                        <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">个性化定制</th>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">领先</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">一般</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]">落后</Badge>
                        </td>
                      </tr>
                      <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                        <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">AI语音助手</th>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">一般</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">领先</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">一般</Badge>
                        </td>
                      </tr>
                      <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                        <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">电池续航</th>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]">落后</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">一般</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">领先</Badge>
                        </td>
                      </tr>
                      <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                        <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">屏幕刷新率</th>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)]">120Hz</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)]">144Hz</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)]">120Hz</Badge>
                        </td>
                      </tr>
                      <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
                        <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">生态互联</th>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]">领先</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]">落后</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]">一般</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[var(--border-primary)] pt-6">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">竞品用户口碑情感分析</h4>
                <CompetitorSentimentChart className="w-full h-48" />
              </div>

              <div className="mt-4 p-4 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[var(--color-info-600)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-info-600)]">AI分析：我司产品在&apos;个性化定制体验&apos;领先竞品Z，但竞品Z在&apos;AI语音助手功能&apos;表现更优。建议下个版本加强AI语音助手能力。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 新品研发方向与策略建议 */}
      <Card className="shadow-sm mt-6">
        <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">新品研发方向与策略建议</h3>
          <div className="flex space-x-2">
            <Button variant="outline">
              生成新品概念草案
            </Button>
            <Button variant="outline">
              发起产品立项
            </Button>
            <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
              定制化研发反哺推送
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">产品创新机会象限图</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">综合用户偏好、市场空白、技术成熟度进行预测。X轴为市场潜力，Y轴为技术可行性。</p>
              <InnovationOpportunityChart className="w-full h-80" />
            </div>
            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">AI预测报告：未来产品趋势</h4>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start">
                  <span className="text-[var(--primary-color)] mr-2 pt-1">▶</span>
                  <span><strong className="text-[var(--text-primary)]">边缘计算与AI融合：</strong>设备端实时处理数据，提升响应速度与隐私保护。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary-color)] mr-2 pt-1">▶</span>
                  <span><strong className="text-[var(--text-primary)]">超个性化体验：</strong>基于用户行为和环境感知，提供千人千面的动态界面与服务。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary-color)] mr-2 pt-1">▶</span>
                  <span><strong className="text-[var(--text-primary)]">可持续性设计：</strong>采用环保材料和模块化设计，延长产品生命周期，吸引环保意识强的消费群体。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary-color)] mr-2 pt-1">▶</span>
                  <span><strong className="text-[var(--text-primary)]">无缝跨设备协同：</strong>打破设备壁垒，实现手机、PC、穿戴设备间的深度信息流转和任务接力。</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolPageLayout>
  );
};

export default ProductStrategyPage;