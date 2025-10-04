// hooks/usePomodoro.tsx (Added type for isActive, added currentSession to deps, install dep for App)
import { useState, useEffect, useCallback, useRef } from 'react'
import { App } from '@capacitor/app'
import { notificationService } from '@/services/notifications'
import { generateSessionId } from '@/lib/utils'

export type SessionType = 'work' | 'short-break' | 'long-break'
export type TimerState = 'idle' | 'running' | 'paused'

export interface PomodoroSession {
  id: string
  type: SessionType
  duration: number // in milliseconds
  completedAt: Date
  wasCompleted: boolean
}

export interface PomodoroConfig {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  longBreakInterval: number
}

const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4
}

export interface UsePomodoroReturn {
  currentTime: number // seconds remaining
  totalTime: number
  timerState: TimerState
  currentSession: SessionType
  sessionCount: number
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipSession: () => void
  progress: number
  config: PomodoroConfig
  updateConfig: (newConfig: Partial<PomodoroConfig>) => void
  sessions: PomodoroSession[]
  clearHistory: () => void
}

export function usePomodoro(
  initialConfig: Partial<PomodoroConfig> = {},
  onSessionComplete?: (session: SessionType) => void
): UsePomodoroReturn {
  const [config, setConfig] = useState<PomodoroConfig>({ ...DEFAULT_CONFIG, ...initialConfig })
  const [currentSession, setCurrentSession] = useState<SessionType>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [currentTime, setCurrentTime] = useState(config.workDuration * 60)
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.map((session: Omit<PomodoroSession, 'completedAt'> & { completedAt: string }) => ({
          ...session,
          completedAt: new Date(session.completedAt)
        }))
      } catch (error) {
        console.error('Failed to parse sessions from localStorage:', error)
        return []
      }
    }
    return []
  })
  
  const intervalRef = useRef<number | null>(null)
  const endTimeRef = useRef<number | null>(null)
  const scheduledIdRef = useRef<number | null>(null)
  const sessionStartTimeRef = useRef<Date | null>(null)
  
  const totalTime = (() => {
    switch (currentSession) {
      case 'work': return config.workDuration * 60
      case 'short-break': return config.shortBreakDuration * 60
      case 'long-break': return config.longBreakDuration * 60
      default: return config.workDuration * 60
    }
  })()
  
  const progress = ((totalTime - currentTime) / totalTime) * 100
  
  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions))
  }, [sessions])
  
  useEffect(() => {
    setCurrentTime(totalTime)
    endTimeRef.current = null
  }, [currentSession, totalTime])
  
  const completeSession = useCallback(() => {
    if (!sessionStartTimeRef.current) return
    
    const session: PomodoroSession = {
      id: generateSessionId(),
      type: currentSession,
      duration: Date.now() - sessionStartTimeRef.current.getTime(),
      completedAt: new Date(),
      wasCompleted: true
    }
    
    setSessions(prev => [session, ...prev])
    onSessionComplete?.(currentSession)
    
    if (currentSession === 'work') {
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      setCurrentSession(newCount % config.longBreakInterval === 0 ? 'long-break' : 'short-break')
    } else {
      setCurrentSession('work')
    }
    
    sessionStartTimeRef.current = null
    endTimeRef.current = null
  }, [currentSession, sessionCount, config.longBreakInterval, onSessionComplete])
  
  const tick = useCallback(() => {
    if (endTimeRef.current) {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      setCurrentTime(remaining)
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setTimerState('idle')
        completeSession()
      }
    }
  }, [completeSession])
  
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerState, tick])
  
  const startTimer = useCallback(() => {
    if (timerState !== 'running') {
      endTimeRef.current = Date.now() + currentTime * 1000
      setTimerState('running')
      if (timerState === 'idle') sessionStartTimeRef.current = new Date()
    }
  }, [timerState, currentTime])
  
  const pauseTimer = useCallback(() => {
    setTimerState('paused')
  }, [])
  
  const resetTimer = useCallback(() => {
    setTimerState('idle')
    setCurrentTime(totalTime)
    endTimeRef.current = null
    sessionStartTimeRef.current = null
    if (scheduledIdRef.current) {
      notificationService.cancelNotification(scheduledIdRef.current)
      scheduledIdRef.current = null
    }
  }, [totalTime])
  
  const skipSession = useCallback(() => {
    if (sessionStartTimeRef.current) {
      const session: PomodoroSession = {
        id: generateSessionId(),
        type: currentSession,
        duration: Date.now() - sessionStartTimeRef.current.getTime(),
        completedAt: new Date(),
        wasCompleted: false
      }
      setSessions(prev => [session, ...prev])
    }
    
    setTimerState('idle')
    endTimeRef.current = null
    sessionStartTimeRef.current = null
    
    if (currentSession === 'work') {
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      setCurrentSession(newCount % config.longBreakInterval === 0 ? 'long-break' : 'short-break')
    } else {
      setCurrentSession('work')
    }
    if (scheduledIdRef.current) {
      notificationService.cancelNotification(scheduledIdRef.current)
      scheduledIdRef.current = null
    }
  }, [currentSession, sessionCount, config.longBreakInterval])
  
  const updateConfig = useCallback((newConfig: Partial<PomodoroConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])
  
  const clearHistory = useCallback(() => {
    setSessions([])
    localStorage.removeItem('pomodoro-sessions')
  }, [])
  
  // Background handling
  useEffect(() => {
    let listener: { remove: () => void } | null = null
    
    const setupAppStateListener = async () => {
      try {
        listener = await App.addListener('appStateChange', async ({ isActive }: { isActive: boolean }) => {
          if (!isActive && timerState === 'running' && endTimeRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            const endDate = new Date(endTimeRef.current)
            const id = await notificationService.scheduleTimerEndNotification(currentSession, endDate)
            scheduledIdRef.current = id
          } else if (isActive && timerState === 'running') {
            if (scheduledIdRef.current) {
              await notificationService.cancelNotification(scheduledIdRef.current)
              scheduledIdRef.current = null
            }
            if (endTimeRef.current) {
              const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
              setCurrentTime(remaining)
              if (remaining <= 0) {
                setTimerState('idle')
                completeSession()
              } else {
                intervalRef.current = setInterval(tick, 1000)
              }
            }
          }
        })
      } catch (error) {
        console.warn('Failed to setup app state listener:', error)
      }
    }
    
    setupAppStateListener()
    
    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, [timerState, completeSession, tick, currentSession])

  return {
    currentTime,
    totalTime,
    timerState,
    currentSession,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    progress,
    config,
    updateConfig,
    sessions,
    clearHistory
  }
}