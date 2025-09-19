'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Smartphone, Users, Zap } from 'lucide-react';
import { useIPCreation } from '../IPCreationContext';

export default function Step5Form() {
  const { data, dispatch, prevStep } = useIPCreation();

  const handlePublishStrategyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'publishStrategy', value: e.target.value });
  };

  const handleRiskAssessmentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'riskAssessment', value: e.target.value });
  };

  const handleChannelToggle = (channel: string) => {
    const currentChannels = data.distributionChannels || [];
    const isSelected = currentChannels.includes(channel);

    if (isSelected) {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'distributionChannels',
        value: currentChannels.filter(c => c !== channel)
      });
    } else {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'distributionChannels',
        value: [...currentChannels, channel]
      });
    }
  };

  const isFormValid = data.publishStrategy.trim() && data.riskAssessment.trim();

  const channels = [
    { name: 'B站', icon: <Users className="w-4 h-4" />, match: 95, color: 'bg-blue-500' },
    { name: '小红书', icon: <Smartphone className="w-4 h-4" />, match: 88, color: 'bg-red-500' },
    { name: '抖音', icon: <Zap className="w-4 h-4" />, match: 82, color: 'bg-black' },
    { name: '微博', icon: <Users className="w-4 h-4" />, match: 75, color: 'bg-orange-500' },
    { name: '微信公众号', icon: <Smartphone className="w-4 h-4" />, match: 70, color: 'bg-green-500' },
    { name: 'QQ空间', icon: <Users className="w-4 h-4" />, match: 65, color: 'bg-blue-600' },
  ];

  return (
    <div className="space-y-8">
      {/* 初期传播渠道选择 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">初期传播渠道选择</h3>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => {
              const isSelected = data.distributionChannels?.includes(channel.name);
              return (
                <div
                  key={channel.name}
                  onClick={() => handleChannelToggle(channel.name)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5'
                      : 'border-[var(--border-secondary)] bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`mr-4 p-2 rounded-lg ${channel.color} text-white`}>
                    {channel.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[var(--text-primary)]">{channel.name}</p>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[var(--primary-color)]" />}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">受众匹配度</p>
                    <div className="text-lg font-bold text-[var(--primary-color)]">{channel.match}%</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            已选择 {data.distributionChannels?.length || 0} 个平台
          </p>
        </CardContent>
      </Card>

      {/* 发布节奏与内容策略 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">发布节奏与内容策略</h3>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="publish-strategy" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              发布策略和节奏规划 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="publish-strategy"
              rows={4}
              value={data.publishStrategy}
              onChange={handlePublishStrategyChange}
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
              placeholder="描述发布时间、频率、内容类型分配等..."
            />
          </div>

          <div className="mt-4 p-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-md text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
            <strong>初期发布节奏建议：</strong>
            {'\n'}- <strong>第一周 (预热):</strong> 在B站、小红书发布概念海报和预告PV，建立#{data.ipName}#话题。
            {'\n'}- <strong>第二周 (亮相):</strong> 公布核心人设和世界观，发布第一个短视频内容。
            {'\n'}- <strong>第三周 (互动):</strong> 发起粉丝互动挑战，如&quot;为{data.ipName}画同人图&quot;，增强社区粘性。
            {'\n'}<strong>内容策略：</strong> B站主打深度内容和长视频，小红书进行图文种草，抖音以病毒式短视频传播。
          </div>
        </CardContent>
      </Card>

      {/* 预期效果与风险评估 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">预期效果与风险评估</h3>
        </div>
        <CardContent className="p-4">
          <div>
            <label htmlFor="risk-assessment" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              风险评估和应对策略 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="risk-assessment"
              rows={4}
              value={data.riskAssessment}
              onChange={handleRiskAssessmentChange}
              className="w-full px-3 py-2 bg-white border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] transition"
              placeholder="识别可能的风险并制定应对策略..."
            />
          </div>

          <div className="mt-4 p-4 bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-md text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
            <strong>潜在风险评估：</strong>
            {'\n'}- <strong>舆论风险:</strong> IP初期形象可能引发争议，需准备好公关预案。
            {'\n'}- <strong>版权风险:</strong> 确保所有设计、文案均为原创，及时进行版权登记。
            {'\n'}- <strong>内容持续性:</strong> 需建立稳定的内容生产流程，避免&quot;出道即巅峰&quot;。
          </div>
        </CardContent>
      </Card>

      {/* 商业化规划 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">商业化规划</h3>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-3">收入模式</h4>
              <div className="space-y-2">
                {[
                  '版权授权',
                  '衍生商品',
                  '品牌合作',
                  '内容付费',
                  '直播打赏',
                  '广告分成'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full"></div>
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-3">时间节点</h4>
              <div className="space-y-3">
                {[
                  { time: '1-3个月', milestone: '建立粉丝基础，完成冷启动' },
                  { time: '3-6个月', milestone: '开始商业化尝试，推出首批衍生品' },
                  { time: '6-12个月', milestone: '品牌合作，扩大影响力' },
                  { time: '12个月+', milestone: 'IP价值最大化，多元化发展' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {item.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{item.milestone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成功指标 */}
      <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
        <div className="p-4 border-b border-[var(--border-secondary)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">成功指标定义</h3>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: '粉丝数量', target: '10万+', platform: '全平台' },
              { metric: '内容播放', target: '100万+', platform: '单条视频' },
              { metric: '互动率', target: '8%+', platform: '平均水平' },
              { metric: '商业变现', target: '50万+', platform: '年收入' },
            ].map((item, index) => (
              <div key={index} className="text-center p-3 bg-white rounded-md">
                <div className="text-xl font-bold text-[var(--primary-color)]">{item.target}</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">{item.metric}</div>
                <div className="text-xs text-[var(--text-secondary)]">{item.platform}</div>
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
            disabled={!isFormValid}
            className="bg-[var(--success-color)] hover:bg-[var(--success-color)]/90"
          >
            完成创建
          </Button>
        </div>
      </div>
    </div>
  );
}