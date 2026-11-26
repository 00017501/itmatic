import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/session'
import * as format from '@/utils/format'

/** Formatters bound to the current language. Dates and money look the same in every language. */
export function useFormat() {
  const { language } = storeToRefs(useSessionStore())
  return {
    date: format.formatDate,
    time: format.formatTime,
    amount: format.formatAmount,
    money: format.formatMoney,
    weekdayShort: (iso: string) => format.weekdayShort(iso, language.value),
    weekdayLong: (iso: string) => format.weekdayLong(iso, language.value),
    monthShort: (month: string) => format.monthShort(month, language.value),
    monthAndYear: (month: string) => format.monthAndYear(month, language.value),
  }
}
