import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown, Plus } from 'lucide-react';
import { BaseTabProps, CampaignData } from './types';

const CampaignManagementTab: React.FC<BaseTabProps> = () => {
  // 状态管理
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>(['advertiser-1', 'advertiser-2']);

  // 示例数据
  const campaignData: CampaignData[] = [
    {
      id: 'advertiser-1',
      name: '夏季大促-广告主A',
      type: 'advertiser',
      status: 'active',
      budget: 50000,
      todaySpend: 12000,
      impressions: 800000,
      clicks: 4000,
      conversions: 200,
      roi: 4.5,
      children: [
        {
          id: 'campaign-1',
          name: '主线-新品推广',
          parentId: 'advertiser-1',
          type: 'campaign',
          aiStatus: 'high-potential',
          status: 'active',
          budget: 30000,
          todaySpend: 8000,
          impressions: 500000,
          clicks: 2500,
          conversions: 150,
          roi: 5.0
        },
        {
          id: 'campaign-2',
          name: '辅线-日常拉新',
          parentId: 'advertiser-1',
          type: 'campaign',
          aiStatus: 'low-efficiency',
          status: 'paused',
          budget: 20000,
          todaySpend: 4000,
          impressions: 300000,
          clicks: 1500,
          conversions: 50,
          roi: 3.0
        }
      ]
    },
    {
      id: 'advertiser-2',
      name: '品牌宣传-广告主B',
      type: 'advertiser',
      status: 'active',
      budget: 100000,
      todaySpend: 25000,
      impressions: 1500000,
      clicks: 6000,
      conversions: 180,
      roi: 3.8,
      children: [
        {
          id: 'campaign-3',
          name: '明星同款系列',
          parentId: 'advertiser-2',
          type: 'campaign',
          aiStatus: 'optimization-needed',
          status: 'active',
          budget: 70000,
          todaySpend: 20000,
          impressions: 1200000,
          clicks: 5000,
          conversions: 160,
          roi: 4.2
        },
        {
          id: 'campaign-4',
          name: '节日限定活动',
          parentId: 'advertiser-2',
          type: 'campaign',
          aiStatus: 'budget-warning',
          status: 'ended',
          budget: 30000,
          todaySpend: 5000,
          impressions: 300000,
          clicks: 1000,
          conversions: 20,
          roi: 2.5
        }
      ]
    }
  ];

  // 工具函数
  const handleItemSelection = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleExpandAll = () => {
    const allAdvertiserIds = campaignData.map(item => item.id);
    setExpandedItems(allAdvertiserIds);
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };

  const getAIStatusBadge = (status?: string) => {
    switch (status) {
      case 'high-potential':
        return (
          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)]">
            高潜计划
          </Badge>
        );
      case 'low-efficiency':
        return (
          <Badge className="bg-[var(--color-error-50)] text-[var(--color-error-600)]">
            低效计划
          </Badge>
        );
      case 'optimization-needed':
        return (
          <Badge className="bg-[var(--color-info-50)] text-[var(--color-info-600)]">
            待优化
          </Badge>
        );
      case 'budget-warning':
        return (
          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)]">
            预算预警
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'paused':
        return '已暂停';
      case 'ended':
        return '已结束';
      default:
        return status;
    }
  };

  // 渲染子计划行
  const renderCampaignRow = (campaign: CampaignData) => (
    <div key={campaign.id} className="border-b border-[var(--border-secondary)] last:border-b-0">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center">
        <div className="col-span-3 flex items-center">
          <input
            type="checkbox"
            checked={selectedItems.includes(campaign.id)}
            onChange={(e) => handleItemSelection(campaign.id, e.target.checked)}
            className="h-4 w-4 mr-3 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
          />
          <div className="ml-6">
            <p className="font-medium text-[var(--text-primary)]">{campaign.name}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{campaign.id}</p>
          </div>
        </div>

        <div className="col-span-1">
          {getAIStatusBadge(campaign.aiStatus)}
        </div>

        <div className="col-span-1 text-[var(--text-secondary)]">
          {getStatusText(campaign.status)}
        </div>

        <div className="col-span-1 text-right text-[var(--text-secondary)]">
          {campaign.budget.toLocaleString()}
        </div>

        <div className="col-span-1 text-right text-[var(--text-secondary)]">
          {campaign.todaySpend.toLocaleString()}
        </div>

        <div className="col-span-1 text-right text-[var(--text-secondary)]">
          {campaign.impressions.toLocaleString()}
        </div>

        <div className="col-span-1 text-right text-[var(--text-secondary)]">
          {campaign.clicks.toLocaleString()}
        </div>

        <div className="col-span-1 text-right text-[var(--text-secondary)]">
          {campaign.conversions.toLocaleString()}
        </div>

        <div className="col-span-1 text-right">
          <span className="font-semibold text-[var(--text-primary)]">
            {campaign.roi.toFixed(1)}
          </span>
        </div>

        <div className="col-span-1 text-center">
          <span className="text-[var(--primary-color)] hover:underline cursor-pointer">
            查看/编辑
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">投放计划列表</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="flex items-center gap-2"
            >
              全部展开
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollapseAll}
              className="flex items-center gap-2"
            >
              全部折叠
            </Button>
            <Button variant="outline">
              批量操作
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建计划
            </Button>
          </div>
        </div>

        {/* 表格头部 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--bg-secondary)] text-sm font-medium text-[var(--text-secondary)] border-b border-[var(--border-primary)]">
          <div className="col-span-3">计划/广告组</div>
          <div className="col-span-1">AI状态</div>
          <div className="col-span-1">状态</div>
          <div className="col-span-1 text-right">预算</div>
          <div className="col-span-1 text-right">今日花费</div>
          <div className="col-span-1 text-right">曝光</div>
          <div className="col-span-1 text-right">点击</div>
          <div className="col-span-1 text-right">转化</div>
          <div className="col-span-1 text-right">ROI</div>
          <div className="col-span-1 text-center">操作</div>
        </div>

        {/* 折叠内容 */}
        <Accordion
          type="multiple"
          value={expandedItems}
          onValueChange={setExpandedItems}
          className="border-0"
        >
          {campaignData.map((advertiser) => (
            <AccordionItem
              key={advertiser.id}
              value={advertiser.id}
              className="border-0"
            >
              <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center w-full border-b border-[var(--border-secondary)]">
                  <div className="col-span-3 flex items-center">
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${expandedItems.includes(advertiser.id) ? 'rotate-0' : '-rotate-90'}`} />
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(advertiser.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleItemSelection(advertiser.id, e.target.checked);
                      }}
                      className="h-4 w-4 mr-3 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{advertiser.name}</p>
                    </div>
                  </div>

                  <div className="col-span-1"></div>

                  <div className="col-span-1 text-[var(--text-secondary)]">
                    {getStatusText(advertiser.status)}
                  </div>

                  <div className="col-span-1 text-right text-[var(--text-secondary)]">
                    {advertiser.budget.toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right text-[var(--text-secondary)]">
                    {advertiser.todaySpend.toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right text-[var(--text-secondary)]">
                    {advertiser.impressions.toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right text-[var(--text-secondary)]">
                    {advertiser.clicks.toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right text-[var(--text-secondary)]">
                    {advertiser.conversions.toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {advertiser.roi.toFixed(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-center">
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="text-[var(--primary-color)] hover:underline cursor-pointer"
                    >
                      查看/编辑
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0">
                <div className="bg-[var(--bg-tertiary)]">
                  {advertiser.children?.map((campaign) => renderCampaignRow(campaign))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default CampaignManagementTab;