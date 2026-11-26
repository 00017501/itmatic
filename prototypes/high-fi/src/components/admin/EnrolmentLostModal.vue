<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChoiceChips from '@/components/shared/ChoiceChips.vue'
import { useEnrolmentsStore } from '@/stores/enrolments'
import type { LostReason } from '@/types'

// Closing an enrolment as lost needs a refusal reason (E-FR01-05).
const props = defineProps<{ enrolmentId: string }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const store = useEnrolmentsStore()

const REASONS: LostReason[] = ['price', 'schedule', 'level', 'location', 'other']
const reason = ref<LostReason | null>(null)
const error = ref('')
const options = computed(() =>
  REASONS.map((value) => ({ value, label: t(`lostReasons.${value}`) })),
)

watch(open, (isOpen) => {
  if (!isOpen) return
  reason.value = null
  error.value = ''
})

function close(): void {
  if (store.closeAsLost(props.enrolmentId, reason.value))
    error.value = t('enrolment.lost.reasonError')
  else open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :title="t('enrolment.lost.title')">
    <template #body>
      <form id="lost-form" class="flex flex-col gap-4" novalidate @submit.prevent="close">
        <p class="text-sm font-semibold">{{ t('enrolment.lost.reason') }}</p>
        <ChoiceChips v-model="reason" :label="t('enrolment.lost.reason')" :options="options" />
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="error"
          role="alert"
        />
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          :label="t('app.cancel')"
          @click="open = false"
        />
        <UButton
          type="submit"
          form="lost-form"
          color="error"
          size="lg"
          :label="t('enrolment.lost.confirm')"
        />
      </div>
    </template>
  </UModal>
</template>
