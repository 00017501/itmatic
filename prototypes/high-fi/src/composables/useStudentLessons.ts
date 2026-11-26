import { computed, type ComputedRef } from 'vue'
import { hasStarted } from '@/domain/lesson'
import { useClockStore } from '@/stores/clock'
import { useLessonsStore } from '@/stores/lessons'
import type { Lesson, Student } from '@/types'

/** A student's lessons, split around the demo clock. */
export function useStudentLessons(student: ComputedRef<Student | undefined>) {
  const clock = useClockStore()
  const lessonsStore = useLessonsStore()

  const all = computed<Lesson[]>(() =>
    lessonsStore.lessons
      .filter((l) => l.groupId === student.value?.groupId && l.state === 'scheduled')
      .sort((a, b) => a.date.localeCompare(b.date)),
  )
  /** The next lesson that has not started yet. */
  const next = computed(() =>
    all.value.find((l) => l.date >= clock.today && !hasStarted(l, clock.now)),
  )
  const earlier = computed(() => all.value.filter((l) => hasStarted(l, clock.now)).reverse())

  return { all, next, earlier }
}
