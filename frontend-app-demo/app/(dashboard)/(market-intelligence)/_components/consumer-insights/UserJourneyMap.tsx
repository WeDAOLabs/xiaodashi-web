'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

interface JourneyStage {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  emoji: string;
}

interface UserJourneyMapProps {
  title: string;
  stages: JourneyStage[];
}

const JourneyStageItem: React.FC<{ stage: JourneyStage; isLast: boolean }> = ({ stage, isLast }) => {
  return (
    <div className="relative flex items-start mb-6 pl-10">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-[var(--border-primary)] border-l-2 border-dashed" />
      )}

      {/* Icon circle */}
      <div className="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] rounded-full">
        <span className="text-lg">{stage.emoji}</span>
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{stage.title}</h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{stage.description}</p>
      </div>
    </div>
  );
};

const UserJourneyMap: React.FC<UserJourneyMapProps> = ({ title, stages }) => {
  return (
    <Card className="border border-[var(--border-primary)] shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">{title}</h3>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-primary)]" />

          {/* Journey stages */}
          {stages.map((stage, index) => (
            <JourneyStageItem
              key={stage.id}
              stage={stage}
              isLast={index === stages.length - 1}
            />
          ))}
        </div>

        <Button className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] transition-colors">
          <Link className="w-4 h-4" />
          联动私域运营
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserJourneyMap;