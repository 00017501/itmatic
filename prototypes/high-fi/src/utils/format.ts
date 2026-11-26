// Display formats from CW1 NFR-02: dates DD.MM.YYYY and money in so'm are the same in every language.
import type { Language } from '@/types'

const INTL_LOCALE: Record<Language, string> = { en: 'en-GB', ru: 'ru', uz: 'uz-Latn' }

export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}.${month}.${year}`
}

export function formatTime(iso: string): string {
  return iso.slice(11, 16)
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US')
}

export function formatMoney(amount: number): string {
  return `${formatAmount(amount)} so'm`
}

function utcDate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`)
}

export function weekdayShort(iso: string, language: Language): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[language], {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(utcDate(iso))
}

export function weekdayLong(iso: string, language: Language): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[language], {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(utcDate(iso))
}

export function monthName(month: string, language: Language): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[language], { month: 'long', timeZone: 'UTC' }).format(
    utcDate(`${month}-01`),
  )
}

export function monthShort(month: string, language: Language): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[language], { month: 'short', timeZone: 'UTC' }).format(
    utcDate(`${month}-01`),
  )
}

export function monthAndYear(month: string, language: Language): string {
  return `${monthName(month, language)} ${month.slice(0, 4)}`
}

/** Adds minutes to an HH:MM time. */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number) as [number, number]
  const total = h * 60 + m + minutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
