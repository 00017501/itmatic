<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { en, ru, uz } from '@nuxt/ui/locale'
import PhoneViewFrame from '@/components/shared/PhoneViewFrame.vue'
import { usePhoneView } from '@/composables/usePhoneView'
import { useSessionStore } from '@/stores/session'

const uiLocales = { en, ru, uz }
const { locale } = useI18n()
const { language } = storeToRefs(useSessionStore())
const { showFrame } = usePhoneView()

// The language is chosen by the user only, and remembered (NFR-02).
watch(
  language,
  (next) => {
    locale.value = next
    document.documentElement.lang = next
  },
  { immediate: true },
)

const uiLocale = computed(() => uiLocales[language.value])
// Messages appear at the bottom on a phone and at the top on a computer (DESIGN.md, Feedback).
const toaster = {
  position: window.matchMedia('(max-width: 1023px)').matches ? 'bottom-center' : 'top-center',
} as const
</script>

<template>
  <UApp :locale="uiLocale" :toaster="toaster">
    <PhoneViewFrame v-if="showFrame" />
    <RouterView v-else />
  </UApp>
</template>
