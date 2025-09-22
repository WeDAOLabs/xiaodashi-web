'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { FileText, Download, Calendar, Settings } from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
}

interface Dimension {
  id: string;
  name: string;
  checked: boolean;
}

interface Metric {
  id: string;
  name: string;
  checked: boolean;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'comprehensive',
    name: '综合营销报告',
    description: '包含所有关键指标的完整报告'
  },
  {
    id: 'roi-focused',
    name: 'ROI专项报告',
    description: '专注于投资回报率分析'
  },
  {
    id: 'channel-performance',
    name: '渠道效果报告',
    description: '各渠道表现对比分析'
  },
  {
    id: 'user-behavior',
    name: '用户行为报告',
    description: '用户路径和行为分析'
  }
];

const ReportCustomizer: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState('comprehensive');
  const [exportFormat, setExportFormat] = React.useState('pdf');
  const [scheduledReport, setScheduledReport] = React.useState(false);

  const [dimensions, setDimensions] = React.useState<Dimension[]>([
    { id: 'time', name: '时间维度', checked: true },
    { id: 'channel', name: '渠道维度', checked: true },
    { id: 'campaign', name: '活动维度', checked: false },
    { id: 'audience', name: '受众维度', checked: true },
    { id: 'content', name: '内容维度', checked: false },
    { id: 'device', name: '设备维度', checked: false }
  ]);

  const [metrics, setMetrics] = React.useState<Metric[]>([
    { id: 'roi', name: 'ROI投资回报率', checked: true },
    { id: 'gmv', name: 'GMV成交额', checked: true },
    { id: 'conversion', name: '转化率', checked: true },
    { id: 'cpc', name: 'CPC点击成本', checked: false },
    { id: 'ctr', name: 'CTR点击率', checked: false },
    { id: 'retention', name: '用户留存率', checked: false }
  ]);

  const handleDimensionChange = React.useCallback((dimensionId: string, checked: boolean) => {
    setDimensions(prev =>
      prev.map(dim =>
        dim.id === dimensionId ? { ...dim, checked } : dim
      )
    );
  }, []);

  const handleMetricChange = React.useCallback((metricId: string, checked: boolean) => {
    setMetrics(prev =>
      prev.map(metric =>
        metric.id === metricId ? { ...metric, checked } : metric
      )
    );
  }, []);

  const selectedDimensionsCount = React.useMemo(() =>
    dimensions.filter(dim => dim.checked).length, [dimensions]);

  const selectedMetricsCount = React.useMemo(() =>
    metrics.filter(metric => metric.checked).length, [metrics]);

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-5 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">报表定制与导出</h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            模板管理
          </Button>
        </div>

        {/* 报告模板选择 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">报告模板</h4>
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTemplates.map((template) => (
                <div key={template.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={template.id} id={template.id} />
                  <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                    <div className="p-3 border border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                      <p className="font-medium text-[var(--text-primary)] text-sm">{template.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{template.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* 维度配置 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">数据维度</h4>
            <span className="text-xs text-[var(--text-secondary)]">已选择 {selectedDimensionsCount} 项</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dimensions.map((dimension) => (
              <div key={dimension.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`dimension-${dimension.id}`}
                  checked={dimension.checked}
                  onCheckedChange={(checked) => handleDimensionChange(dimension.id, checked as boolean)}
                />
                <Label
                  htmlFor={`dimension-${dimension.id}`}
                  className="text-sm text-[var(--text-secondary)] cursor-pointer"
                >
                  {dimension.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 指标配置 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">核心指标</h4>
            <span className="text-xs text-[var(--text-secondary)]">已选择 {selectedMetricsCount} 项</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`metric-${metric.id}`}
                  checked={metric.checked}
                  onCheckedChange={(checked) => handleMetricChange(metric.id, checked as boolean)}
                />
                <Label
                  htmlFor={`metric-${metric.id}`}
                  className="text-sm text-[var(--text-secondary)] cursor-pointer"
                >
                  {metric.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 导出格式 */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">导出格式</h4>
          <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="text-sm text-[var(--text-secondary)] cursor-pointer">PDF报告</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="text-sm text-[var(--text-secondary)] cursor-pointer">Excel表格</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="text-sm text-[var(--text-secondary)] cursor-pointer">CSV数据</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* 定时报告 */}
        <div>
          <div className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--color-primary-500)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">定时生成报告</p>
                <p className="text-xs text-[var(--text-secondary)]">每周一自动生成并发送报告</p>
              </div>
            </div>
            <Switch
              checked={scheduledReport}
              onCheckedChange={setScheduledReport}
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            预览报告
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            立即生成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCustomizer;