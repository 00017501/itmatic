<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'
import UserMenu from '@/components/shared/UserMenu.vue'
import { useDirectoryStore } from '@/stores/directory'
import { useSessionStore } from '@/stores/session'

// One responsive layout for every role (CW1 NFR-04: a single website that adapts to the screen).
// Computer: sidebar and content. Phone: a menu button, and bottom tabs for the account screens.
const props = defineProps<{
  title: string
  caption?: string
  /** Shows a back arrow to this route in place of the menu button. */
  backTo?: RouteLocationRaw
  /** `wide` for tables, `narrow` (default) for forms and lists. */
  width?: 'wide' | 'narrow'
}>()

const { t } = useI18n()
const route = useRoute()
const directory = useDirectoryStore()
const session = useSessionStore()
const { user } = storeToRefs(session)

const branchName = computed(() => directory.branchById(user.value?.branchId ?? null)?.name ?? '')
const studentId = computed(() =>
  typeof route.params.studentId === 'string' ? route.params.studentId : null,
)
/** The account sections for the student in the address; also the phone's bottom tabs. */
const accountTabs = computed(() => {
  if (!studentId.value) return []
  const params = { studentId: studentId.value }
  return [
    {
      label: t('nav.home'),
      icon: 'i-lucide-house',
      to: { name: 'account-home', params },
      tab: true,
    },
    {
      label: t('nav.schedule'),
      icon: 'i-lucide-calendar',
      to: { name: 'account-schedule', params },
      tab: true,
    },
    {
      label: t('nav.attendance'),
      icon: 'i-lucide-square-check-big',
      to: { name: 'account-attendance', params },
      tab: true,
    },
    {
      label: t('nav.grades'),
      icon: 'i-lucide-award',
      to: { name: 'account-grades', params },
      tab: true,
    },
    {
      label: t('nav.materials'),
      icon: 'i-lucide-book-open',
      to: { name: 'account-materials', params },
      tab: false,
    },
    {
      label: t('nav.payments'),
      icon: 'i-lucide-wallet',
      to: { name: 'account-payments', params },
      tab: true,
    },
  ]
})
const bottomTabs = computed(() => accountTabs.value.filter((item) => item.tab))

const items = computed<NavigationMenuItem[]>(() => {
  const role = user.value?.role
  if (role === 'administrator') {
    return [
      { label: t('nav.home'), icon: 'i-lucide-house', to: { name: 'admin-home' }, exact: true },
      { label: t('nav.enrolments'), icon: 'i-lucide-users', to: { name: 'admin-enrolments' } },
      { label: t('nav.debtors'), icon: 'i-lucide-receipt-text', to: { name: 'admin-debtors' } },
    ]
  }
  if (role === 'teacher') {
    return [
      { label: t('nav.lessons'), icon: 'i-lucide-calendar-check', to: { name: 'teacher-today' } },
    ]
  }
  const sections: NavigationMenuItem[] = accountTabs.value.map(({ label, icon, to }) => ({
    label,
    icon,
    to,
    exact: true,
  }))
  if (role === 'parent' && session.visibleStudents.length > 1) {
    sections.push({
      label: t('nav.children'),
      icon: 'i-lucide-users',
      to: { name: 'account-children' },
      exact: true,
    })
  }
  return sections
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :ui="{ root: 'bg-paper', header: 'h-auto py-4', footer: 'block' }">
      <template #header>
        <div>
          <p class="text-xl font-semibold leading-tight">ITmatic</p>
          <p class="text-xs text-ink-muted">{{ t('app.branch', { branch: branchName }) }}</p>
        </div>
      </template>

      <UNavigationMenu orientation="vertical" :items="items" :aria-label="t('nav.main')" />

      <template #footer>
        <UserMenu />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel :ui="{ body: 'bg-mist p-4 sm:p-4 lg:p-8 gap-0 sm:gap-0' }">
      <template #body>
        <div
          class="flex w-full flex-col gap-4 lg:gap-6"
          :class="props.width === 'wide' ? '' : 'mx-auto max-w-2xl'"
        >
          <header class="flex flex-wrap items-start gap-x-2 gap-y-2">
            <UButton
              v-if="backTo"
              :to="backTo"
              color="neutral"
              variant="ghost"
              icon="i-lucide-chevron-left"
              size="lg"
              class="-ml-2 mt-1"
              :aria-label="t('app.back')"
            />
            <UDashboardSidebarToggle
              v-else
              class="-ml-2 mt-1 lg:hidden"
              :aria-label="t('nav.menu')"
            />
            <!-- min-w-[60%]: the title keeps most of the row, so actions wrap below it on a phone. -->
            <div class="min-w-[60%] flex-1">
              <h1 class="text-title font-semibold leading-tight tracking-tight">{{ title }}</h1>
              <p v-if="caption" class="mt-1 text-sm text-ink-muted">{{ caption }}</p>
            </div>
            <slot name="actions" />
          </header>
          <slot />
        </div>
      </template>

      <template v-if="$slots.footer || bottomTabs.length" #footer>
        <div v-if="$slots.footer" class="border-t border-line bg-paper p-4 lg:px-8">
          <div class="w-full" :class="props.width === 'wide' ? '' : 'mx-auto max-w-2xl'">
            <slot name="footer" />
          </div>
        </div>
        <nav
          v-if="bottomTabs.length"
          :aria-label="t('nav.account')"
          class="grid grid-cols-5 border-t border-line bg-paper lg:hidden"
        >
          <RouterLink
            v-for="tab in bottomTabs"
            :key="tab.to.name"
            :to="tab.to"
            class="flex h-16 flex-col items-center justify-center gap-1 text-xs text-ink-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
            exact-active-class="bg-inkteal-100 font-semibold text-ink"
          >
            <UIcon :name="tab.icon" class="size-5" />
            <span class="max-w-full truncate tracking-tight">{{ tab.label }}</span>
          </RouterLink>
        </nav>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
