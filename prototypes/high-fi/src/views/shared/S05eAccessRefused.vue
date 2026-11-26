<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { homeRoute } from '@/router'

const { t } = useI18n()
const route = useRoute()

// E-FR04-03: payment information is for administrators only.
const message = computed(() =>
  route.query.from === 'S05' ? t('access.payment') : t('access.generic'),
)
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-mist p-4">
    <main class="flex w-full max-w-md flex-col gap-4 rounded-md border border-line bg-paper p-6">
      <h1 class="text-xl font-semibold">{{ t('access.title') }}</h1>
      <UAlert color="error" variant="subtle" icon="i-lucide-circle-alert" :title="message" />
      <UButton :to="homeRoute()" :label="t('access.home')" class="self-end" />
    </main>
  </div>
</template>
