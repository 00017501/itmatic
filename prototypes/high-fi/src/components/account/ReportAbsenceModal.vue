<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChoiceChips from '@/components/shared/ChoiceChips.vue'
import { useFormat } from '@/composables/useFormat'
import { ABSENCE_REASONS, DELAY_OPTIONS, type AbsenceDraft } from '@/domain/lesson'
import { useDirectoryStore } from '@/stores/directory'
import { useLessonsStore } from '@/stores/lessons'
import { useSessionStore } from '@/stores/session'
import type { AbsenceKind, Lesson, Student } from '@/types'

// S10a Report absence, with its error state (E-FR03-02) and confirmation (FR-03 main flow 5).
const props = defineProps<{ lesson: Lesson; student: Student }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const format = useFormat()
const directory = useDirectoryStore()
const lessonsStore = useLessonsStore()
const session = useSessionStore()

const draft = reactive<AbsenceDraft>({
  kind: 'absent',
  delayMinutes: null,
  reason: null,
  otherText: '',
})
const error = ref('')
const sent = ref(false)

watch(
  open,
  (isOpen) => {
    if (!isOpen) return
    Object.assign(draft, { kind: 'absent', delayMinutes: null, reason: null, otherText: '' })
    error.value = ''
    sent.value = false
  },
  { immediate: true },
)

const group = computed(() => directory.groupById(props.lesson.groupId))
const lessonLine = computed(() => ({
  day: format.weekdayShort(props.lesson.date),
  date: format.date(props.lesson.date),
  time: props.lesson.startTime,
  course: directory.courseById(group.value?.courseId ?? null)?.name ?? '',
  level: group.value?.level ?? '',
}))
const kinds = computed<{ value: AbsenceKind; label: string }[]>(() => [
  { value: 'late', label: t('account.absence.late') },
  { value: 'absent', label: t('account.absence.absent') },
])
const delays = computed(() =>
  DELAY_OPTIONS.map((n) => ({ value: n, label: t('account.absence.minutes', { n }) })),
)
const reasons = computed(() =>
  ABSENCE_REASONS.map((r) => ({ value: r, label: t(`absenceReasons.${r}`) })),
)

const confirmation = computed(() => {
  const base = {
    name: props.student.fullName,
    day: lessonLine.value.day,
    date: lessonLine.value.date,
    time: lessonLine.value.time,
  }
  if (draft.kind === 'late')
    return t('account.absence.informedLate', { ...base, minutes: draft.delayMinutes ?? 0 })
  const reason =
    draft.reason === 'other' ? draft.otherText : t(`absenceReasons.${draft.reason ?? 'other'}`)
  return t('account.absence.informedAbsent', { ...base, reason: reason.toLowerCase() })
})

function send(): void {
  if (!session.user) return
  const problem = lessonsStore.report(props.lesson, props.student.id, draft, session.user.id)
  if (problem === 'reasonMissing') error.value = t('account.absence.reasonError')
  else if (problem === 'delayMissing') error.value = t('account.absence.delayError')
  else if (problem === 'started') error.value = t('account.absence.started')
  else {
    error.value = ''
    sent.value = true
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="sent ? t('account.absence.informedTitle') : t('account.absence.title')"
    :description="sent ? undefined : t('account.absence.intro', lessonLine)"
  >
    <template #body>
      <p v-if="sent" aria-live="polite">{{ confirmation }}</p>
      <form v-else id="absence-form" class="flex flex-col gap-4" novalidate @submit.prevent="send">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-semibold">{{ t('account.absence.type') }}</p>
          <ChoiceChips v-model="draft.kind" :label="t('account.absence.type')" :options="kinds" />
        </div>
        <div v-if="draft.kind === 'late'" class="flex flex-col gap-2">
          <p class="text-sm font-semibold">{{ t('account.absence.delay') }}</p>
          <ChoiceChips
            v-model="draft.delayMinutes"
            :label="t('account.absence.delay')"
            :options="delays"
          />
        </div>
        <div v-else class="flex flex-col gap-2">
          <p class="text-sm font-semibold">{{ t('account.absence.reason') }}</p>
          <ChoiceChips
            v-model="draft.reason"
            :label="t('account.absence.reason')"
            :options="reasons"
          />
          <UFormField v-if="draft.reason === 'other'" :label="t('account.absence.otherText')">
            <UInput v-model="draft.otherText" size="xl" maxlength="120" class="w-full" />
          </UFormField>
        </div>
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
      <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
        <UButton
          v-if="sent"
          size="lg"
          class="justify-center"
          :label="t('app.done')"
          @click="open = false"
        />
        <template v-else>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-center"
            :label="t('app.cancel')"
            @click="open = false"
          />
          <UButton
            type="submit"
            form="absence-form"
            size="lg"
            class="justify-center"
            :label="t('account.absence.send')"
          />
        </template>
      </div>
    </template>
  </UModal>
</template>
