// Fee calculations shared by the debtors list (FR-04) and the personal account (FR-05).
import type {
  CallResult,
  CollectionProgress,
  DebtorLine,
  Discount,
  Enrolment,
  Group,
  Payment,
  PaymentStatus,
  Student,
  User,
} from '@/types'

export interface FinanceData {
  students: Student[]
  groups: Group[]
  users: User[]
  payments: Payment[]
  discounts: Discount[]
  callResults: CallResult[]
  enrolments: Enrolment[]
}

/** A contract signed after the 20th makes the next month the first fee month. */
const LATE_JOIN_DAY = 20

export function firstFeeMonth(studentId: string, enrolments: Enrolment[]): string | null {
  const enrolment = enrolments.find((e) => e.studentId === studentId && e.contractDate)
  if (!enrolment?.contractDate) return null
  const [year, month, day] = enrolment.contractDate.split('-').map(Number) as [
    number,
    number,
    number,
  ]
  if (day <= LATE_JOIN_DAY) return enrolment.contractDate.slice(0, 7)
  const next = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, '0')}`
  return next
}

export function feeFor(student: Student, month: string, data: FinanceData): number {
  const group = data.groups.find((g) => g.id === student.groupId)
  if (!group) return 0
  const first = firstFeeMonth(student.id, data.enrolments)
  if (first && month < first) return 0
  const percent = data.discounts
    .filter((d) => d.studentId === student.id && d.month === month && d.approved)
    .reduce((sum, d) => sum + d.percent, 0)
  return Math.max(0, Math.round((group.monthlyFee * (100 - Math.min(percent, 100))) / 100))
}

export function paidFor(studentId: string, month: string, payments: Payment[]): number {
  return payments
    .filter((p) => p.studentId === studentId && p.month === month && p.status === 'recorded')
    .reduce((sum, p) => sum + p.amount, 0)
}

/** Group fee minus approved discounts minus recorded payments for that month; never negative. */
export function amountDue(student: Student, month: string, data: FinanceData): number {
  return Math.max(0, feeFor(student, month, data) - paidFor(student.id, month, data.payments))
}

export function paymentStatus(student: Student, month: string, data: FinanceData): PaymentStatus {
  const fee = feeFor(student, month, data)
  const paid = Math.min(fee, paidFor(student.id, month, data.payments))
  const due = fee - paid
  return {
    month,
    fee,
    paid,
    due,
    dueDate: `${month}-01`,
    status: due === 0 ? 'paid' : paid > 0 ? 'partlyPaid' : 'unpaid',
  }
}

export function debtorLines(
  branchId: string,
  month: string,
  today: string,
  data: FinanceData,
): DebtorLine[] {
  const lines: DebtorLine[] = []
  for (const student of data.students) {
    if (student.branchId !== branchId) continue
    const due = amountDue(student, month, data)
    if (due <= 0) continue
    const group = data.groups.find((g) => g.id === student.groupId)
    const parent = data.users.find((u) => u.id === student.parentIds[0])
    const last = data.payments
      .filter((p) => p.studentId === student.id && p.status === 'recorded')
      .map((p) => p.recordedAt)
      .sort()
      .at(-1)
    const callResult =
      data.callResults
        .filter((c) => c.studentId === student.id && c.month === month)
        .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
        .at(-1) ?? null
    lines.push({
      studentId: student.id,
      studentName: student.fullName,
      groupCode: group?.code ?? '',
      parentName: parent?.fullName ?? '',
      parentPhone: parent?.phone ?? '',
      amountDue: due,
      unpaidMonths: [month],
      lastPaymentDate: last ? last.slice(0, 10) : null,
      callResult,
    })
  }
  // A broken promise (promised date already passed) moves the line to the top.
  const broken = (line: DebtorLine): boolean =>
    line.callResult?.result === 'promisedBy' &&
    line.callResult.promisedDate !== null &&
    line.callResult.promisedDate < today
  return lines.sort(
    (a, b) => Number(broken(b)) - Number(broken(a)) || a.studentName.localeCompare(b.studentName),
  )
}

export function collectionProgress(
  branchId: string,
  month: string,
  data: FinanceData,
): CollectionProgress {
  let due = 0
  let collected = 0
  for (const student of data.students) {
    if (student.branchId !== branchId) continue
    const fee = feeFor(student, month, data)
    due += fee
    collected += Math.min(fee, paidFor(student.id, month, data.payments))
  }
  return { month, due, collected, percentage: due === 0 ? 0 : Math.round((collected / due) * 100) }
}
