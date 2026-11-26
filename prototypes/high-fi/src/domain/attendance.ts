// Attendance calculations for the personal account (FR-05) and the missing-attendance list (FR-02).
import type {
  AttendanceSummary,
  Lesson,
  LessonAttendance,
  LessonRecord,
  MonthlyAttendance,
} from '@/types'

/** Minutes after the start when a lesson with no record counts as missing attendance. */
export const MISSING_AFTER_MINUTES = 30

export function attendanceSummary(
  studentId: string,
  month: string,
  lessons: Lesson[],
  records: LessonRecord[],
): AttendanceSummary {
  const rows: LessonAttendance[] = []
  for (const lesson of lessons) {
    if (!lesson.date.startsWith(month)) continue
    const mark = records
      .find((r) => r.lessonId === lesson.id)
      ?.marks.find((m) => m.studentId === studentId)
    if (mark) rows.push({ lessonId: lesson.id, date: lesson.date, status: mark.status })
  }
  rows.sort((a, b) => b.date.localeCompare(a.date))
  const attended = rows.filter((r) => r.status !== 'absent').length
  return {
    month,
    lessons: rows,
    attended,
    percentage: rows.length === 0 ? 0 : Math.round((attended / rows.length) * 100),
  }
}

export function monthlyAttendance(
  studentId: string,
  months: string[],
  lessons: Lesson[],
  records: LessonRecord[],
): MonthlyAttendance[] {
  return months
    .map((month) => attendanceSummary(studentId, month, lessons, records))
    .filter((s) => s.lessons.length > 0)
    .map((s) => ({ month: s.month, percentage: s.percentage }))
}

export function missingAttendance(
  lessons: Lesson[],
  records: LessonRecord[],
  now: string,
): Lesson[] {
  return lessons.filter((lesson) => {
    if (lesson.state !== 'scheduled') return false
    if (records.some((r) => r.lessonId === lesson.id)) return false
    const start = new Date(`${lesson.date}T${lesson.startTime}:00`).getTime()
    return new Date(now).getTime() >= start + MISSING_AFTER_MINUTES * 60_000
  })
}
