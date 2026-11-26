<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAbsenceLabel } from '@/composables/useAbsenceLabel'
import { useFormat } from '@/composables/useFormat'
import { LESSON_MINUTES } from '@/domain/lesson'
import { useClockStore } from '@/stores/clock'
import { useLessonsStore } from '@/stores/lessons'
import type { Lesson } from '@/types'
import { addDays, minutesOf, mondayOf } from '@/utils/dates'
import { addMinutes } from '@/utils/format'
import { ATTENDANCE_COLOUR, type StatusColour } from '@/utils/statusColour'

// One week of a student's lessons: a time grid on a wide screen, a day list on a phone.
const props = defineProps<{ lessons: Lesson[]; studentId: string; courseLine: string }>()

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const lessonsStore = useLessonsStore()
const absenceLabel = useAbsenceLabel()

/** Height of one hour in the time grid, in px. */
const HOUR_HEIGHT = 64
const weekStart = ref(mondayOf(clock.today))

const firstWeek = computed(() => mondayOf(props.lessons[0]?.date ?? clock.today))
const lastWeek = computed(() => mondayOf(props.lessons.at(-1)?.date ?? clock.today))
/** The grid covers the group's lesson times with an hour to spare on each side. */
const firstHour = computed(
  () => Math.floor(Math.min(...props.lessons.map((l) => minutesOf(l.startTime)), 9 * 60) / 60) - 1,
)
const lastHour = computed(
  () =>
    Math.ceil(
      Math.max(...props.lessons.map((l) => minutesOf(l.startTime) + LESSON_MINUTES), 11 * 60) / 60,
    ) + 1,
)
const hours = computed(() =>
  Array.from({ length: lastHour.value - firstHour.value }, (_, index) => firstHour.value + index),
)

interface Block {
  lesson: Lesson
  start: string
  end: string
  top: number
  height: number
  state: { label: string; colour: StatusColour } | null
  hasMaterials: boolean
}

function blockFor(lesson: Lesson): Block {
  const record = lessonsStore.recordFor(lesson.id)
  const mark = record?.marks.find((m) => m.studentId === props.studentId)
  const advance = lessonsStore.activeStatus(lesson.id, props.studentId)
  let state: Block['state'] = null
  if (mark)
    state = { label: t(`attendanceStatus.${mark.status}`), colour: ATTENDANCE_COLOUR[mark.status] }
  else if (advance) state = { label: absenceLabel(advance), colour: 'warning' }
  return {
    lesson,
    start: lesson.startTime,
    end: addMinutes(lesson.startTime, LESSON_MINUTES),
    top: ((minutesOf(lesson.startTime) - firstHour.value * 60) / 60) * HOUR_HEIGHT,
    height: (LESSON_MINUTES / 60) * HOUR_HEIGHT,
    state,
    hasMaterials: !!record,
  }
}

const days = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart.value, index)
    return {
      date,
      weekday: format.weekdayShort(date),
      // DD.MM: the year is in the heading.
      short: format.date(date).slice(0, 5),
      today: date === clock.today,
      blocks: props.lessons.filter((l) => l.date === date).map(blockFor),
    }
  }),
)
const heading = computed(() =>
  t('account.schedule.week', {
    from: format.date(weekStart.value),
    to: format.date(addDays(weekStart.value, 6)),
  }),
)
const materialsLink = { name: 'account-materials', params: { studentId: props.studentId } }
</script>

