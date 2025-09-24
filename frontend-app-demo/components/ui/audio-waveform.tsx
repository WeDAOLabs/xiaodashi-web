'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

export interface RiskPoint {
  id: string
  start: number
  end: number
  label: string
  type: 'high' | 'medium' | 'low'
}

export interface AudioWaveformProps {
  audioUrl?: string
  height?: number
  riskPoints?: RiskPoint[]
  className?: string
  onRiskPointClick?: (riskPoint: RiskPoint) => void
}

export function AudioWaveform({
  height = 120,
  riskPoints = [],
  className = '',
  onRiskPointClick
}: Omit<AudioWaveformProps, 'audioUrl'>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(23) // 模拟音频时长
  const animationRef = useRef<number | undefined>(undefined)

  // 生成模拟波形数据
  const generateWaveformData = useCallback((width: number): number[] => {
    const points = Math.floor(width / 3) // 每3px一个数据点
    const data: number[] = []

    for (let i = 0; i < points; i++) {
      // 生成更真实的音频波形数据
      const baseFreq = Math.sin(i * 0.02) * 0.5
      const noise = (Math.random() - 0.5) * 0.3
      const envelope = Math.sin((i / points) * Math.PI) * 0.8 // 包络
      data.push(Math.max(0.1, Math.min(1, baseFreq + noise + envelope)))
    }

    return data
  }, [])

  // 绘制波形
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height: canvasHeight } = canvas
    const waveformData = generateWaveformData(width)

    // 清空画布
    ctx.clearRect(0, 0, width, canvasHeight)

    // 获取CSS变量颜色
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6'
    const primaryColorAlpha = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6'

    // 绘制背景波形
    ctx.fillStyle = `${primaryColorAlpha}40` // 25% 透明度
    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 1.5

    const centerY = canvasHeight / 2
    const maxAmplitude = canvasHeight * 0.4

    ctx.beginPath()
    ctx.moveTo(0, centerY)

    // 绘制波形路径
    waveformData.forEach((amplitude, index) => {
      const x = (index / waveformData.length) * width
      const y = centerY - (amplitude * maxAmplitude)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // 绘制下半部分镜像
    for (let i = waveformData.length - 1; i >= 0; i--) {
      const x = (i / waveformData.length) * width
      const y = centerY + (waveformData[i] * maxAmplitude)
      ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 绘制进度指示器
    if (isPlaying || currentTime > 0) {
      const progressX = (currentTime / duration) * width
      ctx.strokeStyle = primaryColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, canvasHeight)
      ctx.stroke()
    }

    // 绘制风险点
    riskPoints.forEach(riskPoint => {
      const startX = (riskPoint.start / duration) * width
      const endX = (riskPoint.end / duration) * width

      // 风险点颜色映射
      const colorMap = {
        high: '#ef4444',    // red-500
        medium: '#f59e0b',  // amber-500
        low: '#22c55e'      // emerald-500
      }

      // 绘制风险区域背景
      ctx.fillStyle = `${colorMap[riskPoint.type]}20` // 12.5% 透明度
      ctx.fillRect(startX, 0, endX - startX, canvasHeight)

      // 绘制风险点标记线
      ctx.strokeStyle = colorMap[riskPoint.type]
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(startX, 0)
      ctx.lineTo(startX, canvasHeight)
      ctx.stroke()
      ctx.setLineDash([]) // 重置虚线
    })
  }, [generateWaveformData, isPlaying, currentTime, duration, riskPoints])

  // 处理画布点击
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const clickTime = (x / canvas.width) * duration

    // 检查是否点击了风险点
    const clickedRiskPoint = riskPoints.find(rp =>
      clickTime >= rp.start && clickTime <= rp.end
    )

    if (clickedRiskPoint && onRiskPointClick) {
      onRiskPointClick(clickedRiskPoint)
    } else {
      // 跳转到点击位置
      setCurrentTime(clickTime)
    }
  }, [duration, riskPoints, onRiskPointClick])

  // 播放/暂停控制
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // 动画循环
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prev => {
          const next = prev + 0.1
          if (next >= duration) {
            setIsPlaying(false)
            return duration
          }
          return next
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, duration])

  // 响应式画布尺寸
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = height * dpr

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
        canvas.style.width = rect.width + 'px'
        canvas.style.height = height + 'px'
      }

      drawWaveform()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [height, drawWaveform])

  // 重绘画布
  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePlayPause}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <span className="text-sm text-muted-foreground font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full rounded-md border bg-background cursor-pointer"
        style={{ height: `${height}px` }}
      />

      {riskPoints.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {riskPoints.map(riskPoint => (
            <button
              key={riskPoint.id}
              onClick={() => onRiskPointClick?.(riskPoint)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                riskPoint.type === 'high'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : riskPoint.type === 'medium'
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              {riskPoint.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}