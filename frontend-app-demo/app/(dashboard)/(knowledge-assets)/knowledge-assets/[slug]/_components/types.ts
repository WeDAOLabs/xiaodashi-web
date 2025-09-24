export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'pending';
  aiSummary: string;
  date: string;
  comments: number;
  version: string;
}

export interface KnowledgeBaseConfig {
  title: string;
  name: string;
  description: string;
}

export interface FilterState {
  category: string;
  tag: string;
  status: string;
  sortBy: string;
}

export const KNOWLEDGE_BASE_CONFIG: Record<string, KnowledgeBaseConfig> = {
  'product-materials': {
    title: '知识库管理-产品资料库',
    name: '产品资料库',
    description: '产品相关资料和文档的智能管理中心'
  },
  'marketing-scripts': {
    title: '知识库管理-营销话术库',
    name: '营销话术库',
    description: '营销话术和脚本的智能管理中心'
  },
  'sales-faq': {
    title: '知识库管理-销售FAQ',
    name: '销售FAQ',
    description: '销售常见问题和解答的智能管理中心'
  },
  'technical-docs': {
    title: '知识库管理-技术支持文档',
    name: '技术支持文档',
    description: '技术文档和支持资料的智能管理中心'
  }
};

// 模拟数据
export const MOCK_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: '1',
    title: '2024年Q3社交媒体营销白皮书',
    description: '深入分析了Q3社交媒体趋势，包括短视频内容策略、KOL合作模式以及用户行为变化，为品牌提供可行的营销建议。',
    category: '营销素材库',
    tags: ['社交媒体', '内容策略'],
    status: 'published',
    aiSummary: '报告核心洞察：短视频平台用户粘性持续增强，直播带货向专业化、场景化发展。品牌应关注垂类KOL，实现精准触达。',
    date: '2024-07-15',
    comments: 128,
    version: 'v2.1'
  },
  {
    id: '2',
    title: '竞品A-Plus系列功能对比分析',
    description: '详细拆解了竞品A-Plus系列的核心功能、定价策略和市场反馈，并与我方产品进行了SWOT对比。',
    category: '竞品分析',
    tags: ['竞品分析'],
    status: 'published',
    aiSummary: '关键发现：竞品在AI个性化推荐方面表现优异，但在企业级服务和数据安全方面存在短板，此为我方产品的潜在突破口。',
    date: '2024-07-12',
    comments: 95,
    version: 'v1.0'
  },
  {
    id: '3',
    title: '新品"智云"发布会营销方案草稿',
    description: '"智云"产品发布会的整体营销策划方案，包括活动流程、媒体邀约名单、宣传物料清单和预期KPI。',
    category: '产品文档',
    tags: ['新品发布'],
    status: 'draft',
    aiSummary: '方案亮点：采用线上线下结合的混合模式，邀请行业头部KOL进行现场体验直播，并通过AI生成个性化邀请函，提升参与感。',
    date: '2024-07-18',
    comments: 12,
    version: 'v0.8'
  },
  {
    id: '4',
    title: '客户画像：新锐白领消费群体研究',
    description: '针对25-35岁城市新锐白领的消费习惯、媒介偏好和价值观进行深度研究，构建了三个核心用户画像。',
    category: '用户研究',
    tags: ['用户画像'],
    status: 'published',
    aiSummary: '核心用户特征：追求质价比，注重悦己消费和社交价值，对品牌的情感连接要求高，是内容种草的核心转化人群。',
    date: '2024-06-28',
    comments: 250,
    version: 'v3.0'
  },
  {
    id: '5',
    title: '内容创作AI助手使用手册',
    description: '介绍了公司内部内容创作AI助手的功能模块、操作流程和最佳实践案例，旨在提升内容生产效率。',
    category: '产品文档',
    tags: ['AI工具'],
    status: 'pending',
    aiSummary: '手册要点：重点讲解如何使用"一键生成营销文案"和"智能配图"功能，并提供了5个不同行业的实战模板。',
    date: '2024-07-20',
    comments: 30,
    version: 'v1.5'
  },
  {
    id: '6',
    title: '品牌Logo及VI规范',
    description: '定义了智赢品牌Logo的正确使用方法、标准色、辅助图形及在不同媒介上的应用规范，确保品牌形象统一。',
    category: '品牌资产',
    tags: ['品牌规范'],
    status: 'published',
    aiSummary: '核心规范：主Logo必须保持最小安全边距，标准色CMYK值不可更改。所有对外宣传物料需经品牌部审核。',
    date: '2024-05-10',
    comments: 512,
    version: 'v4.2'
  },
  {
    id: '7',
    title: '"夏日焕新"活动复盘报告',
    description: '对"夏日焕新"大型营销活动的全面复盘，包括数据分析、ROI计算、用户反馈总结以及经验教训。',
    category: '营销活动',
    tags: ['活动复盘'],
    status: 'published',
    aiSummary: '复盘结论：活动通过社交媒体裂变获得了超预期曝光，但线下门店引流效果未达标。未来应加强线上线下联动设计。',
    date: '2024-07-01',
    comments: 77,
    version: 'v1.0'
  },
  {
    id: '8',
    title: '短视频广告投放策略（待审核）',
    description: '一份关于如何在抖音、快手等平台进行有效短视频广告投放的策略方案，包含预算分配、素材创意和数据监测。',
    category: '投放策略',
    tags: ['短视频'],
    status: 'pending',
    aiSummary: '策略核心：采用A/B测试不同创意素材，利用DMP进行精准人群定向，并设置合理的UTM链接以追踪转化路径。',
    date: '2024-07-21',
    comments: 5,
    version: 'v1.0'
  }
];