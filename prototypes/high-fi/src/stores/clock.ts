import { defineStore } from 'pinia'
import { computed } from 'vue'
import { DEMO_DATE, DEMO_MONTH } from '@/data/seed'
import type { Role } from '@/types'
import { persistedRef } from './persist'

/** Demo time of day per role, so each flow happens at a believable moment (decision 46). */
const TIME_FOR_ROLE: Record<Role, string> = {
  parent: '08:42',
  student: '08:42',
  teacher: '09:05',
  administrator: '10:12',
}

// SIMULATED: the date is fixed at 26.11.2026 so the demo works on any day.
export const useClockStore = defineStore('clock', () => {
  const time = persistedRef<string>('clock-time', () => '08:42')
  const today = DEMO_DATE
  const month = DEMO_MONTH
  const now = computed(() => `${today}T${time.value}:00`)

  function setForRole(role: Role): void {
    time.value = TIME_FOR_ROLE[role]
  }

  return { time, today, month, now, setForRole }
})
