'use client';

import React, { useEffect, useState } from 'react';

interface AIMarketingAnimationProps {
  className?: string;
}

const AIMarketingAnimation: React.FC<AIMarketingAnimationProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animationStyles = `
    .ai-animation-container .grid-pattern {
      background-image: 
        linear-gradient(rgba(75, 85, 99, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(75, 85, 99, 0.15) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: gridMove 20s linear infinite;
    }

    .ai-animation-container .ai-brain-core {
      animation: breathe 4s ease-in-out infinite;
    }

    .ai-animation-container .ai-brain-text {
      position: relative;
    }

    .ai-animation-container .tech-grid {
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 2px, transparent 2px);
      background-size: 30px 30px;
      animation: techGridMove 8s linear infinite;
    }

    .ai-animation-container .data-stream {
      animation: dataFlow 3s ease-in-out infinite;
    }

    .ai-animation-container .hologram-effect {
      animation: hologramFlicker 4s ease-in-out infinite;
    }

    .ai-animation-container .pulse-ring-1 {
      animation: pulse 3s ease-in-out infinite;
    }

    .ai-animation-container .pulse-ring-2 {
      animation: pulse 3s ease-in-out infinite 1s;
    }

    .ai-animation-container .pulse-ring-3 {
      animation: pulse 3s ease-in-out infinite 2s;
    }

    .ai-animation-container .connection-line {
      fill: none;
      stroke: url(#lineGradient);
      stroke-width: 2;
      stroke-dasharray: 12, 8;
      animation: lineWave 3s ease-in-out infinite;
    }

    .ai-animation-container .floating-particle {
      /* 移除粒子动画 */
    }

    .ai-animation-container .bar-animation {
      animation: barGrow 2s ease-in-out infinite;
    }

    .ai-animation-container .particle {
      animation: float 6s ease-in-out infinite;
    }

    .ai-animation-container .strategy-progress {
      animation: progressGrow 3s ease-out infinite;
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(40px, 40px); }
    }

    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }

    @keyframes techGridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(30px, 30px); }
    }

    @keyframes dataFlow {
      0%, 100% { 
        transform: translateY(0px);
        opacity: 0.6;
      }
      25% { 
        transform: translateY(-10px);
        opacity: 0.8;
      }
      50% { 
        transform: translateY(-5px);
        opacity: 1;
      }
      75% { 
        transform: translateY(-15px);
        opacity: 0.7;
      }
    }

    @keyframes hologramFlicker {
      0%, 100% { opacity: 1; }
      25% { opacity: 0.8; }
       50% { opacity: 0.9; }
      75% { opacity: 0.85; }
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    @keyframes lineWave {
      0% { 
        stroke-dashoffset: 0; 
        transform: translateY(0px);
      }
      25% { 
        stroke-dashoffset: 8; 
        transform: translateY(-2px);
      }
      50% { 
        stroke-dashoffset: 15; 
        transform: translateY(0px);
      }
      75% { 
        stroke-dashoffset: 23; 
        transform: translateY(2px);
      }
      100% { 
        stroke-dashoffset: 30; 
        transform: translateY(0px);
      }
    }

    @keyframes floatWave {
      0%, 100% { 
        transform: translateY(0px) translateX(0px) rotate(0deg); 
        opacity: 0.6; 
      }
      25% { 
        transform: translateY(-15px) translateX(3px) rotate(90deg); 
        opacity: 0.8; 
      }
      50% { 
        transform: translateY(-5px) translateX(-2px) rotate(180deg); 
        opacity: 1; 
      }
      75% { 
        transform: translateY(-20px) translateX(4px) rotate(270deg); 
        opacity: 0.7; 
      }
    }

    @keyframes barGrow {
      0%, 100% { transform: scaleY(0.5); }
      50% { transform: scaleY(1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
      33% { transform: translateY(-20px) rotate(120deg); opacity: 1; }
      66% { transform: translateY(10px) rotate(240deg); opacity: 0.8; }
    }

    @keyframes progressGrow {
      0% { transform: scaleX(0); }
      60% { transform: scaleX(1); }
      100% { transform: scaleX(1); }
    }

    .ai-animation-container .data-node:hover .node-card {
      transform: scale(1.05);
    }

    .ai-animation-container .node-card {
      transition: all 0.3s ease;
    }

    .ai-animation-container .node-card:hover {
      transform: scale(1.02);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className={`ai-animation-container relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-2xl overflow-hidden ${className}`}>
      {/* 主背景容器 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
        
        {/* 科技网格背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern absolute inset-0" />
          <div className="tech-grid absolute inset-0 opacity-60" />
        </div>

        {/* 数据流效果 */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="data-stream absolute w-px h-16 bg-gradient-to-b from-transparent via-blue-400/60 to-transparent"
              style={{
                left: `${25 + i * 20}%`,
                top: '20%',
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
          {[...Array(4)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="data-stream absolute h-px w-16 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
              style={{
                left: '20%',
                top: `${25 + i * 20}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        {/* 中央智赢AI */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="ai-brain-container relative">
            {/* AI核心背景 - 使用主题蓝色 */}
            <div className="ai-brain-core w-48 h-48 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)]" />
            
            {/* 脉冲环 */}
            <div className="pulse-ring-1 absolute inset-0 rounded-full border-2 border-[var(--primary-color)]/40" />
            <div className="pulse-ring-2 absolute inset-0 rounded-full border-2 border-[var(--accent-color)]/30" />
            <div className="pulse-ring-3 absolute inset-0 rounded-full border-2 border-blue-500/20" />

            {/* 中央智赢AI文字 - 科技感设计 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="ai-brain-text text-white text-4xl md:text-6xl font-bold tracking-wider">
                <span className="relative inline-block">
                  智赢
                  <span className="text-blue-200 ml-1">AI</span>
                </span>
              </div>
            </div>

            {/* 全息投影边框效果 */}
            <div className="hologram-effect absolute inset-2 rounded-full border border-blue-400/30">
              <div className="absolute inset-4 rounded-full border border-emerald-400/20" />
              <div className="absolute inset-6 rounded-full border border-blue-300/15" />
            </div>
          </div>
        </div>

        {/* 数据流节点 */}
        <div className="data-nodes absolute inset-0">
          {/* 左上角 - 内容创作 */}
          <div className={`data-node absolute top-8 left-4 md:top-16 md:left-16 transition-all duration-1500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="node-card bg-white/95 backdrop-blur-md rounded-xl p-3 md:p-4 border border-[var(--primary-color)]/30 hover:border-[var(--primary-color)]/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">智能内容创作</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-xs text-gray-600">文案生成: 98%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span className="text-xs text-gray-600">图片优化: 85%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">视频制作中...</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">✓ 已生成1.2K篇</div>
            </div>
          </div>

          {/* 右上角 - 数据分析 */}
          <div className={`data-node absolute top-8 right-4 md:top-16 md:right-16 transition-all duration-1500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="node-card bg-white/95 backdrop-blur-md rounded-xl p-3 md:p-4 border border-[var(--accent-color)]/30 hover:border-[var(--accent-color)]/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">实时数据分析</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-4 md:w-2 md:h-6 bg-[var(--primary-color)] rounded bar-animation" style={{animationDelay: '0s'}} />
                  <span className="text-xs text-gray-500 mt-1">流量</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-3 md:w-2 md:h-4 bg-[var(--accent-color)] rounded bar-animation" style={{animationDelay: '0.2s'}} />
                  <span className="text-xs text-gray-500 mt-1">转化</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-5 md:w-2 md:h-8 bg-purple-500 rounded bar-animation" style={{animationDelay: '0.4s'}} />
                  <span className="text-xs text-gray-500 mt-1">ROI</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">今日访问:</span>
                  <span className="text-blue-600 font-medium">8.7K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">转化率:</span>
                  <span className="text-green-600 font-medium">4.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 左下角 - 营销策略 */}
          <div className={`data-node absolute bottom-8 left-4 md:bottom-16 md:left-16 transition-all duration-1500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="node-card bg-white/95 backdrop-blur-md rounded-xl p-3 md:p-4 border border-purple-500/30 hover:border-purple-500/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">智能营销策略</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">目标受众匹配</span>
                  <div className="w-8 h-1 bg-purple-200 rounded overflow-hidden">
                    <div className="w-6 h-full bg-purple-500 rounded strategy-progress" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">渠道优化</span>
                  <div className="w-8 h-1 bg-purple-200 rounded overflow-hidden">
                    <div className="w-5 h-full bg-purple-500 rounded strategy-progress" style={{animationDelay: '0.5s'}} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">价格策略</span>
                  <div className="w-8 h-1 bg-purple-200 rounded overflow-hidden">
                    <div className="w-7 h-full bg-purple-500 rounded strategy-progress" style={{animationDelay: '1s'}} />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-600 font-medium">✓ 策略推荐: 12项</div>
            </div>
          </div>

          {/* 右下角 - 效果监控 */}
          <div className={`data-node absolute bottom-8 right-4 md:bottom-16 md:right-16 transition-all duration-1500 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="node-card bg-white/95 backdrop-blur-md rounded-xl p-3 md:p-4 border border-green-500/30 hover:border-green-500/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">实时效果监控</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">ROI增长</span>
                  <span className="text-xs text-green-600 font-bold">+180%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">客户获取</span>
                  <span className="text-xs text-blue-600 font-medium">+45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">成本降低</span>
                  <span className="text-xs text-orange-600 font-medium">-32%</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">实时监控中</span>
              </div>
            </div>
          </div>
        </div>

        {/* 连接线动画 */}
        <div className="connection-lines absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* 能量传输线 - 移除发光效果 */}
            <path className="connection-line" d="M 15% 20% Q 25% 35% 35% 45% T 50% 50%" strokeLinecap="round" style={{animationDelay: '0s'}} />
            <path className="connection-line" d="M 85% 20% Q 75% 35% 65% 45% T 50% 50%" strokeLinecap="round" style={{animationDelay: '1s'}} />
            <path className="connection-line" d="M 50% 50% Q 40% 60% 30% 70% T 15% 80%" strokeLinecap="round" style={{animationDelay: '2s'}} />
            <path className="connection-line" d="M 50% 50% Q 60% 60% 70% 70% T 85% 80%" strokeLinecap="round" style={{animationDelay: '3s'}} />
          </svg>
        </div>

        {/* 移除科技能量粒子 - 保持简洁 */}
      </div>
      </div>
    </>
  );
};

export default AIMarketingAnimation;