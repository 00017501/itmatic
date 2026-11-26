// The only place that touches local storage. Stores keep their state through persistedRef.
import { ref, watch, type Ref } from 'vue'
import { buildSeed } from '@/data/seed'
import type { SeedData } from '@/types'

const PREFIX = 'itmatic:'
/** Kept when the demo data is reset, so the chosen language survives (NFR-02). */
const KEEP_ON_RESET = ['language']

let cachedSeed: SeedData | null = null

export function seedData(): SeedData {
  cachedSeed ??= buildSeed()
  return cachedSeed
}

export function persistedRef<T>(key: string, initial: () => T): Ref<T> {
  const saved = localStorage.getItem(PREFIX + key)
  const state = ref(saved === null ? initial() : (JSON.parse(saved) as T)) as Ref<T>
  watch(state, (value) => localStorage.setItem(PREFIX + key, JSON.stringify(value)), { deep: true })
  return state
}

/** Restores the seed data and signs out. The page reloads so every store starts fresh. */
export function resetDemoData(): void {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(PREFIX) && !KEEP_ON_RESET.includes(key.slice(PREFIX.length))) {
      localStorage.removeItem(key)
    }
  }
  window.location.hash = '#/login'
  window.location.reload()
}
