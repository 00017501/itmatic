import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import type { FinanceData } from '@/domain/finance'
import { usePaymentsStore } from '@/stores/payments'

/** What the fee calculations need; the payments store gathers it. */
export function useFinanceData(): ComputedRef<FinanceData> {
  return storeToRefs(usePaymentsStore()).financeData
}
