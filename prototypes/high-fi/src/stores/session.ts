import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Language, Role, Student, User } from '@/types'
import { useClockStore } from './clock'
import { useDirectoryStore } from './directory'
import { persistedRef } from './persist'

export type SignInError =
  'phoneNotRegistered' | 'codeIncorrect' | 'staffNotRegistered' | 'passwordMissing'

const digits = (value: string): string => value.replace(/\D/g, '')

export const useSessionStore = defineStore('session', () => {
  const directory = useDirectoryStore()
  const clock = useClockStore()
  const userId = persistedRef<string | null>('session-user', () => null)
  const language = persistedRef<Language>('language', () => 'en')
  // Shows the site at phone width inside the browser window, so the phone layout is easy to try.
  const phoneView = persistedRef<boolean>('phone-view', () => false)

  const user = computed<User | null>(() => directory.userById(userId.value) ?? null)

  /** The students this account may see: a parent's children, or the student themselves. */
  const visibleStudents = computed<Student[]>(() => {
    if (!user.value) return []
    if (user.value.role === 'parent') return directory.childrenOf(user.value.id)
    if (user.value.role === 'student') {
      const own = directory.studentById(user.value.studentId)
      return own ? [own] : []
    }
    return []
  })

  function signIn(id: string): void {
    const found = directory.userById(id)
    if (!found) return
    userId.value = found.id
    clock.setForRole(found.role)
  }

  /** Staff sign-in is not specified in CW1, so the prototype offers one demo account per role. */
  function signInAsRole(role: Role): void {
    const found = directory.users.find((u) => u.role === role)
    if (found) signIn(found.id)
  }

  // SIMULATED: no SMS is sent; any 6-digit code is accepted (FR-05 main flow 1).
  function signInByPhone(phone: string, code: string): SignInError | null {
    const found = directory.users.find(
      (u) => (u.role === 'parent' || u.role === 'student') && digits(u.phone) === digits(phone),
    )
    if (!found) return 'phoneNotRegistered'
    if (digits(code).length !== 6) return 'codeIncorrect'
    signIn(found.id)
    return null
  }

  // SIMULATED: staff sign in with their work phone and a password; any password is accepted.
  // CW1 does not specify staff sign-in, only that every user type is authorised (NFR-01).
  function signInStaff(phone: string, password: string): SignInError | null {
    const found = directory.users.find(
      (u) =>
        (u.role === 'administrator' || u.role === 'teacher') && digits(u.phone) === digits(phone),
    )
    if (!found) return 'staffNotRegistered'
    if (password.length === 0) return 'passwordMissing'
    signIn(found.id)
    return null
  }

  function signOut(): void {
    userId.value = null
    phoneView.value = false
  }

  function setPhoneView(on: boolean): void {
    phoneView.value = on
  }

  function setLanguage(next: Language): void {
    language.value = next
  }

  return {
    userId,
    language,
    phoneView,
    setPhoneView,
    user,
    visibleStudents,
    signIn,
    signInAsRole,
    signInByPhone,
    signInStaff,
    signOut,
    setLanguage,
  }
})
