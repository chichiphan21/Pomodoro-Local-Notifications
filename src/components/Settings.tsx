// components/Settings.tsx (Removed unused imports)
import { Button } from '@/components/ui/button'
import type { PomodoroConfig } from '@/hooks/usePomodoro'

interface SettingsProps {
  config: PomodoroConfig
  onConfigUpdate: (config: Partial<PomodoroConfig>) => void
  soundEnabled: boolean
  onSoundToggle: (enabled: boolean) => void
  vibrationEnabled: boolean
  onVibrationToggle: (enabled: boolean) => void
  selectedSound: string
  onSoundChange: (sound: string) => void
}

const SOUND_OPTIONS = [
  { value: 'default', label: 'Mặc định', icon: '🔔' },
  { value: 'bell', label: 'Chuông', icon: '🛎️' },
  { value: 'chime', label: 'Kèn', icon: '🎵' }
]

export function Settings({
  config,
  onConfigUpdate,
  soundEnabled,
  onSoundToggle,
  vibrationEnabled,
  onVibrationToggle,
  selectedSound,
  onSoundChange
}: SettingsProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Cài đặt</h3>

      <div className="settings-content">
        <div className="settings-section">
          <h4 className="settings-section-title">Thời gian (phút)</h4>
          <div className="settings-items">
            <div className="settings-item">
              <label>Làm việc</label>
              <div className="settings-controls">
                <button onClick={() => onConfigUpdate({ workDuration: Math.max(1, config.workDuration - 5) })}>-</button>
                <span>{config.workDuration}</span>
                <button onClick={() => onConfigUpdate({ workDuration: Math.min(60, config.workDuration + 5) })}>+</button>
              </div>
            </div>
            <div className="settings-item">
              <label>Nghỉ ngắn</label>
              <div className="settings-controls">
                <button onClick={() => onConfigUpdate({ shortBreakDuration: Math.max(1, config.shortBreakDuration - 1) })}>-</button>
                <span>{config.shortBreakDuration}</span>
                <button onClick={() => onConfigUpdate({ shortBreakDuration: Math.min(30, config.shortBreakDuration + 1) })}>+</button>
              </div>
            </div>
            <div className="settings-item">
              <label>Nghỉ dài</label>
              <div className="settings-controls">
                <button onClick={() => onConfigUpdate({ longBreakDuration: Math.max(5, config.longBreakDuration - 5) })}>-</button>
                <span>{config.longBreakDuration}</span>
                <button onClick={() => onConfigUpdate({ longBreakDuration: Math.min(60, config.longBreakDuration + 5) })}>+</button>
              </div>
            </div>
            <div className="settings-item">
              <label>Chu kỳ nghỉ dài</label>
              <div className="settings-controls">
                <button onClick={() => onConfigUpdate({ longBreakInterval: Math.max(2, config.longBreakInterval - 1) })}>-</button>
                <span>{config.longBreakInterval}</span>
                <button onClick={() => onConfigUpdate({ longBreakInterval: Math.min(10, config.longBreakInterval + 1) })}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4 className="settings-section-title">Thông báo</h4>
          <div className="settings-items">
            <div className="settings-item">
              <label>Âm thanh</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={soundEnabled} onChange={(e) => onSoundToggle(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-item">
              <label>Rung</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={vibrationEnabled} onChange={(e) => onVibrationToggle(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {soundEnabled && (
          <div className="settings-section">
            <h4 className="settings-section-title">Âm báo</h4>
            <div className="sound-options">
              {SOUND_OPTIONS.map((sound) => (
                <button
                  key={sound.value}
                  onClick={() => onSoundChange(sound.value)}
                  className={`sound-option ${selectedSound === sound.value ? 'selected' : ''}`}
                >
                  <span>{sound.icon}</span>
                  <span>{sound.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            onConfigUpdate({
              workDuration: 25,
              shortBreakDuration: 5,
              longBreakDuration: 15,
              longBreakInterval: 4
            })
            onSoundChange('default')
          }}
          style={{ width: '100%' }}
        >
          Khôi phục mặc định
        </Button>
      </div>
    </div>
  )
}