'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Settings } from 'lucide-react';

interface PersonaTag {
  label: string;
  color: string;
}

interface Persona {
  id: string;
  name: string;
  avatar: string;
  tags: PersonaTag[];
  isSelected?: boolean;
}

interface PersonaListProps {
  personas: Persona[];
  selectedPersonaId?: string;
  onPersonaSelect: (personaId: string) => void;
}

const PersonaCard: React.FC<{ persona: Persona; isSelected: boolean; onClick: () => void }> = ({
  persona,
  isSelected,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 flex items-center space-x-4 transition-colors ${
      isSelected
        ? 'bg-[var(--color-primary-50)]'
        : 'hover:bg-[var(--bg-tertiary)]'
    }`}
  >
    <Image
      src={persona.avatar}
      alt={persona.name}
      width={48}
      height={48}
      className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.src !== '/images/personas/default-avatar.jpg') {
          target.src = '/images/personas/default-avatar.jpg';
        }
      }}
    />
    <div className="flex-1 overflow-hidden">
      <p className={`font-semibold truncate ${
        isSelected
          ? 'text-[var(--color-primary-500)]'
          : 'text-[var(--text-primary)]'
      }`}>
        {persona.name}
      </p>
      <div className="flex flex-wrap gap-1 mt-1">
        {persona.tags.map((tag, index) => (
          <Badge
            key={index}
            className="text-xs px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full"
          >
            {tag.label}
          </Badge>
        ))}
      </div>
    </div>
  </button>
);

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  selectedPersonaId,
  onPersonaSelect
}) => {
  return (
    <Card className="h-fit sticky top-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">用户画像列表</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Persona List */}
        <ScrollArea className="h-[400px]">
          <div className="px-6">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedPersonaId === persona.id}
                onClick={() => onPersonaSelect(persona.id)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t border-[var(--border-primary)] space-y-2">
          <Button
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary-500)] bg-[var(--bg-primary)] border border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] transition-colors"
            variant="outline"
          >
            <Bot className="w-4 h-4" />
            AI动态细分
          </Button>
          <Button
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
            variant="outline"
          >
            <Settings className="w-4 h-4" />
            管理画像
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaList;