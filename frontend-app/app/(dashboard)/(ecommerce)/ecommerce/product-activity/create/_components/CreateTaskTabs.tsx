'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityPublishTab from './ActivityPublishTab';
import ProductPublishTab from './ProductPublishTab';
import PublishSidebar from './PublishSidebar';
import type { TaskType } from '../page';

interface CreateTaskTabsProps {
  currentTab: TaskType;
  onTabChange: (tab: TaskType) => void;
}

const CreateTaskTabs: React.FC<CreateTaskTabsProps> = ({
  currentTab,
  onTabChange
}) => {
  return (
    <div className="flex gap-6">
      <div className="flex-grow">
        <Tabs value={currentTab} onValueChange={(value) => onTabChange(value as TaskType)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="activity" className="text-sm font-medium">
              活动发布
            </TabsTrigger>
            <TabsTrigger value="product" className="text-sm font-medium">
              商品发布
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6 mt-0">
            <ActivityPublishTab />
          </TabsContent>

          <TabsContent value="product" className="space-y-6 mt-0">
            <ProductPublishTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* 右侧发布配置侧边栏 */}
      <div className="transition-all duration-500 ease-in-out w-96 opacity-100">
        <PublishSidebar taskType={currentTab} />
      </div>
    </div>
  );
};

export default CreateTaskTabs;