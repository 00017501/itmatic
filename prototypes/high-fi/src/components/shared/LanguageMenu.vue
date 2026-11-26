<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useSessionStore } from '@/stores/session'
import type { Language } from '@/types'

/** `sidebar` looks like a navigation item; `compact` is a small outlined button. */
defineProps<{ appearance: 'sidebar' | 'compact' }>()

const { t } = useI18n()
const session = useSessionStore()
const { language } = storeToRefs(session)

// Language names are shown in their own language, so they are not translated.
const NAMES: Record<Language, string> = { en: 'English', ru: 'Русский', uz: 'Oʻzbekcha' }

const items = computed<DropdownMenuItem[]>(() =>
  (Object.keys(NAMES) as Language[]).map((code) => ({
    label: NAMES[code],
    type: 'checkbox',
    checked: language.value === code,
    onUpdateChecked: () => session.setLanguage(code),
  })),
)
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'start' }">
    <UButton
      color="neutral"
      :variant="appearance === 'sidebar' ? 'ghost' : 'outline'"
      icon="i-lucide-languages"
      trailing-icon="i-lucide-chevron-down"
      :label="NAMES[language]"
      :aria-label="`${t('app.language')}: ${NAMES[language]}`"
      :class="appearance === 'sidebar' ? 'w-full justify-start font-normal' : ''"
      :ui="{ trailingIcon: 'ms-auto' }"
    />
  </UDropdownMenu>
</template>
