// Status colours carry meaning only, and always sit next to the status word (DESIGN.md).
import type { AttendanceStatus, EnrolmentStatus, PaymentStatusKind } from '@/types'

export type StatusColour = 'primary' | 'success' | 'warning' | 'error' | 'neutral'

export const ENROLMENT_STATUS_COLOUR: Record<EnrolmentStatus, StatusColour> = {
  inProgress: 'primary',
  waitingList: 'warning',
  completed: 'success',
  lost: 'error',
}

export const ATTENDANCE_COLOUR: Record<AttendanceStatus, StatusColour> = {
  present: 'success',
  late: 'warning',
  absent: 'error',
}

export const PAYMENT_STATUS_COLOUR: Record<PaymentStatusKind, StatusColour> = {
  paid: 'success',
  partlyPaid: 'warning',
  unpaid: 'error',
}
