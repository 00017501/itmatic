import { defineStore } from 'pinia'
import { currentStage } from '@/domain/enrolment'
import type { Enquiry, Enrolment, LostReason, StageKey, StageResult } from '@/types'
import { useClockStore } from './clock'
import { useDirectoryStore } from './directory'
import { persistedRef, seedData } from './persist'

export type StageOutcome = 'recorded' | 'backToGroup' | 'stageRepeats' | 'outOfOrder'
export type GroupError = 'groupFull' | 'groupMismatch' | 'outOfOrder'
export type ContractError = 'numberMissing' | 'numberTaken' | 'scanInvalid' | 'noContract'
export interface ContractDraft {
  number: string
  date: string
  scanName: string
}

const SCAN_TYPES = ['pdf', 'jpg', 'jpeg', 'png']
/** Stages that are done again when the applicant goes back to choosing a group. */
const AFTER_GROUP: StageKey[] = ['group', 'teacherConversation', 'trialLesson', 'feedback']
const digits = (phone: string): string => phone.replace(/\D/g, '')

export const useEnrolmentsStore = defineStore('enrolments', () => {
  const clock = useClockStore()
  const directory = useDirectoryStore()
  const enquiries = persistedRef<Enquiry[]>('enquiries', () => seedData().enquiries)
  const enrolments = persistedRef<Enrolment[]>('enrolments', () => seedData().enrolments)

  const enrolmentById = (id: string): Enrolment | undefined =>
    enrolments.value.find((e) => e.id === id)
  const enquiryById = (id: string): Enquiry | undefined => enquiries.value.find((q) => q.id === id)

  /**
   * Enrolment.recordStage(): stages are recorded in order, with the date and the responsible
   * user. "Not suitable" and "wants another group" return the flow to choosing a group; a
   * missed trial lesson leaves that stage open (FR-01 alternative flows).
   */
  function recordStage(
    id: string,
    key: StageKey,
    result: StageResult,
    detail: string,
    by: string,
    level: string | null = null,
  ): StageOutcome {
    const enrolment = enrolmentById(id)
    if (!enrolment || currentStage(enrolment) !== key) return 'outOfOrder'
    if (result === 'notSuitable' || result === 'wantsAnotherGroup') {
      enrolment.stages = enrolment.stages.filter((s) => !AFTER_GROUP.includes(s.key))
      enrolment.groupId = null
      return 'backToGroup'
    }
    if (result === 'didNotAttend') return 'stageRepeats'
    enrolment.stages.push({ key, result, detail, date: clock.today, responsibleUserId: by })
    if (key === 'levelTest') enrolment.level = level
    return 'recorded'
  }

  /** Enrolment.assignGroup(): the group matches the course and level and has a free place. */
  function assignGroup(id: string, groupId: string, by: string): GroupError | null {
    const enrolment = enrolmentById(id)
    const group = directory.groupById(groupId)
    if (!enrolment || !group || currentStage(enrolment) !== 'group') return 'outOfOrder'
    const enquiry = enquiryById(enrolment.enquiryId)
    if (group.courseId !== enquiry?.courseId || group.level !== enrolment.level)
      return 'groupMismatch'
    if (directory.studentsInGroup(groupId).length >= group.capacity) return 'groupFull'
    enrolment.groupId = groupId
    enrolment.status = 'inProgress'
    enrolment.stages.push({
      key: 'group',
      result: 'assigned',
      detail: group.code,
      date: clock.today,
      responsibleUserId: by,
    })
    return null
  }

  function addToWaitingList(id: string): void {
    const enrolment = enrolmentById(id)
    if (enrolment) enrolment.status = 'waitingList'
  }

  /** The applicant joins the group only once a signed contract is recorded (E-FR01-02). */
  function addToGroup(id: string): ContractError | null {
    const enrolment = enrolmentById(id)
    const enquiry = enrolment ? enquiryById(enrolment.enquiryId) : undefined
    const group = directory.groupById(enrolment?.groupId ?? null)
    if (!enrolment || !enquiry || !group || !enrolment.contractNumber) return 'noContract'

    const existingParent = directory.users.find(
      (u) => u.role === 'parent' && digits(u.phone) === digits(enquiry.parentPhone),
    )
    const parentId = existingParent?.id ?? `u-parent-${enrolment.id}`
    const studentId = `s-${enrolment.id}`
    const account = { language: 'en' as const, branchId: group.branchId }
    if (!existingParent) {
      directory.addUser({
        id: parentId,
        role: 'parent',
        fullName: enquiry.parentName,
        phone: enquiry.parentPhone,
        studentId: null,
        ...account,
      })
    }
    directory.addStudent({
      id: studentId,
      fullName: enquiry.studentName,
      age: enquiry.age,
      phone: enquiry.studentPhone,
      branchId: group.branchId,
      groupId: group.id,
      parentIds: [parentId],
    })
    directory.addUser({
      id: `u-student-${enrolment.id}`,
      role: 'student',
      fullName: enquiry.studentName,
      phone: enquiry.studentPhone,
      studentId,
      ...account,
    })
    enrolment.studentId = studentId
    enrolment.status = 'completed'
    return null
  }

  /**
   * Enrolment.complete(): records the signed contract, then adds the student to the group and
   * creates the student and parent accounts. The first month's fee becomes due through
   * firstFeeMonth(), which reads the contract date.
   */
  function complete(id: string, contract: ContractDraft, by: string): ContractError | null {
    const enrolment = enrolmentById(id)
    if (!enrolment || currentStage(enrolment) !== 'contract') return 'noContract'
    const number = contract.number.trim()
    if (!number) return 'numberMissing'
    if (enrolments.value.some((e) => e.contractNumber === number)) return 'numberTaken'
    const scanName = contract.scanName.trim()
    if (
      !scanName.includes('.') ||
      !SCAN_TYPES.includes(scanName.split('.').pop()?.toLowerCase() ?? '')
    )
      return 'scanInvalid'
    enrolment.contractNumber = number
    enrolment.contractDate = contract.date
    enrolment.contractScanName = scanName
    enrolment.stages.push({
      key: 'contract',
      result: 'signed',
      detail: number,
      date: contract.date,
      responsibleUserId: by,
    })
    return addToGroup(id)
  }

  /** Enrolment.closeAsLost(): the refusal reason is mandatory (E-FR01-05). */
  function closeAsLost(id: string, reason: LostReason | null): 'reasonMissing' | null {
    const enrolment = enrolmentById(id)
    if (!enrolment || !reason) return 'reasonMissing'
    enrolment.status = 'lost'
    enrolment.lostReason = reason
    return null
  }

  return {
    enquiries,
    enrolments,
    enrolmentById,
    enquiryById,
    recordStage,
    assignGroup,
    addToWaitingList,
    addToGroup,
    complete,
    closeAsLost,
  }
})
