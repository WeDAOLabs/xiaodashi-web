'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Shield,
  Settings,
  FileText,
  Upload,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

type RiskLevel = 'high' | 'medium' | 'low';

interface RiskStatsCardProps {
  title: string;
  count: number;
  level: RiskLevel;
}

const riskStyles: Record<RiskLevel, { bg: string; text: string }> = {
  high: { bg: 'bg-red-500\/10', text: 'text-[var(--color-danger-600)]' },
  medium: { bg: 'bg-yellow-500\/10', text: 'text-[var(--color-warning-600)]' },
  low: { bg: 'bg-blue-500\/10', text: 'text-[var(--color-info-600)]' }
};

const RiskStatsCard: React.FC<RiskStatsCardProps> = ({ title, count, level }) => {
  const styles = riskStyles[level];
  return (
    <div className={`${styles.bg} p-4 rounded-lg`}>
      <p className={`text-sm ${styles.text} font-medium`}>{title}</p>
      <p className={`text-3xl font-bold ${styles.text} mt-2`}>
        {count} <span className="text-lg font-medium">个</span>
      </p>
    </div>
  );
};

type MaterialVariant = 'primary' | 'secondary' | 'accent' | 'warning' | 'danger';

interface MaterialTypeProgressProps {
  type: string;
  percentage: number;
  variant: MaterialVariant;
}

const materialVariantStyles: Record<MaterialVariant, string> = {
  primary: 'bg-[var(--chart-1)]',     // 图表主色
  secondary: 'bg-[var(--chart-2)]',   // 图表次色
  accent: 'bg-[var(--chart-3)]',      // 图表强调色
  warning: 'bg-[var(--chart-4)]',     // 图表警告色
  danger: 'bg-[var(--chart-5)]'       // 图表危险色
};

