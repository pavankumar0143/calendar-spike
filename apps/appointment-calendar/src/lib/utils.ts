import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateFull(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function getDayOfWeek(date: Date): number {
  return date.getDay() // 0 = Sunday, 6 = Saturday
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay()
  const diff = date.getDate() - day
  const weekStart = new Date(date.setDate(diff))
  
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(weekStart, i))
  }
  
  return weekDates
} 