import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { firstFeeMonth } from '@/domain/finance'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { useSessionStore } from '@/stores/session'

/** The student whose account is open (from the address), their group, and what the viewer may do. */
export function useAccountStudent() {
  const route = useRoute()
  const directory = useDirectoryStore()
  const session = useSessionStore()
  const clock = useClockStore()
  const enrolments = useEnrolmentsStore()
  const { user } = storeToRefs(session)

  const studentId = computed(() => String(route.params.studentId))
  const student = computed(() => directory.studentById(studentId.value))
  const group = computed(() => directory.groupById(student.value?.groupId ?? null))
  const courseName = computed(() => directory.courseById(group.value?.courseId ?? null)?.name ?? '')
  /** Only a parent reports an absence (FR-03 actors). */
  const isParent = computed(() => user.value?.role === 'parent')
  const canSwitchChild = computed(() => isParent.value && session.visibleStudents.length > 1)

  /** The month whose fee the account shows: this month, or the first fee month of a new student. */
  const feeMonth = computed(() => {
    const first = firstFeeMonth(studentId.value, enrolments.enrolments)
    return first && first > clock.month ? first : clock.month
  })

  return { studentId, student, group, courseName, isParent, canSwitchChild, user, feeMonth }
}
