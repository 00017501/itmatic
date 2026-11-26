<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/composables/useFormat'
import { useDirectoryStore } from '@/stores/directory'
import type { EnrolmentStage, StageKey } from '@/types'

// One stage of the enrolment stepper. Own markup, because a finished stage keeps its result,
// date and responsible person in view, which UStepper does not show.
const props = defineProps<{
  stageKey: StageKey
  number: number
  stage?: EnrolmentStage
  current: boolean
}>()

const { t } = useI18n()
const format = useFormat()
const directory = useDirectoryStore()

const doneLine = computed(() => {
  if (!props.stage) return ''
  const parts = [
    format.date(props.stage.date),
    directory.userById(props.stage.responsibleUserId)?.fullName ?? '',
  ]
  if (props.stage.detail) parts.unshift(props.stage.detail)
  return parts.filter(Boolean).join(', ')
})
</script>

<template>
  <li
    class="flex gap-4 p-4"
    :class="current ? 'bg-inkteal-100' : ''"
    :aria-current="current ? 'step' : undefined"
  >
    <span
      class="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
      :class="
        stage
          ? 'bg-inkteal-500 text-white'
          : current
            ? 'border-2 border-inkteal-500 text-inkteal-500'
            : 'border border-line-strong text-ink-muted'
      "
    >
      <UIcon v-if="stage" name="i-lucide-check" class="size-4" />
      <template v-else>{{ number }}</template>
    </span>
    <div class="flex min-w-0 flex-1 flex-col gap-4">
      <div class="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1">
        <h2 class="font-semibold" :class="stage || current ? 'text-ink' : 'text-ink-muted'">
          {{ t(`stages.${stageKey}`) }}
        </h2>
        <UBadge
          v-if="stage"
          color="success"
          variant="subtle"
          :label="t(`stageResults.${stage.result}`)"
        />
        <UBadge
          v-else-if="current"
          color="primary"
          variant="subtle"
          :label="t('enrolment.current')"
        />
        <span v-else class="text-sm text-ink-muted">{{ t('enrolment.notStarted') }}</span>
        <span v-if="stage" class="text-sm text-ink-muted">{{ doneLine }}</span>
      </div>
      <slot v-if="current" />
    </div>
  </li>
</template>
