'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useIPCreation } from '../IPCreationContext';

export default function Step1Form() {
  const { data, dispatch, nextStep } = useIPCreation();
  const [newKeyword, setNewKeyword] = useState('');

  const handleIPNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'ipName', value: e.target.value });
  };

  const handleIPTypeChange = (value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'ipType', value });
  };

  const handleCoreSellingPointChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'coreSellingPoint', value: e.target.value });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !data.keywords.includes(newKeyword.trim())) {
      dispatch({ type: 'ADD_KEYWORD', keyword: newKeyword.trim() });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    dispatch({ type: 'REMOVE_KEYWORD', index });
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleNext = () => {
    if (data.ipName && data.ipType) {
      nextStep();
    }
  };

  const isFormValid = data.ipName.trim() && data.ipType;

  return (
    <div className="space-y-6">
      {/* IP名称和类型 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ip-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            IP名称 <span className="text-red-500">*</span>
          </label>
          <input
            id="ip-name"
            type="text"
            value={data.ipName}
            onChange={handleIPNameChange}
            className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
            placeholder="输入IP名称"
          />
        </div>

        <div>
          <label htmlFor="ip-type" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            IP类型 <span className="text-red-500">*</span>
          </label>
          <Select value={data.ipType} onValueChange={handleIPTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择IP类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="virtual-character">虚拟形象</SelectItem>
              <SelectItem value="spiritual-symbol">精神符号</SelectItem>
              <SelectItem value="story-framework">故事框架</SelectItem>
              <SelectItem value="cultural-symbol">文化符号</SelectItem>
              <SelectItem value="personal-brand">个人品牌</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* IP关键词 */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          IP关键词
        </label>
        <div className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary-color-focus-ring)] focus-within:border-[var(--primary-color)] transition">
          <div className="flex flex-wrap items-center gap-2">
            {data.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-semibold px-2 py-1 rounded-full"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="focus:outline-none hover:bg-[var(--primary-color)]/20 rounded-full p-0.5"
                  aria-label={`删除关键词 ${keyword}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeywordKeyPress}
              className="flex-grow bg-transparent focus:outline-none min-w-[120px]"
              placeholder="添加关键词..."
            />
          </div>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          按回车键添加关键词，点击标签删除
        </p>
      </div>

      {/* 核心卖点 */}
      <div>
        <label htmlFor="core-selling-point" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          核心卖点 (一句话)
        </label>
        <Textarea
          id="core-selling-point"
          rows={4}
          value={data.coreSellingPoint}
          onChange={handleCoreSellingPointChange}
          placeholder="用一句话描述IP最吸引人的地方"
          className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4 pt-4">
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
  );
}