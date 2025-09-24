import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 bg-[var(--color-primary-50)] rounded-lg flex items-center justify-center mb-3">
          <div className="w-6 h-6 text-[var(--color-primary-500)]">
            {icon}
          </div>
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{title}</h3>
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;