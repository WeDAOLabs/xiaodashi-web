/**
 * 工具聚合页面的静态数据
 */

import { Calendar, Video, MessageCircle, PenTool } from 'lucide-react';
import type { ToolItem } from './types';

/**
 * 工具列表数据
 */
export const toolsData: ToolItem[] = [
  {
    id: 'ai-meeting-assistant',
    title: 'AI会议纪要助手',
    icon: Calendar,
    painPoint: '告别冗长会议记录，解放双手，让会议效率翻倍！',
    userValue: '精准捕获会议精华，自动生成任务，确保每项决策高效落地。',
    features: [
      '省时省力，专注会议核心内容',
      '决策不遗漏，任务直达飞书'
    ],
    isFavorite: false,
    actionUrl: '#'
  },
  {
    id: 'ai-video-transcription',
    title: 'AI视频文字提取',
    icon: Video,
    painPoint: '无需手动听写，轻松将视频内容转化为文字，提升内容复用效率。',
    userValue: '一键提取视频文字稿，快速编辑、查找或翻译，内容创作更自由。',
    features: [
      '高识别率，告别繁琐听写',
      '轻松制作字幕，拓宽内容受众'
    ],
    isFavorite: false,
    actionUrl: '#'
  },
  {
    id: 'wechat-message-optimizer',
    title: '微信消息防折叠助手',
    icon: MessageCircle,
    painPoint: '不再担心微信消息被折叠，让你的重要信息直达人心。',
    userValue: 'AI智能编排，提升微信文案曝光率和阅读效果，沟通更有效。',
    features: [
      '智能排版，高效触达受众',
      '告别折叠，阅读量蹭蹭涨'
    ],
    isFavorite: false,
    actionUrl: '#'
  },
  {
    id: 'ai-selling-point-optimizer',
    title: 'AI买点文案优化器',
    icon: PenTool,
    painPoint: '产品卖点说不透？用户get不到核心价值？',
    userValue: 'AI帮你将产品特性转化为用户一听就懂的"购买理由"，让文案直击痛点，激发购买欲。',
    features: [
      '智能提炼用户买点，转化率飙升'
    ],
    isFavorite: false,
    actionUrl: '#'
  }
];