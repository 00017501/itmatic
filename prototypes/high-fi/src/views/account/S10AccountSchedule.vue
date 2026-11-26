<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LessonAbsenceCard from '@/components/account/LessonAbsenceCard.vue'
import ScheduleWeekCalendar from '@/components/account/ScheduleWeekCalendar.vue'
import { useAccountStudent } from '@/composables/useAccountStudent'
import { useFormat } from '@/composables/useFormat'
import { useStudentLessons } from '@/composables/useStudentLessons'
import AppLayout from '@/layouts/AppLayout.vue'
import { useLessonsStore } from '@/stores/lessons'
import type { Lesson } from '@/types'

const { t } = useI18n()
const format = useFormat()
const lessonsStore = useLessonsStore()
const { studentId, student, group, courseName, isParent } = useAccountStudent()
const { all, next, earlier } = useStudentLessons(student)

const dayLine = (lesson: Lesson): string =>
  `${format.weekdayShort(lesson.date)} ${format.date(lesson.date)}, ${lesson.startTime}`
const lessonLine = (lesson: Lesson): string =>
  t('account.schedule.lessonLine', {
    course: courseName.value,
    level: group.value?.level ?? '',
    room: lesson.room,
  })
</script>

<template>
  <AppLayout :title="t('account.schedule.title')" :caption="student?.fullName">
    <template v-if="student">
      <div class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('account.home.nextLesson') }}</h2>
        <LessonAbsenceCard v-if="next" :lesson="next" :student="student" :can-report="isParent" />
        <p v-else class="rounded-md border border-line bg-paper p-4 text-ink-muted">
          {{ t('account.home.noNext') }}
        </p>
      </div>

      <ScheduleWeekCalendar
        :lessons="all"
        :student-id="studentId"
        :course-line="`${courseName} ${group?.level ?? ''}`"
      />

      <div v-if="earlier.length" class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('account.schedule.earlier') }}</h2>
        <ul class="divide-y divide-line rounded-md border border-line bg-paper">
          <li v-for="lesson in earlier.slice(0, 3)" :key="lesson.id">
            <RouterLink
              :to="{ name: 'account-materials', params: { studentId } }"
              class="flex min-h-16 items-center gap-4 p-4 hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
            >
              <span class="min-w-0 flex-1">
                <span class="block font-semibold">{{ dayLine(lesson) }}</span>
                <span class="block text-sm text-ink-muted">{{
                  lessonsStore.recordFor(lesson.id)?.topic ?? lessonLine(lesson)
                }}</span>
              </span>
              <span class="shrink-0 text-sm">{{ t('account.schedule.materials') }}</span>
              <UIcon name="i-lucide-chevron-right" class="size-5 shrink-0 text-ink-muted" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </template>
  </AppLayout>
</template>
