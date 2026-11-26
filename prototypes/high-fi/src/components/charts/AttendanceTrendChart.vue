<script setup lang="ts">
import { computed } from 'vue'
import { StackedBar } from '@unovis/ts'
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import { useFormat } from '@/composables/useFormat'
import type { MonthlyAttendance } from '@/types'

// Attendance per month as bars (decision 41). One hue: the current month is the darkest.
const props = defineProps<{ data: MonthlyAttendance[] }>()

const format = useFormat()
const RAMP = [
  'var(--color-inkteal-500)',
  'var(--color-chart-teal-mid)',
  'var(--color-chart-teal-light)',
]
const last = computed(() => props.data.length - 1)

const x = (_: MonthlyAttendance, index: number): number => index
const y = (d: MonthlyAttendance): number => d.percentage
/** Unovis passes the stack index to the colour accessor, so the position is found from the month. */
const position = (d: MonthlyAttendance): number =>
  props.data.findIndex((row) => row.month === d.month)
const colour = (d: MonthlyAttendance): string =>
  RAMP[Math.min(last.value - position(d), RAMP.length - 1)] ?? RAMP[0]!
/** The current month's tick also carries its value: the one direct label on the chart. */
const monthTick = (index: number): string => {
  const row = props.data[index]
  if (!row) return ''
  return index === last.value
    ? `${format.monthShort(row.month)}, ${row.percentage}%`
    : format.monthShort(row.month)
}
const percentTick = (value: number): string => `${value}%`
/** Unovis hands the tooltip either the row or a wrapper that holds it in `datum`. */
type BarDatum = MonthlyAttendance | { datum: MonthlyAttendance }
const triggers = {
  [StackedBar.selectors.bar]: (d: BarDatum): string => {
    const row = 'datum' in d ? d.datum : d
    return `${format.monthAndYear(row.month)}: ${row.percentage}%`
  },
}
</script>

<template>
  <VisXYContainer
    :data="data"
    :height="200"
    :y-domain="[0, 100]"
    :padding="{ top: 4 }"
    class="chart"
  >
    <VisStackedBar
      :x="x"
      :y="y"
      :color="colour"
      :rounded-corners="4"
      :bar-max-width="56"
      :bar-padding="0.3"
    />
    <VisAxis
      type="x"
      :tick-values="data.map((_, index) => index)"
      :tick-format="monthTick"
      :grid-line="false"
      :tick-line="false"
    />
    <VisAxis
      type="y"
      :tick-values="[0, 50, 100]"
      :tick-format="percentTick"
      :tick-line="false"
      :domain-line="false"
    />
    <VisTooltip :triggers="triggers" />
  </VisXYContainer>
</template>
