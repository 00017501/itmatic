import { useI18n } from 'vue-i18n'
import type { AbsenceStatus } from '@/types'

/** "Absent: illness" or "Late ~15 min", in the current language. */
export function useAbsenceLabel(): (status: AbsenceStatus) => string {
  const { t } = useI18n()
  return (status) => {
    if (status.kind === 'late')
      return t('account.absence.statusLate', { minutes: status.delayMinutes ?? 0 })
    const reason =
      status.reason === 'other' && status.otherText
        ? status.otherText
        : t(`absenceReasons.${status.reason ?? 'other'}`)
    return t('account.absence.statusAbsent', { reason: reason.toLowerCase() })
  }
}
