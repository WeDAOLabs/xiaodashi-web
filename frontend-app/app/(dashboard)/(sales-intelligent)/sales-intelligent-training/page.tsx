'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Edit,
  Copy,
  Trash2,
  Send,
  Smile,
  Image as ImageIcon,
  Mic,
  ThumbsUp,
  Lightbulb,
} from 'lucide-react';

// 场景数据类型定义
interface ScenarioData {
  id: string;
  title: string;
  description: string;
  practiceCount: number;
  avgRating: number;
  selected?: boolean;
}

// 消息数据类型定义
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  avatar: string;
}

// AI客户设置类型定义
interface AICustomerSettings {
  personality: string;
  communicationStyle: string;
  knowledgeLevel: number[];
}

// 场景选择组件
const ScenarioSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部场景');

  const scenarios: ScenarioData[] = [
    {
      id: '1',
      title: '新客户初次接触',
      description: '与潜在客户首次电话接触，建立初步联系',
      practiceCount: 128,
      avgRating: 4.2,
      selected: true,
    },
    {
      id: '2',
      title: '需求挖掘与痛点分析',
      description: '深入了解客户需求和痛点，提供针对性解决方案',
      practiceCount: 96,
      avgRating: 3.8,
    },
    {
      id: '3',
      title: '价格异议处理',
      description: '客户对价格提出异议，如何有效回应并强调价值',
      practiceCount: 156,
      avgRating: 3.5,
    },
    {
      id: '4',
      title: '竞品对比与优势呈现',
      description: '客户提及竞争对手产品，如何巧妙回应',
      practiceCount: 72,
      avgRating: 4.0,
    },
  ];

  const categories = ['全部场景', '初次接触', '需求挖掘', '异议处理'];

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">模拟对话场景选择</h3>
          <Badge className="bg-blue-100 text-blue-700 text-xs font-semibold">
            {scenarios.length}个场景
          </Badge>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <Input
            type="text"
            placeholder="搜索场景..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
          />
        </div>

        <div className="flex gap-2 text-sm mb-3 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                scenario.selected
                  ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)]'
                  : 'bg-[var(--bg-primary)] border-transparent hover:border-[var(--border-primary)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">{scenario.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{scenario.description}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Edit className="w-4 h-4 text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--primary-color)]" />
                  <Copy className="w-4 h-4 text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--primary-color)]" />
                  <Trash2 className="w-4 h-4 text-[var(--text-tertiary)] cursor-pointer hover:text-red-500" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-[var(--text-secondary)]">
                <span>练习次数: {scenario.practiceCount}</span>
                <span>平均评分: {scenario.avgRating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// AI客户设置组件
const AICustomerSettings: React.FC = () => {
  const [settings, setSettings] = useState<AICustomerSettings>({
    personality: '友善型',
    communicationStyle: '',
    knowledgeLevel: [25],
  });

  const personalities = ['友善型', '谨慎型', '挑战型', '果断型'];
  const communicationStyles = ['直接型', '分析型', '关系型', '表达型'];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-4">AI客户设置</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">客户性格</h4>
            <div className="flex flex-wrap gap-2">
              {personalities.map((personality) => (
                <button
                  key={personality}
                  onClick={() => setSettings({...settings, personality})}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    settings.personality === personality
                      ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)] text-[var(--primary-color)] font-semibold'
                      : 'bg-[var(--bg-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {personality}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">沟通风格</h4>
            <div className="flex flex-wrap gap-2">
              {communicationStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSettings({...settings, communicationStyle: style})}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    settings.communicationStyle === style
                      ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)] text-[var(--primary-color)] font-semibold'
                      : 'bg-[var(--bg-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">产品知识水平</h4>
            <Slider
              value={settings.knowledgeLevel}
              onValueChange={(value) => setSettings({...settings, knowledgeLevel: value})}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>初级</span>
              <span>专家</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[var(--primary-color)] text-white font-semibold py-3 rounded-lg mt-6 hover:bg-[var(--primary-hover)]">
          开始练习
        </Button>
      </CardContent>
    </Card>
  );
};

