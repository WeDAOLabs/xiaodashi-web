// 新建投放计划相关类型定义

export type Platform = 'douyin' | 'wechat' | 'baidu' | 'xiaohongshu' | 'meituan';

export type MarketingObjective = 'brand' | 'traffic' | 'conversion' | 'leads';

export type InvestmentStrategy = 'max_performance' | 'cost_control' | 'fast_delivery';

export type AudienceType = 'ai' | 'existing' | 'custom';

export type CreativeSource = 'library' | 'ai_generate';

export interface BudgetConfig {
  total: number;
  daily: number;
}

export interface ScheduleConfig {
  startDate: string;
  endDate: string;
  longTerm: boolean;
}

export interface AudienceConfig {
  type: AudienceType;
  details?: Record<string, unknown>;
}

export interface CreativeConfig {
  source: CreativeSource;
  materials?: Record<string, unknown>[];
}

export interface CampaignFormData {
  // 步骤1：平台与目标
  platform?: Platform;
  objective?: MarketingObjective;

  // 步骤2：策略与预算
  strategy?: InvestmentStrategy;
  budget?: BudgetConfig;
  schedule?: ScheduleConfig;

  // 步骤3：受众与创意
  audience?: AudienceConfig;
  creative?: CreativeConfig;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export interface StepProps {
  formData: CampaignFormData;
  onUpdate: (data: Partial<CampaignFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onNavigateToStep?: (step: number) => void;
  validation: StepValidation;
}

// 平台选项配置
export interface PlatformOption {
  key: Platform;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// 营销目标选项配置
export interface ObjectiveOption {
  key: MarketingObjective;
  name: string;
  description?: string;
}

// 投放策略选项配置
export interface StrategyOption {
  key: InvestmentStrategy;
  name: string;
  description: string;
}