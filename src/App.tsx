// App.tsx (No code changes needed; install dependency as per fix)
import { useState, useCallback, useEffect } from 'react'
import { Settings as SettingsIcon, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Timer } from '@/components/Timer'
import { SessionHistory } from '@/components/SessionHistory'
import { Settings } from '@/components/Settings'
import { usePomodoro } from '@/hooks/usePomodoro'
import { handleSessionComplete, notificationService } from '@/services/notifications'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [selectedSound, setSelectedSound] = useState('default')
  
  const onSessionComplete = useCallback(async (sessionType: 'work' | 'short-break' | 'long-break') => {
    await handleSessionComplete(sessionType, {
      showNotification: true,
      playSound: soundEnabled,
      vibrate: vibrationEnabled,
      soundName: selectedSound
    })
  }, [soundEnabled, vibrationEnabled, selectedSound])
  
  const pomodoro = usePomodoro({}, onSessionComplete)
  
  useEffect(() => {
    notificationService.requestPermissions()
  }, [])

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">🍅 Pomodoro Timer</h1>
          <p className="app-subtitle">Kỹ thuật quản lý thời gian hiệu quả với chu kỳ 25/5 phút</p>
        </header>

        <Timer
          currentTime={pomodoro.currentTime}
          totalTime={pomodoro.totalTime}
          timerState={pomodoro.timerState}
          currentSession={pomodoro.currentSession}
          progress={pomodoro.progress}
          onStart={pomodoro.startTimer}
          onPause={pomodoro.pauseTimer}
          onReset={pomodoro.resetTimer}
          onSkip={pomodoro.skipSession}
        />
        
        <div className="session-counter">
          <div className="counter-label">Phiên làm việc hoàn thành</div>
          <div className="counter-value">{pomodoro.sessionCount}</div>
        </div>

        <div className="action-buttons">
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-secondary action-btn"
          >
            <History size={18} />
            <span>Lịch sử</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-secondary action-btn"
          >
            <SettingsIcon size={18} />
            <span>Cài đặt</span>
          </Button>
        </div>

        {showHistory && (
          <SessionHistory
            sessions={pomodoro.sessions}
            onClearHistory={pomodoro.clearHistory}
          />
        )}

        {showSettings && (
          <Settings
            config={pomodoro.config}
            onConfigUpdate={pomodoro.updateConfig}
            soundEnabled={soundEnabled}
            onSoundToggle={setSoundEnabled}
            vibrationEnabled={vibrationEnabled}
            onVibrationToggle={setVibrationEnabled}
            selectedSound={selectedSound}
            onSoundChange={setSelectedSound}
          />
        )}
      </div>
    </div>
  )
}

export default App