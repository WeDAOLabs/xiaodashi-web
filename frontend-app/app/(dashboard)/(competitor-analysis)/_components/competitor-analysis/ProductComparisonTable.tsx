'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeatureComparison {
  feature: string;
  our: {
    status: 'available' | 'unavailable' | 'developing';
    description: string;
  };
  competitorA: {
    status: 'available' | 'unavailable' | 'developing';
    description: string;
  };
  competitorB: {
    status: 'available' | 'unavailable' | 'developing';
    description: string;
  };
}

interface ProductComparisonTableProps {
  features: FeatureComparison[];
  className?: string;
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ features, className }) => {
  const getStatusDisplay = (status: string, description: string) => {
    switch (status) {
      case 'available':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded">{description}</span>
          </div>
        );
      case 'unavailable':
        return (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm">{description}</span>
          </div>
        );
      case 'developing':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin flex-shrink-0" />
            <span className="text-sm">{description}</span>
          </div>
        );
      default:
        return <span className="text-sm">{description}</span>;
    }
  };

  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 text-center">产品功能对比</h3>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <TableHeader className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-secondary)]">
            <TableRow>
              <TableHead className="px-6 py-3">功能点</TableHead>
              <TableHead className="px-6 py-3">我方</TableHead>
              <TableHead className="px-6 py-3">竞品A</TableHead>
              <TableHead className="px-6 py-3">竞品B</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index} className="bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
                <TableCell className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                  {feature.feature}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusDisplay(feature.our.status, feature.our.description)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusDisplay(feature.competitorA.status, feature.competitorA.description)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusDisplay(feature.competitorB.status, feature.competitorB.description)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductComparisonTable;