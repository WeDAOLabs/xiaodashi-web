import React from 'react';
import { DataTableColumn } from '../types';

interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, unknown>[];
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left">
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ${
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={String(record.id) || index}
              className="border-b border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  }`}
                >
                  {column.render
                    ? column.render(record[column.key], record)
                    : String(record[column.key] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;