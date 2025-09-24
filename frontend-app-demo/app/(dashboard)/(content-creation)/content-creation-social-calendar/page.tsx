'use client';

import React, { useState, useEffect } from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Eye,
  User,
  BarChart3,
  Shield,
  AlertTriangle,
  RotateCcw,
  X,
  Edit,
  Trash2
} from 'lucide-react';

// 内容状态枚举
const STATUS_CONFIG = {
  published: {
    label: '已发布',
    color: 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-600)]',
    bgColor: 'bg-[var(--color-success-50)]',
    borderColor: 'border-[var(--color-success-600)]'
  },
  scheduled: {
    label: '待发布',
    color: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-600)]',
    bgColor: 'bg-[var(--color-warning-50)]',
    borderColor: 'border-[var(--color-warning-600)]'
  },
  draft: {
    label: '草稿',
    color: 'bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-600)]',
    bgColor: 'bg-[var(--color-info-50)]',
    borderColor: 'border-[var(--color-info-600)]'
  },
  reviewing: {
    label: '审核中',
    color: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--text-secondary)]',
    bgColor: 'bg-[var(--bg-tertiary)]',
    borderColor: 'border-[var(--text-secondary)]'
  },
  error: {
    label: '有异常',
    color: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-600)]',
    bgColor: 'bg-[var(--color-danger-50)]',
    borderColor: 'border-[var(--color-danger-600)]'
  },
  compliance_risk: {
    label: '有合规风险',
    color: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-600)]',
    bgColor: 'bg-[var(--color-danger-50)]',
    borderColor: 'border-[var(--color-danger-600)]'
  }
};

// 朋友圈内容类型
interface FriendsCircleContent {
  id: string;
  date: string;
  time?: string;
  status: keyof typeof STATUS_CONFIG;
  title: string;
  content?: string;
  ipTags?: string[];
  interactions?: {
    likes: number;
    comments: number;
    views: number;
  };
  aiAnalysis?: {
    matchScore: number;
    complianceRisks?: Array<{
      type: string;
      description: string;
      suggestion: string;
    }>;
  };
}

// 示例数据
const SAMPLE_CONTENT: FriendsCircleContent[] = [
  {
    id: '1',
    date: '2025-07-04',
    time: '09:00',
    status: 'published',
    title: '新品上市！AI赋能，营销新纪元！',
    content: '我们的AI营销平台正式上线啦！为企业提供全域营销解决方案...',
    ipTags: ['科技先锋'],
    interactions: { likes: 128, comments: 36, views: 1250 }
  },
  {
    id: '2',
    date: '2025-07-08',
    time: '18:30',
    status: 'scheduled',
    title: '下周直播预告：深度解析客户画像',
    content: '下周三晚8点，我们将分享如何利用AI技术构建精准客户画像...',
    ipTags: ['行业专家']
  },
  {
    id: '3',
    date: '2025-07-11',
    status: 'draft',
    title: '客户成功案例初稿',
    content: '分享我们如何帮助某知名品牌提升营销ROI超过300%...',
    ipTags: ['营销顾问']
  },
  {
    id: '4',
    date: '2025-07-15',
    status: 'error',
    title: '人设偏离预警：内容风格不符',
    content: '最近的内容风格与设定的专业形象有偏差，需要调整...',
    ipTags: ['科技先锋']
  },
  {
    id: '5',
    date: '2025-07-20',
    time: '10:00',
    status: 'compliance_risk',
    title: '竞品对比分析，存在合规风险',
    content: '还在用XX竞品？别傻了！我们的产品效果绝对是最好的，秒杀市面上所有同类工具！',
    ipTags: ['科技先锋'],
    interactions: { likes: 0, comments: 0, views: 0 },
    aiAnalysis: {
      matchScore: 70,
      complianceRisks: [
        {
          type: '绝对化用语',
          description: '广告法禁止使用"最"、"第一"等绝对化词语。',
          suggestion: '修改"最好的"为"领先的"或"高效的"。'
        },
        {
          type: '贬低竞品',
          description: '不正当竞争法规定不得捏造、散布虚伪事实，损害竞争对手的商业信誉、商品声誉。',
          suggestion: '删除"别傻了"、"秒杀市面上所有同类工具"等语句，改为客观陈述自身产品优点。'
        }
      ]
    }
  },
  {
    id: '6',
    date: '2025-07-22',
    status: 'reviewing',
    title: '季度优惠活动文案',
    content: '夏日狂欢季，AI营销工具限时优惠，助力企业营销升级...',
    ipTags: ['营销专家']
  }
];

