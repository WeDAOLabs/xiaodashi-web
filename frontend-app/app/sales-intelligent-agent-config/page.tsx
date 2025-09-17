'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, X, Plus, Inbox, ArrowDown, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
  current: boolean;
}

// Tab配置的类型定义
type TabId = 'basic' | 'schedule' | 'handoff' | 'strategy';

interface TabConfig {
  id: TabId;
  step: number;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  required: boolean;
}

// Tab状态类型
interface TabStatus {
  isCompleted: boolean;
  hasErrors: boolean;
  isDirty: boolean;
}

// Tab配置数据
const tabConfigs: TabConfig[] = [
  {
    id: 'basic',
    step: 1,
    title: '基础信息设置',
    description: '定义智能销售员的基本"人设"',
    required: true,
  },
  {
    id: 'schedule',
    step: 2,
    title: '工作时间配置',
    description: '设置在线状态与自动接待规则',
    required: true,
  },
  {
    id: 'handoff',
    step: 3,
    title: '对话转接机制',
    description: '配置AI与人工协作的无缝衔接',
    required: true,
  },
  {
    id: 'strategy',
    step: 4,
    title: '销售策略编辑器',
    description: '设计自动化销售流程与策略',
    required: false,
  },
];

// 专长领域标签数据
const expertiseTags = [
  { id: 1, label: '产品咨询', selected: true },
  { id: 2, label: '优惠活动', selected: true },
  { id: 3, label: '售后服务', selected: true },
];

// 沟通风格选项
const communicationStyles = [
  {
    id: 'professional',
    name: '专业顾问',
    description: '专业、理性、详细解答...',
    selected: false
  },
  {
    id: 'friendly',
    name: '亲切朋友',
    description: '活泼、热情、生活化语言...',
    selected: true
  },
  {
    id: 'efficient',
    name: '高效专家',
    description: '直接、简洁、结果导向...',
    selected: false
  },
  {
    id: 'custom',
    name: '自定义风格',
    description: '根据需求调整沟通参数',
    selected: false
  }
];

// 工作模式选项
const workModes = [
  {
    id: '24_7',
    name: '24/7 全天候在线',
    description: '全天无休，随时响应客户咨询',
    selected: false
  },
  {
    id: 'custom_time',
    name: '自定义工作时间',
    description: '按指定时间段在线，其他时间自动回复',
    selected: true
  },
  {
    id: 'follow_company',
    name: '跟随企业工作时间',
    description: '与企业上下班时间保持一致',
    selected: false
  }
];

// 转接条件选项
const handoffConditions = [
  {
    id: 'customer_request',
    name: '客户明确要求转人工',
    description: '当客户发送"转人工"、"找真人"等关键词时',
    selected: true
  },
  {
    id: 'low_confidence',
    name: 'AI对话引擎得分低于阈值',
    description: '当AI对回答信心度低于设定阈值时自动转接',
    selected: false
  },
  {
    id: 'negative_emotion',
    name: '客户情绪极度负面',
    description: '当AI识别到客户情绪极度负面时自动转接',
    selected: false
  },
  {
    id: 'sales_milestone',
    name: '达到关键销售节点',
    description: '当客户进入高价值转化节点时转接人工跟进',
    selected: false
  }
];

