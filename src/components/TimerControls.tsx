import { Play, Pause, Square, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TimerState } from '@/hooks/usePomodoro'

interface TimerControlsProps {
  timerState: TimerState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  disabled?: boolean
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onReset,
  onSkip,
  disabled = false
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Start/Pause button */}
      {timerState === 'running' ? (
        <Button
          onClick={onPause}
          disabled={disabled}
          size="circle"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 hover:scale-105 transition-transform"
        >
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          onClick={onStart}
          disabled={disabled}
          size="circle"
          className="h-16 w-16 rounded-full hover:scale-105 transition-transform"
        >
          <Play className="h-6 w-6 ml-1" />
        </Button>
      )}
      
      {/* Reset button */}
      <Button
        onClick={onReset}
        disabled={disabled}
        variant="outline"
        size="circle"
        className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
      >
        <Square className="h-4 w-4" />
      </Button>
      
      {/* Skip button */}
      <Button
        onClick={onSkip}
        disabled={disabled}
        variant="ghost"
        size="circle"
        className="h-12 w-12 rounded-full hover:scale-105 transition-transform"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  )
}