// 日历组件接口
interface CalendarDayProps {
  date: number;
  content?: FriendsCircleContent[];
  onContentClick?: (content: FriendsCircleContent) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, content = [], onContentClick }) => {
  return (
    <div className="p-1.5 bg-[var(--bg-primary)] border-b border-r border-[var(--border-secondary)] min-h-[140px] flex flex-col">
      {date > 0 && (
        <span className="text-xs font-semibold self-start px-1.5 py-0.5 rounded-full text-[var(--text-secondary)]">
          {date}
        </span>
      )}
      <div className="flex flex-col gap-2 mt-1">
        {content.map((item) => {
          const statusConfig = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              className={`p-2 rounded-md cursor-pointer transition-all hover:scale-105 hover:shadow-md ${statusConfig.bgColor} border-l-4 ${statusConfig.borderColor}`}
              onClick={() => onContentClick?.(item)}
            >
              <div className="flex justify-between items-start">
                <p className={`text-xs font-bold ${statusConfig.color}`}>
                  {statusConfig.label}
                </p>
                {item.time && (
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">
                    {item.time}
                  </p>
                )}
              </div>
              <p className="text-sm text-[var(--text-primary)] mt-1 font-medium truncate">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs flex-1 text-center py-1 bg-white/50 hover:bg-white rounded transition">
                  编辑
                </button>
                <button className="text-xs flex-1 text-center py-1 bg-white/50 hover:bg-white rounded transition">
                  发布
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 内容详情面板接口
interface ContentDetailPanelProps {
  content: FriendsCircleContent | null;
  onClose: () => void;
}

const ContentDetailPanel: React.FC<ContentDetailPanelProps> = ({ content, onClose }) => {
  const statusConfig = content ? STATUS_CONFIG[content.status] : null;

  // ESC键关闭面板
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && content) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content, onClose]);

  return (
    <>
      {/* 背景遮罩 */}
      {content && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* 详情面板 */}
      <aside className={cn(
        "fixed top-0 right-0 h-full w-96 bg-[var(--bg-primary)] shadow-2xl z-50 flex flex-col",
        "transition-all duration-300 ease-in-out",
        content
          ? "transform translate-x-0 opacity-100"
          : "transform translate-x-full opacity-0 pointer-events-none"
      )}>
      <header className="p-4 border-b border-[var(--border-secondary)] flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">内容详情与互动数据</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 p-5 overflow-y-auto">
        {content ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold">{content.date.split('-').slice(1).join('月')}日</p>
                {content.time && (
                  <p className="text-sm text-[var(--text-tertiary)]">{content.time} 发布</p>
                )}
              </div>
              <Badge className={statusConfig?.color}>
                {statusConfig?.label}
              </Badge>
            </div>

            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
              {content.content || content.title}
            </p>

        {/* IP人设信息 */}
        {content.ipTags && content.ipTags.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <User className="w-4 h-4" />
              <h4 className="text-sm font-semibold">IP人设信息</h4>
            </div>
            <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
              <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] p-2 rounded-md">
                {content.ipTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 互动数据 */}
        {content.interactions && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <BarChart3 className="w-4 h-4" />
              <h4 className="text-sm font-semibold">互动数据</h4>
            </div>
            <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
              <div className="flex justify-around bg-[var(--bg-tertiary)] p-3 rounded-md text-center">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">{content.interactions.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{content.interactions.comments}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{content.interactions.views}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI分析 */}
        {content.aiAnalysis && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Shield className="w-4 h-4" />
              <h4 className="text-sm font-semibold">AI分析</h4>
            </div>
            <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
              <div className="bg-[var(--bg-tertiary)] p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <p>人设匹配度</p>
                  <p className="font-bold text-[var(--color-danger-600)]">{content.aiAnalysis.matchScore}%</p>
                </div>
                <div className="w-full bg-[var(--border-secondary)] rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full bg-[var(--color-danger-600)]"
                    style={{ width: `${content.aiAnalysis.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 合规性评估报告 */}
        {content.aiAnalysis?.complianceRisks && content.aiAnalysis.complianceRisks.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Shield className="w-4 h-4" />
              <h4 className="text-sm font-semibold">合规性评估报告</h4>
            </div>
            <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
              <div className="bg-[var(--color-danger-50)] border border-[var(--color-danger-100)] p-3 rounded-md">
                <div className="flex items-center gap-2 text-[var(--color-danger-600)]">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-semibold text-sm">合规性评估：存在 {content.aiAnalysis.complianceRisks.length} 项高风险</p>
                </div>
                <div className="mt-3 space-y-3 text-xs pl-7">
                  {content.aiAnalysis.complianceRisks.map((risk, index) => (
                    <div key={index}>
                      <p className="font-bold text-[var(--text-primary)]">风险 {index + 1}: {risk.type}</p>
                      <p className="mt-1"><span className="font-semibold">原因:</span> {risk.description}</p>
                      <p className="mt-1 text-[var(--color-primary-700)]"><span className="font-semibold">建议:</span> {risk.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--text-secondary)] text-sm">点击日历中的内容查看详情</p>
          </div>
        )}
      </div>

      <footer className="p-4 border-t border-[var(--border-secondary)] bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Button variant="outline" className="bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <Edit className="w-4 h-4" />
            再次编辑
          </Button>
          <Button variant="outline" className="bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
            <Trash2 className="w-4 h-4" />
            撤回/删除
          </Button>
          <Button className="col-span-2 bg-[var(--color-info-100)] text-[var(--color-info-600)] hover:bg-[var(--color-info-100)]/80">
            <RotateCcw className="w-4 h-4" />
            再次合规检测
          </Button>
        </div>
      </footer>
    </aside>
    </>
  );
};

const SocialCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState<FriendsCircleContent | null>(null);

  // 计算月份需要的行数
  const calculateWeeksNeeded = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // 周一为0，周日为6
    const totalDays = lastDay.getDate();
    return Math.ceil((totalDays + startOffset) / 7);
  };

  // 生成当月日历数据
  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // 从周一开始

    const weeksNeeded = calculateWeeksNeeded(year, month);
    const totalDays = weeksNeeded * 7;
    const calendarData: Array<{ date: number; content: FriendsCircleContent[] }> = [];

    for (let i = 0; i < totalDays; i++) { // 动态行数 * 7 days
      const currentCalDate = new Date(startDate);
      currentCalDate.setDate(startDate.getDate() + i);

      const dateStr = currentCalDate.toISOString().split('T')[0];
      const dayContent = SAMPLE_CONTENT.filter(content => content.date === dateStr);

      calendarData.push({
        date: currentCalDate.getMonth() === month ? currentCalDate.getDate() : 0,
        content: dayContent
      });
    }

    return calendarData;
  };

  const calendarData = generateCalendarData();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleContentClick = (content: FriendsCircleContent) => {
    setSelectedContent(content);
  };

  return (
    <ToolPageLayout
      title="朋友圈内容日历与管理"
      description="通过智能日历管理朋友圈内容发布，实现精准内容规划与合规监控"
      breadcrumbs={[
        { label: '品牌与创意资产', href: '#' },
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '朋友圈内容日历与管理', href: '/content-creation-social-calendar', current: true }
      ]}
      actions={
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建朋友圈
        </Button>
      }
    >
      <div className="relative w-full">
        <div className="w-full flex flex-col">
          {/* 筛选栏 */}
          <div className="mb-6 bg-[var(--bg-primary)] p-4 rounded-lg shadow-sm border border-[var(--border-secondary)]">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-[var(--text-tertiary)] absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  placeholder="关键词搜索..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 text-[var(--text-tertiary)] absolute top-1/2 left-3 -translate-y-1/2 z-10" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="pl-10 w-full">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="scheduled">待发布</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="reviewing">审核中</SelectItem>
                    <SelectItem value="error">有异常</SelectItem>
                    <SelectItem value="compliance_risk">有合规风险</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input type="date" placeholder="选择日期范围" />
            </div>
          </div>

          {/* 日历视图 */}
          <Card className="w-full">
            <CardContent className="p-5">
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-4">朋友圈内容发布日程与概览</p>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-[var(--border-secondary)] border-t border-l border-[var(--border-secondary)]">
                {/* 星期标题 */}
                {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
                  <div key={index} className="text-center py-2 bg-[var(--bg-tertiary)] text-xs font-semibold text-[var(--text-secondary)] border-b border-r border-[var(--border-secondary)]">
                    {day}
                  </div>
                ))}

                {/* 日历格子 */}
                {calendarData.map((dayData, index) => (
                  <CalendarDay
                    key={index}
                    date={dayData.date}
                    content={dayData.content}
                    onContentClick={handleContentClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 内容详情面板 */}
        <ContentDetailPanel
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      </div>
    </ToolPageLayout>
  );
};

export default SocialCalendarPage;