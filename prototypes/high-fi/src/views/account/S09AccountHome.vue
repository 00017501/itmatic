<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LessonAbsenceCard from '@/components/account/LessonAbsenceCard.vue'
import { useAccountStudent } from '@/composables/useAccountStudent'
import { useFinanceData } from '@/composables/useFinanceData'
import { useFormat } from '@/composables/useFormat'
import { useStudentLessons } from '@/composables/useStudentLessons'
import { attendanceSummary } from '@/domain/attendance'
import { paymentStatus } from '@/domain/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useGradesStore } from '@/stores/grades'
import { useLessonsStore } from '@/stores/lessons'
import { PAYMENT_STATUS_COLOUR } from '@/utils/statusColour'

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const lessonsStore = useLessonsStore()
const gradesStore = useGradesStore()
const finance = useFinanceData()
const { studentId, student, isParent, canSwitchChild, feeMonth } = useAccountStudent()
const { next } = useStudentLessons(student)

const attendance = computed(() =>
  attendanceSummary(studentId.value, clock.month, lessonsStore.lessons, lessonsStore.records),
)
const payment = computed(() =>
  student.value ? paymentStatus(student.value, feeMonth.value, finance.value) : null,
)
const latestGrade = computed(() => gradesStore.visibleGrades(studentId.value).at(-1))
const params = computed(() => ({ studentId: studentId.value }))

const rows = computed(() => [
  {
    to: { name: 'account-attendance', params: params.value },
    title: t('account.home.attendanceMonth'),
    line: format.monthAndYear(clock.month),
    value: attendance.value.lessons.length
      ? `${attendance.value.percentage}%`
      : t('account.home.noAttendance'),
    colour: null,
  },
  {
    to: { name: 'account-payments', params: params.value },
    title: t('account.home.payments'),
    line: t('account.home.feeLine', {
      month: format.monthAndYear(feeMonth.value),
      fee: format.money(payment.value?.fee ?? 0),
    }),
    value: payment.value ? t(`paymentStatus.${payment.value.status}`) : '',
    colour: payment.value ? PAYMENT_STATUS_COLOUR[payment.value.status] : null,
  },
  {
    to: { name: 'account-materials', params: params.value },
    title: t('account.home.materials'),
    line: t('account.home.materialsLine'),
    value: '',
    colour: null,
  },
  {
    to: { name: 'account-grades', params: params.value },
    title: t('account.home.grades'),
    line: t('account.home.gradesLine'),
    value:
      latestGrade.value?.score != null
        ? t('account.grades.outOf', { score: latestGrade.value.score })
        : t('account.home.noGrades'),
    colour: null,
  },
])
</script>

<template>
  <AppLayout :title="student?.fullName ?? ''">
    <template v-if="canSwitchChild" #actions>
      <UButton
        :to="{ name: 'account-children' }"
        color="neutral"
        variant="outline"
        size="lg"
        :label="t('account.switchChild')"
      />
    </template>

    <template v-if="student">
      <div class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('account.home.nextLesson') }}</h2>
        <LessonAbsenceCard v-if="next" :lesson="next" :student="student" :can-report="isParent" />
        <p v-else class="rounded-md border border-line bg-paper p-4 text-ink-muted">
          {{ t('account.home.noNext') }}
        </p>
      </div>

      <ul class="divide-y divide-line rounded-md border border-line bg-paper">
        <li v-for="row in rows" :key="row.title">
          <RouterLink
            :to="row.to"
            class="flex min-h-16 items-center gap-4 p-4 hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
          >
            <span class="min-w-0 flex-1">
              <span class="block font-semibold">{{ row.title }}</span>
              <span class="block text-sm text-ink-muted">{{ row.line }}</span>
            </span>
            <UBadge
              v-if="row.colour"
              :color="row.colour"
              variant="subtle"
              size="lg"
              :label="row.value"
            />
            <span v-else class="shrink-0 text-sm">{{ row.value }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-5 shrink-0 text-ink-muted" />
          </RouterLink>
        </li>
      </ul>
    </template>
  </AppLayout>
</template>
