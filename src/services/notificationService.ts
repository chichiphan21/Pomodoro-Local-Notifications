import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Dialog } from '@capacitor/dialog'
import type { SessionType } from '@/hooks/usePomodoro'

export interface NotificationConfig {
  enableNotifications: boolean
  enableHaptics: boolean
  notificationSound: 'default' | 'bell' | 'chime' | 'none'
  notificationTitle: string
  notificationBody: string
}

const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enableNotifications: true,
  enableHaptics: true,
  notificationSound: 'default',
  notificationTitle: 'Pomodoro Timer',
  notificationBody: 'Session completed!'
}

class NotificationService {
  private config: NotificationConfig
  private notificationId = 1

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = { ...DEFAULT_NOTIFICATION_CONFIG, ...config }
    this.initialize()
  }

  private async initialize() {
    try {
      // Request notification permissions
      const permission = await LocalNotifications.requestPermissions()
      
      if (permission.display !== 'granted') {
        console.warn('Notification permissions not granted')
        this.config.enableNotifications = false
      }

      // Check if notifications are supported
      const isSupported = await LocalNotifications.areEnabled()
      if (!isSupported.value) {
        console.warn('Local notifications not supported')
        this.config.enableNotifications = false
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
      this.config.enableNotifications = false
    }
  }

  async notifySessionComplete(sessionType: SessionType): Promise<void> {
    const { title, body } = this.getSessionMessage(sessionType)
    
    // Show notification
    if (this.config.enableNotifications) {
      await this.showNotification(title, body)
    }

    // Trigger haptic feedback
    if (this.config.enableHaptics) {
      await this.triggerHapticFeedback(sessionType)
    }

    // Show dialog for fallback
    await this.showCompletionDialog(title, body)
  }

  private async showNotification(title: string, body: string): Promise<void> {
    try {
      const notification: LocalNotificationSchema = {
        id: this.notificationId++,
        title,
        body,
        largeBody: body,
        summaryText: 'Pomodoro Timer',
        sound: this.config.notificationSound === 'none' ? undefined : `public/sounds/${this.config.notificationSound}.mp3`,
        attachments: undefined,
        actionTypeId: '',
        extra: null,
        schedule: {
          at: new Date(Date.now() + 100) // Show immediately
        }
      }

      await LocalNotifications.schedule({
        notifications: [notification]
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  private async triggerHapticFeedback(sessionType: SessionType): Promise<void> {
    try {
      // Different haptic patterns for different session types
      switch (sessionType) {
        case 'work':
          // Strong vibration for completed work session
          await Haptics.impact({ style: ImpactStyle.Heavy })
          await new Promise(resolve => setTimeout(resolve, 200))
          await Haptics.impact({ style: ImpactStyle.Heavy })
          break
        case 'short-break':
        case 'long-break':
          // Gentle vibration for break completion
          await Haptics.impact({ style: ImpactStyle.Light })
          await new Promise(resolve => setTimeout(resolve, 100))
          await Haptics.impact({ style: ImpactStyle.Light })
          await new Promise(resolve => setTimeout(resolve, 100))
          await Haptics.impact({ style: ImpactStyle.Light })
          break
      }
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error)
    }
  }

  private async showCompletionDialog(title: string, body: string): Promise<void> {
    try {
      await Dialog.alert({
        title,
        message: body,
        buttonTitle: 'OK'
      })
    } catch (error) {
      console.error('Failed to show completion dialog:', error)
    }
  }

  private getSessionMessage(sessionType: SessionType): { title: string; body: string } {
    switch (sessionType) {
      case 'work':
        return {
          title: '🎉 Phiên làm việc hoàn thành!',
          body: 'Bạn đã hoàn thành 25 phút tập trung. Giờ là lúc nghỉ ngơi!'
        }
      case 'short-break':
        return {
          title: '☕ Nghỉ ngơi xong!',
          body: 'Bạn đã nghỉ ngơi 5 phút. Sẵn sàng cho phiên làm việc tiếp theo?'
        }
      case 'long-break':
        return {
          title: '🌟 Nghỉ dài hoàn thành!',
          body: 'Bạn đã nghỉ ngơi 15 phút. Hãy bắt đầu chu kỳ mới với năng lượng tràn đầy!'
        }
      default:
        return {
          title: this.config.notificationTitle,
          body: this.config.notificationBody
        }
    }
  }

  // Schedule a notification for when the timer ends (useful for background operation)
  async scheduleTimerEndNotification(sessionType: SessionType, endTime: Date): Promise<number> {
    if (!this.config.enableNotifications) {
      return -1
    }

    try {
      const { title, body } = this.getSessionMessage(sessionType)
      const notification: LocalNotificationSchema = {
        id: this.notificationId++,
        title,
        body,
        largeBody: body,
        summaryText: 'Pomodoro Timer',
        sound: this.config.notificationSound === 'none' ? undefined : `public/sounds/${this.config.notificationSound}.mp3`,
        attachments: undefined,
        actionTypeId: '',
        extra: null,
        schedule: {
          at: endTime
        }
      }

      await LocalNotifications.schedule({
        notifications: [notification]
      })

      return notification.id
    } catch (error) {
      console.error('Failed to schedule notification:', error)
      return -1
    }
  }

  // Cancel a scheduled notification
  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id }]
      })
    } catch (error) {
      console.error('Failed to cancel notification:', error)
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Save to localStorage
    localStorage.setItem('pomodoro-notification-config', JSON.stringify(this.config))
  }

  // Get current configuration
  getConfig(): NotificationConfig {
    return { ...this.config }
  }

  // Load configuration from localStorage
  static loadConfig(): NotificationConfig {
    try {
      const saved = localStorage.getItem('pomodoro-notification-config')
      if (saved) {
        return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load notification config:', error)
    }
    return DEFAULT_NOTIFICATION_CONFIG
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService(NotificationService.loadConfig())

export default NotificationService