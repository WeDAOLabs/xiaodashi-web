import React from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Star, Check } from 'lucide-react';
import { IPAsset } from '../types';

interface IPSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ipAssets: IPAsset[];
  selectedIP: IPAsset | null;
  onSelectIP: (ip: IPAsset) => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

const IPSelectionSheet: React.FC<IPSelectionSheetProps> = ({
  isOpen,
  onClose,
  ipAssets,
  selectedIP,
  onSelectIP,
  searchKeyword,
  onSearchChange
}) => {
  // 过滤IP资产
  const filteredAssets = ipAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'incubating':
        return 'bg-blue-100 text-blue-800';
      case 'authorized':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'incubating':
        return '孵化中';
      case 'authorized':
        return '已授权';
      case 'pending':
        return '待评估';
      default:
        return '未知';
    }
  };

  const handleSelectIP = (ip: IPAsset) => {
    onSelectIP(ip);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>IP资产库</SheetTitle>
          <SheetDescription>
            选择要分析的IP资产，查看其商业化潜力和评估报告
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 py-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <Input
              placeholder="搜索IP资产..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* IP资产列表 */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <p>未找到匹配的IP资产</p>
                <p className="text-sm mt-1">尝试使用不同的关键词搜索</p>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedIP?.id === asset.id;

                return (
                  <div
                    key={asset.id}
                    className={`
                      relative p-6 rounded-lg border cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'bg-[var(--color-primary-50)] border-[var(--color-primary-500)] shadow-md'
                        : 'bg-[var(--bg-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-secondary)]'
                      }
                    `}
                    onClick={() => handleSelectIP(asset)}
                  >
                    {/* 选中状态指示器 */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-5">
                      {/* IP头像 */}
                      <div className="relative flex-shrink-0">
                        <Image
                          src={asset.avatar}
                          alt={asset.name}
                          width={72}
                          height={72}
                          className="w-[72px] h-[72px] rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== '/images/ip/default.jpg') {
                              target.src = '/images/ip/default.jpg';
                            }
                          }}
                        />
                      </div>

                      {/* IP信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`font-bold text-lg truncate ${
                            isSelected ? 'text-[var(--color-primary-700)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {asset.name}
                          </h4>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                          {asset.category}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* 评分 */}
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {asset.rating}
                              </span>
                            </div>

                            {/* 状态标签 */}
                            <Badge className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(asset.status)}`}>
                              {getStatusText(asset.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* 描述信息 */}
                        {asset.description && (
                          <p className="text-xs text-[var(--text-tertiary)] mt-2 line-clamp-2">
                            {asset.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 底部操作区 */}
          <div className="pt-6 border-t border-[var(--border-secondary)]">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>共 {filteredAssets.length} 个IP资产</span>
              <Button variant="outline" size="sm" onClick={onClose}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IPSelectionSheet;