// 聊天界面组件
const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      content: '您好，哪位？我现在有点忙，有什么事请尽快说。',
      sender: 'ai',
      timestamp: '10:23',
      avatar: '/images/avatars/ai-customer.jpg',
    },
    {
      id: '2',
      content: '王经理您好，我是智赢科技的张经理，抱歉打扰您。我们是专注于企业数字化转型的解决方案提供商，了解到贵公司正在推进信息化建设，想简单和您介绍一下我们的产品如何帮助类似企业提升效率。',
      sender: 'user',
      timestamp: '10:24',
      avatar: '/images/avatars/sales-trainer.jpg',
    },
    {
      id: '3',
      content: '哦，智赢科技是吧？我们确实在看一些解决方案，但现在接触的供应商也不少了。你们有什么特别的优势吗？如果只是常规的产品介绍，我建议你先把资料发邮件给我，我有空会看的。',
      sender: 'ai',
      timestamp: '10:25',
      avatar: '/images/avatars/ai-customer.jpg',
    },
    {
      id: '4',
      content: '明白您的时间宝贵，王经理。我们的核心优势在于能提供行业定制化的解决方案，而不是标准化产品。比如我们最近常与贵公司规模相似的XX企业实现了采购流程自动化，平均缩短了30%的采购周期，同时降低了15%的采购成本。我只需要2分钟简单介绍下这个方案的核心思路，如果您觉得有兴趣，我们再发详细资料给您深入了解，您看可以吗？',
      sender: 'user',
      timestamp: '10:26',
      avatar: '/images/avatars/sales-trainer.jpg',
    },
    {
      id: '5',
      content: 'XX企业？我知道他们。你们是怎么做到的？不过我确实只有几分钟时间。',
      sender: 'ai',
      timestamp: '10:27',
      avatar: '/images/avatars/ai-customer.jpg',
    },
  ];

  const quickReplies = ['突出ROI和成功案例', '请求简短会议时间', '快捷回复：', '案例介绍', '预约演示'];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // 这里可以添加发送消息的逻辑
      setInputMessage('');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center border-b border-[var(--border-primary)] pb-4">
          <h3 className="font-bold text-lg">新客户初次接触</h3>
        </div>

        <div className="flex-1 bg-[var(--bg-secondary)] p-4 overflow-y-auto mt-4 rounded-lg">
          <div className="text-center text-sm text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-full px-4 py-2 inline-block mb-4">
            欢迎使用销售陪练功能！您已选择&ldquo;新客户初次接触&rdquo;场景，系统将为您模拟一位潜在客户。提示：尝试先自我介绍，然后简明扼要地说明致电目的
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Image
                  src={message.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div
                  className={`p-3 rounded-lg max-w-md ${
                    message.sender === 'user'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                      : 'bg-[var(--primary-color)] text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-[var(--text-tertiary)]'
                        : 'text-white opacity-70'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center my-4">
            <span className="text-[var(--text-tertiary)] text-xs">...</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="请输入您的回复..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12 py-3 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
            />
            <Button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--primary-color)] text-white rounded-full p-2 hover:bg-[var(--primary-hover)]"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <span className="text-sm">AI建议：</span>
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="px-3 py-1 text-xs bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--border-primary)] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
              <Smile className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
              <ImageIcon className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
              <Mic className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 实时反馈组件
const RealtimeFeedback: React.FC = () => {
  const skillScores = [
    { name: '开场白', score: 4.2, percentage: 84 },
    { name: '需求挖掘', score: 3.8, percentage: 76 },
    { name: '价值呈现', score: 4.8, percentage: 96 },
    { name: '异议处理', score: 4.5, percentage: 90 },
    { name: '促成技巧', score: 3.5, percentage: 70 },
  ];

  const feedbackItems = [
    {
      type: 'positive',
      message: '很好地引用了相似企业的成功案例，增强了说服力',
      icon: <ThumbsUp className="w-4 h-4" />,
    },
    {
      type: 'suggestion',
      message: '可以尝试更询问客户是否有特定痛点或需求，以便更精准地调整介绍重点',
      icon: <Lightbulb className="w-4 h-4" />,
    },
  ];

  const keyPoints = [
    '客户：王经理，采购经理',
    '当前状态：已有供应商接触',
    '已提及的价值点：采购流程自动化, 缩短30%采购周期, 降低15%采购成本',
    '客户兴趣点：行业定制化解决方案, 成功案例',
  ];

  const nextSteps = [
    '简要介绍XX企业案例的核心解决方案',
    '询问客户当前采购流程中遇到的主要挑战',
    '建议安排15分钟的简短演示，展示系统如何解决这些挑战',
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">实时评分与反馈</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">基于您的对话表现，系统实时分析并提供反馈</p>

        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">当前评分</h4>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-bold text-2xl text-[var(--primary-color)]">4.5<span className="text-lg text-[var(--text-secondary)]">/5.0</span></span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
              <div className="bg-[var(--primary-color)] h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">技能维度评分</h4>
            <div className="space-y-3">
              {skillScores.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span className="font-medium">{skill.score}</span>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5">
                    <div
                      className="bg-[var(--primary-color)] h-1.5 rounded-full"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">实时反馈</h4>
            <div className="space-y-2">
              {feedbackItems.map((feedback, index) => (
                <div
                  key={index}
                  className={`flex items-start p-3 rounded-lg ${
                    feedback.type === 'positive'
                      ? 'bg-[var(--color-success-50)] border border-[var(--color-success-100)]'
                      : 'bg-[var(--color-warning-50)] border border-[var(--color-warning-100)]'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      feedback.type === 'positive'
                        ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]'
                        : 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]'
                    }`}
                  >
                    {feedback.icon}
                  </div>
                  <p
                    className={`text-sm ${
                      feedback.type === 'positive'
                        ? 'text-[var(--color-success-600)]'
                        : 'text-[var(--color-warning-600)]'
                    }`}
                  >
                    {feedback.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">对话要点提取</h4>
            <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">下一步建议</h4>
            <ol className="list-decimal pl-5 text-sm text-[var(--text-secondary)] space-y-1">
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 主页面组件
const SalesTrainingPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="销售陪练"
      description="为销售人员提供一个实时的、互动式的模拟训练环境，帮助他们提升销售技能，熟悉各类客户场景应对策略"
      breadcrumbs={[
        { label: '智能销售赋能', href: '#' },
        { label: '销售陪练', href: '/sales-intelligent-training', current: true }
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧栏 - 场景选择和AI设置 */}
        <div className="lg:w-[30%] flex-shrink-0 space-y-6">
          <ScenarioSelector />
          <AICustomerSettings />
        </div>

        {/* 中间栏 - 对话界面 */}
        <div className="flex-1">
          <ChatInterface />
        </div>

        {/* 右侧栏 - 实时反馈 */}
        <div className="lg:w-[25%] flex-shrink-0">
          <RealtimeFeedback />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default SalesTrainingPage;