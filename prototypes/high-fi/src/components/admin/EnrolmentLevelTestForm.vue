<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { useSessionStore } from '@/stores/session'

// Stage 1: the level test, or a recorded reason for skipping it (FR-01 main flow 2).
const props = defineProps<{ enrolmentId: string; courseId: string }>()

const { t } = useI18n()
const directory = useDirectoryStore()
const store = useEnrolmentsStore()
const session = useSessionStore()

const levels = computed(() =>
  [
    ...new Set(
      directory.groups
        .filter((g) => g.branchId === session.user?.branchId && g.courseId === props.courseId)
        .map((g) => g.level),
    ),
  ].sort(),
)
const skip = ref(false)
const score = ref<number | null>(null)
const level = ref<string | undefined>(undefined)
const skipReason = ref('')
const errors = reactive({ score: '', level: '', skipReason: '' })

function record(): void {
  if (!session.user) return
  Object.assign(errors, { score: '', level: '', skipReason: '' })
  if (skip.value) {
    if (!skipReason.value.trim()) errors.skipReason = t('enrolment.levelTest.skipReasonError')
    else
      store.recordStage(
        props.enrolmentId,
        'levelTest',
        'skipped',
        skipReason.value.trim(),
        session.user.id,
        levels.value[0] ?? null,
      )
    return
  }
  const valid =
    score.value !== null && Number.isInteger(score.value) && score.value >= 0 && score.value <= 100
  if (!valid) errors.score = t('enrolment.levelTest.scoreError')
  if (!level.value) errors.level = t('enrolment.levelTest.levelError')
  if (!valid || !level.value) return
  const detail = t('enrolment.levelTest.detailScored', { score: score.value, level: level.value })
  store.recordStage(props.enrolmentId, 'levelTest', 'scored', detail, session.user.id, level.value)
}
</script>

<template>
  <form class="flex max-w-xl flex-col gap-4" novalidate @submit.prevent="record">
    <UCheckbox v-model="skip" :label="t('enrolment.levelTest.skip')" />
    <UFormField
      v-if="skip"
      :label="t('enrolment.levelTest.skipReason')"
      :error="errors.skipReason || false"
      required
    >
      <UInput v-model="skipReason" size="lg" maxlength="120" class="w-full" />
    </UFormField>
    <div v-else class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('enrolment.levelTest.score')" :error="errors.score || false" required>
        <UInput
          v-model.number="score"
          type="number"
          inputmode="numeric"
          min="0"
          max="100"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField :label="t('enrolment.levelTest.level')" :error="errors.level || false" required>
        <USelect v-model="level" :items="levels" size="lg" class="w-full" />
      </UFormField>
    </div>
    <UButton type="submit" size="lg" class="self-start" :label="t('enrolment.levelTest.record')" />
  </form>
</template>
