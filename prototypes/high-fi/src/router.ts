import { createRouter, createWebHashHistory, type RouteLocationRaw } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import type { Role } from '@/types'
import { EMBEDDED, ROUTE_MESSAGE } from '@/composables/usePhoneView'

declare module 'vue-router' {
  interface RouteMeta {
    /** Roles that may open the route. An empty list means anyone, signed in or not. */
    roles: Role[]
    /** Screen ID from .agents/contracts/screens-and-flows.md. */
    screenId: string
  }
}

const ADMIN: Role[] = ['administrator']
const TEACHER: Role[] = ['teacher']
const ACCOUNT: Role[] = ['parent', 'student']

// Hash routing: GitHub Pages has no rewrites, so a refresh on a deep link must not reach the server.
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'login' } },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/shared/S01LoginScreen.vue'),
      meta: { roles: [], screenId: 'S01' },
    },
    {
      path: '/no-access',
      name: 'access-refused',
      component: () => import('@/views/shared/S05eAccessRefused.vue'),
      meta: { roles: [], screenId: 'S05e' },
    },
    {
      path: '/admin',
      name: 'admin-home',
      component: () => import('@/views/admin/S02AdminHome.vue'),
      meta: { roles: ADMIN, screenId: 'S02' },
    },
    {
      path: '/admin/enrolments',
      name: 'admin-enrolments',
      component: () => import('@/views/admin/S03EnrolmentsList.vue'),
      meta: { roles: ADMIN, screenId: 'S03' },
    },
    {
      path: '/admin/enrolments/:id',
      name: 'admin-enrolment',
      component: () => import('@/views/admin/S04EnrolmentStepper.vue'),
      meta: { roles: ADMIN, screenId: 'S04' },
    },
    {
      path: '/admin/debtors',
      name: 'admin-debtors',
      component: () => import('@/views/admin/S05DebtorsList.vue'),
      meta: { roles: ADMIN, screenId: 'S05' },
    },
    {
      path: '/teacher',
      name: 'teacher-today',
      component: () => import('@/views/teacher/S06TodaysLessons.vue'),
      meta: { roles: TEACHER, screenId: 'S06' },
    },
    {
      path: '/teacher/lessons/:id',
      name: 'teacher-lesson',
      component: () => import('@/views/teacher/S07LessonRecordForm.vue'),
      meta: { roles: TEACHER, screenId: 'S07' },
    },
    {
      path: '/account',
      name: 'account-children',
      component: () => import('@/views/account/S08ChildChooser.vue'),
      meta: { roles: ACCOUNT, screenId: 'S08' },
    },
    {
      path: '/account/:studentId',
      name: 'account-home',
      component: () => import('@/views/account/S09AccountHome.vue'),
      meta: { roles: ACCOUNT, screenId: 'S09' },
    },
    {
      path: '/account/:studentId/schedule',
      name: 'account-schedule',
      component: () => import('@/views/account/S10AccountSchedule.vue'),
      meta: { roles: ACCOUNT, screenId: 'S10' },
    },
    {
      path: '/account/:studentId/attendance',
      name: 'account-attendance',
      component: () => import('@/views/account/S11AccountAttendance.vue'),
      meta: { roles: ACCOUNT, screenId: 'S11' },
    },
    {
      path: '/account/:studentId/grades',
      name: 'account-grades',
      component: () => import('@/views/account/S12AccountGrades.vue'),
      meta: { roles: ACCOUNT, screenId: 'S12' },
    },
    {
      path: '/account/:studentId/materials',
      name: 'account-materials',
      component: () => import('@/views/account/S13AccountMaterials.vue'),
      meta: { roles: ACCOUNT, screenId: 'S13' },
    },
    {
      path: '/account/:studentId/payments',
      name: 'account-payments',
      component: () => import('@/views/account/S14AccountPayments.vue'),
      meta: { roles: ACCOUNT, screenId: 'S14' },
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'login' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

/** Where each role lands after signing in. */
export function homeRoute(): RouteLocationRaw {
  const session = useSessionStore()
  const user = session.user
  if (!user) return { name: 'login' }
  if (user.role === 'administrator') return { name: 'admin-home' }
  if (user.role === 'teacher') return { name: 'teacher-today' }
  const students = session.visibleStudents
  const only = students[0]
  if (students.length === 1 && only) return { name: 'account-home', params: { studentId: only.id } }
  return { name: 'account-children' }
}

// One guard for every route (NFR-01): no session goes to login, the wrong role is refused.
// Inside the phone frame, tell the page around it which screen is open.
router.afterEach((to) => {
  if (EMBEDDED)
    window.parent.postMessage(
      { type: ROUTE_MESSAGE, hash: `#${to.fullPath}` },
      window.location.origin,
    )
})

router.beforeEach((to) => {
  if (to.meta.roles.length === 0) return true
  const session = useSessionStore()
  const user = session.user
  if (!user) return { name: 'login' }
  const refused = { name: 'access-refused', query: { from: to.meta.screenId } }
  if (!to.meta.roles.includes(user.role)) return refused
  const studentId = to.params.studentId
  if (typeof studentId === 'string' && !session.visibleStudents.some((s) => s.id === studentId))
    return refused
  return true
})
