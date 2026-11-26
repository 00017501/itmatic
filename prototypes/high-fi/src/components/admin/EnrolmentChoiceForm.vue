<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChoiceChips from '@/components/shared/ChoiceChips.vue'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { useSessionStore } from '@/stores/session'
import type { StageResult } from '@/types'

// Stages 3 to 5: one answer out of two or three (teacher conversation, trial lesson, feedback).
type ChoiceStage = 'teacherConversation' | 'trialLesson' | 'feedback'
const props = defineProps<{ enrolmentId: string; stageKey: ChoiceStage }>()
const emit = defineEmits<{ declined: [] }>()

const { t } = useI18n()
const toast = useToast()
const store = useEnrolmentsStore()
const session = useSessionStore()

const RESULTS: Record<ChoiceStage, StageResult[]> = {
  teacherConversation: ['accepted', 'notSuitable'],
  trialLesson: ['attended', 'didNotAttend'],
  feedback: ['wantsToJoin', 'wantsAnotherGroup', 'declines'],
}
const result = ref<StageResult | null>(null)
const error = ref('')
const options = computed(() =>
  RESULTS[props.stageKey].map((value) => ({ value, label: t(`stageResults.${value}`) })),
)

function record(): void {
  if (!session.user) return
  if (!result.value) {
    error.value = t('enrolment.chooseError')
    return
  }
  error.value = ''
  // Declining closes the enrolment as lost, which needs a refusal reason (E-FR01-05).
  if (result.value === 'declines') {
    emit('declined')
    return
  }
  const outcome = store.recordStage(
    props.enrolmentId,
    props.stageKey,
    result.value,
    '',
    session.user.id,
  )
  if (outcome === 'backToGroup')
    toast.add({ title: t('enrolment.anotherGroup'), color: 'neutral', icon: 'i-lucide-undo-2' })
  if (outcome === 'stageRepeats')
    toast.add({ title: t('enrolment.trialAgain'), color: 'neutral', icon: 'i-lucide-info' })
}
</script>

<template>
  <form class="flex max-w-xl flex-col gap-4" novalidate @submit.prevent="record">
    <p class="text-sm font-semibold">{{ t(`enrolment.${stageKey}.label`) }}</p>
    <ChoiceChips v-model="result" :label="t(`enrolment.${stageKey}.label`)" :options="options" />
    <p v-if="error" class="text-sm text-debt" role="alert">{{ error }}</p>
    <UButton
      type="submit"
      size="lg"
      class="self-start"
      :label="t(`enrolment.${stageKey}.record`)"
    />
  </form>
</template>
