import { computed, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/session'
import type { Role } from '@/types'

/** True when this page is the one shown inside the phone frame. */
export const EMBEDDED = window.self !== window.top
/** Sent from the framed page to the page around it, so a refresh returns to the same screen. */
export const ROUTE_MESSAGE = 'itmatic:route'
/** The roles that use the system on a phone (CW1 NFR-04, FR-02 acceptance criterion 1). */
const PHONE_ROLES: Role[] = ['parent', 'student', 'teacher']
/** The frame is only worth showing where the sidebar layout is in use. */
const WIDE_SCREEN = '(min-width: 1024px)'

export function usePhoneView() {
  const session = useSessionStore()
  const { user, phoneView } = storeToRefs(session)

  const query = window.matchMedia(WIDE_SCREEN)
  const wide = ref(query.matches)
  const onChange = (event: MediaQueryListEvent): void => {
    wide.value = event.matches
  }
  query.addEventListener('change', onChange)
  onBeforeUnmount(() => query.removeEventListener('change', onChange))

  const available = computed(() => !!user.value && PHONE_ROLES.includes(user.value.role))
  /** The menu offers the phone view on a wide screen, and the way back inside the frame. */
  const canEnter = computed(() => available.value && wide.value && !EMBEDDED)
  const canLeave = computed(() => EMBEDDED && phoneView.value)
  /** The page around the frame shows the frame and nothing else. */
  const showFrame = computed(() => available.value && wide.value && !EMBEDDED && phoneView.value)

  return { canEnter, canLeave, showFrame, setPhoneView: session.setPhoneView }
}
