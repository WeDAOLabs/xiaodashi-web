import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { AIAlertProps } from '../types';

const AIAlert: React.FC<AIAlertProps> = ({
  type,
  message,
  timestamp,
  actions
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-[var(--color-warning-50)] border-[var(--color-warning-100)]';
      case 'info':
        return 'bg-[var(--color-info-50)] border-[var(--color-info-100)]';
      case 'success':
        return 'bg-[var(--color-success-50)] border-[var(--color-success-100)]';
      default:
        return 'bg-[var(--bg-secondary)] border-[var(--border-primary)]';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-[var(--color-warning-600)]';
      case 'info':
        return 'text-[var(--color-info-600)]';
      case 'success':
        return 'text-[var(--color-success-600)]';
      default:
        return 'text-[var(--text-secondary)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'info':
        return <Lightbulb className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <Card className={`p-4 border flex flex-col justify-between ${getAlertStyles()}`}>
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-full ${getIconColor()}`}>
            {getIcon()}
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">{timestamp}</span>
        </div>
        <p className="text-[var(--text-primary)] font-medium mb-4">{message}</p>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={index === actions.length - 1 ? "default" : "ghost"}
            size="sm"
            className="text-sm"
          >
            {action}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default AIAlert;