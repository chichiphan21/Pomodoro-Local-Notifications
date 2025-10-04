// SessionHistory.tsx (simplified to show recent sessions, focused on today)
import { Clock, CheckCircle, XCircle, Coffee, Briefcase } from 'lucide-react'
import type { PomodoroSession } from '@/hooks/usePomodoro'

interface SessionHistoryProps {
  sessions: PomodoroSession[]
  onClearHistory: () => void
}

export function SessionHistory({ sessions, onClearHistory }: SessionHistoryProps) {
  const todaySessions = sessions.filter(session => new Date(session.completedAt).toDateString() === new Date().toDateString())

  const completedToday = todaySessions.filter(s => s.wasCompleted).length
  const totalTimeToday = todaySessions.reduce((total, session) => total + session.duration, 0) / 60000 // minutes
  const workSessions = todaySessions.filter(s => s.type === 'work' && s.wasCompleted).length
  const breakSessions = todaySessions.filter(s => s.type !== 'work' && s.wasCompleted).length

  const getSessionIcon = (type: PomodoroSession['type']) => {
    switch (type) {
      case 'work': return <Briefcase className="h-4 w-4" />
      default: return <Coffee className="h-4 w-4" />
    }
  }

  const getSessionLabel = (type: PomodoroSession['type']) => {
    switch (type) {
      case 'work': return 'Làm việc'
      case 'short-break': return 'Nghỉ ngắn'
      case 'long-break': return 'Nghỉ dài'
    }
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3 className="history-title">Lịch sử phiên</h3>
        {sessions.length > 0 && (
          <button onClick={onClearHistory} className="clear-history-btn">Xóa lịch sử</button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <CheckCircle size={20} color="#10b981" />
          <span className="stat-value">{completedToday}</span>
          <div className="stat-label">Phiên hoàn thành</div>
        </div>
        
        <div className="stat-item">
          <Clock size={20} color="#3b82f6" />
          <span className="stat-value">{Math.floor(totalTimeToday)} phút</span>
          <div className="stat-label">Tổng thời gian</div>
        </div>

        <div className="stat-item">
          <Briefcase size={20} color="#f59e0b" />
          <span className="stat-value">{workSessions}</span>
          <div className="stat-label">Phiên làm việc</div>
        </div>

        <div className="stat-item">
          <Coffee size={20} color="#10b981" />
          <span className="stat-value">{breakSessions}</span>
          <div className="stat-label">Phiên nghỉ</div>
        </div>
      </div>

      <div className="session-list">
        {sessions.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} color="rgba(255,255,255,0.5)" />
            <p>Chưa có phiên nào. Bắt đầu timer để xem!</p>
          </div>
        ) : (
          sessions.slice(0, 10).map((session) => (
            <div key={session.id} className={`session-item ${session.type}`}>
              <div className="session-info">
                <div className="session-type-info">
                  {getSessionIcon(session.type)}
                  <span>{getSessionLabel(session.type)}</span>
                </div>
                <div className="session-status">
                  {session.wasCompleted ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                  <span>{session.wasCompleted ? 'Hoàn thành' : 'Bỏ qua'}</span>
                </div>
              </div>
              <div className="session-time">
                <div className="session-duration">{Math.floor(session.duration / 60000)}:{((session.duration / 1000) % 60).toString().padStart(2, '0')}</div>
                <div className="session-timestamp">{session.completedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}