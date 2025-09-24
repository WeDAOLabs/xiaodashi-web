/**
 * Knowledge Base Creation Types
 *
 * 新建知识库相关的类型定义
 */

// 步骤验证结果
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

// 文件上传信息
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string | ArrayBuffer;
}

// 网站链接信息
export interface WebsiteLink {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

// 手动输入内容
export interface ManualContent {
  id: string;
  title: string;
  content: string;
}

// 数据源类型
export type DataSourceType = 'upload' | 'website' | 'manual';

// 数据源配置
export interface DataSource {
  type: DataSourceType;
  files?: UploadedFile[];
  websites?: WebsiteLink[];
  manualContents?: ManualContent[];
}

// 知识库表单数据
export interface KnowledgeBaseFormData {
  // 基本信息 - 步骤1
  name?: string;
  description?: string;

  // 数据源 - 步骤2
  dataSource?: DataSource;

  // 创建时间戳
  createdAt?: string;
}

// 步骤组件通用Props
export interface StepProps {
  formData: KnowledgeBaseFormData;
  onUpdate: (data: Partial<KnowledgeBaseFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onNavigateToStep: (step: number) => void;
  validation: StepValidation;
}

// 步骤定义
export interface Step {
  id: number;
  title: string;
  description: string;
}

// 支持的文件类型
export const SUPPORTED_FILE_TYPES = [
  '.txt',
  '.pdf',
  '.md',
  '.docx',
  '.csv'
] as const;

export type SupportedFileType = typeof SUPPORTED_FILE_TYPES[number];

// 最大文件大小 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 最大文件数量
export const MAX_FILE_COUNT = 10;