<template>
  <section class="rounded-md border border-line bg-paper" :aria-label="heading">
    <div class="flex items-center justify-between gap-2 border-b border-line p-2 pl-4">
      <h2 class="font-semibold" aria-live="polite">{{ heading }}</h2>
      <div class="flex gap-1">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-chevron-left"
          :disabled="weekStart <= firstWeek"
          :aria-label="t('account.schedule.previousWeek')"
          @click="weekStart = addDays(weekStart, -7)"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-chevron-right"
          :disabled="weekStart >= lastWeek"
          :aria-label="t('account.schedule.nextWeek')"
          @click="weekStart = addDays(weekStart, 7)"
        />
      </div>
    </div>

    <!-- Wide screens: days across, hours down. The first column (3.5rem) holds the hour labels. -->
    <div class="hidden md:block">
      <div
        class="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b border-line text-center text-sm"
      >
        <span />
        <div
          v-for="day in days"
          :key="day.date"
          class="border-l border-line px-1 py-2"
          :class="day.today ? 'bg-inkteal-100' : ''"
        >
          <span class="block" :class="day.today ? 'font-semibold' : 'text-ink-muted'">
            {{ day.today ? t('app.today') : day.weekday }}
          </span>
          <span class="block">{{ day.short }}</span>
        </div>
      </div>
      <div
        class="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]"
        :style="{ height: `${hours.length * HOUR_HEIGHT}px` }"
      >
        <div class="relative">
          <span
            v-for="(hour, index) in hours"
            :key="hour"
            class="absolute right-2 text-xs text-ink-muted"
            :style="{ top: `${index * HOUR_HEIGHT + 4}px` }"
          >
            {{ String(hour).padStart(2, '0') }}:00
          </span>
        </div>
        <div
          v-for="day in days"
          :key="day.date"
          class="relative border-l border-line"
          :class="day.today ? 'bg-mist' : ''"
        >
          <span
            v-for="(hour, index) in hours"
            :key="hour"
            class="absolute inset-x-0 border-t border-line"
            :style="{ top: `${index * HOUR_HEIGHT}px` }"
          />
          <component
            :is="block.hasMaterials ? 'RouterLink' : 'div'"
            v-for="block in day.blocks"
            :key="block.lesson.id"
            :to="block.hasMaterials ? materialsLink : undefined"
            class="absolute inset-x-1 flex flex-col gap-0 overflow-hidden rounded-sm border border-inkteal-500 bg-inkteal-100 p-1 text-xs leading-tight focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inkteal-500"
            :class="block.hasMaterials ? 'hover:bg-inkteal-200' : ''"
            :style="{ top: `${block.top}px`, height: `${block.height}px` }"
            :title="`${t('account.schedule.hours', { start: block.start, end: block.end })}, ${courseLine}, ${block.lesson.room}`"
          >
            <span class="font-semibold">{{ block.start }}</span>
            <span class="font-semibold">{{ courseLine }}</span>
            <span class="text-ink-muted">{{ block.lesson.room }}</span>
            <UBadge
              v-if="block.state"
              :color="block.state.colour"
              variant="subtle"
              size="sm"
              class="mt-auto self-start"
              :label="block.state.label"
            />
          </component>
        </div>
      </div>
    </div>

    <!-- Phones: one row per day. -->
    <ul class="divide-y divide-line md:hidden">
      <li
        v-for="day in days"
        :key="day.date"
        class="flex gap-4 px-4 py-2"
        :class="day.today ? 'bg-inkteal-100' : ''"
      >
        <div class="w-18 shrink-0 text-sm">
          <span class="block" :class="day.today ? 'font-semibold' : 'text-ink-muted'">
            {{ day.today ? t('app.today') : day.weekday }}
          </span>
          <span class="block">{{ day.short }}</span>
        </div>
        <p v-if="day.blocks.length === 0" class="self-center text-sm text-ink-muted">
          {{ t('account.schedule.noLesson') }}
        </p>
        <div v-else class="flex min-w-0 flex-1 flex-col gap-2">
          <div
            v-for="block in day.blocks"
            :key="block.lesson.id"
            class="flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <span class="min-w-0 flex-1">
              <span class="block font-semibold">{{
                t('account.schedule.hours', { start: block.start, end: block.end })
              }}</span>
              <span class="block text-sm text-ink-muted"
                >{{ courseLine }}, {{ block.lesson.room }}</span
              >
            </span>
            <UBadge
              v-if="block.state"
              :color="block.state.colour"
              variant="subtle"
              :label="block.state.label"
            />
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
