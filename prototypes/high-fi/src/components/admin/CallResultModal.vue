<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChoiceChips from '@/components/shared/ChoiceChips.vue'
import { useFormat } from '@/composables/useFormat'
import { useClockStore } from '@/stores/clock'
import { usePaymentsStore } from '@/stores/payments'
import { useSessionStore } from '@/stores/session'
import type { CallResultKind, DebtorLine } from '@/types'
import { addDays, parseDisplayDate } from '@/utils/dates'

// S05a Record call result, with its error state (E-FR04-04) and confirmation.
const props = defineProps<{ line: DebtorLine }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const paymentsStore = usePaymentsStore()
const session = useSessionStore()

const result = ref<CallResultKind | null>('promisedBy')
const promisedDate = ref('')
const error = ref('')
const saved = ref(false)

watch(
  open,
  (isOpen) => {
    if (!isOpen) return
    result.value = 'promisedBy'
    promisedDate.value = ''
    error.value = ''
    saved.value = false
  },
  { immediate: true },
)

const options = computed<{ value: CallResultKind; label: string }[]>(() => [
  { value: 'promisedBy', label: t('callResults.promisedBy') },
  { value: 'noAnswer', label: t('callResults.noAnswer') },
  { value: 'leaving', label: t('callResults.leaving') },
])
const intro = computed(() =>
  t('debtors.call.intro', {
    student: props.line.studentName,
    group: props.line.groupCode,
    amount: format.money(props.line.amountDue),
    parent: props.line.parentName,
    phone: props.line.parentPhone,
  }),
)
const savedText = computed(() =>
  result.value === 'promisedBy'
    ? t('debtors.call.savedPromised', {
        student: props.line.studentName,
        date: format.date(parseDisplayDate(promisedDate.value) ?? clock.today),
      })
    : t('debtors.call.savedOther', {
        student: props.line.studentName,
        result: t(`callResults.${result.value ?? 'noAnswer'}`),
      }),
)

function save(): void {
  if (!session.user || !result.value) return
  const problem = paymentsStore.recordCallResult(
    props.line.studentId,
    clock.month,
    result.value,
    parseDisplayDate(promisedDate.value),
    session.user.id,
  )
  if (problem) error.value = t('debtors.call.dateError')
  else {
    error.value = ''
    saved.value = true
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="saved ? t('debtors.call.savedTitle') : t('debtors.call.title')"
    :description="saved ? undefined : intro"
  >
    <template #body>
      <p v-if="saved" aria-live="polite">{{ savedText }}</p>
      <form v-else id="call-form" class="flex flex-col gap-4" novalidate @submit.prevent="save">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-semibold">{{ t('debtors.call.result') }}</p>
          <ChoiceChips v-model="result" :label="t('debtors.call.result')" :options="options" />
        </div>
        <UFormField
          v-if="result === 'promisedBy'"
          :label="t('debtors.call.promisedDate')"
          :help="t('debtors.call.dateHint')"
          :error="error || false"
        >
          <UInput
            v-model="promisedDate"
            size="xl"
            inputmode="numeric"
            maxlength="10"
            :placeholder="format.date(addDays(clock.today, 3))"
            class="w-full"
          />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton v-if="saved" size="lg" :label="t('app.done')" @click="open = false" />
        <template v-else>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            :label="t('app.cancel')"
            @click="open = false"
          />
          <UButton type="submit" form="call-form" size="lg" :label="t('app.save')" />
        </template>
      </div>
    </template>
  </UModal>
</template>
