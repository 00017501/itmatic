<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AttendanceTrendChart from '@/components/charts/AttendanceTrendChart.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import { useAccountStudent } from '@/composables/useAccountStudent'
import { useFormat } from '@/composables/useFormat'
import { useStudentLessons } from '@/composables/useStudentLessons'
import { attendanceSummary, monthlyAttendance } from '@/domain/attendance'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useLessonsStore } from '@/stores/lessons'
import { ATTENDANCE_COLOUR } from '@/utils/statusColour'

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const lessonsStore = useLessonsStore()
const { studentId, student } = useAccountStudent()
const { all } = useStudentLessons(student)

const summary = computed(() =>
  attendanceSummary(studentId.value, clock.month, all.value, lessonsStore.records),
)
const months = computed(() =>
  [...new Set(all.value.map((l) => l.date.slice(0, 7)))].filter((m) => m <= clock.month),
)
const trend = computed(() =>
  monthlyAttendance(studentId.value, months.value, all.value, lessonsStore.records),
)
const previous = computed(() => trend.value.filter((m) => m.month < clock.month).at(-1))
const comparison = computed(() => {
  if (!previous.value || summary.value.lessons.length === 0) return ''
  const params = {
    percent: previous.value.percentage,
    month: format.monthAndYear(previous.value.month),
  }
  if (summary.value.percentage > previous.value.percentage)
    return t('account.attendance.up', params)
  if (summary.value.percentage < previous.value.percentage)
    return t('account.attendance.down', params)
  return t('account.attendance.same', params)
})
</script>

<template>
  <AppLayout :title="t('account.attendance.title')" :caption="student?.fullName">
    <section class="flex flex-col gap-1 rounded-md border border-line bg-paper p-4">
      <template v-if="summary.lessons.length">
        <p class="text-title font-semibold">
          {{ t('account.attendance.summary', { percent: summary.percentage }) }}
        </p>
        <p class="text-sm text-ink-muted">
          {{
            t('account.attendance.detail', {
              month: format.monthAndYear(clock.month),
              total: summary.lessons.length,
              attended: summary.attended,
            })
          }}
          {{ comparison }}
        </p>
      </template>
      <p v-else class="text-ink-muted">{{ t('account.attendance.empty') }}</p>
    </section>

    <ChartCard
      v-if="trend.length"
      :title="t('account.attendance.chartTitle')"
      :takeaway="comparison || t('account.attendance.summary', { percent: summary.percentage })"
      :label-header="t('charts.month')"
      :value-header="t('charts.attendance')"
      :rows="
        trend.map((row) => ({ label: format.monthAndYear(row.month), value: `${row.percentage}%` }))
      "
    >
      <AttendanceTrendChart :data="trend" />
    </ChartCard>

    <ul
      v-if="summary.lessons.length"
      class="divide-y divide-line rounded-md border border-line bg-paper"
    >
      <li
        v-for="lesson in summary.lessons"
        :key="lesson.lessonId"
        class="flex min-h-12 items-center justify-between gap-4 px-4 py-2"
      >
        <span>{{ format.weekdayShort(lesson.date) }} {{ format.date(lesson.date) }}</span>
        <UBadge
          :color="ATTENDANCE_COLOUR[lesson.status]"
          variant="subtle"
          size="lg"
          :label="t(`attendanceStatus.${lesson.status}`)"
        />
      </li>
    </ul>
  </AppLayout>
</template>
