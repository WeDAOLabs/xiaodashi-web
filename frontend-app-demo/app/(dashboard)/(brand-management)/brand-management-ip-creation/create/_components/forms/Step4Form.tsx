'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileText } from 'lucide-react';
import { useIPCreation } from '../IPCreationContext';

export default function Step4Form() {
  const { data, dispatch, nextStep, prevStep } = useIPCreation();

  const handleCoreStorylineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'coreStoryline', value: e.target.value });
  };

  const handleContentExamplesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'contentExamples', value: e.target.value });
  };

  const handleNext = () => {
    if (data.coreStoryline.trim()) {
      nextStep();
    }
  };

  const isFormValid = data.coreStoryline.trim();

  return (
    <div className="space-y-8">
      {/* 核心故事线/内容主题 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">核心故事线/内容主题</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI故事创意
          </Button>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="core-storyline" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              构建IP的核心故事线或内容主题框架 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="core-storyline"
              rows={6}
              value={data.coreStoryline}
              onChange={handleCoreStorylineChange}
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
              placeholder="描述IP的背景故事、成长历程、冒险经历或日常生活..."
            />
          </div>

          <div className="mt-4 p-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-md text-sm text-[var(--info-color)] whitespace-pre-wrap">
            <h4 className="font-bold mb-2">AI 故事创意</h4>
            根据&apos;{data.ipName}&apos;的设定，可以尝试以下故事方向：
            {'\n'}1. **起源故事：** 探索&apos;{data.ipName}&apos;是如何诞生的，它来自哪里，有什么样的使命。
            {'\n'}2. **冒险系列：** &apos;{data.ipName}&apos;与朋友们一起解决赛博都市中的各种难题，每一次冒险都凸显其{data.keywords.join('、')}的特质。
            {'\n'}3. **日常互动：** 通过四格漫画或短视频，展现&apos;{data.ipName}&apos;在日常生活中的有趣瞬间，拉近与粉丝的距离。
          </div>
        </CardContent>
      </Card>

      {/* AI文案/脚本辅助 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">AI文案/脚本辅助</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI生成内容
          </Button>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="content-examples" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              AI可辅助生成推广文案、短视频脚本、社交媒体互动内容等草稿
            </label>
            <Textarea
              id="content-examples"
              rows={6}
              value={data.contentExamples}
              onChange={handleContentExamplesChange}
              placeholder="点击&quot;AI生成内容&quot;以获取草稿..."
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
            />
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            提示：点击 &quot;AI生成内容&quot; 将跳转至&quot;智能内容创作与素材中心&quot;的文案生成功能，并携带当前IP相关信息。
          </p>
        </CardContent>
      </Card>

      {/* 内容类型规划 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">内容类型规划</h3>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: '短视频', platform: '抖音/B站', description: '1-3分钟趣味内容' },
              { type: '四格漫画', platform: '微博/小红书', description: '日常生活片段' },
              { type: '表情包', platform: '微信/QQ', description: '情感表达工具' },
              { type: '长篇故事', platform: 'B站/公众号', description: '深度世界观构建' },
              { type: '直播互动', platform: '抖音/B站', description: '实时粉丝互动' },
              { type: '衍生商品', platform: '电商平台', description: '周边产品展示' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 bg-white border border-[var(--border-primary)] rounded-md hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[var(--text-primary)]">{item.type}</h4>
                  <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-1">{item.platform}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 内容发布时间表 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">内容发布时间表</h3>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[
              { week: '第1周', content: '发布起源故事漫画，建立世界观' },
              { week: '第2周', content: '短视频介绍IP人格特征和日常' },
              { week: '第3周', content: '表情包发布，增加传播度' },
              { week: '第4周', content: '直播互动，收集粉丝反馈' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-md">
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="text-sm font-medium text-[var(--primary-color)]">{item.week}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
        >
          上一步
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => console.log('保存当前步骤')}
          >
            保存
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
          >
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
}