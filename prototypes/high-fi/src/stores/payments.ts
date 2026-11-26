import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  collectionProgress as calculateCollection,
  debtorLines as calculateDebtorLines,
  type FinanceData,
} from '@/domain/finance'
import type {
  CallResult,
  CallResultKind,
  CollectionProgress,
  DebtorLine,
  Discount,
  Payment,
  PaymentMethod,
} from '@/types'
import { useClockStore } from './clock'
import { useDirectoryStore } from './directory'
import { useEnrolmentsStore } from './enrolments'
import { persistedRef, seedData } from './persist'

export type CallResultError = 'dateNotAfterToday'

function nextMonth(month: string): string {
  const [year, m] = month.split('-').map(Number) as [number, number]
  return m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`
}

export const usePaymentsStore = defineStore('payments', () => {
  const clock = useClockStore()
  const payments = persistedRef<Payment[]>('payments', () => seedData().payments)
  const discounts = persistedRef<Discount[]>('discounts', () => seedData().discounts)
  const callResults = persistedRef<CallResult[]>('call-results', () => seedData().callResults)

  const directory = useDirectoryStore()
  const enrolmentsStore = useEnrolmentsStore()
  /** Everything the fee calculations read, gathered once. */
  const financeData = computed<FinanceData>(() => ({
    students: directory.students,
    groups: directory.groups,
    users: directory.users,
    payments: payments.value,
    discounts: discounts.value,
    callResults: callResults.value,
    enrolments: enrolmentsStore.enrolments,
  }))

  /** Debtors.debtorLines(): one line per student who owes for the month. */
  const debtorLines = (branchId: string, month: string): DebtorLine[] =>
    calculateDebtorLines(branchId, month, clock.today, financeData.value)
  /** Debtors.collectionProgress(): fees due and collected for the branch. */
  const collectionProgress = (branchId: string, month: string): CollectionProgress =>
    calculateCollection(branchId, month, financeData.value)

  const newId = (): string => `p-${payments.value.length + 1}-${clock.time.replace(':', '')}`

  function add(
    studentId: string,
    month: string,
    amount: number,
    method: PaymentMethod,
    by: string,
    extra: Partial<Payment> = {},
  ): Payment {
    const payment: Payment = {
      id: newId(),
      studentId,
      month,
      amount,
      method,
      status: 'recorded',
      invoiceNumber: null,
      qrPayload: null,
      recordedByUserId: by,
      recordedAt: clock.now,
      ...extra,
    }
    payments.value.push(payment)
    return payment
  }

  /**
   * Payment.record(): logs who recorded it and when. An amount above what is due becomes
   * credit for the next month (FR-04 validation rules).
   */
  function record(
    studentId: string,
    month: string,
    amount: number,
    method: PaymentMethod,
    by: string,
    due: number,
  ): Payment {
    const forMonth = Math.min(amount, due)
    const payment = add(studentId, month, forMonth, method, by)
    if (amount > forMonth) add(studentId, nextMonth(month), amount - forMonth, method, by)
    return payment
  }

  /** The invoice number a new Payme or Click payment would get. */
  function nextInvoiceNumber(month: string): string {
    const count = payments.value.filter((p) => p.invoiceNumber !== null).length
    return `INV-${month}-${String(412 + count).padStart(4, '0')}`
  }

  // SIMULATED: the QR code holds a demo reference, not a real Payme or Click payment link.
  function qrPayloadFor(invoiceNumber: string, amount: number, method: PaymentMethod): string {
    return `ITMATIC DEMO | ${method.toUpperCase()} | ${invoiceNumber} | ${amount} UZS | NOT A REAL PAYMENT`
  }

  /** Payment.createQrInvoice(): Payme or Click only; the payment waits for the provider to confirm. */
  function createQrInvoice(
    studentId: string,
    month: string,
    amount: number,
    method: PaymentMethod,
    by: string,
  ): Payment {
    const invoiceNumber = nextInvoiceNumber(month)
    return add(studentId, month, amount, method, by, {
      status: 'awaitingConfirmation',
      invoiceNumber,
      qrPayload: qrPayloadFor(invoiceNumber, amount, method),
    })
  }

  // SIMULATED: the provider's confirmation arrives after a short wait in the prototype.
  function confirm(paymentId: string): void {
    const payment = payments.value.find((p) => p.id === paymentId)
    if (!payment) return
    payment.status = 'recorded'
    payment.recordedAt = clock.now
  }

  /** Debtors.recordCallResult(): a promised date must be after today (E-FR04-04). */
  function recordCallResult(
    studentId: string,
    month: string,
    result: CallResultKind,
    promisedDate: string | null,
    by: string,
  ): CallResultError | null {
    if (result === 'promisedBy' && (!promisedDate || promisedDate <= clock.today))
      return 'dateNotAfterToday'
    callResults.value.push({
      id: `cr-${callResults.value.length + 1}`,
      studentId,
      month,
      result,
      promisedDate: result === 'promisedBy' ? promisedDate : null,
      recordedByUserId: by,
      recordedAt: clock.now,
    })
    return null
  }

  return {
    payments,
    financeData,
    debtorLines,
    collectionProgress,
    discounts,
    callResults,
    record,
    nextInvoiceNumber,
    qrPayloadFor,
    createQrInvoice,
    confirm,
    recordCallResult,
  }
})
