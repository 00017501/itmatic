<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EnrolmentFunnelStep } from '@/types'

// Applicants reaching each stage this month, as horizontal bars from one baseline (decision 41).
// Every bar carries its own label and count, so plain markup is enough.
const props = defineProps<{ data: EnrolmentFunnelStep[] }>()

const { t } = useI18n()
const max = computed(() => Math.max(1, ...props.data.map((step) => step.count)))
</script>

<template>
  <ul class="flex flex-col gap-2">
    <!-- Columns: stage name (9rem), bar (the rest), count (2rem). -->
    <li
      v-for="step in data"
      :key="step.step"
      class="grid grid-cols-[9rem_1fr_2rem] items-center gap-4 text-sm"
    >
      <span class="truncate text-ink-muted">{{ t(`stages.${step.step}`) }}</span>
      <span class="block h-4">
        <span
          class="block h-full rounded-r-sm bg-inkteal-500"
          :style="{ width: `${(step.count / max) * 100}%` }"
          :title="`${t(`stages.${step.step}`)}: ${step.count}`"
        />
      </span>
      <span class="text-right font-semibold">{{ step.count }}</span>
    </li>
  </ul>
</template>
