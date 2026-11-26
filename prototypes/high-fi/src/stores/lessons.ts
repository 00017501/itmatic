import { defineStore } from 'pinia'
import {
  validateAbsenceDraft,
  validateLessonDraft,
  type AbsenceDraft,
  type AbsenceDraftError,
  type LessonDraft,
  type LessonDraftError,
} from '@/domain/lesson'
import type {
  AbsenceStatus,
  AttendanceMark,
  Lesson,
  LessonRecord,
  ReportedVia,
  Student,
} from '@/types'
import { useClockStore } from './clock'
import { persistedRef, seedData } from './persist'

export const useLessonsStore = defineStore('lessons', () => {
  const clock = useClockStore()
  const lessons = persistedRef<Lesson[]>('lessons', () => seedData().lessons)
  const records = persistedRef<LessonRecord[]>('lesson-records', () => seedData().lessonRecords)
  const absenceStatuses = persistedRef<AbsenceStatus[]>(
    'absence-statuses',
    () => seedData().absenceStatuses,
  )
  // SIMULATED: connection loss is a switch on the lesson form (NFR-03).
  const offline = persistedRef<boolean>('offline', () => false)

  const lessonById = (id: string): Lesson | undefined => lessons.value.find((l) => l.id === id)
  const recordFor = (lessonId: string): LessonRecord | undefined =>
    records.value.find((r) => r.lessonId === lessonId)
  /** The advance status in force for a student and lesson (withdrawn ones are history). */
  const activeStatus = (lessonId: string, studentId: string): AbsenceStatus | undefined =>
    absenceStatuses.value.find(
      (a) => a.lessonId === lessonId && a.studentId === studentId && a.withdrawnAt === null,
    )
  const activeStatusesFor = (lessonId: string): AbsenceStatus[] =>
    absenceStatuses.value.filter((a) => a.lessonId === lessonId && a.withdrawnAt === null)

  /** LessonRecord.markAllPresent(): fills only the unmarked students; advance statuses stay. */
  function markAllPresent(draft: LessonDraft, students: Student[]): void {
    for (const student of students) draft.marks[student.id] ??= 'present'
  }

  /** LessonRecord.save(): one record per lesson; a changed mark keeps its earlier value in the history. */
  function save(
    lessonId: string,
    draft: LessonDraft,
    students: Student[],
    savedByUserId: string,
  ): LessonDraftError | null {
    const error = validateLessonDraft(draft, students)
    if (error) return error
    const now = clock.now
    const previous = recordFor(lessonId)
    const marks: AttendanceMark[] = students.map((student) => {
      const status = draft.marks[student.id] ?? 'present'
      const before = previous?.marks.find((m) => m.studentId === student.id)
      const history = before ? [...before.history] : []
      if (!before || before.status !== status) history.push({ status, changedAt: now })
      return { studentId: student.id, status, history }
    })
    const record: LessonRecord = {
      lessonId,
      topic: draft.topic.trim(),
      homework: draft.homework.trim(),
      attachmentNames: draft.attachmentNames,
      marks,
      savedAt: now,
      savedByUserId,
      savedOffline: offline.value,
      sentAt: offline.value ? null : now,
    }
    const index = records.value.findIndex((r) => r.lessonId === lessonId)
    if (index >= 0) records.value[index] = record
    else records.value.push(record)
    return null
  }

  /** When the connection returns, records saved on the device are sent (NFR-03). */
  function setOffline(next: boolean): void {
    offline.value = next
    if (next) return
    for (const record of records.value) {
      if (record.sentAt === null) record.sentAt = clock.now
    }
  }

  /** AbsenceStatus.report(): one advance status per student and lesson; a replacement keeps the old one. */
  function report(
    lesson: Lesson,
    studentId: string,
    draft: AbsenceDraft,
    reportedByUserId: string,
    reportedVia: ReportedVia = 'parent',
  ): AbsenceDraftError | null {
    const error = validateAbsenceDraft(draft, lesson, clock.now)
    if (error) return error
    const existing = activeStatus(lesson.id, studentId)
    if (existing) existing.withdrawnAt = clock.now
    absenceStatuses.value.push({
      id: `a-${absenceStatuses.value.length + 1}`,
      lessonId: lesson.id,
      studentId,
      kind: draft.kind,
      delayMinutes: draft.kind === 'late' ? draft.delayMinutes : null,
      reason: draft.kind === 'absent' ? draft.reason : null,
      otherText: draft.kind === 'absent' && draft.reason === 'other' ? draft.otherText.trim() : '',
      reportedByUserId,
      reportedVia,
      reportedAt: clock.now,
      withdrawnAt: null,
    })
    return null
  }

  /** AbsenceStatus.withdraw(): kept in the history, no longer shown to the teacher. */
  function withdraw(statusId: string): void {
    const status = absenceStatuses.value.find((a) => a.id === statusId)
    if (status) status.withdrawnAt = clock.now
  }

  return {
    lessons,
    records,
    absenceStatuses,
    offline,
    lessonById,
    recordFor,
    activeStatus,
    activeStatusesFor,
    markAllPresent,
    save,
    setOffline,
    report,
    withdraw,
  }
})
