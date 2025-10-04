// services/notifications.ts (Fixed binary expression with ternary)
import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Dialog } from '@capacitor/dialog'
import type { SessionType } from '@/hooks/usePomodoro'

export class NotificationService {
  private notificationId = 1

  async requestPermissions(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions()
    return permission.display === 'granted'
  }

  async scheduleTimerEndNotification(sessionType: SessionType, endTime: Date): Promise<number> {
    try {
      const { title, body } = this.getSessionMessage(sessionType)
      const id = this.notificationId++
      const notification: LocalNotificationSchema = {
        id,
        title,
        body,
        schedule: { at: endTime },
        sound: 'default',
      }
      await LocalNotifications.schedule({ notifications: [notification] })
      return id
    } catch (error) {
      console.error('Failed to schedule:', error)
      return -1
    }
  }

  async cancelNotification(id: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id }] })
  }

  async scheduleSessionCompleteNotification(sessionType: SessionType): Promise<void> {
    const { title, body } = this.getSessionMessage(sessionType)
    await LocalNotifications.schedule({
      notifications: [{
        id: this.notificationId++,
        title,
        body,
        schedule: { at: new Date(Date.now() + 100) },
        sound: 'default',
      }]
    })
  }

  async vibrate(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Heavy })
  }

  async playSound(soundName: string = 'default'): Promise<void> {
    const audio = new Audio(soundName ? `/sounds/${soundName}.mp3` : 'data:audio/wav;base64,UklGRvIAAABXQVZFZm10IBAAAAABAQUAKAAAAIAAAABACAAAQAE=')
    audio.volume = 0.5
    await audio.play()
  }

  async showAlert(title: string, message: string): Promise<void> {
    await Dialog.alert({ title, message })
  }

  private getSessionMessage(sessionType: SessionType): { title: string; body: string } {
    switch (sessionType) {
      case 'work':
        return { title: '🍅 Phiên làm việc hoàn thành!', body: 'Thời gian nghỉ ngơi!' }
      case 'short-break':
        return { title: '☕ Nghỉ ngắn hoàn thành!', body: 'Sẵn sàng làm việc!' }
      case 'long-break':
        return { title: '🎉 Nghỉ dài hoàn thành!', body: 'Bắt đầu chu kỳ mới!' }
      default:
        return { title: '🍅 Pomodoro hoàn thành!', body: 'Phiên kết thúc.' }
    }
  }
}

export const notificationService = new NotificationService()

export async function handleSessionComplete(sessionType: SessionType, options: {
  showNotification?: boolean
  playSound?: boolean
  vibrate?: boolean
  soundName?: string
} = {}) {
  const { showNotification = true, playSound = true, vibrate = true, soundName = 'default' } = options
  if (showNotification) await notificationService.scheduleSessionCompleteNotification(sessionType)
  if (playSound) await notificationService.playSound(soundName)
  if (vibrate) await notificationService.vibrate()
}