'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  User,
  Send,
  CreditCard,
  Settings,
  MessageCircle,
  LucideIcon
} from 'lucide-react';

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  User,
  Send,
  CreditCard,
  Settings,
  MessageCircle,
};

interface HelpTopicCardProps {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

const HelpTopicCard: React.FC<HelpTopicCardProps> = ({ title, description, icon }) => {
  const IconComponent = iconMap[icon];

  const handleClick = () => {
    // TODO: 实现点击后的导航逻辑
    console.log(`Clicked on ${title}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-secondary)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`查看${title}帮助主题`}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 text-[var(--color-primary-500)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpTopicCard;