// Calendar arithmetic on ISO dates (YYYY-MM-DD), done in UTC so the day never shifts.

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** The Monday of the week the date is in. */
export function mondayOf(iso: string): string {
  const weekday = new Date(`${iso}T00:00:00Z`).getUTCDay()
  return addDays(iso, weekday === 0 ? -6 : 1 - weekday)
}

/** "09:30" becomes 570. */
export function minutesOf(time: string): number {
  const [hours, minutes] = time.split(':').map(Number) as [number, number]
  return hours * 60 + minutes
}

/** "29.11.2026" becomes "2026-11-29"; null when the text is not a real date in that form. */
export function parseDisplayDate(text: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim())
  if (!match) return null
  const iso = `${match[3]}-${match[2]}-${match[1]}`
  const date = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso ? null : iso
}