const SalesAgentConfigPage: React.FC = () => {
  // Tab导航状态
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [tabStatus, setTabStatus] = useState<Record<TabId, TabStatus>>({
    basic: { isCompleted: false, hasErrors: false, isDirty: false },
    schedule: { isCompleted: false, hasErrors: false, isDirty: false },
    handoff: { isCompleted: false, hasErrors: false, isDirty: false },
    strategy: { isCompleted: false, hasErrors: false, isDirty: false },
  });
  const [isDirty, setIsDirty] = useState(false);

  // 表单数据状态
  const [formData, setFormData] = useState({
    basic: {
      name: '',
      department: '销售部',
      position: '智能销售顾问',
      bio: '您好！我是智能销售顾问，专注于为您提供产品咨询、优惠活动介绍和售后服务支持。24小时在线，随时为您解答疑问，欢迎随时咨询！'
    },
    schedule: {
      workMode: 'custom_time',
      customTimes: {},
    },
    handoff: {
      conditions: ['customer_request'],
      target: '销售团队',
    },
    strategy: {
      strategies: [],
    }
  });

  const [expertiseList, setExpertiseList] = useState(expertiseTags);
  const [selectedStyle, setSelectedStyle] = useState('friendly');
  const [selectedWorkMode, setSelectedWorkMode] = useState('custom_time');
  const [selectedHandoffConditions, setSelectedHandoffConditions] = useState(['customer_request']);
  const [weekActiveTab, setWeekActiveTab] = useState('monday');

  const breadcrumbs: BreadcrumbItem[] = [
    { label: '智能销售赋能', href: '#', current: false },
    { label: '智能销售员设置与策略配置', href: '/sales-intelligent-agent-config', current: true }
  ];

  // 删除专长标签
  const removeExpertise = (id: number) => {
    setExpertiseList(prev => {
      const newList = prev.filter(item => item.id !== id);
      markFormDirty('basic');
      return newList;
    });
  };

  // 添加专长标签
  const addExpertise = () => {
    // 这里可以实现添加逻辑
    console.log('添加专长');
    markFormDirty('basic');
  };

  // Tab切换处理
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // 更新Tab状态
  const updateTabStatus = (tabId: TabId, updates: Partial<TabStatus>) => {
    setTabStatus(prev => ({
      ...prev,
      [tabId]: { ...prev[tabId], ...updates }
    }));
  };

  // 表单验证函数
  const validateTab = (tabId: TabId): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (tabId) {
      case 'basic':
        if (!formData.basic.name.trim()) {
          errors.push('姓名为必填项');
        }
        if (expertiseList.length === 0) {
          errors.push('请至少选择一个专长领域');
        }
        break;
      case 'schedule':
        if (!selectedWorkMode) {
          errors.push('请选择工作模式');
        }
        break;
      case 'handoff':
        if (selectedHandoffConditions.length === 0) {
          errors.push('请至少选择一个转接条件');
        }
        break;
      case 'strategy':
        // 策略不是必填项
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  // 标记表单为脏状态
  const markFormDirty = (tabId: TabId) => {
    updateTabStatus(tabId, { isDirty: true });
    setIsDirty(true);

    // 同时进行验证
    const validation = validateTab(tabId);
    updateTabStatus(tabId, { hasErrors: !validation.isValid });
  };

  // 检查Tab是否完成
  // const checkTabCompletion = (tabId: TabId) => {
  //   const validation = validateTab(tabId);
  //   updateTabStatus(tabId, {
  //     isCompleted: validation.isValid && tabStatus[tabId].isDirty,
  //     hasErrors: !validation.isValid
  //   });
  // };

  // 自动保存草稿（防抖）
  const saveAsDraft = useCallback(() => {
    const draftData = {
      formData,
      expertiseList,
      selectedStyle,
      selectedWorkMode,
      selectedHandoffConditions,
      tabStatus,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('sales-agent-config-draft', JSON.stringify(draftData));
      console.log('草稿已自动保存');
    } catch (error) {
      console.error('保存草稿失败:', error);
    }
  }, [formData, expertiseList, selectedStyle, selectedWorkMode, selectedHandoffConditions, tabStatus]);

  // 防抖保存
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      saveAsDraft();
    }, 300); // 300ms防抖

    return () => clearTimeout(timer);
  }, [isDirty, saveAsDraft]);

  // 页面加载时恢复草稿
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('sales-agent-config-draft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        // 检查草稿是否在24小时内
        if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
          // 可以在这里添加一个确认对话框询问用户是否恢复草稿
          console.log('发现未保存的草稿，可恢复');
        }
      }
    } catch (error) {
      console.error('恢复草稿失败:', error);
    }
  }, []);

  // 离开页面提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '您有未保存的修改，确定要离开吗？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 获取Tab的样式类 - 简化为只有选中边框高亮
  const getTabStyles = (tabConfig: TabConfig) => {
    const isActive = activeTab === tabConfig.id;

    if (isActive) {
      return 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20 bg-white';
    }
    return 'border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-white';
  };

  // 切换转接条件
  const toggleHandoffCondition = (conditionId: string) => {
    setSelectedHandoffConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
    markFormDirty('handoff');
  };

  // 导航状态计算
  const currentTabIndex = tabConfigs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabConfigs.length - 1;

  const weekDays = [
    { key: 'monday', label: '周一' },
    { key: 'tuesday', label: '周二' },
    { key: 'wednesday', label: '周三' },
    { key: 'thursday', label: '周四' },
    { key: 'friday', label: '周五' },
    { key: 'saturday', label: '周六' },
    { key: 'sunday', label: '周日' }
  ];

  return (
    <ToolPageLayout
      title="智能销售员设置与策略配置"
      description="一站式配置智能销售员的'人设'与'行为'，打造企业专属AI销售助手"
      breadcrumbs={breadcrumbs}
    >

        {/* Tab导航区域 */}
        <div className="sticky top-0 z-10 py-4 bg-[var(--bg-secondary)]/80 backdrop-blur-sm">
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as TabId)}
            className="w-full"
          >
            {/* Tab导航栏 */}
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-sm h-auto p-2">
              {tabConfigs.map((tabConfig) => {
                return (
                  <TabsTrigger
                    key={tabConfig.id}
                    value={tabConfig.id}
                    className={`flex flex-col items-center gap-2 p-4 h-auto border-2 rounded-lg transition-all ${getTabStyles(tabConfig)}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold bg-[var(--primary-color)] text-white text-sm">
                        {tabConfig.step}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{tabConfig.title}</p>
                      <p className="text-xs opacity-80">{tabConfig.description}</p>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab内容区域 */}
            <div className="mt-6 transition-all duration-300 ease-in-out">
              {/* 1. 基础信息设置 */}
              <TabsContent value="basic" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">基础信息设置</h3>
                <span className="text-sm text-[var(--text-tertiary)]">必填项*</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 左侧：基础信息 */}
                <div className="md:col-span-2 space-y-6">
                  {/* 名称与头像 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-[var(--text-secondary)]">名称与头像</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-center">
                          <Image
                            src="/images/avatars/agent-avatar.jpg"
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full"
                          />
                          <button className="text-xs text-[var(--primary-color)] mt-1 block hover:underline">
                            点击更换头像
                          </button>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="name" className="text-sm text-[var(--text-secondary)]">姓名*</Label>
                          <Input
                            type="text"
                            id="name"
                            placeholder="昵称/别名"
                            className="mt-1 bg-gray-50"
                            value={formData.basic.name}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                basic: { ...prev.basic, name: e.target.value }
                              }));
                              markFormDirty('basic');
                            }}
                          />
                          {tabStatus.basic.hasErrors && !formData.basic.name.trim() && (
                            <p className="text-red-500 text-xs mt-1">姓名为必填项</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 简介/工牌 */}
                    <div>
                      <Label className="text-sm font-medium text-[var(--text-secondary)]">简介/工牌</Label>
                      <div className="space-y-2 mt-2">
                        <Input
                          type="text"
                          placeholder="所属部门*"
                          defaultValue="销售部"
                          className="bg-gray-50 text-sm"
                        />
                        <Input
                          type="text"
                          placeholder="职位*"
                          defaultValue="智能销售顾问"
                          className="bg-gray-50 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 专长领域 */}
                  <div>
                    <Label className="text-sm font-medium text-[var(--text-secondary)]">专长领域 (最多选择3项)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expertiseList.map((tag) => (
                        <span key={tag.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                          {tag.label}
                          <X
                            className="w-4 h-4 cursor-pointer hover:bg-green-200 rounded-full"
                            onClick={() => removeExpertise(tag.id)}
                          />
                        </span>
                      ))}
                      <button
                        onClick={addExpertise}
                        className="px-3 py-1 border border-dashed border-gray-400 text-gray-600 rounded-full text-sm flex items-center gap-1 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                        添加专长
                      </button>
                    </div>
                    {tabStatus.basic.hasErrors && expertiseList.length === 0 && (
                      <p className="text-red-500 text-xs mt-1">请至少选择一个专长领域</p>
                    )}
                  </div>

                  {/* 个人简介 */}
                  <div>
                    <Label className="text-sm font-medium text-[var(--text-secondary)]">个人简介 (将显示在工牌上)</Label>
                    <Textarea
                      rows={3}
                      className="mt-2 resize-none"
                      defaultValue="您好！我是智能销售顾问，专注于为您提供产品咨询、优惠活动介绍和售后服务支持。24小时在线，随时为您解答疑问，欢迎随时咨询！"
                    />
                    <p className="text-right text-xs text-[var(--text-tertiary)] mt-1">最多200字</p>
                  </div>
                </div>

                {/* 右侧：沟通风格 */}
                <div className="space-y-6">
                  {/* 沟通风格选择 */}
                  <div>
                    <Label className="text-sm font-medium text-[var(--text-secondary)]">沟通风格*</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {communicationStyles.map((style) => (
                        <label key={style.id} className={`relative block p-4 border rounded-lg cursor-pointer ${
                          selectedStyle === style.id
                            ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)]'
                            : 'bg-white border-[var(--border-primary)]'
                        }`}>
                          <input
                            type="radio"
                            name="style"
                            value={style.id}
                            checked={selectedStyle === style.id}
                            onChange={(e) => {
                              setSelectedStyle(e.target.value);
                              markFormDirty('basic');
                            }}
                            className="sr-only"
                          />
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">{style.name}</span>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{style.description}</p>
                          </div>
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedStyle === style.id
                              ? 'border-[var(--primary-color)]'
                              : 'border-[var(--border-primary)]'
                          }`}>
                            {selectedStyle === style.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]"></div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 高级风格调整 */}
                  <div>
                    <Label className="text-sm font-medium text-[var(--text-secondary)]">高级风格调整</Label>
                    <div className="space-y-3 mt-2">
                      {[
                        { label: '热情度', value: '中等', percentage: 50, range: ['冷静', '热情'] },
                        { label: '专业度', value: '高', percentage: 80, range: ['通俗', '专业'] },
                        { label: '直接度', value: '中等', percentage: 50, range: ['委婉', '直接'] },
                        { label: '正式度', value: '中高', percentage: 65, range: ['非正式', '正式'] },
                      ].map(({ label, value, percentage, range }) => (
                        <div key={label}>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[var(--text-secondary)]">{label}</span>
                            <span className="font-medium text-[var(--text-primary)]">{value}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[var(--primary-color)] h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)] mt-1">
                            <span>{range[0]}</span>
                            <span>{range[1]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
                </Card>
              </TabsContent>

              {/* 2. 工作时间配置 */}
              <TabsContent value="schedule" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">工作时间配置</h3>
                <span className="text-sm text-[var(--text-tertiary)]">必填项*</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                {/* 左侧：工作模式和时间设置 */}
                <div>
                  {/* 工作模式 */}
                  <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">工作模式*</h4>
                  <div className="space-y-3">
                    {workModes.map((mode) => (
                      <label key={mode.id} className={`relative block p-4 border rounded-lg cursor-pointer ${
                        selectedWorkMode === mode.id
                          ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)]'
                          : 'bg-white border-[var(--border-primary)]'
                      }`}>
                        <input
                          type="radio"
                          name="work-mode"
                          value={mode.id}
                          checked={selectedWorkMode === mode.id}
                          onChange={(e) => {
                            setSelectedWorkMode(e.target.value);
                            markFormDirty('schedule');
                          }}
                          className="sr-only"
                        />
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">{mode.name}</span>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{mode.description}</p>
                        </div>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedWorkMode === mode.id
                            ? 'border-[var(--primary-color)]'
                            : 'border-[var(--border-primary)]'
                        }`}>
                          {selectedWorkMode === mode.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* 自定义工作时间 */}
                  {selectedWorkMode === 'custom_time' && (
                    <div className="mt-4 pl-4 border-l-2 border-[var(--primary-color)]">
                      <h5 className="font-semibold text-[var(--text-primary)] mb-3">自定义工作时间</h5>

                      {/* 星期选择 */}
                      <div className="flex justify-between">
                        {weekDays.map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => setWeekActiveTab(key)}
                            className={`px-4 py-2 rounded-t-lg text-sm border-t border-x ${
                              weekActiveTab === key
                                ? 'bg-white border-b-0'
                                : 'bg-gray-100'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* 时间设置面板 */}
                      <div className="bg-white p-4 border rounded-b-lg">
                        <label className="flex items-center text-sm mb-3">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          工作日设置相同时间
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-[var(--text-secondary)]">开始时间</Label>
                            <Input type="time" defaultValue="09:00" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm text-[var(--text-secondary)]">结束时间</Label>
                            <Input type="time" defaultValue="18:00" className="mt-1" />
                          </div>
                        </div>
                      </div>

                      {/* 节假日设置 */}
                      <h5 className="font-semibold text-[var(--text-primary)] mb-3 mt-4">节假日设置</h5>
                      <label className="relative block p-4 border rounded-lg cursor-pointer bg-[var(--color-primary-50)] border-[var(--primary-color)]">
                        <input type="radio" name="holiday-mode" className="sr-only" defaultChecked />
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">遵循国家法定节假日</span>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">自动同步国家法定节假日安排</p>
                        </div>
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center border-[var(--primary-color)]">
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]"></div>
                        </div>
                      </label>

                      <div className="mt-3">
                        <Input
                          type="text"
                          placeholder="企业自定义节假日(可选)"
                          className="bg-gray-50"
                        />
                        <button className="w-full mt-2 p-2 border border-dashed border-gray-400 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                          + 添加自定义节假日
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 右侧：消息设置 */}
                <div className="space-y-6">
                  {/* 初次见面语 */}
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">初次见面语</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">新客户首次咨询时发送</p>
                    <Textarea
                      rows={3}
                      className="mt-2 resize-none"
                      defaultValue="您好！欢迎咨询智慧产品。我是智能销售顾问小智，很高兴为您服务。请问有什么可以帮助您的吗？"
                    />
                    <div className="flex justify-end items-center gap-3 text-sm mt-2">
                      <button className="text-[var(--primary-color)] hover:underline">添加变量</button>
                      <button className="text-[var(--primary-color)] hover:underline">添加素材</button>
                      <button className="text-[var(--text-secondary)] hover:underline">预览</button>
                    </div>
                  </div>

                  {/* 无回复提醒 */}
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">无回复提醒</h4>
                    <div className="mt-2 p-3 border rounded-lg">
                      <label className="flex items-center text-sm">
                        <input type="radio" name="reminder" className="mr-2" defaultChecked />
                        开启无回复提醒
                      </label>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 pl-5">客户多久未回复后发送提醒</p>
                      <Select defaultValue="5">
                        <SelectTrigger className="mt-2 bg-gray-50">
                          <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5分钟</SelectItem>
                          <SelectItem value="10">10分钟</SelectItem>
                          <SelectItem value="15">15分钟</SelectItem>
                          <SelectItem value="30">30分钟</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        rows={2}
                        className="mt-2 resize-none"
                        defaultValue="您好，看到您之前有咨询，请问还有什么可以帮助您的吗？如果您有任何问题，我随时都在哦~"
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-1">最多发送次数</p>
                      <Select defaultValue="1">
                        <SelectTrigger className="mt-2 bg-gray-50">
                          <SelectValue placeholder="选择次数" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1次</SelectItem>
                          <SelectItem value="2">2次</SelectItem>
                          <SelectItem value="3">3次</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 离线留言收集 */}
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">离线留言收集</h4>
                    <div className="mt-2 p-3 border rounded-lg">
                      <label className="flex items-center text-sm">
                        <input type="radio" name="offline-msg" className="mr-2" defaultChecked />
                        开启离线留言功能
                      </label>
                      <p className="text-xs text-[var(--text-secondary)] mt-2">离线提示语</p>
                      <Textarea
                        rows={2}
                        className="mt-2 resize-none"
                        defaultValue="您好，当前不在工作时间 (工作时间：周一至周五 9:00-18:00)。您可以留言，我们将在工作时间第一时间回复您。"
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-2">需要收集的信息</p>
                      <div className="space-y-1 mt-1 text-sm">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          姓名
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          联系方式 (电话/微信)
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          留言内容
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          公司名称
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          需求类型
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
                </Card>
              </TabsContent>

              {/* 3. 对话转接机制 */}
              <TabsContent value="handoff" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">对话转接机制</h3>
                <span className="text-sm text-[var(--text-tertiary)]">必填项*</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧：转接条件设置 */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">转接条件设置*</h4>
                  {handoffConditions.map((condition) => (
                    <label key={condition.id} className={`relative block p-4 border rounded-lg cursor-pointer ${
                      selectedHandoffConditions.includes(condition.id)
                        ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)]'
                        : 'bg-white border-[var(--border-primary)]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedHandoffConditions.includes(condition.id)}
                        onChange={() => toggleHandoffCondition(condition.id)}
                        className="sr-only"
                      />
                      <div>
                        <span className="font-semibold text-[var(--text-primary)]">{condition.name}</span>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{condition.description}</p>
                      </div>
                      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedHandoffConditions.includes(condition.id)
                          ? 'border-[var(--primary-color)]'
                          : 'border-[var(--border-primary)]'
                      }`}>
                        {selectedHandoffConditions.includes(condition.id) && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]"></div>
                        )}
                      </div>
                    </label>
                  ))}
                  <button className="w-full mt-2 p-2 border border-dashed border-gray-400 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                    + 添加自定义转接条件
                  </button>
                  {tabStatus.handoff.hasErrors && selectedHandoffConditions.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">请至少选择一个转接条件</p>
                  )}
                </div>

                {/* 中间：转接对象设置 */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">转接对象设置*</h4>
                  <Input
                    type="text"
                    defaultValue="销售团队"
                    className="bg-gray-50"
                    placeholder="团队名称"
                  />
                  <Input
                    type="text"
                    defaultValue="全部销售团队"
                    className="bg-gray-50"
                    placeholder="转接范围"
                  />
                  <Select defaultValue="round_robin">
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="选择分配方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">轮流分配</SelectItem>
                      <SelectItem value="load_balance">负载均衡</SelectItem>
                      <SelectItem value="skill_based">技能匹配</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    defaultValue="转接至团队其他成员"
                    className="bg-gray-50"
                    placeholder="备用转接规则"
                  />
                </div>

                {/* 右侧：转接语设置 */}
                <div className="space-y-6">
                  {/* 转接语设置 */}
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">转接语设置</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">转接前对客户的提示语</p>
                    <Textarea
                      rows={2}
                      className="mt-2 resize-none"
                      defaultValue="感谢您的咨询！我将为您转接至企业客户销售团队的同事，他们将为您提供更专业的服务，请稍候..."
                    />
                  </div>

                  {/* 转接超时设置 */}
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">转接超时提示语</p>
                    <Textarea
                      rows={2}
                      className="mt-2 resize-none"
                      defaultValue="抱歉，当前人工坐席正忙。您可以选择继续等待，或留下联系方式，我们将尽快与您联系。"
                    />
                    <p className="text-xs text-[var(--text-secondary)] mt-1">转接超时时间设置</p>
                    <Select defaultValue="30">
                      <SelectTrigger className="mt-1 bg-gray-50">
                        <SelectValue placeholder="选择超时时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30秒</SelectItem>
                        <SelectItem value="60">60秒</SelectItem>
                        <SelectItem value="90">90秒</SelectItem>
                        <SelectItem value="120">120秒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 人工接入后设置 */}
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">人工接入后设置</h4>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center text-sm">
                        <input type="radio" name="post-handoff" className="mr-2" defaultChecked />
                        继续辅助模式
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="radio" name="post-handoff" className="mr-2" />
                        完全退出
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="radio" name="post-handoff" className="mr-2" />
                        按需辅助
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
                </Card>
              </TabsContent>

              {/* 4. 销售策略编辑器 */}
              <TabsContent value="strategy" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">销售策略编辑器 (核心配置项)</h3>
              </div>

              {/* 策略管理头部 */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">现有销售策略</h4>
                <div>
                  <Button variant="outline" size="sm" className="text-sm px-4 py-1.5 mr-2">
                    保存为模板
                  </Button>
                  <Button size="sm" className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
                    新建策略
                  </Button>
                </div>
              </div>

              {/* 策略列表 */}
              <div className="space-y-4 mb-6">
                {/* 策略1 - 已启用 */}
                <div className="p-4 border-[var(--border-primary)] border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-[var(--text-primary)]">新注册用户转化策略</h5>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        针对新注册用户的7天跟进流程, 目标: 完成首单购买
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-200">新注册用户</span>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-200">首单转化</span>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-200">7天流程</span>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-200">自动化</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        已启用
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] mt-4">上次编辑: 2023-06-15</p>
                    </div>
                  </div>

                  {/* 策略流程展示 */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {/* 步骤1 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-[var(--border-primary)] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Inbox className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">发送欢迎消息与新人礼包</p>
                          <p className="text-xs text-[var(--text-secondary)]">触发后立即发送</p>
                        </div>
                        <div className="w-4 border-t-2 border-dashed border-[var(--border-primary)] mx-2"></div>
                      </div>

                      {/* 步骤2 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-[var(--border-primary)] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Inbox className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">产品功能介绍</p>
                          <p className="text-xs text-[var(--text-secondary)]">等待3天发送</p>
                        </div>
                        <div className="w-4 border-t-2 border-dashed border-[var(--border-primary)] mx-2"></div>
                      </div>

                      {/* 步骤3 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-[var(--border-primary)] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Inbox className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">发送首单优惠</p>
                          <p className="text-xs text-[var(--text-secondary)]">等待3天发送</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-x-4 text-sm font-medium text-[var(--primary-color)]">
                      <button className="hover:underline">编辑</button>
                      <button className="hover:underline">复制</button>
                      <button className="hover:underline">数据分析</button>
                    </div>
                  </div>
                </div>

                {/* 策略2 - 未启用 */}
                <div className="p-4 border-[var(--border-primary)] border rounded-lg bg-gray-50 text-[var(--text-secondary)]">
                  <h5 className="font-semibold text-[var(--text-primary)]">沉睡客户唤醒策略</h5>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    针对30天未活跃客户的唤醒流程, 目标: 重新激活
                  </p>
                </div>
              </div>

              {/* 策略编辑器 */}
              <div className="border-t pt-6">
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-4">策略编辑器</h4>
                <div className="p-4 border-[var(--border-primary)] border rounded-lg grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* 策略基本信息 */}
                  <div className="space-y-4">
                    <h5 className="font-semibold">策略基本信息</h5>
                    <Input type="text" placeholder="策略名称*" />
                    <Textarea
                      placeholder="策略描述"
                      rows={2}
                      className="resize-none"
                    />
                    <Input type="text" placeholder="目标客群*" defaultValue="新注册用户" />
                    <Input type="text" placeholder="转化目标*" defaultValue="预约演示" />
                    <Input type="text" placeholder="触发条件*" defaultValue="新线索进入" />
                  </div>

                  {/* 工作流程设计 */}
                  <div className="lg:col-span-2 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold mb-4">工作流程设计</h5>
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg border-2 border-[var(--primary-color)] shadow-sm text-center">
                        <p className="text-sm font-medium">发送个性化产品推荐</p>
                        <p className="text-xs text-[var(--text-secondary)]">根据浏览记录推荐相关产品</p>
                      </div>
                      <div className="text-center text-[var(--text-tertiary)]">
                        <ArrowDown className="w-4 h-4 mx-auto" />
                      </div>
                      <div className="p-3 bg-white rounded-lg border-[var(--border-primary)] border text-center">
                        <p className="text-sm font-medium">等待客户响应</p>
                        <p className="text-xs text-[var(--text-secondary)]">等待24小时</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                      <button className="text-sm py-2 bg-white border-[var(--border-primary)] border rounded hover:bg-gray-100">
                        发送消息
                      </button>
                      <button className="text-sm py-2 bg-white border-[var(--border-primary)] border rounded hover:bg-gray-100">
                        等待
                      </button>
                      <button className="text-sm py-2 bg-white border-[var(--border-primary)] border rounded hover:bg-gray-100">
                        条件判断
                      </button>
                      <button className="text-sm py-2 bg-white border-[var(--border-primary)] border rounded hover:bg-gray-100">
                        创建任务
                      </button>
                    </div>
                  </div>

                  {/* 内容库关联 */}
                  <div className="space-y-4">
                    <h5 className="font-semibold">内容库关联</h5>
                    <Input type="text" placeholder="选择话术模板..." />
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 border rounded-lg bg-[var(--color-primary-50)] text-[var(--primary-color)] text-sm">
                        图片
                      </button>
                      <button className="flex-1 py-1.5 border-[var(--border-primary)] border rounded-lg text-sm">视频</button>
                      <button className="flex-1 py-1.5 border-[var(--border-primary)] border rounded-lg text-sm">文档</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 h-24 bg-gray-100 p-2 rounded-lg">
                      <div className="bg-gray-300 rounded"></div>
                      <div className="bg-gray-300 rounded"></div>
                      <div className="bg-gray-300 rounded"></div>
                    </div>
                    <button className="text-sm text-[var(--primary-color)] hover:underline">+ 添加素材</button>
                  </div>
                </div>
              </div>

              {/* A/B测试和模板 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* A/B测试管理 */}
                <div className="p-4 border-[var(--border-primary)] border rounded-lg">
                  <h5 className="font-semibold mb-3">A/B测试管理</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">话术A/B测试</p>
                      <button className="mt-2 text-xs text-purple-600 hover:underline">创建话术测试</button>
                    </div>
                    <div className="text-center bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">流程A/B测试</p>
                      <button className="mt-2 text-xs text-purple-600 hover:underline">创建流程测试</button>
                    </div>
                    <div className="text-center bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">测试报告分析</p>
                      <button className="mt-2 text-xs text-green-600 hover:underline">查看测试报告</button>
                    </div>
                  </div>
                </div>

                {/* 策略模板库 */}
                <div className="p-4 border-[var(--border-primary)] border rounded-lg">
                  <h5 className="font-semibold mb-3">策略模板库</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">新客户7天转化模板</p>
                      <button className="mt-2 text-xs text-[var(--primary-color)] hover:underline">使用模板</button>
                    </div>
                    <div className="text-center bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">高价值客户跟进模板</p>
                      <button className="mt-2 text-xs text-[var(--primary-color)] hover:underline">使用模板</button>
                    </div>
                    <div className="text-center bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">电商促销活动模板</p>
                      <button className="mt-2 text-xs text-[var(--primary-color)] hover:underline">使用模板</button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* 底部操作栏 */}
            <div className="mt-8 sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6">
              <div className="flex justify-between items-center">
                {/* 左侧状态提示 */}
                <div className="flex items-center gap-2">
                  {isDirty ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600">有未保存的修改</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">未修改</span>
                    </>
                  )}
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex items-center gap-3">
                  {/* 导航按钮 */}
                  <div className="flex items-center gap-2 mr-2 md:mr-4">
                    {!isFirstTab && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentTabIndex > 0) {
                            handleTabChange(tabConfigs[currentTabIndex - 1].id);
                          }
                        }}
                      >
                        <span className="hidden sm:inline">← 上一步</span>
                        <span className="sm:hidden">←</span>
                      </Button>
                    )}
                    {!isLastTab && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentTabIndex < tabConfigs.length - 1) {
                            handleTabChange(tabConfigs[currentTabIndex + 1].id);
                          }
                        }}
                      >
                        <span className="hidden sm:inline">下一步 →</span>
                        <span className="sm:hidden">→</span>
                      </Button>
                    )}
                  </div>

                  {/* 保存操作按钮 */}
                  {isDirty ? (
                    <>
                      <Button variant="outline" onClick={() => setIsDirty(false)}>取消</Button>
                      <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
                        💾 保存配置
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled
                      className="bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      ⚪ 保存配置
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </div>
        <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default SalesAgentConfigPage;