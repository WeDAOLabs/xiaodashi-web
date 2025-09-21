'use client';

import React from 'react';
import { InfoSectionProps } from './types';

/**
 * 信息展示区域组件
 * 用于展示键值对形式的信息
 */
const InfoSection: React.FC<InfoSectionProps> = ({ title, data }) => (
  <div>
    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
    {data.map((item, index) => (
      <div
        key={index}
        className="flex justify-between py-2 border-b border-[var(--border-secondary)]"
      >
        <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
        <span className="text-sm text-[var(--text-primary)] font-medium text-right">{item.value}</span>
      </div>
    ))}
  </div>
);

export default InfoSection;