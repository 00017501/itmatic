import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'

export function useSignOut(): () => Promise<void> {
  const router = useRouter()
  const session = useSessionStore()
  return async () => {
    session.signOut()
    await router.push({ name: 'login' })
  }
}
