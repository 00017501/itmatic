<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VisAxis, VisCrosshair, VisLine, VisScatter, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { GradeProgress } from '@/types'

// Published scores in order as a line with points (decision 41).
const props = defineProps<{ data: GradeProgress[] }>()

const { t } = useI18n()
const TEAL = 'var(--color-inkteal-500)'
const last = computed(() => props.data.length - 1)

const x = (_: GradeProgress, index: number): number => index
const y = (d: GradeProgress): number => d.score
const name = (d: GradeProgress): string => `${d.level} ${t(`gradeKinds.${d.kind}`).toLowerCase()}`
/** The latest assessment's tick also carries its score: the one direct label on the chart. */
const tick = (index: number): string => {
  const row = props.data[index]
  if (!row) return ''
  return index === last.value ? `${name(row)}, ${row.score}` : name(row)
}
const template = (d: GradeProgress): string =>
  `${name(d)}: ${t('account.grades.outOf', { score: d.score })}`
</script>

<template>
  <VisXYContainer
    :data="data"
    :height="200"
    :y-domain="[0, 100]"
    :padding="{ top: 4, left: 8, right: 24 }"
    class="chart"
  >
    <VisLine :x="x" :y="y" :color="TEAL" :line-width="2" />
    <VisScatter
      :x="x"
      :y="y"
      :color="TEAL"
      :size="10"
      stroke-color="var(--color-paper)"
      :stroke-width="2"
    />
    <VisAxis
      type="x"
      :tick-values="data.map((_, index) => index)"
      :tick-format="tick"
      :grid-line="false"
      :tick-line="false"
    />
    <VisAxis type="y" :tick-values="[0, 50, 100]" :tick-line="false" :domain-line="false" />
    <VisCrosshair :template="template" :color="TEAL" />
    <VisTooltip />
  </VisXYContainer>
</template>
