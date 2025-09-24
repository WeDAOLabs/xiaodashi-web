'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProductInfo {
  name: string;
  subtitle: string;
  description: string;
  mainImages: FileList | null;
  detailImages: FileList | null;
  video: File | null;
}

interface ProductInfoFormProps {
  productInfo: ProductInfo;
  onInfoChange: (info: ProductInfo) => void;
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  productInfo,
  onInfoChange
}) => {
  const [showAiSuggestion] = useState(true);

  const handleInputChange = (field: keyof ProductInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onInfoChange({
      ...productInfo,
      [field]: e.target.value
    });
  };

  const handleFileChange = (field: 'mainImages' | 'detailImages' | 'video') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (field === 'video') {
      const file = e.target.files?.[0] || null;
      onInfoChange({
        ...productInfo,
        [field]: file
      });
    } else {
      const files = e.target.files;
      onInfoChange({
        ...productInfo,
        [field]: files
      });
    }
  };

  const handleAiOptimize = () => {
    // TODO: 实现AI优化标题功能
    console.log('AI优化标题');
  };

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          商品基础信息
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div>
                <Label htmlFor="productName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  商品名称
                </Label>
                <Input
                  id="productName"
                  placeholder="例如: 智能降噪蓝牙耳机"
                  value={productInfo.name}
                  onChange={handleInputChange('name')}
                  className="w-full"
                />
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={handleAiOptimize}
                  className="flex items-center text-xs font-semibold bg-[var(--color-primary-50)] text-[var(--primary-color)] border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition-colors px-3 py-1.5"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI优化标题
                </Button>
                {showAiSuggestion && (
                  <div className="mt-2 p-3 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg text-sm text-[var(--color-info-600)]">
                    <p><strong>AI建议:</strong> 独家优惠：优质 智能降噪蓝牙耳机，现享7折优惠！</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="productSubtitle" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                商品副标题
              </Label>
              <Input
                id="productSubtitle"
                placeholder="一句话亮点"
                value={productInfo.subtitle}
                onChange={handleInputChange('subtitle')}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              商品描述 (富文本)
            </Label>
            <div className="w-full h-40 p-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-sm focus-within:ring-1 focus-within:ring-[var(--primary-color)] focus-within:border-[var(--primary-color)]">
              <Textarea
                className="w-full h-full border-none focus:ring-0 resize-none text-sm"
                placeholder="输入商品详情..."
                value={productInfo.description}
                onChange={handleInputChange('description')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="mainImages" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                商品主图
              </Label>
              <Input
                id="mainImages"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange('mainImages')}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="detailImages" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                商品详情图
              </Label>
              <Input
                id="detailImages"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange('detailImages')}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="video" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                商品演示视频
              </Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange('video')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfoForm;