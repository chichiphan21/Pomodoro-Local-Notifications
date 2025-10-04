import { cn, formatTime, calculateStrokeDashArray, calculateStrokeDashOffset } from '@/lib/utils'

interface TimerDisplayProps {
  currentTime: number
  totalTime: number
  progress: number
  sessionType: 'work' | 'short-break' | 'long-break'
  isRunning: boolean
  className?: string
}

export function TimerDisplay({ 
  currentTime, 
  progress, 
  sessionType, 
  isRunning,
  className 
}: TimerDisplayProps) {
  const radius = 120
  const circumference = calculateStrokeDashArray(radius)
  const strokeDashoffset = calculateStrokeDashOffset(radius, progress)
  
  const sessionColors = {
    work: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      stroke: 'stroke-blue-500',
      text: 'text-blue-600 dark:text-blue-400'
    },
    'short-break': {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      stroke: 'stroke-green-500',
      text: 'text-green-600 dark:text-green-400'
    },
    'long-break': {
      bg: 'bg-purple-50 dark:bg-purple-950',
      border: 'border-purple-200 dark:border-purple-800',
      stroke: 'stroke-purple-500',
      text: 'text-purple-600 dark:text-purple-400'
    }
  }
  
  const colors = sessionColors[sessionType]
  
  const sessionLabels = {
    work: 'Làm việc',
    'short-break': 'Nghỉ ngắn',
    'long-break': 'Nghỉ dài'
  }

  return (
    <div className={cn(
      'relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300',
      colors.bg,
      colors.border,
      isRunning && 'timer-pulse shadow-lg',
      className
    )}>
      {/* Progress Circle */}
      <div className="relative">
        <svg
          width="280"
          height="280"
          className="timer-circle"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('timer-progress', colors.stroke)}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center"> 
          <div className={cn('text-5xl font-bold mb-2', colors.text)}>
            {formatTime(currentTime)}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            {sessionLabels[sessionType]}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {Math.round(progress)}% hoàn thành
          </div>
        </div>
      </div>
      
      {/* Session indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <div className={cn('w-3 h-3 rounded-full', isRunning ? 'animate-pulse' : '', colors.stroke.replace('stroke-', 'bg-'))} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isRunning ? 'Đang chạy...' : 'Tạm dừng'}
        </span>
      </div>
    </div>
  )
}