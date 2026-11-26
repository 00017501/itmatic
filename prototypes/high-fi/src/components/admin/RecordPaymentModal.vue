<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import ChoiceChips from '@/components/shared/ChoiceChips.vue'
import { useFormat } from '@/composables/useFormat'
import { useClockStore } from '@/stores/clock'
import { usePaymentsStore } from '@/stores/payments'
import { useSessionStore } from '@/stores/session'
import type { DebtorLine, PaymentMethod } from '@/types'

// S05b Record payment, with the QR code for Payme and Click (decision 39) and its confirmation.
const props = defineProps<{ line: DebtorLine; fee: number }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const paymentsStore = usePaymentsStore()
const session = useSessionStore()

/** How long the prototype waits before the simulated provider confirmation. */
const CONFIRM_AFTER_MS = 1800
const METHODS: PaymentMethod[] = ['cash', 'card', 'payme', 'click']

const amount = ref<number | null>(null)
const method = ref<PaymentMethod | null>('cash')
const error = ref('')
const step = ref<'form' | 'waiting' | 'recorded'>('form')
const dueBefore = ref(0)
const invoiceNumber = ref('')
const recordedAt = ref('')

watch(
  open,
  (isOpen) => {
    if (!isOpen) return
    amount.value = props.line.amountDue
    method.value = 'cash'
    error.value = ''
    step.value = 'form'
    dueBefore.value = props.line.amountDue
    invoiceNumber.value = paymentsStore.nextInvoiceNumber(clock.month)
  },
  { immediate: true },
)

const usesQr = computed(() => method.value === 'payme' || method.value === 'click')
const methodName = computed(() => t(`paymentMethods.${method.value ?? 'cash'}`))
const monthLabel = computed(() => format.monthAndYear(clock.month))
const validAmount = computed(() =>
  amount.value !== null && Number.isInteger(amount.value) && amount.value > 0 ? amount.value : 0,
)
const remaining = computed(() => Math.max(0, dueBefore.value - validAmount.value))
const credit = computed(() => Math.max(0, validAmount.value - dueBefore.value))
const qrPayload = computed(() =>
  paymentsStore.qrPayloadFor(invoiceNumber.value, validAmount.value, method.value ?? 'payme'),
)
const methodOptions = computed(() =>
  METHODS.map((value) => ({ value, label: t(`paymentMethods.${value}`) })),
)
const intro = computed(() =>
  t('debtors.pay.intro', {
    student: props.line.studentName,
    group: props.line.groupCode,
    month: monthLabel.value,
    fee: format.money(props.fee),
    paid: format.money(props.fee - dueBefore.value),
  }),
)

function finish(): void {
  recordedAt.value = clock.time
  step.value = 'recorded'
}

function submit(): void {
  if (!session.user || !method.value) return
  if (validAmount.value === 0) {
    error.value = t('debtors.pay.amountError')
    return
  }
  error.value = ''
  if (!usesQr.value) {
    paymentsStore.record(
      props.line.studentId,
      clock.month,
      validAmount.value,
      method.value,
      session.user.id,
      dueBefore.value,
    )
    finish()
    return
  }
  const invoice = paymentsStore.createQrInvoice(
    props.line.studentId,
    clock.month,
    validAmount.value,
    method.value,
    session.user.id,
  )
  step.value = 'waiting'
  window.setTimeout(() => {
    paymentsStore.confirm(invoice.id)
    finish()
  }, CONFIRM_AFTER_MS)
}
</script>

<template>
  <UModal
    v-model:open="open"
    :dismissible="step !== 'waiting'"
    :title="step === 'recorded' ? t('debtors.pay.recordedTitle') : t('debtors.pay.title')"
    :description="step === 'recorded' ? undefined : intro"
  >
    <template #body>
      <div v-if="step === 'recorded'" class="flex flex-col gap-4" aria-live="polite">
        <p>
          {{
            t('debtors.pay.recordedText', {
              amount: format.money(validAmount),
              student: line.studentName,
              month: monthLabel,
              method: methodName,
              by: session.user?.fullName ?? '',
              time: recordedAt,
            })
          }}
        </p>
        <UAlert
          :color="remaining > 0 ? 'warning' : 'success'"
          variant="subtle"
          :icon="remaining > 0 ? 'i-lucide-info' : 'i-lucide-circle-check'"
          :title="
            remaining > 0
              ? t('debtors.pay.stillDue', {
                  amount: format.money(remaining),
                  student: line.studentName,
                })
              : t('debtors.pay.paidInFull', { student: line.studentName, month: monthLabel })
          "
        />
      </div>

      <form
        v-else
        id="payment-form"
        class="flex flex-col gap-4"
        novalidate
        @submit.prevent="submit"
      >
        <UFormField :label="t('debtors.pay.month')">
          <UInput :model-value="monthLabel" size="xl" readonly class="w-full" />
        </UFormField>
        <UFormField
          :label="t('debtors.pay.amount')"
          :help="t('debtors.pay.amountHint')"
          :error="error || false"
          required
        >
          <UInput
            v-model.number="amount"
            type="number"
            inputmode="numeric"
            min="1"
            step="1000"
            size="xl"
            :disabled="step === 'waiting'"
            class="w-full"
          />
        </UFormField>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-semibold">{{ t('debtors.pay.method') }}</p>
          <ChoiceChips v-model="method" :label="t('debtors.pay.method')" :options="methodOptions" />
        </div>

        <div v-if="usesQr" class="flex gap-4 rounded-md bg-mist p-4">
          <div class="shrink-0 rounded-sm border border-line bg-paper p-1">
            <QrcodeVue
              :value="qrPayload"
              :size="148"
              level="M"
              render-as="svg"
              foreground="#14202a"
              background="#ffffff"
            />
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <p class="text-sm font-semibold">
              {{ t('debtors.pay.qrTitle', { method: methodName }) }}
            </p>
            <p class="text-sm">
              {{
                t('debtors.pay.qrAmount', {
                  amount: format.money(validAmount),
                  month: monthLabel,
                  student: line.studentName,
                })
              }}
            </p>
            <p class="text-xs text-ink-muted">
              {{ t('debtors.pay.qrInvoice', { invoice: invoiceNumber, method: methodName }) }}
            </p>
            <p class="text-xs text-ink-muted">{{ t('debtors.pay.qrDemo') }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 rounded-md bg-mist px-4 py-2 text-sm">
          <span class="text-ink-muted">{{
            credit > 0 ? t('debtors.pay.credit') : t('debtors.pay.remaining')
          }}</span>
          <span class="font-semibold">{{ format.money(credit > 0 ? credit : remaining) }}</span>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          v-if="step === 'recorded'"
          size="lg"
          :label="t('app.done')"
          @click="open = false"
        />
        <template v-else>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            :disabled="step === 'waiting'"
            :label="t('app.cancel')"
            @click="open = false"
          />
          <UButton
            type="submit"
            form="payment-form"
            size="lg"
            :loading="step === 'waiting'"
            :label="
              step === 'waiting'
                ? t('debtors.pay.waiting', { method: methodName })
                : t('debtors.pay.record')
            "
          />
        </template>
      </div>
    </template>
  </UModal>
</template>
