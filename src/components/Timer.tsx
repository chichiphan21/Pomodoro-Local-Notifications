// Timer.tsx (fixed progress circle rotation, simplified controls)
import { Play, Pause, Square, SkipForward } from 'lucide-react'
import { formatTime, calculateStrokeDashArray, calculateStrokeDashOffset } from '@/lib/utils'
import type { SessionType, TimerState } from '@/hooks/usePomodoro'

interface TimerProps {
  currentTime: number
  totalTime: number
  timerState: TimerState
  currentSession: SessionType
  progress: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const SESSION_LABELS = {
  work: 'Làm việc',
  'short-break': 'Nghỉ ngắn',
  'long-break': 'Nghỉ dài'
}

const SESSION_ICONS = {
  work: '🍅',
  'short-break': '☕',
  'long-break': '🎉'
}

export function Timer({
  currentTime,
  totalTime,
  timerState,
  currentSession,
  progress,
  onStart,
  onPause,
  onReset,
  onSkip
}: TimerProps) {
  const radius = 120
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth / 2  // Corrected for stroke centering
  const circumference = calculateStrokeDashArray(normalizedRadius)
  const strokeDashoffset = calculateStrokeDashOffset(normalizedRadius, progress)

  const isRunning = timerState === 'running'
  const isPaused = timerState === 'paused'
  const isIdle = timerState === 'idle'

  return (
    <div className="timer-container">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{SESSION_ICONS[currentSession]}</div>
        <h2 className="session-type">{SESSION_LABELS[currentSession]}</h2>
      </div>

      <div className="timer-circle">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="rgba(255, 255, 255, 0.3)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          <circle
            stroke={currentSession === 'work' ? '#3b82f6' : '#10b981'}
            className="timer-progress"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}  // Fixed rotation to -90 for clockwise progress
          />
        </svg>
        
        <div className="timer-display-overlay">
          <div className={`timer-display ${isRunning ? 'timer-pulse' : ''}`}>
            {formatTime(currentTime)}
          </div>
          <div className="timer-total">{formatTime(totalTime)}</div>
        </div>
      </div>

      <div className="controls">
        {isIdle && (
          <button onClick={onStart} className="btn btn-primary">
            <Play size={24} fill="currentColor" />
          </button>
        )}

        {isRunning && (
          <button onClick={onPause} className="btn btn-primary">
            <Pause size={24} fill="currentColor" />
          </button>
        )}

        {isPaused && (
          <button onClick={onStart} className="btn btn-success">
            <Play size={24} fill="currentColor" />
          </button>
        )}

        {!isIdle && (
          <button onClick={onReset} className="btn btn-secondary">
            <Square size={24} />
          </button>
        )}

        <button onClick={onSkip} className="btn btn-secondary">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="progress-container" style={{ marginBottom: '13px' }}>
        <div className="progress-header" style={{ paddingBottom: '5px' }}>
          <span >Tiến độ</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentSession === 'work' ? '#3b82f6' : '#10b981'
            }}
          />
        </div>
      </div>

      <div className="status-indicator">
        <div className="status-badge">
          <div className={`status-dot ${isRunning ? 'running' : isPaused ? 'paused' : 'idle'}`} />
          {isRunning ? 'Đang chạy' : isPaused ? 'Tạm dừng' : 'Dừng'}
        </div>
      </div>
    </div>
  )
}