<script setup lang="ts">
import { computed } from 'vue'

// A part-of-a-whole bar for the fee and collection meters (decision 41). Plain markup, one hue.
const props = defineProps<{ label: string; value: number; total: number; caption: string }>()

const percentage = computed(() =>
  props.total <= 0 ? 0 : Math.min(100, Math.round((props.value / props.total) * 100)),
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-baseline justify-between gap-4 text-sm">
      <span class="font-semibold">{{ label }}</span>
      <span class="tabular font-semibold">{{ percentage }}%</span>
    </div>
    <div
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percentage"
      :aria-valuetext="caption"
      class="h-3 overflow-hidden rounded-full bg-inkteal-100"
    >
      <div class="h-full rounded-full bg-inkteal-500" :style="{ width: `${percentage}%` }" />
    </div>
    <p class="text-sm text-ink-muted">{{ caption }}</p>
  </div>
</template>
