import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { AnalysisData } from '../types';

interface AICommercializationAssessmentProps {
  analysisData: AnalysisData;
}

const AICommercializationAssessment: React.FC<AICommercializationAssessmentProps> = ({
  analysisData
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return '高潜力';
      case 'medium':
        return '中等潜力';
      case 'low':
        return '低潜力';
      default:
        return '未知';
    }
  };

  const getLevelProgress = (level: string) => {
    switch (level) {
      case 'high':
        return 85;
      case 'medium':
        return 60;
      case 'low':
        return 30;
      default:
        return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI商业化潜能评估 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary-500)]" />
            AI商业化潜能评估
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisData.commercializationPotentials.map((potential, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="font-medium text-[var(--text-primary)]">
                    {potential.category}
                  </span>
                </div>
                <Badge className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(potential.level)}`}>
                  {getLevelText(potential.level)}
                </Badge>
              </div>

              <Progress
                value={getLevelProgress(potential.level)}
                className="w-full h-2"
              />

              <p className="text-sm text-[var(--text-secondary)]">
                {potential.description}
              </p>

              {index < analysisData.commercializationPotentials.length - 1 && (
                <div className="border-b border-[var(--border-secondary)]" />
              )}
            </div>
          ))}

          {/* 风险警告 */}
          {analysisData.riskWarning && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <div className="ml-2">
                <div className="font-medium text-sm">风险提示</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">
                  {analysisData.riskWarning}
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* AI推荐商业化路径 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--color-primary-500)]" />
            AI推荐商业化路径
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisData.recommendedPaths.map((path, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center text-sm font-semibold">
                  {path.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                    {path.title}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {path.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
              </div>

              {/* 连接线 */}
              {index < analysisData.recommendedPaths.length - 1 && (
                <div className="absolute left-8 bottom-0 w-0.5 h-4 bg-[var(--border-secondary)] transform translate-y-full" />
              )}
            </div>
          ))}

          <div className="text-center pt-2">
            <p className="text-xs text-[var(--text-tertiary)]">
              AI基于数据分析生成的个性化建议
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICommercializationAssessment;