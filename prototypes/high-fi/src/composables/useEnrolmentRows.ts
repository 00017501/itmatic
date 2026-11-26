import { useI18n } from 'vue-i18n'
import { currentStage, lastUpdated, STAGE_ORDER } from '@/domain/enrolment'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import type { Enrolment, EnrolmentStatus } from '@/types'

export interface EnrolmentRow {
  id: string
  applicant: string
  course: string
  stage: string
  status: EnrolmentStatus
  updated: string
}

/** Turns enrolments into table rows with translated stage labels. */
export function useEnrolmentRows(): (enrolments: Enrolment[]) => EnrolmentRow[] {
  const { t } = useI18n()
  const directory = useDirectoryStore()
  const store = useEnrolmentsStore()

  return (enrolments) =>
    enrolments.map((enrolment) => {
      const enquiry = store.enquiryById(enrolment.enquiryId)
      const stage = currentStage(enrolment)
      return {
        id: enrolment.id,
        applicant: enquiry?.studentName ?? '',
        course: directory.courseById(enquiry?.courseId ?? null)?.name ?? '',
        stage: stage
          ? t('enrolments.stageOf', {
              stage: t(`stages.${stage}`),
              n: STAGE_ORDER.indexOf(stage) + 1,
            })
          : t('enrolments.allStages'),
        status: enrolment.status,
        updated: lastUpdated(enrolment, enquiry),
      }
    })
}
