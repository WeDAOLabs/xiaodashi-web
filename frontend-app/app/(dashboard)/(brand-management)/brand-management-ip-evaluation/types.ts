// IP资产智能评估与商业化孵化页面类型定义

export interface IPAsset {
  id: string;
  name: string;
  category: string;
  avatar: string;
  rating: number;
  status: 'incubating' | 'authorized' | 'pending';
  description?: string;
}

export interface OverviewStats {
  totalAssets: number;
  incubatingProjects: number;
  authorizedIPs: number;
  aiInsight: string;
}

export interface RadarChartData {
  dimension: string;
  value: number;
}

export interface FanDemographics {
  ageGroup: string;
  percentage: number;
}

export interface CommercializationPotential {
  category: string;
  level: 'high' | 'medium' | 'low';
  description: string;
}

export interface CommercializationPath {
  step: number;
  title: string;
  description: string;
}

export interface LicensingProject {
  projectName: string;
  duration: string;
  revenue: string;
}

export interface AnalysisData {
  radarData: RadarChartData[];
  fanDemographics: FanDemographics[];
  commercializationPotentials: CommercializationPotential[];
  recommendedPaths: CommercializationPath[];
  licensingProjects: LicensingProject[];
  riskWarning?: string;
}

export interface PageState {
  selectedIP: IPAsset | null;
  isSelectionSheetOpen: boolean;
  searchKeyword: string;
  stats: OverviewStats;
  analysisData: AnalysisData | null;
  loading: boolean;
}

// 快捷操作按钮类型
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}