// 图表组件类型定义
export interface DataPoint {
  x: number;
  y: number;
}

export interface ConversationTypeData {
  name: string;
  label: string;
  value: number;
  fill: string;
}

export interface HourlyData {
  hour: string;
  ai: number;
  human: number;
}

export interface ChartProps {
  className?: string;
  height?: number | string;
}

export interface MiniTrendChartProps extends ChartProps {
  data: DataPoint[];
  color: string;
}

export interface ConversationTypePieChartProps extends ChartProps {
  data?: ConversationTypeData[];
}

export interface HourlyConversationChartProps extends ChartProps {
  data?: HourlyData[];
  selectedPeriod?: '工作日' | '周末' | '节假日';
  onPeriodChange?: (period: string) => void;
}