<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/composables/useFormat'
import { FORM_OPENS_BEFORE_MINUTES, formIsOpen, LESSON_MINUTES } from '@/domain/lesson'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { useLessonsStore } from '@/stores/lessons'
import { useSessionStore } from '@/stores/session'
import { addMinutes } from '@/utils/format'

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const directory = useDirectoryStore()
const lessonsStore = useLessonsStore()
const { user } = storeToRefs(useSessionStore())

const rows = computed(() =>
  lessonsStore.lessons
    .filter(
      (lesson) =>
        lesson.teacherId === user.value?.id &&
        lesson.date === clock.today &&
        lesson.state === 'scheduled',
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((lesson) => {
      const group = directory.groupById(lesson.groupId)
      const record = lessonsStore.recordFor(lesson.id)
      return {
        id: lesson.id,
        title: t('teacher.today.lessonTitle', {
          course: directory.courseById(group?.courseId ?? null)?.name ?? '',
          level: group?.level ?? '',
          group: group?.code ?? '',
        }),
        time: t('teacher.today.lessonTime', {
          start: lesson.startTime,
          end: addMinutes(lesson.startTime, LESSON_MINUTES),
          room: lesson.room,
        }),
        students: directory.studentsInGroup(lesson.groupId).length,
        absences: lessonsStore.activeStatusesFor(lesson.id).length,
        open: formIsOpen(lesson, clock.now),
        opensAt: addMinutes(lesson.startTime, -FORM_OPENS_BEFORE_MINUTES),
        savedAt: record ? format.time(record.savedAt) : null,
      }
    }),
)
</script>

<template>
  <AppLayout
    :title="t('teacher.today.title')"
    :caption="`${format.weekdayLong(clock.today)}, ${format.date(clock.today)}. ${t('teacher.today.teacherLine', { name: user?.fullName ?? '' })}`"
  >
    <p v-if="rows.length === 0" class="rounded-md border border-line bg-paper p-6 text-ink-muted">
      {{ t('teacher.today.empty') }}
    </p>
    <ul v-else class="divide-y divide-line rounded-md border border-line bg-paper">
      <li v-for="row in rows" :key="row.id">
        <component
          :is="row.open ? 'RouterLink' : 'div'"
          :to="row.open ? { name: 'teacher-lesson', params: { id: row.id } } : undefined"
          class="flex min-h-16 items-center gap-4 p-4"
          :class="
            row.open
              ? 'hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500'
              : ''
          "
        >
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ row.title }}</p>
            <p class="text-sm text-ink-muted">{{ row.time }}</p>
            <p v-if="row.absences > 0" class="mt-1 text-sm font-semibold text-pending">
              {{ t('teacher.today.absences', { n: row.absences }) }}
            </p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1 text-sm">
            <span class="text-ink-muted">{{
              t('teacher.today.students', { n: row.students })
            }}</span>
            <UBadge
              v-if="row.savedAt"
              color="success"
              variant="subtle"
              :label="t('teacher.today.saved', { time: row.savedAt })"
            />
            <UBadge
              v-else-if="!row.open"
              color="neutral"
              variant="subtle"
              :label="t('teacher.today.opens', { time: row.opensAt })"
            />
          </div>
          <UIcon
            v-if="row.open"
            name="i-lucide-chevron-right"
            class="size-5 shrink-0 text-ink-muted"
          />
        </component>
      </li>
    </ul>
    <p class="text-sm text-ink-muted">{{ t('teacher.today.note') }}</p>
  </AppLayout>
</template>
