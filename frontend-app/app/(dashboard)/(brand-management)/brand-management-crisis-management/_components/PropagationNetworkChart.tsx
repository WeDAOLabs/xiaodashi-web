'use client';

import React from 'react';

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  type: 'source' | 'media' | 'social' | 'user';
}

interface NetworkLink {
  from: string;
  to: string;
  strength: number;
}

const PropagationNetworkChart: React.FC = () => {
  const nodes: NetworkNode[] = React.useMemo(() => [
    { id: 'source', label: '原始事件', x: 70, y: 70, size: 10, type: 'source' },
    { id: 'weibo', label: '微博', x: 130, y: 45, size: 8, type: 'media' },
    { id: 'xiaohongshu', label: '小红书', x: 130, y: 95, size: 8, type: 'media' },
    { id: 'douyin', label: '抖音', x: 190, y: 55, size: 7, type: 'social' },
    { id: 'wechat', label: '微信群', x: 190, y: 85, size: 7, type: 'social' },
    { id: 'user1', label: 'KOL', x: 250, y: 35, size: 5, type: 'user' },
    { id: 'user2', label: '粉丝', x: 250, y: 70, size: 5, type: 'user' },
    { id: 'user3', label: '评论', x: 250, y: 105, size: 5, type: 'user' },
  ], []);

  const links: NetworkLink[] = React.useMemo(() => [
    { from: 'source', to: 'weibo', strength: 0.8 },
    { from: 'source', to: 'xiaohongshu', strength: 0.6 },
    { from: 'weibo', to: 'douyin', strength: 0.7 },
    { from: 'weibo', to: 'user1', strength: 0.9 },
    { from: 'xiaohongshu', to: 'wechat', strength: 0.5 },
    { from: 'xiaohongshu', to: 'user2', strength: 0.6 },
    { from: 'douyin', to: 'user1', strength: 0.4 },
    { from: 'douyin', to: 'user3', strength: 0.5 },
    { from: 'wechat', to: 'user2', strength: 0.7 },
    { from: 'wechat', to: 'user3', strength: 0.3 },
  ], []);

  const getNodeColor = (type: NetworkNode['type']): string => {
    switch (type) {
      case 'source': return 'var(--color-danger-600)';
      case 'media': return 'var(--color-warning-600)';
      case 'social': return 'var(--color-info-600)';
      case 'user': return 'var(--text-secondary)';
    }
  };

  const getStrokeWidth = (strength: number): number => {
    return Math.max(1, strength * 3);
  };

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex items-center justify-center mb-1">
        <h4 className="text-xs font-medium text-[var(--text-secondary)]">舆情传播路径图</h4>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 140"
          className="border-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="舆情传播路径网络图，显示从原始事件到各个平台和用户的传播路径"
        >
          {/* 渲染连接线 */}
          <g>
            {links.map((link, index) => {
              const fromNode = nodes.find(n => n.id === link.from);
              const toNode = nodes.find(n => n.id === link.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={`link-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="var(--border-primary)"
                  strokeWidth={getStrokeWidth(link.strength)}
                  opacity={0.6}
                />
              );
            })}
          </g>

          {/* 渲染节点 */}
          <g>
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={getNodeColor(node.type)}
                  opacity={0.8}
                  stroke="white"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + node.size + 6}
                  textAnchor="middle"
                  fontSize="7"
                  fill="var(--text-secondary)"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>

          {/* 添加箭头标记定义 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="var(--border-primary)"
                opacity={0.6}
              />
            </marker>
          </defs>
        </svg>
      </div>

      {/* 图例 */}
      <div className="flex justify-center mt-1">
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-danger-600)]"></div>
            <span className="text-[var(--text-tertiary)] text-[10px]">事件源</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-warning-600)]"></div>
            <span className="text-[var(--text-tertiary)] text-[10px]">媒体</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-info-600)]"></div>
            <span className="text-[var(--text-tertiary)] text-[10px]">社交</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]"></div>
            <span className="text-[var(--text-tertiary)] text-[10px]">用户</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropagationNetworkChart;