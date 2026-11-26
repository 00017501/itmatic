<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { STAGE_ORDER } from '@/domain/enrolment'
import type { EnrolmentStage, StageKey } from '@/types'

// The six stages in one line, for wide screens (DESIGN.md, signature component). It repeats the
// list below it at a glance, so it is hidden from assistive technology.
defineProps<{ stages: EnrolmentStage[]; current: StageKey | null }>()

const { t } = useI18n()
</script>

<template>
  <ol class="grid-cols-6" aria-hidden="true">
    <li
      v-for="(key, index) in STAGE_ORDER"
      :key="key"
      class="flex flex-col items-center gap-2 text-center text-sm"
    >
      <span class="flex w-full items-center">
        <span class="h-px flex-1" :class="index === 0 ? '' : 'bg-line-strong'" />
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full font-semibold"
          :class="
            stages.some((s) => s.key === key)
              ? 'bg-inkteal-500 text-white'
              : current === key
                ? 'border-2 border-inkteal-500 bg-inkteal-100 text-inkteal-600'
                : 'border border-line-strong bg-paper text-ink-muted'
          "
        >
          <UIcon v-if="stages.some((s) => s.key === key)" name="i-lucide-check" class="size-4" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span
          class="h-px flex-1"
          :class="index === STAGE_ORDER.length - 1 ? '' : 'bg-line-strong'"
        />
      </span>
      <span :class="current === key ? 'font-semibold text-ink' : 'text-ink-muted'">{{
        t(`stages.${key}`)
      }}</span>
    </li>
  </ol>
</template>
