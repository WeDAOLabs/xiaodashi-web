'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Upload, X } from 'lucide-react';
import { useIPCreation } from '../IPCreationContext';

export default function Step3Form() {
  const { data, dispatch, nextStep, prevStep } = useIPCreation();

  const handlePersonalityTraitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'personalityTraits', value: e.target.value });
  };

  const handleNext = () => {
    if (data.personalityTraits.trim()) {
      nextStep();
    }
  };

  const isFormValid = data.personalityTraits.trim();

  return (
    <div className="space-y-8">
      {/* IP形象草图与迭代 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">IP形象草图与迭代</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI优化建议
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              生成更多形象草图
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <Alert className="mb-4 bg-[var(--info-bg)] border-[var(--info-border)] text-[var(--info-color)]">
            <Sparkles className="w-4 h-4" />
            <AlertDescription className="text-sm">
              <strong className="font-semibold">AI优化建议：</strong>
              此形象在Z世代中可能缺乏亲和力，建议调整色彩或面部特征。可以尝试更明亮、饱和度更高的配色方案，并简化线条，增加一些可爱的表情符号元素。
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {/* 示例图片占位符 */}
            <div className="relative group aspect-square">
              <div className="w-full h-full bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] flex items-center justify-center">
                <div className="text-center text-[var(--text-secondary)]">
                  <Upload className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">草图1</p>
                </div>
              </div>
              <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="relative group aspect-square">
              <div className="w-full h-full bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] flex items-center justify-center">
                <div className="text-center text-[var(--text-secondary)]">
                  <Upload className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">草图2</p>
                </div>
              </div>
              <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-8 text-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition">
            <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)]" />
            <p className="text-[var(--text-secondary)]">点击或拖拽图片到此区域上传</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">支持 JPG, PNG, GIF</p>
          </div>
        </CardContent>
      </Card>

      {/* IP人格化设定 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">IP人格化设定</h3>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="personality-traits" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              人格特征描述 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="personality-traits"
              rows={4}
              value={data.personalityTraits}
              onChange={handlePersonalityTraitsChange}
              placeholder="例如：活泼、沉稳、幽默、专业。描述IP的性格特点、说话方式、行为习惯等..."
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
            />
          </div>

          <div className="mt-4 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-md">
            <h4 className="font-bold text-sm text-[var(--success-color)] mb-2">人格化建议</h4>
            <div className="text-sm text-[var(--text-secondary)] space-y-2">
              <p><strong>性格维度：</strong> 建议从外向/内向、感性/理性、严肃/幽默等维度定义</p>
              <p><strong>语言风格：</strong> 考虑使用特定的口头禅、语气词或表达方式</p>
              <p><strong>行为特征：</strong> 定义在不同场景下的反应模式和行为习惯</p>
              <p><strong>价值观念：</strong> 明确IP所代表的核心价值观和立场</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 视觉设计指南 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">视觉设计指南</h3>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-2">色彩搭配</h4>
              <div className="flex gap-2">
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-2">设计风格</h4>
              <div className="flex flex-wrap gap-2">
                {['简约', '可爱', '科技感', '手绘风', '3D建模'].map((style) => (
                  <span
                    key={style}
                    className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded-full cursor-pointer hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)] transition-colors"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
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