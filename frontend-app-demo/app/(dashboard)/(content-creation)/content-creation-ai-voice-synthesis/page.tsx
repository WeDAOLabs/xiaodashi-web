'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AudioWaveform, RiskPoint } from '@/components/ui/audio-waveform';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Scissors,
  Volume2,
  MicOff,
  Play,
  Save,
  Shield,
  Download,
  RotateCcw,
  Music,
  FileAudio,
  Trash2,
  Plus,
  Upload
} from 'lucide-react';

interface VoiceOptionProps {
  name: string;
  avatar: string;
  tags: string[];
  isSelected: boolean;
  onClick: () => void;
}

const VoiceOption: React.FC<VoiceOptionProps> = ({ name, avatar, tags, isSelected, onClick }) => (
  <div
    className={`p-3 border rounded-lg cursor-pointer transition-all ${
      isSelected
        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] ring-2 ring-[var(--color-primary-500)]'
        : 'border-[var(--border-secondary)] hover:border-[var(--color-primary-500)]'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <Image
        src={avatar}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-[var(--text-primary)]">{name}</p>
        <div className="flex gap-1 mt-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface AudioToolButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const AudioToolButton: React.FC<AudioToolButtonProps> = ({ icon, title, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
  >
    {icon}
  </button>
);

interface MusicItemProps {
  title: string;
  artist: string;
  duration: string;
  status: 'authorized' | 'unknown';
}

const MusicItem: React.FC<MusicItemProps> = ({ title, artist, duration, status }) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--bg-tertiary)]">
    <div>
      <p className="font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="text-xs text-[var(--text-tertiary)]">{artist} - {duration}</p>
    </div>
    <Badge
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        status === 'authorized'
          ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
          : 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]'
      }`}
    >
      {status === 'authorized' ? '版权已授权' : '版权未知'}
    </Badge>
  </div>
);

interface SoundEffectItemProps {
  name: string;
  onAdd: () => void;
}

const SoundEffectItem: React.FC<SoundEffectItemProps> = ({ name, onAdd }) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--bg-tertiary)]">
    <p className="font-medium">{name}</p>
    <button
      onClick={onAdd}
      className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

// 音色选项数据
const VOICE_OPTIONS = [
  {
    name: '标准男声',
    avatar: '/images/voice-avatars/male-1.jpg',
    tags: ['通用', '新闻']
  },
  {
    name: '甜美女声',
    avatar: '/images/voice-avatars/female-1.jpg',
    tags: ['客服', '活泼']
  },
  {
    name: '磁性男声',
    avatar: '/images/voice-avatars/male-2.jpg',
    tags: ['广告', '纪录片']
  },
  {
    name: '儿童音',
    avatar: '/images/voice-avatars/child-1.jpg',
    tags: ['故事', '可爱']
  }
];

// 背景音乐数据
const BACKGROUND_MUSIC = [
  {
    title: 'Sunny Mornings',
    artist: 'UpbeatCorp',
    duration: '2:34',
    status: 'authorized' as const
  },
  {
    title: 'Focus Flow',
    artist: 'StudyBeats',
    duration: '3:12',
    status: 'authorized' as const
  },
  {
    title: 'Midnight City',
    artist: 'Chillwave Inc.',
    duration: '1:58',
    status: 'unknown' as const
  }
];

// 音效数据
const SOUND_EFFECTS = ['点击声', '转场音', '成功提示'];

