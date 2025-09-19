import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { AnalysisData } from '../types';

interface IPLicensingTableProps {
  analysisData: AnalysisData;
}

const IPLicensingTable: React.FC<IPLicensingTableProps> = ({ analysisData }) => {
  const getStatusFromDuration = (duration: string): string => {
    const currentYear = new Date().getFullYear();
    if (duration.includes(`${currentYear}`)) {
      return '进行中';
    } else if (duration.includes(`${currentYear - 1}`) || duration.includes(`${currentYear + 1}`)) {
      return '即将到期';
    } else {
      return '已完成';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'bg-green-100 text-green-800';
      case '即将到期':
        return 'bg-yellow-100 text-yellow-800';
      case '已完成':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatRevenue = (revenue: string) => {
    return revenue.replace('¥', '').replace(',', '');
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--color-primary-500)]" />
            IP授权管理
          </CardTitle>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增授权
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {analysisData.licensingProjects.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <p>暂无授权项目</p>
            <p className="text-sm mt-1">创建首个IP授权项目开始商业化</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">项目名称</TableHead>
                  <TableHead className="font-semibold">授权期限</TableHead>
                  <TableHead className="font-semibold">状态</TableHead>
                  <TableHead className="font-semibold">授权收益</TableHead>
                  <TableHead className="font-semibold text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisData.licensingProjects.map((project, index) => {
                  const status = getStatusFromDuration(project.duration);

                  return (
                    <TableRow key={index} className="hover:bg-[var(--bg-tertiary)]">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--color-primary-50)] rounded-md flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-[var(--color-primary-500)]" />
                          </div>
                          <span className="text-[var(--text-primary)]">
                            {project.projectName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" />
                          {project.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[var(--text-secondary)]" />
                          <span className="font-semibold text-[var(--text-primary)]">
                            ¥{formatRevenue(project.revenue)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)]"
                            title="更多操作"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* 统计信息 */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-secondary)] text-sm text-[var(--text-secondary)]">
              <span>共 {analysisData.licensingProjects.length} 个授权项目</span>
              <span>
                总收益: ¥{analysisData.licensingProjects
                  .reduce((total, project) => {
                    const revenue = parseFloat(formatRevenue(project.revenue));
                    return total + revenue;
                  }, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IPLicensingTable;