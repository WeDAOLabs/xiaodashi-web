import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Edit,
  FileText,
  Handshake,
  Shield,
  Brush,
  MoreHorizontal,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import { IPAsset } from '../types';

interface CurrentIPCardProps {
  ipAsset: IPAsset | null;
  onEdit?: () => void;
  onGeneratePlan?: () => void;
  onInitiateLicensing?: () => void;
  onLegalSupport?: () => void;
  onContentCreation?: () => void;
  onMoreActions?: () => void;
}

const CurrentIPCard: React.FC<CurrentIPCardProps> = ({
  ipAsset,
  onEdit,
  onGeneratePlan,
  onInitiateLicensing,
  onLegalSupport,
  onContentCreation,
  onMoreActions
}) => {
  if (!ipAsset) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24 text-[var(--text-secondary)]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-2">
                <div className="text-[var(--color-primary-500)] font-bold">IP</div>
              </div>
              <p>暂无选中的IP资产</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  return (
    <Card className="relative group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* 左侧IP信息 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={ipAsset.avatar}
                alt={ipAsset.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== '/images/ip/default.jpg') {
                    target.src = '/images/ip/default.jpg';
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{ipAsset.name}</h2>
                <Badge className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(ipAsset.status)}`}>
                  {getStatusText(ipAsset.status)}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 text-yellow-500">⭐</div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{ipAsset.rating}分</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <span>类型:</span>
                  <span className="font-medium">{ipAsset.category}</span>
                </span>
                {ipAsset.description && (
                  <span className="flex items-center gap-1">
                    <span>描述:</span>
                    <span className="font-medium">{ipAsset.description}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右侧快捷操作按钮 */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">编辑信息</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onGeneratePlan}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">生成计划书</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onInitiateLicensing}
            >
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">发起授权</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onLegalSupport}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">法律支持</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onContentCreation}
            >
              <Brush className="w-4 h-4" />
              <span className="hidden sm:inline">联动创作</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-3"
              onClick={onMoreActions}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">更多</span>
            </Button>
          </div>
        </div>

        {/* 底部联系方式 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-secondary)]">
          <div className="text-sm text-[var(--text-secondary)]">
            快速联系相关负责人
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
              title="发送消息"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
              title="发送邮件"
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
              title="拨打电话"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentIPCard;