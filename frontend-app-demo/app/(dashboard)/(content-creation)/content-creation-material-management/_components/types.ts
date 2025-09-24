// 扩展素材数据接口以支持详细信息
export interface ExtendedMaterialData {
  id: string;
  title: string;
  type: string;
  image: string;
  compliance: {
    status: 'compliant' | 'low-risk' | 'medium-risk' | 'high-risk';
    label: string;
    riskType?: string;
    description?: string;
    aiSolution?: string;
  };
  tags: string[];
  basicInfo: {
    size?: string;
    fileSize: string;
    uploader: string;
    uploadTime: string;
  };
  copyrightInfo?: {
    authorizer?: string;
    authPeriod?: string;
    usageScope?: string;
  };
}

// 合规性报告组件属性
export interface ComplianceReportProps {
  compliance: ExtendedMaterialData['compliance'];
}

// 信息展示区域组件属性
export interface InfoSectionProps {
  title: string;
  data: Array<{
    label: string;
    value: string;
  }>;
}

// 素材详情面板组件属性
export interface MaterialDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  material: ExtendedMaterialData | null;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}