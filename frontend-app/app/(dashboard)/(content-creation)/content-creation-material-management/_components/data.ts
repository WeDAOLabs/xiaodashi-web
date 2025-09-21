import { ExtendedMaterialData } from './types';

// 扩展示例数据以匹配新的数据结构
export const EXTENDED_MOCK_MATERIALS: ExtendedMaterialData[] = [
  {
    id: 'MT001',
    title: '夏季新品发布会主视觉.jpg',
    type: '图片',
    image: '/images/materials/summer-campaign.jpg',
    compliance: { status: 'compliant', label: '已合规' },
    tags: ['夏季', '新品', '时尚'],
    basicInfo: {
      size: '3000x4500',
      fileSize: '8.5MB',
      uploader: '张三',
      uploadTime: '2025-07-15'
    }
  },
  {
    id: 'MT002',
    title: '品牌宣传视频V2.mp4',
    type: '视频',
    image: '/images/materials/brand-video.jpg',
    compliance: {
      status: 'low-risk',
      label: '低风险',
      riskType: '背景音乐版权',
      description: '视频中使用的背景音乐版权状态需要确认，建议联系版权方确认授权范围。',
      aiSolution: '建议替换为版权明确的音乐，或购买商用授权。'
    },
    tags: ['品牌', '宣传片', 'TVC'],
    basicInfo: {
      fileSize: '245MB',
      uploader: '李四',
      uploadTime: '2025-07-10'
    },
    copyrightInfo: {
      authorizer: '创意视频工作室',
      authPeriod: '2025-12-31',
      usageScope: '全媒体投放'
    }
  },
  {
    id: 'MT004',
    title: '代言人形象照-备选.jpg',
    type: '图片',
    image: '/images/materials/celebrity-portrait.jpg',
    compliance: {
      status: 'high-risk',
      label: '高风险',
      riskType: '肖像权授权到期',
      description: '代言人肖像使用授权即将于2024-08-31到期，到期后使用将构成侵权。',
      aiSolution: '立即与经纪公司续签授权合同，或在到期前替换所有相关物料。'
    },
    tags: ['代言人', '肖像'],
    basicInfo: {
      size: '3000x4500',
      fileSize: '12.5MB',
      uploader: '李四',
      uploadTime: '2025-07-11'
    },
    copyrightInfo: {
      authorizer: 'XX摄影工作室',
      authPeriod: '2024-08-31',
      usageScope: '仅限线上社交媒体'
    }
  },
  {
    id: 'MT003',
    title: '产品介绍核心卖点.doc',
    type: '文案',
    image: '/images/materials/document-thumbnail.jpg',
    compliance: { status: 'compliant', label: '已合规' },
    tags: ['产品', '卖点', '文案'],
    basicInfo: {
      fileSize: '1.2MB',
      uploader: '王五',
      uploadTime: '2025-07-12'
    }
  },
  {
    id: 'MT005',
    title: 'App开屏广告设计稿.psd',
    type: '设计稿',
    image: '/images/materials/design-draft.jpg',
    compliance: { status: 'compliant', label: '已合规' },
    tags: ['APP', '开屏', '广告'],
    basicInfo: {
      size: '1080x1920',
      fileSize: '35.8MB',
      uploader: '设计师小张',
      uploadTime: '2025-07-13'
    }
  },
  {
    id: 'MT006',
    title: '电台广告音频.mp3',
    type: '音频',
    image: '/images/materials/audio-wave.jpg',
    compliance: {
      status: 'medium-risk',
      label: '中风险',
      riskType: '广告法合规',
      description: '音频内容中存在"最佳"等绝对化用词，需要调整以符合广告法要求。',
      aiSolution: '建议将"最佳"修改为"优质"或"出色"等相对性表述。'
    },
    tags: ['电台', '广告', '音频'],
    basicInfo: {
      fileSize: '15.2MB',
      uploader: '音频制作组',
      uploadTime: '2025-07-14'
    }
  },
  {
    id: 'MT007',
    title: '社交媒体九宫格图.zip',
    type: '图片',
    image: '/images/materials/social-media.jpg',
    compliance: { status: 'compliant', label: '已合规' },
    tags: ['社交', '九宫格', '媒体'],
    basicInfo: {
      fileSize: '25.6MB',
      uploader: '新媒体运营',
      uploadTime: '2025-07-16'
    }
  },
  {
    id: 'MT008',
    title: '用户访谈录音.wav',
    type: '音频',
    image: '/images/materials/interview-record.jpg',
    compliance: {
      status: 'low-risk',
      label: '低风险',
      riskType: '用户隐私保护',
      description: '录音中包含用户真实姓名，建议在使用前进行脱敏处理。',
      aiSolution: '对录音中的敏感信息进行音频处理或文字脱敏。'
    },
    tags: ['访谈', '录音', '用户'],
    basicInfo: {
      fileSize: '48.3MB',
      uploader: '产品经理',
      uploadTime: '2025-07-17'
    }
  }
];