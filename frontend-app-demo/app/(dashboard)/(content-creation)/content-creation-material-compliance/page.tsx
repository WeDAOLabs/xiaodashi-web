'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Download,
  ExternalLink,
  MessageSquare,
  ScanText,
  Send,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// 类型定义
interface RiskMaterial {
  id: string;
  name: string;
  image: string;
  riskType: string;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'ignored';
  submitter: string;
  submitDate: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface RiskDetailDrawerProps {
  material: RiskMaterial | null;
  isOpen: boolean;
  onClose: () => void;
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Card className="relative group">
    <CardContent className="p-5">
      <button
        className="absolute top-4 right-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`查看${title}详情`}
      >
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </button>
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
        <div className="text-[var(--color-primary-500)]">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</p>
    </CardContent>
  </Card>
);

// 风险等级样式映射
const getRiskLevelStyle = (level: RiskMaterial['riskLevel']) => {
  switch (level) {
    case 'high':
      return 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]';
    case 'medium':
      return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]';
    case 'low':
      return 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

// 状态样式映射
const getStatusStyle = (status: RiskMaterial['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-[var(--color-danger-100)] text-[var(--color-danger-800)]';
    case 'processing':
      return 'bg-[var(--color-info-100)] text-[var(--color-info-600)]';
    case 'completed':
      return 'bg-[var(--color-success-100)] text-[var(--color-success-600)]';
    case 'ignored':
      return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]';
    default:
      return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]';
  }
};

// 状态文本映射
const getStatusText = (status: RiskMaterial['status']) => {
  switch (status) {
    case 'pending':
      return '待处理';
    case 'processing':
      return '处理中';
    case 'completed':
      return '已处理';
    case 'ignored':
      return '已忽略';
    default:
      return '未知';
  }
};

// 风险分布饼图数据
const riskDistributionData = [
  { name: 'copyright', label: '版权过期', value: 400, fill: '#ef4444' },
  { name: 'sensitive', label: '敏感信息', value: 300, fill: '#f97316' },
  { name: 'false_advertising', label: '虚假宣传', value: 300, fill: '#f59e0b' },
  { name: 'inappropriate_speech', label: '不当言论', value: 200, fill: '#8b5cf6' },
  { name: 'duplicate_material', label: '重复素材', value: 278, fill: '#3b82f6' }
];

// 风险分布饼图组件
const RiskDistributionChart: React.FC = React.memo(() => {
  const chartConfig: ChartConfig = React.useMemo(() => {
    return riskDistributionData.reduce((config, item) => {
      config[item.name] = {
        label: item.label,
        color: item.fill
      };
      return config;
    }, {} as ChartConfig);
  }, []);

  const totalValue = React.useMemo(() =>
    riskDistributionData.reduce((sum, item) => sum + item.value, 0), []
  );

  return (
    <div className="w-full h-56 flex items-center justify-center">
      <div className="flex-1 h-full max-w-[280px] relative">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                aria-label="风险类型分布饼图"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 中心文本显示 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text-primary)]">{totalValue}</div>
            <div className="text-xs text-[var(--text-secondary)]">总风险数</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[var(--text-secondary)] space-y-2 ml-4">
        {riskDistributionData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
            <span>{item.label} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
});

RiskDistributionChart.displayName = 'RiskDistributionChart';

