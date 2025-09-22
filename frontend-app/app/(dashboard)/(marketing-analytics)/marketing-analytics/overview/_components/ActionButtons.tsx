import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonConfig {
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButtonConfig[];
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  className = "flex items-center gap-4"
}) => {
  return (
    <div className={className}>
      {buttons.map((button, index) => (
        <Button
          key={`action-${button.label}-${index}`}
          variant={button.variant || 'outline'}
          className="text-sm font-semibold"
          onClick={button.onClick}
          disabled={button.disabled}
          asChild={!!button.href}
        >
          {button.href ? (
            <a href={button.href}>
              {button.label}
            </a>
          ) : (
            button.label
          )}
        </Button>
      ))}
    </div>
  );
};

export default ActionButtons;