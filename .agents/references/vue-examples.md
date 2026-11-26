# Vue examples

Worked code for [`vue.md`](../rules/vue.md) and [`project/hifi.md`](../rules/project/hifi.md). Shapes, not finished features: check Nuxt UI, Pinia and Vue Router APIs in their current docs before copying.

## A setup store that owns persistence

```ts
// src/stores/payments.ts
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Payment, PaymentMethod } from '@/types'
import { seedPayments } from '@/data/seed'

const STORAGE_KEY = 'itmatic:payments'

export const usePaymentsStore = defineStore('payments', () => {
  const payments = ref<Payment[]>(loadPayments())

  const paymentsByStudent = computed(() => {
    const byStudent = new Map<string, Payment[]>()
    for (const payment of payments.value) {
      byStudent.set(payment.studentId, [...(byStudent.get(payment.studentId) ?? []), payment])
    }
    return byStudent
  })

  // Named as in data-model.md: Payment.record(student, month, amount, method)
  function record(studentId: string, month: string, amount: number, method: PaymentMethod, recordedByUserId: string): Payment {
    if (!Number.isInteger(amount) || amount <= 0) throw new Error('Amount must be a positive whole number of so\'m')
    const payment: Payment = {
      id: crypto.randomUUID(), studentId, month, amount, method,
      recordedByUserId, recordedAt: new Date().toISOString(),
    }
    payments.value.push(payment)
    return payment
  }

  function reset(): void {
    payments.value = structuredClone(seedPayments)
  }

  watch(payments, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

  return { payments, paymentsByStudent, record, reset }
})

function loadPayments(): Payment[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? (JSON.parse(saved) as Payment[]) : structuredClone(seedPayments)
}
```

## A view built from Nuxt UI components

```vue
<!-- src/views/admin/S05DebtorsList.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDebtorsStore } from '@/stores/debtors'
import DebtorsTableRowActions from '@/components/admin/DebtorsTableRowActions.vue'
import RecordPaymentModal from '@/components/admin/RecordPaymentModal.vue'
import type { DebtorLine } from '@/types'

const { t } = useI18n()
const debtorsStore = useDebtorsStore()
const { lines, totalDue } = storeToRefs(debtorsStore)
const selectedLine = ref<DebtorLine | null>(null)

const columns = computed(() => [
  { accessorKey: 'studentName', header: t('debtors.student') },
  { accessorKey: 'groupCode', header: t('debtors.group') },
  { accessorKey: 'parentPhone', header: t('debtors.parentPhone') },
  { accessorKey: 'amountDue', header: t('debtors.amountDue') },
  { id: 'actions' },
])
</script>

<template>
  <UDashboardPanel id="debtors">
    <template #header>
      <UDashboardNavbar :title="t('debtors.title', { month: 'November 2026' })" />
    </template>
    <template #body>
      <UTable :data="lines" :columns="columns" :empty="t('debtors.empty')">
        <template #actions-cell="{ row }">
          <DebtorsTableRowActions :line="row.original" @record-payment="selectedLine = row.original" />
        </template>
      </UTable>
      <p class="text-muted tabular-nums">{{ t('debtors.total', { amount: totalDue }) }}</p>
      <RecordPaymentModal v-if="selectedLine" :line="selectedLine" @close="selectedLine = null" />
    </template>
  </UDashboardPanel>
</template>
```

## A form with errors next to fields

```vue
<!-- src/components/admin/RecordPaymentModal.vue (excerpt) -->
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormError } from '@nuxt/ui'
import type { DebtorLine, PaymentMethod } from '@/types'

const props = defineProps<{ line: DebtorLine }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const state = reactive<{ amount: number | undefined; method: PaymentMethod }>({ amount: undefined, method: 'cash' })

function validatePayment(current: typeof state): FormError[] {
  return current.amount && current.amount > 0 ? [] : [{ name: 'amount', message: t('payment.amountRequired') }]
}

function submitPayment(): void {
  // usePaymentsStore().record(...), then a toast "Payment recorded", then emit('close')
}
</script>

<template>
  <UModal :open="true" :title="`Record payment: ${props.line.studentName}`" @update:open="emit('close')">
    <template #body>
      <UForm :state="state" :validate="validatePayment" @submit="submitPayment">
        <UFormField name="amount" :label="t('payment.amount')" required>
          <UInputNumber v-model="state.amount" />
        </UFormField>
        <!-- method, month ... -->
        <UButton type="submit" :label="t('payment.record')" />
      </UForm>
    </template>
  </UModal>
</template>
```

## Routes with roles

```ts
// src/router.ts (excerpt)
import { createRouter, createWebHashHistory } from 'vue-router'
import type { Role } from '@/types'

declare module 'vue-router' {
  interface RouteMeta { roles: Role[]; screenId: string }
}

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/shared/S01LoginScreen.vue'), meta: { roles: [], screenId: 'S01' } },
    { path: '/admin/debtors', name: 'debtors', component: () => import('@/views/admin/S05DebtorsList.vue'), meta: { roles: ['administrator'], screenId: 'S05' } },
  ],
})

router.beforeEach((to) => {
  // One guard for every route: no session -> login; wrong role -> access message (E-FR04-03 wording).
})
```
