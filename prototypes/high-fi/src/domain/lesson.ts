// Lesson record and advance absence rules (FR-02, FR-03).
import type {
  AbsenceKind,
  AbsenceReason,
  AttendanceStatus,
  DelayMinutes,
  Lesson,
  Student,
} from '@/types'

export const LESSON_MINUTES = 90
/** The lesson form opens this many minutes before the start (FR-02 preconditions). */
export const FORM_OPENS_BEFORE_MINUTES = 15
export const TOPIC_MIN = 3
export const TOPIC_MAX = 200
export const HOMEWORK_MAX = 1000
export const ATTACHMENTS_MAX = 3
export const ATTACHMENT_TYPES = ['pdf', 'docx', 'jpg', 'png', 'mp3']
export const DELAY_OPTIONS: DelayMinutes[] = [5, 10, 15, 30, 60]
export const ABSENCE_REASONS: AbsenceReason[] = [
  'illness',
  'family',
  'travel',
  'schoolExam',
  'other',
]

export interface LessonDraft {
  marks: Record<string, AttendanceStatus | null>
  topic: string
  homework: string
  attachmentNames: string[]
}

export type LessonDraftError =
  | { field: 'marks'; studentNames: string[] }
  | { field: 'topic' }
  | { field: 'homework' }
  | { field: 'attachments' }

function startOf(lesson: Lesson): number {
  return new Date(`${lesson.date}T${lesson.startTime}:00`).getTime()
}

export function hasStarted(lesson: Lesson, now: string): boolean {
  return new Date(now).getTime() >= startOf(lesson)
}

export function formIsOpen(lesson: Lesson, now: string): boolean {
  return new Date(now).getTime() >= startOf(lesson) - FORM_OPENS_BEFORE_MINUTES * 60_000
}

/** "Aliyeva Malika" becomes "Aliyeva M.", as in the CW1 message. */
export function shortName(fullName: string): string {
  const [surname, first] = fullName.split(' ')
  return first ? `${surname} ${first[0]}.` : fullName
}

/** Returns the first problem with a lesson draft, in the order CW1 lists them, or null. */
export function validateLessonDraft(
  draft: LessonDraft,
  students: Student[],
): LessonDraftError | null {
  const unmarked = students.filter((s) => !draft.marks[s.id])
  if (unmarked.length > 0)
    return { field: 'marks', studentNames: unmarked.map((s) => shortName(s.fullName)) }
  const topic = draft.topic.trim()
  if (topic.length < TOPIC_MIN || topic.length > TOPIC_MAX) return { field: 'topic' }
  if (draft.homework.length > HOMEWORK_MAX) return { field: 'homework' }
  const badType = draft.attachmentNames.some(
    (name) => !ATTACHMENT_TYPES.includes(name.split('.').pop()?.toLowerCase() ?? ''),
  )
  if (draft.attachmentNames.length > ATTACHMENTS_MAX || badType) return { field: 'attachments' }
  return null
}

export interface AbsenceDraft {
  kind: AbsenceKind
  delayMinutes: DelayMinutes | null
  reason: AbsenceReason | null
  otherText: string
}

export type AbsenceDraftError = 'started' | 'reasonMissing' | 'delayMissing'

export function validateAbsenceDraft(
  draft: AbsenceDraft,
  lesson: Lesson,
  now: string,
): AbsenceDraftError | null {
  if (hasStarted(lesson, now)) return 'started'
  if (draft.kind === 'late' && draft.delayMinutes === null) return 'delayMissing'
  if (
    draft.kind === 'absent' &&
    (draft.reason === null || (draft.reason === 'other' && !draft.otherText.trim()))
  ) {
    return 'reasonMissing'
  }
  return null
}
