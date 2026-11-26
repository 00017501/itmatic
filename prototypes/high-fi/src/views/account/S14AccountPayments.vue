<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressMeter from '@/components/charts/ProgressMeter.vue'
import { useAccountStudent } from '@/composables/useAccountStudent'
import { useFinanceData } from '@/composables/useFinanceData'
import { useFormat } from '@/composables/useFormat'
import { paymentStatus } from '@/domain/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import { usePaymentsStore } from '@/stores/payments'
import { PAYMENT_STATUS_COLOUR } from '@/utils/statusColour'

const { t } = useI18n()
const format = useFormat()
const paymentsStore = usePaymentsStore()
const finance = useFinanceData()
const { studentId, student, feeMonth } = useAccountStudent()

const status = computed(() =>
  student.value ? paymentStatus(student.value, feeMonth.value, finance.value) : null,
)
const monthLabel = computed(() => format.monthAndYear(feeMonth.value))
const history = computed(() =>
  paymentsStore.payments
    .filter((p) => p.studentId === studentId.value && p.status === 'recorded')
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
)
</script>

<template>
  <AppLayout :title="t('account.payments.title')" :caption="student?.fullName">
    <template v-if="status">
      <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4">
        <div class="flex flex-wrap items-center gap-4">
          <UBadge
            :color="PAYMENT_STATUS_COLOUR[status.status]"
            variant="subtle"
            size="lg"
            :label="t(`paymentStatus.${status.status}`)"
          />
          <p class="text-title font-semibold" aria-live="polite">
            {{
              status.due > 0
                ? t('account.payments.due', { amount: format.money(status.due) })
                : t('account.payments.nothingDue')
            }}
          </p>
        </div>
        <ProgressMeter
          :label="t('account.payments.meterLabel', { month: monthLabel })"
          :value="status.paid"
          :total="status.fee"
          :caption="
            t('account.payments.meterCaption', {
              paid: format.money(status.paid),
              fee: format.money(status.fee),
            })
          "
        />
        <dl class="divide-y divide-line border-t border-line text-sm">
          <div class="flex justify-between gap-4 py-2">
            <dt class="text-ink-muted">{{ t('account.payments.fee') }}</dt>
            <dd class="tabular">{{ format.money(status.fee) }}</dd>
          </div>
          <div class="flex justify-between gap-4 py-2">
            <dt class="text-ink-muted">{{ t('account.payments.paid') }}</dt>
            <dd class="tabular">{{ format.money(status.paid) }}</dd>
          </div>
          <div class="flex justify-between gap-4 py-2">
            <dt class="text-ink-muted">{{ t('account.payments.dueRow') }}</dt>
            <dd class="tabular font-semibold">{{ format.money(status.due) }}</dd>
          </div>
          <div class="flex justify-between gap-4 py-2">
            <dt class="text-ink-muted">{{ t('account.payments.dueDate') }}</dt>
            <dd>{{ format.date(status.dueDate) }}</dd>
          </div>
        </dl>
      </section>

      <div class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('account.payments.history') }}</h2>
        <p
          v-if="history.length === 0"
          class="rounded-md border border-line bg-paper p-4 text-ink-muted"
        >
          {{ t('account.payments.historyEmpty') }}
        </p>
        <ul v-else class="divide-y divide-line rounded-md border border-line bg-paper">
          <li
            v-for="payment in history"
            :key="payment.id"
            class="flex min-h-12 items-center justify-between gap-4 px-4 py-2"
          >
            <span class="min-w-0">
              <span class="block font-semibold">{{ format.monthAndYear(payment.month) }}</span>
              <span class="block text-sm text-ink-muted">
                {{ format.date(payment.recordedAt) }}, {{ t(`paymentMethods.${payment.method}`) }}
              </span>
            </span>
            <span class="tabular shrink-0">{{ format.money(payment.amount) }}</span>
          </li>
        </ul>
      </div>
    </template>
  </AppLayout>
</template>
