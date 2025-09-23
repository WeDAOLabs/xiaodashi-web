// 知识库名称到路由slug的映射
export const getSlugByName = (name: string): string => {
  const nameToSlugMap: Record<string, string> = {
    '产品资料库': 'product-materials',
    '营销话术库': 'marketing-scripts',
    '销售FAQ': 'sales-faq',
    '技术支持文档': 'technical-docs'
  };

  return nameToSlugMap[name] || 'product-materials';
};