// Checks that the seed gives the totals the contracts state. Run: node scripts/check-seed.ts
import { buildSeed, DEMO_DATE, DEMO_MONTH, HOME_BRANCH_ID, MALIKA_ID } from '../src/data/seed.ts'
import { collectionProgress, debtorLines } from '../src/domain/finance.ts'
import { monthlyAttendance, missingAttendance } from '../src/domain/attendance.ts'
import { enrolmentFunnel } from '../src/domain/enrolment.ts'

const seed = buildSeed()
const lines = debtorLines(HOME_BRANCH_ID, DEMO_MONTH, DEMO_DATE, seed)
const collection = collectionProgress(HOME_BRANCH_ID, DEMO_MONTH, seed)
const funnel = enrolmentFunnel(DEMO_MONTH, seed.enrolments, seed.enquiries).map((s) => s.count)
const attendance = monthlyAttendance(MALIKA_ID, ['2026-09', '2026-10', '2026-11'], seed.lessons, seed.lessonRecords)
const statuses = (status: string): number => seed.enrolments.filter((e) => e.status === status).length
const missing = missingAttendance(seed.lessons, seed.lessonRecords, `${DEMO_DATE}T08:42:00`)

const checks: [string, unknown, unknown][] = [
  ['debtors', lines.length, 23],
  ['debt total', lines.reduce((s, l) => s + l.amountDue, 0), 9_200_000],
  ['due', collection.due, 51_000_000],
  ['collected', collection.collected, 41_800_000],
  ['collection %', collection.percentage, 82],
  ['funnel', funnel.join(','), '14,11,9,8,7,5'],
  ['in progress', statuses('inProgress'), 3],
  ['waiting list', statuses('waitingList'), 5],
  ['completed', statuses('completed'), 41],
  ['lost', statuses('lost'), 7],
  ['attendance Sep, Oct, Nov', attendance.map((a) => a.percentage).join(','), '85,86,100'],
  ['missing attendance before 09:30', missing.length, 1],
  ['Malika due', lines.find((l) => l.studentId === MALIKA_ID)?.amountDue, 500_000],
]
let failed = 0
for (const [name, got, want] of checks) {
  const ok = got === want
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${String(got)}${ok ? '' : ` (expected ${String(want)})`}`)
}
console.log(`students ${seed.students.length}, payments ${seed.payments.length}, lessons ${seed.lessons.length}, records ${seed.lessonRecords.length}`)
process.exit(failed ? 1 : 0)
