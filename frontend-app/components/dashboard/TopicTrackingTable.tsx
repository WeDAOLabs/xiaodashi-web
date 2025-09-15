import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

interface TopicData {
  topic: string;
  heat: number;
  trend: number;
  trendDirection: 'up' | 'down';
  relevance: number;
}

interface TopicTrackingTableProps {
  topics: TopicData[];
}

const TopicTrackingTable: React.FC<TopicTrackingTableProps> = ({ topics }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">
          热门话题追踪
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">话题</TableHead>
              <TableHead className="text-right">热度</TableHead>
              <TableHead className="text-right">趋势</TableHead>
              <TableHead className="text-right">相关度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="w-6 h-6 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] rounded-full flex items-center justify-center text-xs font-bold mr-3 p-0"
                    >
                      #
                    </Badge>
                    <span className="text-[var(--text-primary)] font-medium">{topic.topic}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-[var(--text-primary)] font-medium">
                  {topic.heat}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`text-sm font-medium flex items-center justify-end ${topic.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={topic.trendDirection === 'up' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                    {topic.trend}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    {renderStars(topic.relevance)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopicTrackingTable;