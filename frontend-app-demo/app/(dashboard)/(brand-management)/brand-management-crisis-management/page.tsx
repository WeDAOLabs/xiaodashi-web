'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Clock, Lightbulb, Plus, Send, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import AIEmotionWordCloud from './_components/AIEmotionWordCloud';
import PropagationNetworkChart from './_components/PropagationNetworkChart';

interface WarningItem {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  time: string;
}

interface SentimentTrendData {
  day: string;
  value: number;
}

interface EmotionData {
  name: string;
  value: number;
  color: string;
}

interface LevelBadgeProps {
  className: string;
  text: string;
}

const CrisisManagementPage: React.FC = () => {
  // 预警数据
  const warnings: WarningItem[] = [
    {
      id: '1',
      level: 'high',
      title: '舆情危机：品牌Y产品质量争议，讨论量激增。',
      time: '今天 14:00',
    },
    {
      id: '2',
      level: 'medium',
      title: '知识产权：IP Z被发现盗用元素，面临侵权风险。',
      time: '昨天 10:30',
    },
    {
      id: '3',
      level: 'low',
      title: '竞品动态：竞品A负面营销活动，可能波及我方品牌。',
      time: '前天 16:00',
    },
    {
      id: '4',
      level: 'medium',
      title: '合规风险：新广告法实施，部分宣传语需紧急修改。',
      time: '2024-07-28 09:00',
    },
    {
      id: '5',
      level: 'low',
      title: '供应链：主要原料供应商所在地区出现极端天气。',
      time: '2024-07-27 18:45',
    },
  ];

  // 当前选中的预警项目
  const [selectedWarning, setSelectedWarning] = React.useState<string>('1');

  // 舆情趋势数据
  const sentimentTrendData: SentimentTrendData[] = [
    { day: '3天前', value: 5200 },
    { day: '2天前', value: 6800 },
    { day: '昨天', value: 7500 },
    { day: '今天', value: 8124 },
  ];

  // 情感极性数据
  const emotionData: EmotionData[] = [
    { name: '负面', value: 45, color: 'var(--color-danger-600)' },
    { name: '中性', value: 35, color: 'var(--color-warning-600)' },
    { name: '正面', value: 20, color: 'var(--color-success-600)' },
  ];

  // 风险等级样式映射
  const getLevelBadgeProps = (level: WarningItem['level']): LevelBadgeProps => {
    switch (level) {
      case 'high':
        return {
          className: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]',
          text: '高危'
        };
      case 'medium':
        return {
          className: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]',
          text: '中等'
        };
      case 'low':
        return {
          className: 'bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-100)]',
          text: '低级'
        };
    }
  };
  return (
    <ToolPageLayout
      title="品牌/IP危机预警与舆情管理"
      description="基于AI实时监测品牌危机与舆情变化，提供智能化预警与处理方案"
      breadcrumbs={[
        { label: '智能品牌与IP资产管理', href: '#' },
        { label: '品牌/IP危机预警与舆情管理', href: '/brand-management-crisis-management', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 顶部概览区域 - 3列响应式网格 */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 左侧：统计数据与AI预警 */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 bg-[var(--color-danger-50)] p-3 rounded-lg border border-[var(--color-danger-100)]">
                    <p className="text-sm text-[var(--color-danger-600)]">活跃预警</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
                      <span className="text-base font-normal text-[var(--text-primary)]">条</span>
                    </div>
                    <p className="text-xs text-[var(--color-danger-600)] mt-1">(高危3条)</p>
                  </div>
                  <div className="flex-1 bg-[var(--color-info-50)] p-3 rounded-lg border border-[var(--color-info-100)]">
                    <p className="text-sm text-[var(--color-info-600)]">舆情热度指数</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">8,124</p>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xs text-[var(--color-info-600)] mt-1">较昨日 +15%</p>
                  </div>
                </div>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-semibold text-[var(--primary-color)]">AI 预警：</span>
                    某媒体今日发布对品牌X的负面报道，舆情有扩散风险。
                  </AlertDescription>
                </Alert>
              </div>

              {/* 中间：图表区域 */}
              <div className="grid grid-rows-2 gap-2">
                <div className="p-2 border border-[var(--border-secondary)] rounded-lg">
                  <h3 className="text-sm font-semibold text-center text-[var(--text-secondary)] mb-2">舆情趋势</h3>
                  <div className="w-full h-[100px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: '舆情热度',
                          color: 'var(--primary-color)',
                        },
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sentimentTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            hide
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            hide
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary-color)"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
                <div className="p-2 border border-[var(--border-secondary)] rounded-lg">
                  <h3 className="text-sm font-semibold text-center text-[var(--text-secondary)] mb-2">情感极性</h3>
                  <div className="w-full h-[100px]">
                    <ChartContainer
                      config={{
                        negative: {
                          label: '负面',
                          color: 'var(--color-danger-600)',
                        },
                        neutral: {
                          label: '中性',
                          color: 'var(--color-warning-600)',
                        },
                        positive: {
                          label: '正面',
                          color: 'var(--color-success-600)',
                        },
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </div>

              {/* 右侧：操作按钮 */}
              <div className="flex flex-col space-y-2 justify-center">
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  设置自定义预警规则
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  查看所有历史预警
                </Button>
                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  AI生成危机应对SOP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主内容区域 - 左右分栏弹性布局 */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-400px)]">
          {/* 左侧：实时风险预警列表 */}
          <aside className="w-full md:w-1/3 lg:w-1/4">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-4 border-b border-[var(--border-primary)]">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">实时风险预警列表</h2>
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  {/* 预警项目列表 */}
                  {warnings.map((warning) => {
                    const isSelected = selectedWarning === warning.id;
                    const badgeProps = getLevelBadgeProps(warning.level);

                    return (
                      <div
                        key={warning.id}
                        className={`p-4 border-b border-[var(--border-secondary)] cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] ${
                          isSelected ? 'bg-[var(--color-primary-50)]' : ''
                        }`}
                        onClick={() => setSelectedWarning(warning.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Badge className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeProps.className}`}>
                            {badgeProps.text}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-semibold text-[var(--text-primary)] text-sm leading-tight">
                              {warning.title}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              {warning.time}
                            </p>
                          </div>
                        </div>

                        {/* 操作按钮 - 仅在选中项显示 */}
                        {isSelected && (
                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              标记已处理
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                            >
                              <Send className="w-3.5 h-3.5 mr-1" />
                              发起应对小组
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧：舆情分析与危机处理工作台 */}
          <main className="flex-1">
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">舆情分析与危机处理工作台</h2>

                {/* 工作台内容 */}
                <div className="space-y-8">
                  {/* Section: 预警事件详情 */}
                  <section>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-3">预警事件详情</h3>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-secondary)] text-sm space-y-2">
                      <p>
                        <span className="font-medium text-[var(--text-secondary)]">事件描述:</span> 舆情危机 - 品牌Y产品质量争议，讨论量激增。
                      </p>
                      <p>
                        <span className="font-medium text-[var(--text-secondary)]">发生时间:</span> 今天 14:00
                      </p>
                      <p>
                        <span className="font-medium text-[var(--text-secondary)]">涉及品牌/IP:</span> 品牌Y
                      </p>
                    </div>
                  </section>

                  {/* Section: 舆情传播路径与AI情感分析 */}
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">舆情传播路径</h3>
                      <div className="w-full h-64 bg-white rounded-lg p-4 flex items-center justify-center border border-[var(--border-primary)]">
                        <PropagationNetworkChart />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-3">AI情感分析</h3>
                      <div className="w-full h-64 bg-white rounded-lg p-4 border border-[var(--border-primary)]">
                        <AIEmotionWordCloud />
                      </div>
                    </div>
                  </section>

                  {/* Section: AI智能应对建议 */}
                  <section>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-3">AI智能应对建议</h3>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-secondary)] space-y-3 text-sm">
                      <p>
                        <span className="font-bold text-green-600">建议:</span> 立即发布官方声明，澄清误解，并提供权威第三方检测证据。
                      </p>
                      <p>
                        <span className="font-bold text-blue-600">推荐:</span> 启动KOL合作，通过开箱测评和工厂溯源直播，引导正面舆论。
                      </p>
                      <p>
                        <span className="font-bold text-red-600">风险:</span> 若不及时处理，72小时内品牌声誉可能严重受损，影响本季度销量。
                      </p>
                    </div>
                  </section>

                  {/* Section: 危机处理行动计划 */}
                  <section>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-3">危机处理行动计划</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 rounded-lg border bg-white border-[var(--border-primary)]">
                        <Checkbox className="h-4 w-4 text-[var(--primary-color)]" />
                        <p className="flex-1 mx-4 text-sm text-[var(--text-primary)]">
                          草拟官方回应声明
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          公关部-张三
                        </Badge>
                        <span className="text-xs text-[var(--text-tertiary)] ml-4 w-24 text-right">
                          今天 18:00
                        </span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg border bg-white border-[var(--border-primary)]">
                        <Checkbox className="h-4 w-4 text-[var(--primary-color)]" />
                        <p className="flex-1 mx-4 text-sm text-[var(--text-primary)]">
                          联系第三方检测机构
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          产品部-李四
                        </Badge>
                        <span className="text-xs text-[var(--text-tertiary)] ml-4 w-24 text-right">
                          明天 12:00
                        </span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg border bg-green-50 border-green-200">
                        <Checkbox checked className="h-4 w-4 text-[var(--primary-color)]" />
                        <p className="flex-1 mx-4 text-sm line-through text-[var(--text-tertiary)]">
                          筛选合作KOL名单
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          市场部-王五
                        </Badge>
                        <span className="text-xs text-[var(--text-tertiary)] ml-4 w-24 text-right">
                          今天 20:00
                        </span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg border bg-white border-[var(--border-primary)]">
                        <Checkbox className="h-4 w-4 text-[var(--primary-color)]" />
                        <p className="flex-1 mx-4 text-sm text-[var(--text-primary)]">
                          安抚核心用户社群
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          用户运营-赵六
                        </Badge>
                        <span className="text-xs text-[var(--text-tertiary)] ml-4 w-24 text-right">
                          持续进行
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Section: 操作按钮 */}
                  <section>
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                        生成危机报告
                      </Button>
                      <Button variant="outline">
                        立即发布声明
                      </Button>
                      <Button variant="outline">
                        调整预警规则
                      </Button>
                      <Button variant="outline">
                        查看关联舆情
                      </Button>
                      <Button variant="outline">
                        联动市场洞察
                      </Button>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CrisisManagementPage;