const AiVoiceSynthesisPage: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = React.useState(1); // 使用索引，默认选择甜美女声
  const [emotion, setEmotion] = React.useState('活泼');
  const [speechRate, setSpeechRate] = React.useState([50]);
  const [tone, setTone] = React.useState([50]);
  const [industry, setIndustry] = React.useState('电商');
  const [complianceLevel, setComplianceLevel] = React.useState('高');
  const [inputText, setInputText] = React.useState(
    '欢迎使用智赢AI全域营销大师。在这里，您可以轻松将文本转化为生动语音。然而，请注意，某些词汇，如"极限"、"国家级"等，可能涉及合规风险。'
  );

  // 风险点数据
  const riskPoints: RiskPoint[] = React.useMemo(() => [
    {
      id: 'risk-1',
      start: 15.2,
      end: 16.8,
      label: '合规风险',
      type: 'high'
    },
    {
      id: 'risk-2',
      start: 8.5,
      end: 9.2,
      label: '版权风险',
      type: 'medium'
    }
  ], []);

  const handleVoiceSelect = React.useCallback((voiceIndex: number) => {
    setSelectedVoice(voiceIndex);
  }, []);

  const handleSynthesize = React.useCallback(() => {
    console.log('开始智能合成:', {
      voice: VOICE_OPTIONS[selectedVoice]?.name,
      emotion,
      speechRate: speechRate[0],
      tone: tone[0],
      industry,
      complianceLevel,
      text: inputText
    });
    // 这里实现语音合成逻辑
  }, [selectedVoice, emotion, speechRate, tone, industry, complianceLevel, inputText]);

  const handleClearText = React.useCallback(() => {
    setInputText('');
  }, []);

  const handleRiskPointClick = React.useCallback((riskPoint: RiskPoint) => {
    console.log('风险点被点击:', riskPoint);
    // 这里可以实现跳转到特定时间点或显示详细信息的逻辑
  }, []);

  return (
    <ToolPageLayout
      title="AI语音合成与编辑"
      description="通过AI技术将文案转化为高质量语音，并提供专业的音频编辑功能"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '听觉内容智能创作与编辑', href: '/content-creation-audio-center' },
        { label: 'AI语音合成与编辑', href: '/content-creation-ai-voice-synthesis', current: true }
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Section: Input & Controls */}
        <div className="xl:col-span-4 space-y-6">

          {/* Text Input */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">待合成文本</h3>
              <div className="relative">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent resize-none text-sm leading-relaxed"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2 p-2 rounded-md bg-[var(--color-warning-50)] text-[var(--color-warning-600)]">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold">实时合规预警</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI音色选择</h3>
              <div className="grid grid-cols-2 gap-3">
                {VOICE_OPTIONS.map((voice, index) => (
                  <VoiceOption
                    key={voice.name}
                    name={voice.name}
                    avatar={voice.avatar}
                    tags={voice.tags}
                    isSelected={selectedVoice === index}
                    onClick={() => handleVoiceSelect(index)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parameter Configuration */}
          <Card>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">情感倾向</label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="活泼">活泼</SelectItem>
                      <SelectItem value="中性">中性</SelectItem>
                      <SelectItem value="严肃">严肃</SelectItem>
                      <SelectItem value="积极">积极</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">语速调节</label>
                    <span className="text-sm font-semibold text-[var(--color-primary-700)]">{speechRate[0]}</span>
                  </div>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">语调调节</label>
                    <span className="text-sm font-semibold text-[var(--color-primary-700)]">{tone[0]}</span>
                  </div>
                  <Slider
                    value={tone}
                    onValueChange={setTone}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <p className="text-xs text-center text-[var(--text-tertiary)] pt-2">
                  可在文本中通过#1s#等符号插入停顿
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Configuration */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">合规性配置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">所属行业</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="电商">电商</SelectItem>
                      <SelectItem value="医药">医药</SelectItem>
                      <SelectItem value="金融">金融</SelectItem>
                      <SelectItem value="教育">教育</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">合规等级</label>
                  <Select value={complianceLevel} onValueChange={setComplianceLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="高">高</SelectItem>
                      <SelectItem value="中">中</SelectItem>
                      <SelectItem value="低">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-xs text-[var(--text-secondary)] p-3 bg-[var(--bg-tertiary)] rounded-md">
                  <span className="font-semibold">合规监测智能体</span>: 已启用智能合规监测，AI将识别并预警敏感词句和不当表达，确保语音内容合规。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSynthesize}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              智能合成
            </Button>
            <Button
              variant="outline"
              onClick={handleClearText}
              className="flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              清空文本
            </Button>
          </div>
        </div>

        {/* Center Section: Audio Editor */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <Card className="flex-grow flex flex-col">
            <CardContent className="p-5 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">语音合成结果与编辑</h3>

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 p-2 bg-[var(--bg-tertiary)] rounded-md mb-4">
                <div className="flex gap-1.5">
                  <AudioToolButton icon={<RotateCcw className="w-4 h-4" />} title="重新合成" />
                  <AudioToolButton icon={<Scissors className="w-4 h-4" />} title="剪辑" />
                  <AudioToolButton icon={<RefreshCw className="w-4 h-4" />} title="拼接" />
                  <AudioToolButton icon={<Volume2 className="w-4 h-4" />} title="音量平衡" />
                  <AudioToolButton icon={<MicOff className="w-4 h-4" />} title="去除静音" />
                </div>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs font-semibold">
                    <Music className="w-3.5 h-3.5" />
                    背景音乐
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs font-semibold">
                    <FileAudio className="w-3.5 h-3.5" />
                    添加音效
                  </Button>
                </div>
              </div>

              {/* Waveform Display */}
              <div className="flex-grow w-full bg-[var(--bg-secondary)] rounded-md p-4">
                <AudioWaveform
                  height={120}
                  riskPoints={riskPoints}
                  onRiskPointClick={handleRiskPointClick}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Button size="lg" className="w-12 h-12 rounded-full p-0">
                    <Play className="w-6 h-6" fill="currentColor" />
                  </Button>
                  <div className="text-center">
                    <p className="font-mono font-semibold text-lg text-[var(--text-primary)]">00:08 / 00:23</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save className="w-4 h-4" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-[var(--color-primary-100)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] hover:text-white">
                    <Shield className="w-4 h-4" />
                    合规检测
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    导出
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Music & SFX Library */}
        <div className="xl:col-span-3 space-y-6">

          {/* Background Music */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI推荐背景音乐</h3>
              <div className="space-y-3">
                {BACKGROUND_MUSIC.map((music, index) => (
                  <MusicItem
                    key={index}
                    title={music.title}
                    artist={music.artist}
                    duration={music.duration}
                    status={music.status}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sound Effects */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">音效库</h3>
              <div className="space-y-2">
                {SOUND_EFFECTS.map((effect, index) => (
                  <SoundEffectItem
                    key={index}
                    name={effect}
                    onAdd={() => console.log(`添加音效: ${effect}`)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Button */}
          <Button variant="outline" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            上传音乐/音效
          </Button>
        </div>

      </div>
    </ToolPageLayout>
  );
};

export default AiVoiceSynthesisPage;