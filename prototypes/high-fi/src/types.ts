// Mirrors .agents/contracts/data-model.md. Change both together.
// Ids are strings; dates are ISO strings; money is whole so'm; months are YYYY-MM.

export type Role = 'administrator' | 'teacher' | 'parent' | 'student'
export type Language = 'en' | 'ru' | 'uz'

export interface Branch {
  id: string
  name: string
}

export interface User {
  id: string
  role: Role
  fullName: string
  phone: string
  language: Language
  branchId: string
  /** Set for a student login: the student record this account shows. */
  studentId: string | null
}

export interface Student {
  id: string
  fullName: string
  age: number
  phone: string
  branchId: string
  groupId: string | null
  parentIds: string[]
}

export interface Course {
  id: string
  name: string
}

export type GroupType = 'standard' | 'mini' | 'individual'

export interface Group {
  id: string
  code: string
  courseId: string
  level: string
  teacherId: string
  branchId: string
  type: GroupType
  capacity: number
  monthlyFee: number
  room: string
  /** 0 is Sunday, 6 is Saturday. */
  weekdays: number[]
  startTime: string
}

export interface Enquiry {
  id: string
  studentName: string
  age: number
  studentPhone: string
  parentName: string
  parentPhone: string
  courseId: string
  createdAt: string
}

export type EnrolmentStatus = 'inProgress' | 'waitingList' | 'completed' | 'lost'
export type StageKey =
  'levelTest' | 'group' | 'teacherConversation' | 'trialLesson' | 'feedback' | 'contract'
export type StageResult =
  | 'scored'
  | 'skipped'
  | 'assigned'
  | 'accepted'
  | 'notSuitable'
  | 'attended'
  | 'didNotAttend'
  | 'wantsToJoin'
  | 'wantsAnotherGroup'
  | 'declines'
  | 'signed'
export type LostReason = 'price' | 'schedule' | 'level' | 'location' | 'other'

export interface EnrolmentStage {
  key: StageKey
  result: StageResult
  detail: string
  date: string
  responsibleUserId: string
}

export interface Enrolment {
  id: string
  enquiryId: string
  status: EnrolmentStatus
  level: string | null
  groupId: string | null
  stages: EnrolmentStage[]
  lostReason: LostReason | null
  contractNumber: string | null
  contractDate: string | null
  contractScanName: string | null
  studentId: string | null
}

export type LessonState = 'scheduled' | 'cancelled'

export interface Lesson {
  id: string
  groupId: string
  teacherId: string
  date: string
  startTime: string
  room: string
  state: LessonState
}

export type AttendanceStatus = 'present' | 'late' | 'absent'

export interface AttendanceChange {
  status: AttendanceStatus
  changedAt: string
}

export interface AttendanceMark {
  studentId: string
  status: AttendanceStatus
  history: AttendanceChange[]
}

export interface LessonRecord {
  lessonId: string
  topic: string
  homework: string
  attachmentNames: string[]
  marks: AttendanceMark[]
  savedAt: string
  savedByUserId: string
  savedOffline: boolean
  sentAt: string | null
}

export type AbsenceKind = 'late' | 'absent'
export type DelayMinutes = 5 | 10 | 15 | 30 | 60
export type AbsenceReason = 'illness' | 'family' | 'travel' | 'schoolExam' | 'other'
export type ReportedVia = 'parent' | 'phone'

export interface AbsenceStatus {
  id: string
  lessonId: string
  studentId: string
  kind: AbsenceKind
  delayMinutes: DelayMinutes | null
  reason: AbsenceReason | null
  otherText: string
  reportedByUserId: string
  reportedVia: ReportedVia
  reportedAt: string
  withdrawnAt: string | null
}

export type PaymentMethod = 'cash' | 'card' | 'payme' | 'click'
export type PaymentRecordStatus = 'recorded' | 'awaitingConfirmation'

export interface Payment {
  id: string
  studentId: string
  month: string
  amount: number
  method: PaymentMethod
  status: PaymentRecordStatus
  invoiceNumber: string | null
  qrPayload: string | null
  recordedByUserId: string
  recordedAt: string
}

export type DiscountType = 'oneOff' | 'bringAFriend'

export interface Discount {
  id: string
  studentId: string
  month: string
  percent: number
  type: DiscountType
  approved: boolean
}

export type CallResultKind = 'promisedBy' | 'noAnswer' | 'leaving'

export interface CallResult {
  id: string
  studentId: string
  month: string
  result: CallResultKind
  promisedDate: string | null
  recordedByUserId: string
  recordedAt: string
}

export type GradeKind = 'midterm' | 'final'

export interface Grade {
  id: string
  studentId: string
  level: string
  kind: GradeKind
  score: number | null
  published: boolean
}

// ---- Derived values: calculated, never stored ----

export interface DebtorLine {
  studentId: string
  studentName: string
  groupCode: string
  parentName: string
  parentPhone: string
  amountDue: number
  unpaidMonths: string[]
  lastPaymentDate: string | null
  callResult: CallResult | null
}

export type PaymentStatusKind = 'paid' | 'partlyPaid' | 'unpaid'

export interface PaymentStatus {
  month: string
  fee: number
  paid: number
  due: number
  dueDate: string
  status: PaymentStatusKind
}

export interface LessonAttendance {
  lessonId: string
  date: string
  status: AttendanceStatus
}

export interface AttendanceSummary {
  month: string
  lessons: LessonAttendance[]
  attended: number
  percentage: number
}

export interface MonthlyAttendance {
  month: string
  percentage: number
}

export interface GradeProgress {
  level: string
  kind: GradeKind
  score: number
}

export interface CollectionProgress {
  month: string
  due: number
  collected: number
  percentage: number
}

export interface EnrolmentFunnelStep {
  step: 'enquiry' | 'levelTest' | 'group' | 'teacherConversation' | 'trialLesson' | 'contract'
  count: number
}

/** Everything the seed provides and the stores keep. */
export interface SeedData {
  branches: Branch[]
  users: User[]
  students: Student[]
  courses: Course[]
  groups: Group[]
  enquiries: Enquiry[]
  enrolments: Enrolment[]
  lessons: Lesson[]
  lessonRecords: LessonRecord[]
  absenceStatuses: AbsenceStatus[]
  payments: Payment[]
  discounts: Discount[]
  callResults: CallResult[]
  grades: Grade[]
}
