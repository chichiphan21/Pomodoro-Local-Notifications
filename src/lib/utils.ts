// lib/utils.ts (updated for correct dashoffset and time in seconds)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function calculateStrokeDashArray(radius: number): number {
  return 2 * Math.PI * radius
}

export function calculateStrokeDashOffset(radius: number, progress: number): number {
  const circumference = calculateStrokeDashArray(radius)
  return circumference - (progress / 100) * circumference
}