// 风险详情抽屉组件
const RiskDetailDrawer: React.FC<RiskDetailDrawerProps> = ({ material, isOpen, onClose }) => {
  if (!material) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-3xl sm:max-w-2xl bg-[var(--bg-tertiary)] p-0">
        <SheetHeader className="p-6 border-b border-[var(--border-secondary)] bg-[var(--bg-primary)]">
          <SheetTitle className="text-lg font-semibold text-[var(--text-primary)]">
            素材风险详细信息
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 素材预览 */}
          <section>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">素材预览</h3>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-secondary)]">
              <Image
                src={material.image}
                alt={material.name}
                width={400}
                height={240}
                className="w-full h-auto max-h-60 rounded-md object-contain"
              />
              <p className="text-sm text-[var(--text-primary)] font-medium mt-3">{material.name}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                提交人: {material.submitter} | 检测时间: {material.submitDate}
              </p>
            </div>
          </section>

          {/* 风险详情 */}
          <section>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">风险详情</h3>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-secondary)] space-y-3 text-sm">
              <p>
                <strong className="text-[var(--text-secondary)]">风险类型：</strong>
                <span className="font-medium text-[var(--color-danger-600)]">{material.riskType}</span>
              </p>
              <p>
                <strong className="text-[var(--text-secondary)]">风险等级：</strong>
                <span className={`font-medium ${material.riskLevel === 'high' ? 'text-[var(--color-danger-600)]' : material.riskLevel === 'medium' ? 'text-[var(--color-warning-600)]' : 'text-[var(--color-success-600)]'}`}>
                  {material.riskLevel === 'high' ? '高' : material.riskLevel === 'medium' ? '中' : '低'}
                </span>
              </p>
              <p>
                <strong className="text-[var(--text-secondary)]">详细说明：</strong>
                {material.description}
              </p>
            </div>
          </section>

          {/* AI推荐解决方案 */}
          <section>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">AI推荐解决方案</h3>
            <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-white p-4 rounded-lg border border-[var(--color-primary-100)]">
              <p className="text-sm text-[var(--color-primary-700)] leading-relaxed">
                检测到图片为签约素材，授权已于2天前到期。建议立即下架并联系版权方续约，或使用系统推荐的备用素材进行替换。
              </p>
              <Button className="mt-4 bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                采纳AI建议
              </Button>
            </div>
          </section>

          {/* 飞书协同 */}
          <section>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">飞书协同</h3>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-secondary)] flex items-center gap-4">
              <Button variant="ghost" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-colors">
                <MessageSquare className="w-5 h-5 text-[#3b82f6]" />
                <span>发起飞书群讨论</span>
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-colors">
                <ClipboardList className="w-5 h-5 text-[#16a34a]" />
                <span>创建飞书任务</span>
              </Button>
            </div>
          </section>
        </div>

        <SheetFooter className="p-6 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)]">
          <div className="flex items-center justify-end gap-2 w-full overflow-x-auto">
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap text-sm px-3 py-2">
              <Send className="w-4 h-4" />
              联系负责人
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap text-sm px-3 py-2">
              <Shield className="w-4 h-4" />
              发起审批
            </Button>
            <Button variant="outline" className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] hover:bg-[var(--color-danger-100)] flex items-center gap-2 whitespace-nowrap text-sm px-3 py-2">
              <Trash2 className="w-4 h-4" />
              删除素材
            </Button>
            <Button className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] whitespace-nowrap text-sm px-3 py-2">
              手动标记为已处理
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// 主页面组件
const MaterialCompliancePage: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<RiskMaterial | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // 示例数据 - 使用 useMemo 优化性能
  const riskMaterials: RiskMaterial[] = useMemo(() => [
    {
      id: '1',
      name: '夏季新品海报.jpg',
      image: '/images/materials/risk001.jpg',
      riskType: '版权过期',
      riskLevel: 'high',
      description: '此图片授权期限为2023年10月1日-2024年9月30日，现已过期。侵权风险：高。',
      status: 'pending',
      submitter: '张三',
      submitDate: '2024-10-02'
    },
    {
      id: '2',
      name: '"效果王"产品文案.docx',
      image: '/images/materials/risk002.jpg',
      riskType: '虚假宣传嫌疑',
      riskLevel: 'high',
      description: '文案包含"效果王"、"第一品牌"等绝对化词语，涉嫌虚假宣传。',
      status: 'pending',
      submitter: '李四',
      submitDate: '2024-10-02'
    },
    {
      id: '3',
      name: 'AI生成风景图.png',
      image: '/images/materials/risk003.jpg',
      riskType: 'AI生成内容未声明',
      riskLevel: 'medium',
      description: '图片经检测为AI生成，但未在使用声明中进行标注。',
      status: 'processing',
      submitter: '王五',
      submitDate: '2024-10-01'
    },
    {
      id: '4',
      name: '内部培训视频.mp4',
      image: '/images/materials/risk004.jpg',
      riskType: '包含敏感词',
      riskLevel: 'medium',
      description: '视频字幕中包含内部项目代号"风暴计划"，可能造成信息泄露。',
      status: 'completed',
      submitter: '赵六',
      submitDate: '2024-09-30'
    },
    {
      id: '5',
      name: '用户评论截图.png',
      image: '/images/materials/risk005.jpg',
      riskType: '不当言论',
      riskLevel: 'low',
      description: '截图中包含不文明用语，不建议直接作为宣传素材。',
      status: 'ignored',
      submitter: '孙七',
      submitDate: '2024-09-29'
    }
  ], []);

  const handleViewDetail = useCallback((material: RiskMaterial) => {
    setSelectedMaterial(material);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedMaterial(null);
  }, []);

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === riskMaterials.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(riskMaterials.map(item => item.id)));
    }
  }, [selectedItems.size, riskMaterials]);

  return (
    <ToolPageLayout
      title="素材安全与合规性检测"
      description="通过AI深度检测素材安全与合规风险，确保营销内容的法律合规性"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '智能素材资产管理与协同', href: '/content-creation-material-center' },
        { label: '素材安全与合规性检测', href: '/content-creation-material-compliance', current: true }
      ]}
    >
      {/* 风险概览 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="风险素材总览"
              value="1,280 个"
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            <StatCard
              title="高危风险 / 中等风险"
              value="89 / 231 个"
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            <StatCard
              title="待处理风险 / 已处理"
              value="15 / 1,265 个"
              icon={<ClipboardList className="w-5 h-5" />}
            />
            <Card>
              <CardContent className="p-5 flex flex-col items-center justify-center gap-3">
                <Button className="bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold w-full flex items-center justify-center gap-2">
                  <ScanText className="w-4 h-4" />
                  一键扫描全部素材
                </Button>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 min-w-0 text-xs sm:text-sm px-2 sm:px-3">
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">配置合规规则</span>
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 min-w-0 text-xs sm:text-sm px-2 sm:px-3">
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">查看合规报告</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-2 xl:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">风险类型分布</h3>
              <div className="flex-grow">
                <RiskDistributionChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 风险素材列表 */}
      <section className="bg-[var(--bg-tertiary)] py-6 rounded-lg mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">风险素材列表</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">检测到的风险素材列表。</p>
          </div>
          <Button variant="outline">批量处理 ({selectedItems.size})</Button>
        </div>

        {/* 表格头 */}
        <div className="grid grid-cols-12 items-center gap-4 px-4 py-2 text-xs font-medium text-[var(--text-tertiary)]">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
              aria-label="全选素材"
              checked={selectedItems.size === riskMaterials.length && riskMaterials.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <div className="col-span-3">素材名称</div>
          <div className="col-span-1">风险等级</div>
          <div className="col-span-3">风险描述</div>
          <div className="col-span-1">状态</div>
          <div className="col-span-1">提交人</div>
          <div className="col-span-2">操作</div>
        </div>

        {/* 表格内容 */}
        <div className="space-y-3">
          {riskMaterials.map((material) => (
            <div key={material.id} className="bg-[var(--bg-primary)] grid grid-cols-12 items-center gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                  aria-label={`选择素材 ${material.name}`}
                  checked={selectedItems.has(material.id)}
                  onChange={() => handleSelectItem(material.id)}
                />
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <Image
                  src={material.image}
                  alt={material.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{material.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{material.riskType}</p>
                </div>
              </div>
              <div className="col-span-1">
                <Badge className={`text-xs font-semibold px-2 py-1 rounded-full border ${getRiskLevelStyle(material.riskLevel)}`}>
                  {material.riskLevel === 'high' ? '高风险' : material.riskLevel === 'medium' ? '中风险' : '低风险'}
                </Badge>
              </div>
              <p className="col-span-3 text-xs text-[var(--text-secondary)] leading-5 truncate" title={material.description}>
                {material.description}
              </p>
              <div className="col-span-1">
                <Badge className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusStyle(material.status)}`}>
                  {getStatusText(material.status)}
                </Badge>
              </div>
              <div className="col-span-1 text-xs text-[var(--text-secondary)]">
                <p>{material.submitter}</p>
                <p className="text-[var(--text-tertiary)]">{material.submitDate}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                  onClick={() => handleViewDetail(material)}
                >
                  查看详情
                </Button>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  忽略
                </Button>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  重检
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 风险详情抽屉 */}
      <RiskDetailDrawer
        material={selectedMaterial}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default MaterialCompliancePage;