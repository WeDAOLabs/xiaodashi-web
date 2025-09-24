/**
 * Knowledge Base Creation Utilities
 *
 * 知识库创建相关的工具函数
 */

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 生成唯一文件ID
 * @returns 唯一的文件ID字符串
 */
export const generateFileId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};