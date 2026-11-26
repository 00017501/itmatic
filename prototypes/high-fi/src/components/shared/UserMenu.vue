<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { DropdownMenuItem } from '@nuxt/ui'
import { usePhoneView } from '@/composables/usePhoneView'
import { useSignOut } from '@/composables/useSignOut'
import ResetDemoModal from '@/components/shared/ResetDemoModal.vue'
import { useSessionStore } from '@/stores/session'
import type { Language } from '@/types'

// The signed-in person at the bottom of the sidebar; the button opens language, reset and sign out.
const { t } = useI18n()
const session = useSessionStore()
const { user, language } = storeToRefs(session)
const signOut = useSignOut()
const resetOpen = ref(false)
const { canEnter, canLeave, setPhoneView } = usePhoneView()

// Language names are shown in their own language, so they are not translated.
const NAMES: Record<Language, string> = { en: 'English', ru: 'Русский', uz: 'Oʻzbekcha' }

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: t('app.language'), type: 'label' },
    ...(Object.keys(NAMES) as Language[]).map<DropdownMenuItem>((code) => ({
      label: NAMES[code],
      type: 'checkbox',
      checked: language.value === code,
      onUpdateChecked: () => session.setLanguage(code),
    })),
  ],
  ...(canEnter.value
    ? [
        [
          {
            label: t('app.phoneView'),
            icon: 'i-lucide-smartphone',
            onSelect: () => setPhoneView(true),
          },
        ],
      ]
    : []),
  ...(canLeave.value
    ? [
        [
          {
            label: t('app.fullView'),
            icon: 'i-lucide-monitor',
            onSelect: () => setPhoneView(false),
          },
        ],
      ]
    : []),
  [
    {
      label: t('app.resetDemo'),
      icon: 'i-lucide-rotate-ccw',
      onSelect: () => (resetOpen.value = true),
    },
  ],
  [{ label: t('app.signOut'), icon: 'i-lucide-log-out', onSelect: () => void signOut() }],
])
</script>

<template>
  <div class="flex items-center gap-2 py-2">
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-semibold">{{ user?.fullName }}</span>
      <span class="block truncate text-xs text-ink-muted">{{
        user ? t(`roleNames.${user.role}`) : ''
      }}</span>
    </span>
    <UDropdownMenu
      :items="items"
      :content="{ align: 'end', side: 'top' }"
      :ui="{ content: 'w-52' }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-ellipsis-vertical"
        size="lg"
        :aria-label="t('app.accountMenu')"
      />
    </UDropdownMenu>
    <ResetDemoModal v-model:open="resetOpen" />
  </div>
</template>
