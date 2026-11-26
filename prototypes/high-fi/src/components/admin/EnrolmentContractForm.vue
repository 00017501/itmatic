<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/composables/useFormat'
import { useClockStore } from '@/stores/clock'
import { useEnrolmentsStore, type ContractDraft } from '@/stores/enrolments'
import { useSessionStore } from '@/stores/session'
import { parseDisplayDate } from '@/utils/dates'

// Stage 6: the signed contract. Completing it adds the student to the group (FR-01 main flow 8).
const props = defineProps<{ enrolmentId: string; groupCode: string }>()
const emit = defineEmits<{ completed: [] }>()

const { t } = useI18n()
const clock = useClockStore()
const store = useEnrolmentsStore()
const session = useSessionStore()

// SIMULATED: the scan is a file name; nothing is uploaded.
const draft = reactive<ContractDraft>({ number: '', date: clock.today, scanName: '' })
const errors = reactive({ number: '', date: '', scanName: '' })
const format = useFormat()
const dateText = ref(format.date(clock.today))
const refusedOpen = ref(false)

function complete(): void {
  if (!session.user) return
  Object.assign(errors, { number: '', date: '', scanName: '' })
  const date = parseDisplayDate(dateText.value)
  if (!date || date > clock.today) {
    errors.date = t('enrolment.contract.dateError')
    return
  }
  draft.date = date
  const problem = store.complete(props.enrolmentId, draft, session.user.id)
  if (problem === 'numberMissing') errors.number = t('enrolment.contract.numberError')
  else if (problem === 'numberTaken') errors.number = t('enrolment.contract.numberTaken')
  else if (problem === 'scanInvalid') errors.scanName = t('enrolment.contract.scanError')
  else if (!problem) emit('completed')
}

/** "Add to group" before the contract is recorded is refused (E-FR01-02). */
function addToGroup(): void {
  if (store.addToGroup(props.enrolmentId) === 'noContract') refusedOpen.value = true
}
</script>

<template>
  <form class="flex max-w-xl flex-col gap-4" novalidate @submit.prevent="complete">
    <p class="text-sm text-ink-muted">{{ t('enrolment.contract.note', { group: groupCode }) }}</p>
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('enrolment.contract.number')" :error="errors.number || false" required>
        <UInput v-model="draft.number" size="lg" placeholder="C-2026-0412" class="w-full" />
      </UFormField>
      <UFormField :label="t('enrolment.contract.date')" :error="errors.date || false" required>
        <UInput
          v-model="dateText"
          size="lg"
          inputmode="numeric"
          maxlength="10"
          placeholder="26.11.2026"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField
      :label="t('enrolment.contract.scan')"
      :help="t('enrolment.contract.scanHint')"
      :error="errors.scanName || false"
      required
    >
      <UInput
        v-model="draft.scanName"
        size="lg"
        placeholder="contract-C-2026-0412.pdf"
        class="w-full"
      />
    </UFormField>
    <div class="flex flex-wrap gap-2">
      <UButton type="submit" size="lg" :label="t('enrolment.contract.complete')" />
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        :label="t('enrolment.contract.addToGroup')"
        @click="addToGroup"
      />
    </div>

    <UModal v-model:open="refusedOpen" :title="t('enrolment.noContract.title')">
      <template #body>
        <div class="flex flex-col gap-4">
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :title="t('enrolment.noContract.message')"
          />
          <p class="text-sm text-ink-muted">
            {{ t('enrolment.noContract.hint', { group: groupCode }) }}
          </p>
        </div>
      </template>
      <template #footer>
        <UButton
          size="lg"
          class="ml-auto"
          :label="t('enrolment.noContract.back')"
          @click="refusedOpen = false"
        />
      </template>
    </UModal>
  </form>
</template>