const MaterialTypeProgress: React.FC<MaterialTypeProgressProps> = ({ type, percentage, variant }) => (
  <div className="flex items-center space-y-2">
    <span className="w-20 text-xs text-[var(--text-secondary)]">{type}</span>
    <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-5 ml-3">
      <div
        className={`h-5 rounded-full ${materialVariantStyles[variant]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

interface ProductionProgressProps {
  title: string;
  percentage: number;
}

const ProductionProgress: React.FC<ProductionProgressProps> = ({ title, percentage }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-[var(--text-secondary)] font-medium">{title}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{percentage}%</span>
    </div>
    <Progress value={percentage} className="h-2.5" />
  </div>
);

interface MaterialCardProps {
  image: string;
  title: string;
  type: string;
  date: string;
  usageCount: number;
  complianceStatus: string;
  isRisk: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  image,
  title,
  type,
  date,
  usageCount,
  complianceStatus,
  isRisk
}) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm overflow-hidden group">
      <Image
        src={hasError ? '/images/materials/placeholder.jpg' : image}
        alt={title}
        width={400}
        height={300}
        className="w-full h-32 object-cover"
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="p-4">
      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{title}</p>
      <div className="text-xs text-[var(--text-tertiary)] mt-1 flex justify-between">
        <span>{type}</span>
        <span>{date}</span>
      </div>
      <div className="text-xs text-[var(--text-secondary)] mt-2">使用次数: {usageCount}</div>
      <p className={`text-xs font-semibold mt-2 ${isRisk ? 'text-[var(--color-danger-600)]' : 'text-[var(--color-success-600)]'}`}>
        合规状态：{complianceStatus}
      </p>
      </div>
    </div>
  );
};

interface PendingReviewItemProps {
  title: string;
  author: string;
  time: string;
  status: string;
  statusColor: string;
}

const PendingReviewItem: React.FC<PendingReviewItemProps> = ({
  title,
  author,
  time,
  status,
  statusColor
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
          {status}
        </Badge>
      </div>
      <p className="text-xs text-[var(--text-tertiary)] mt-1">{author} · {time}</p>
    </div>
    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] transition-colors text-[var(--color-primary-500)]">
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </button>
  </div>
);

interface ExpirationItemProps {
  name: string;
  type: string;
  expireDate: string;
}

const ExpirationItem: React.FC<ExpirationItemProps> = ({ name, type, expireDate }) => (
  <div className="grid grid-cols-3 gap-4 text-sm items-center">
    <span className="font-medium text-[var(--text-primary)]">{name}</span>
    <span className="text-[var(--text-secondary)]">{type}</span>
    <span className="text-[var(--color-danger-600)] font-semibold">到期日: {expireDate}</span>
  </div>
);

// 风险分布数据
const RISK_DISTRIBUTION_DATA = [
  { name: '版权过期', value: 30, fill: '#ef4444' },
  { name: '敏感信息', value: 25, fill: '#f59e0b' },
  { name: '重复素材', value: 25, fill: '#8b5cf6' },
  { name: '虚假宣传', value: 20, fill: '#3b82f6' }
];

const MaterialCenterPage: React.FC = () => {
  // 示例数据
  const materialGridData = [
    {
      image: '/images/materials/spring-promotion.jpg',
      title: '春季促销海报',
      type: '图片',
      date: '2024-07-20',
      usageCount: 15,
      complianceStatus: '无风险',
      isRisk: false
    },
    {
      image: '/images/materials/product-video.jpg',
      title: '产品宣传视频',
      type: '视频',
      date: '2024-07-19',
      usageCount: 42,
      complianceStatus: '2个风险',
      isRisk: true
    },
    {
      image: '/images/materials/brand-story.jpg',
      title: '品牌故事文案',
      type: '文案',
      date: '2024-07-18',
      usageCount: 8,
      complianceStatus: '无风险',
      isRisk: false
    },
    {
      image: '/images/materials/summer-kv.jpg',
      title: '夏季活动主KV',
      type: '设计稿',
      date: '2024-07-17',
      usageCount: 23,
      complianceStatus: '无风险',
      isRisk: false
    },
    {
      image: '/images/materials/background-music.jpg',
      title: '背景音乐BGM',
      type: '音频',
      date: '2024-07-16',
      usageCount: 55,
      complianceStatus: '1个风险',
      isRisk: true
    },
    {
      image: '/images/materials/user-interview.jpg',
      title: '用户访谈录音',
      type: '音频',
      date: '2024-07-15',
      usageCount: 12,
      complianceStatus: '无风险',
      isRisk: false
    }
  ];

  const pendingReviewData = [
    {
      title: '秋季新品发布会视频',
      author: '张三',
      time: '2024-07-20 10:30',
      status: '待内容审核',
      statusColor: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]'
    },
    {
      title: '合作KOL肖像照片',
      author: '李四',
      time: '2024-07-20 09:15',
      status: '待合规审核',
      statusColor: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]'
    },
    {
      title: '双十一活动文案',
      author: '王五',
      time: '2024-07-19 18:00',
      status: '待内容审核',
      statusColor: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]'
    },
    {
      title: '品牌授权Logo',
      author: '赵六',
      time: '2024-07-19 15:45',
      status: '待合规审核',
      statusColor: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]'
    },
    {
      title: '产品介绍长图',
      author: '张三',
      time: '2024-07-19 14:00',
      status: '待内容审核',
      statusColor: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]'
    }
  ];

  const expirationData = [
    { name: '音乐授权-《城市之光》', type: '音频', expireDate: '2024-08-15' },
    { name: '模特肖像权-王晓', type: '图片', expireDate: '2024-08-20' },
    { name: '字体授权-方正兰亭黑', type: '设计稿', expireDate: '2024-09-01' }
  ];

  return (
    <ToolPageLayout
      title="素材中心概览"
      description="智能素材资产管理与协同中心，提供全方位的素材管理解决方案"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '智能素材资产管理与协同', href: '/content-creation-material-center', current: true }
      ]}
    >
      {/* 合规风险总览 */}
      <div className="xl:col-span-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">当前素材库合规风险总览</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  配置合规规则
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  查看合规报告
                </Button>
                <Button className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  立即处理风险
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start col-span-1 md:col-span-2 lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <RiskStatsCard
                    title="高风险素材"
                    count={15}
                    level="high"
                  />
                  <RiskStatsCard
                    title="中风险素材"
                    count={42}
                    level="medium"
                  />
                  <RiskStatsCard
                    title="低风险素材"
                    count={128}
                    level="low"
                  />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-2 h-48 flex items-center justify-center">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={RISK_DISTRIBUTION_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6 text-sm text-[var(--text-secondary)] space-y-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2 bg-red-500" />版权过期
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2 bg-yellow-500" />敏感信息
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2 bg-purple-500" />重复素材
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2 bg-blue-500" />虚假宣传
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据概览区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* 素材类型总览 */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">素材类型总览</h3>
                <Button variant="ghost" size="sm">
                  查看分类详情
                </Button>
              </div>
              <div className="flex-grow space-y-3">
                <MaterialTypeProgress type="图片" percentage={100} variant="primary" />
                <MaterialTypeProgress type="视频" percentage={75} variant="secondary" />
                <MaterialTypeProgress type="文案" percentage={50} variant="accent" />
                <MaterialTypeProgress type="音频" percentage={69} variant="warning" />
                <MaterialTypeProgress type="设计稿" percentage={47} variant="danger" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 内容生产概览 */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">当前项目内容生产概览</h3>
                <Button variant="ghost" size="sm">
                  查看详细报告
                </Button>
              </div>
              <div className="space-y-6 flex-grow flex flex-col justify-center">
                <ProductionProgress title="文案内容创作" percentage={75} />
                <ProductionProgress title="视觉内容创作" percentage={90} />
                <ProductionProgress title="听觉内容创作" percentage={45} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 素材管理区域 */}
      <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* 最新素材 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Tabs defaultValue="newest" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="newest">最新入库素材</TabsTrigger>
                    <TabsTrigger value="popular">热门高复用素材</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">查看更多</Button>
                  <Button className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    快速上传
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {materialGridData.map((material, index) => (
                  <MaterialCard key={index} {...material} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 待审核列表 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">当前团队待审核的素材</h3>
              </div>
              <div className="flex-grow overflow-y-auto divide-y divide-[var(--border-secondary)]">
                {pendingReviewData.map((item, index) => (
                  <PendingReviewItem key={index} {...item} />
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                进入审核
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 到期预警 */}
      <div className="xl:col-span-3 mt-6">
        <div className="bg-[var(--color-warning-50)] border border-[var(--color-warning-100)] p-6 rounded-lg text-[var(--color-warning-600)]">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">重要素材版权或授权期限即将到期，请及时处理。</h3>
              <div className="mt-4 space-y-2">
                {expirationData.map((item, index) => (
                  <ExpirationItem key={index} {...item} />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Button>查看详情并处理</Button>
                <Button variant="ghost" className="text-[var(--text-secondary)]">
                  忽略此提醒
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default MaterialCenterPage;