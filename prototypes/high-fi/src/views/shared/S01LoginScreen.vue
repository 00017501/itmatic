<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageMenu from '@/components/shared/LanguageMenu.vue'
import { homeRoute } from '@/router'
import { useDirectoryStore } from '@/stores/directory'
import ResetDemoModal from '@/components/shared/ResetDemoModal.vue'
import { useSessionStore } from '@/stores/session'
import type { Role } from '@/types'

const { t } = useI18n()
const resetOpen = ref(false)
const router = useRouter()
const session = useSessionStore()
const directory = useDirectoryStore()

type Tab = 'family' | 'staff'
const tab = ref<Tab>('family')
const tabs = computed(() => [
  { label: t('login.familyTab'), value: 'family' as const },
  { label: t('login.staffTab'), value: 'staff' as const },
])

const family = reactive({ phone: '', code: '' })
const staff = reactive({ phone: '', password: '' })
const errors = reactive({ phone: '', code: '', staffPhone: '', password: '' })

const DEMO_ROLES: { role: Role; does: string }[] = [
  { role: 'administrator', does: 'login.demoAdministrator' },
  { role: 'teacher', does: 'login.demoTeacher' },
  { role: 'parent', does: 'login.demoParent' },
  { role: 'student', does: 'login.demoStudent' },
]
const demoAccounts = computed(() =>
  DEMO_ROLES.map((item) => {
    const user = directory.users.find((u) => u.role === item.role)
    const name = user?.fullName ?? ''
    return {
      ...item,
      id: user?.id ?? '',
      name,
      initials: name
        .split(' ')
        .map((part) => part[0] ?? '')
        .join(''),
    }
  }),
)

async function submitFamily(): Promise<void> {
  errors.phone = ''
  errors.code = ''
  const error = session.signInByPhone(family.phone, family.code)
  if (error === 'phoneNotRegistered') errors.phone = t('login.phoneNotRegistered')
  else if (error === 'codeIncorrect') errors.code = t('login.codeIncorrect')
  else await router.push(homeRoute())
}

async function submitStaff(): Promise<void> {
  errors.staffPhone = ''
  errors.password = ''
  const error = session.signInStaff(staff.phone, staff.password)
  if (error === 'staffNotRegistered') errors.staffPhone = t('login.staffNotRegistered')
  else if (error === 'passwordMissing') errors.password = t('login.passwordMissing')
  else await router.push(homeRoute())
}

async function demoSignIn(userId: string): Promise<void> {
  session.signIn(userId)
  await router.push(homeRoute())
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-mist">
    <header class="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
      <p class="text-xl font-semibold">ITmatic</p>
      <LanguageMenu appearance="compact" />
    </header>

    <main class="flex flex-1 items-start justify-center px-4 pb-8 lg:items-center">
      <div class="grid w-full max-w-4xl gap-4 lg:grid-cols-2 lg:gap-6">
        <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4 lg:p-8">
          <div>
            <h1 class="text-title font-semibold leading-tight tracking-tight">
              {{ t('login.title') }}
            </h1>
            <p class="mt-1 text-sm text-ink-muted">{{ t('login.tagline') }}</p>
          </div>

          <UTabs v-model="tab" :items="tabs" :content="false" variant="link" class="w-full" />

          <form
            v-if="tab === 'family'"
            class="flex flex-col gap-4"
            novalidate
            @submit.prevent="submitFamily"
          >
            <p class="text-sm text-ink-muted">{{ t('login.intro') }}</p>
            <UFormField
              :label="t('login.phone')"
              :help="t('login.phoneHint')"
              :error="errors.phone || false"
              size="lg"
            >
              <UInput
                v-model="family.phone"
                type="tel"
                autocomplete="tel"
                placeholder="+998 90 123 45 67"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UFormField
              :label="t('login.code')"
              :help="t('login.codeHint')"
              :error="errors.code || false"
              size="lg"
            >
              <UInput
                v-model="family.code"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="7"
                placeholder="481 206"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" size="xl" block :label="t('login.signIn')" />
          </form>

          <form v-else class="flex flex-col gap-4" novalidate @submit.prevent="submitStaff">
            <UFormField
              :label="t('login.staffPhone')"
              :help="t('login.phoneHint')"
              :error="errors.staffPhone || false"
              size="lg"
            >
              <UInput
                v-model="staff.phone"
                type="tel"
                autocomplete="tel"
                placeholder="+998 90 700 10 10"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UFormField
              :label="t('login.password')"
              :help="t('login.passwordHint')"
              :error="errors.password || false"
              size="lg"
            >
              <UInput
                v-model="staff.password"
                type="password"
                autocomplete="current-password"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" size="xl" block :label="t('login.signIn')" />
          </form>
        </section>

        <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4 lg:p-8">
          <div>
            <h2 class="text-xl font-semibold">{{ t('login.demoTitle') }}</h2>
            <p class="mt-1 text-sm text-ink-muted">{{ t('login.demoIntro') }}</p>
          </div>
          <ul class="flex flex-col divide-y divide-line border-y border-line">
            <li v-for="account in demoAccounts" :key="account.role">
              <button
                type="button"
                class="flex min-h-16 w-full items-center gap-4 px-4 py-2 text-left hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
                :aria-label="
                  t('login.signInAs', { name: `${account.name}, ${t(`roles.${account.role}`)}` })
                "
                @click="demoSignIn(account.id)"
              >
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-inkteal-100 text-xs font-semibold text-inkteal-600"
                  aria-hidden="true"
                >
                  {{ account.initials }}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-semibold"
                    >{{ t(`roleNames.${account.role}`) }}: {{ account.name }}</span
                  >
                  <span class="block text-sm text-ink-muted">{{ t(account.does) }}</span>
                </span>
                <UIcon name="i-lucide-chevron-right" class="size-5 shrink-0 text-ink-muted" />
              </button>
            </li>
          </ul>
          <UButton
            color="neutral"
            variant="link"
            icon="i-lucide-rotate-ccw"
            :label="t('app.resetDemo')"
            class="self-start px-0"
            @click="resetOpen = true"
          />
          <ResetDemoModal v-model:open="resetOpen" />
        </section>
      </div>
    </main>
  </div>
</template>
