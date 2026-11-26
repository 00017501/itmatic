<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { moveRadioChoice, radioTabIndex } from '@/composables/useRadioKeys'
import type { AttendanceStatus } from '@/types'

// Single choice: choosing one status clears the others (decision 40).
defineProps<{ label: string }>()
const model = defineModel<AttendanceStatus | null>({ required: true })

const { t } = useI18n()
const OPTIONS: AttendanceStatus[] = ['present', 'late', 'absent']
const SELECTED: Record<AttendanceStatus, string> = {
  present: 'bg-paid/10 text-paid font-semibold',
  late: 'bg-pending/10 text-pending font-semibold',
  absent: 'bg-debt/10 text-debt font-semibold',
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    @keydown="moveRadioChoice($event, OPTIONS, (value) => (model = value))"
    class="grid grid-cols-3 overflow-hidden rounded-md border border-line-strong"
  >
    <button
      v-for="(option, index) in OPTIONS"
      :key="option"
      type="button"
      role="radio"
      :aria-checked="model === option"
      :tabindex="radioTabIndex(option, index, model)"
      class="flex h-11 items-center justify-center gap-1 border-l border-line-strong px-2 text-sm first:border-l-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
      :class="model === option ? SELECTED[option] : 'bg-paper text-ink hover:bg-mist'"
      @click="model = option"
    >
      <UIcon v-if="model === option" name="i-lucide-check" class="size-4" />
      {{ t(`attendanceStatus.${option}`) }}
    </button>
  </div>
</template>
