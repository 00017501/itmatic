<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { TableColumn } from '@nuxt/ui'
import CallResultModal from '@/components/admin/CallResultModal.vue'
import RecordPaymentModal from '@/components/admin/RecordPaymentModal.vue'
import { useFinanceData } from '@/composables/useFinanceData'
import { useFormat } from '@/composables/useFormat'
import { feeFor } from '@/domain/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { usePaymentsStore } from '@/stores/payments'
import { useSessionStore } from '@/stores/session'
import type { DebtorLine } from '@/types'
import type { StatusColour } from '@/utils/statusColour'

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const directory = useDirectoryStore()
const { user } = storeToRefs(useSessionStore())
const finance = useFinanceData()
const paymentsStore = usePaymentsStore()

const branchId = computed(() => user.value?.branchId ?? '')
// SIMULATED: the list is calculated when the page opens, not by a job on the 1st at 08:00.
const lines = computed(() => paymentsStore.debtorLines(branchId.value, clock.month))
const totalDue = computed(() => lines.value.reduce((sum, line) => sum + line.amountDue, 0))
const monthLabel = computed(() => format.monthAndYear(clock.month))

const selected = ref<DebtorLine | null>(null)
const callOpen = ref(false)
const payOpen = ref(false)
const selectedFee = computed(() => {
  const student = directory.studentById(selected.value?.studentId ?? null)
  return student ? feeFor(student, clock.month, finance.value) : 0
})

function openCall(line: DebtorLine): void {
  selected.value = line
  callOpen.value = true
}

function openPay(line: DebtorLine): void {
  selected.value = line
  payOpen.value = true
}

function callBadge(line: DebtorLine): { label: string; colour: StatusColour } | null {
  const call = line.callResult
  if (!call) return null
  if (call.result === 'promisedBy' && call.promisedDate) {
    const broken = call.promisedDate < clock.today
    return {
      label: broken
        ? t('callResults.broken')
        : t('callResults.promisedOn', { date: format.date(call.promisedDate) }),
      colour: broken ? 'error' : 'warning',
    }
  }
  return {
    label: t(`callResults.${call.result}`),
    colour: call.result === 'leaving' ? 'error' : 'neutral',
  }
}

const columns = computed<TableColumn<DebtorLine>[]>(() => [
  { accessorKey: 'studentName', header: t('debtors.student') },
  { accessorKey: 'groupCode', header: t('debtors.group') },
  {
    accessorKey: 'parentName',
    header: `${t('debtors.parent')}, ${t('debtors.phone').toLowerCase()}`,
  },
  {
    accessorKey: 'amountDue',
    header: t('debtors.due'),
    meta: { class: { th: 'text-right', td: 'text-right' } },
  },
  {
    accessorKey: 'lastPaymentDate',
    header: t('debtors.lastPayment'),
    meta: { class: { th: 'text-right', td: 'tabular text-right' } },
  },
  { id: 'callResult', header: t('debtors.callResult') },
  {
    id: 'actions',
    header: t('debtors.actions'),
    meta: { class: { th: 'text-right', td: 'text-right' } },
  },
])
</script>

<template>
  <AppLayout
    width="wide"
    :title="t('debtors.title', { month: monthLabel })"
    :caption="t('debtors.caption', { date: format.date(`${clock.month}-01`) })"
  >
    <template #actions>
      <div class="w-full lg:w-auto lg:text-right" aria-live="polite">
        <p class="text-xl font-semibold">
          {{ t('debtors.total', { amount: format.money(totalDue) }) }}
        </p>
        <p class="text-sm text-ink-muted">
          {{
            t('debtors.totalCount', {
              count: lines.length,
              branch: directory.branchById(branchId)?.name ?? '',
            })
          }}
        </p>
      </div>
    </template>

    <UTable
      :data="lines"
      :columns="columns"
      :empty="t('debtors.empty', { month: monthLabel })"
      class="hidden rounded-md border border-line bg-paper lg:block"
    >
      <template #studentName-cell="{ row }">
        <span class="font-semibold text-ink">{{ row.original.studentName }}</span>
      </template>
      <template #parentName-cell="{ row }">
        <span class="block text-ink">{{ row.original.parentName }}</span>
        <span class="block text-sm text-ink-muted">{{ row.original.parentPhone }}</span>
      </template>
      <template #amountDue-cell="{ row }">
        <span class="tabular font-semibold text-ink">{{
          format.amount(row.original.amountDue)
        }}</span>
      </template>
      <template #lastPaymentDate-cell="{ row }">
        {{ row.original.lastPaymentDate ? format.date(row.original.lastPaymentDate) : '' }}
      </template>
      <template #callResult-cell="{ row }">
        <UBadge
          v-if="callBadge(row.original)"
          :color="callBadge(row.original)!.colour"
          variant="subtle"
          :label="callBadge(row.original)!.label"
        />
        <span v-else class="text-ink-muted">{{ t('callResults.none') }}</span>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('debtors.callAction')"
            :aria-label="`${t('debtors.callAction')}: ${row.original.studentName}`"
            @click="openCall(row.original)"
          />
          <UButton
            color="neutral"
            variant="outline"
            :label="t('debtors.payAction')"
            :aria-label="`${t('debtors.payAction')}: ${row.original.studentName}`"
            @click="openPay(row.original)"
          />
        </div>
      </template>
    </UTable>

    <!-- Phones: one block per debtor, so both actions stay on screen. -->
    <p
      v-if="lines.length === 0"
      class="rounded-md border border-line bg-paper p-4 text-ink-muted lg:hidden"
    >
      {{ t('debtors.empty', { month: monthLabel }) }}
    </p>
    <ul v-else class="divide-y divide-line rounded-md border border-line bg-paper lg:hidden">
      <li v-for="line in lines" :key="line.studentId" class="flex flex-col gap-2 p-4">
        <div class="flex items-baseline justify-between gap-4">
          <span class="font-semibold">{{ line.studentName }}</span>
          <span class="tabular shrink-0 font-semibold">{{ format.money(line.amountDue) }}</span>
        </div>
        <p class="text-sm text-ink-muted">
          {{ line.groupCode }}, {{ line.parentName }}, {{ line.parentPhone }}
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <UBadge
            v-if="callBadge(line)"
            :color="callBadge(line)!.colour"
            variant="subtle"
            :label="callBadge(line)!.label"
          />
          <span v-else class="text-sm text-ink-muted">{{ t('callResults.none') }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            color="neutral"
            variant="outline"
            class="justify-center"
            :label="t('debtors.callAction')"
            @click="openCall(line)"
          />
          <UButton
            color="neutral"
            variant="outline"
            class="justify-center"
            :label="t('debtors.payAction')"
            @click="openPay(line)"
          />
        </div>
      </li>
    </ul>

    <CallResultModal v-if="selected" v-model:open="callOpen" :line="selected" />
    <RecordPaymentModal
      v-if="selected"
      v-model:open="payOpen"
      :line="selected"
      :fee="selectedFee"
    />
  </AppLayout>
</template>
