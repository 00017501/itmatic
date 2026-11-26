<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// The frame every chart sits in: a title that names the series, a takeaway in words, the chart
// with a text alternative, and the same figures as a table (DESIGN.md, Charts).
defineProps<{
  title: string
  takeaway: string
  labelHeader: string
  valueHeader: string
  rows: { label: string; value: string }[]
}>()

const { t } = useI18n()
const showTable = ref(false)
</script>

<template>
  <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 class="font-semibold">{{ title }}</h2>
        <p class="text-sm text-ink-muted">{{ takeaway }}</p>
      </div>
      <UButton
        color="neutral"
        variant="link"
        class="shrink-0 px-0"
        :label="showTable ? t('charts.showChart') : t('charts.showTable')"
        @click="showTable = !showTable"
      />
    </div>
    <table v-if="showTable" class="w-full text-sm">
      <thead class="text-left text-ink-muted">
        <tr>
          <th scope="col" class="py-2 font-normal">{{ labelHeader }}</th>
          <th scope="col" class="py-2 text-right font-normal">{{ valueHeader }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line border-t border-line">
        <tr v-for="row in rows" :key="row.label">
          <td class="py-2">{{ row.label }}</td>
          <td class="py-2 text-right font-semibold">{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
    <div
      v-else
      role="img"
      :aria-label="`${title}. ${rows.map((row) => `${row.label}: ${row.value}`).join(', ')}.`"
    >
      <slot />
    </div>
  </section>
</template>
