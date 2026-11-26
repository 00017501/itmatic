// Enrolment stage rules (FR-01).
import type { Enquiry, Enrolment, EnrolmentFunnelStep, StageKey } from '@/types'

export const STAGE_ORDER: StageKey[] = [
  'levelTest',
  'group',
  'teacherConversation',
  'trialLesson',
  'feedback',
  'contract',
]

/** The first stage with no result yet, or null when every stage is recorded. */
export function currentStage(enrolment: Enrolment): StageKey | null {
  return STAGE_ORDER.find((key) => !enrolment.stages.some((s) => s.key === key)) ?? null
}

export function lastUpdated(enrolment: Enrolment, enquiry: Enquiry | undefined): string {
  return (
    enrolment.stages
      .map((s) => s.date)
      .sort()
      .at(-1) ??
    enquiry?.createdAt ??
    ''
  )
}

export function enrolmentFunnel(
  month: string,
  enrolments: Enrolment[],
  enquiries: Enquiry[],
): EnrolmentFunnelStep[] {
  const thisMonth = enrolments.filter((e) =>
    enquiries.find((q) => q.id === e.enquiryId)?.createdAt.startsWith(month),
  )
  const reached = (key: StageKey): number =>
    thisMonth.filter((e) => e.stages.some((s) => s.key === key)).length
  return [
    { step: 'enquiry', count: thisMonth.length },
    { step: 'levelTest', count: reached('levelTest') },
    { step: 'group', count: reached('group') },
    { step: 'teacherConversation', count: reached('teacherConversation') },
    { step: 'trialLesson', count: reached('trialLesson') },
    { step: 'contract', count: reached('contract') },
  ]
}
