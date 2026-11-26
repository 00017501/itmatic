<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTE_MESSAGE } from '@/composables/usePhoneView'
import { useSessionStore } from '@/stores/session'

// The same website in a phone-sized frame in the middle of the window. The frame is a second
// copy of the page, so it gets the real phone layout; both copies share the saved data.
const { t } = useI18n()
const session = useSessionStore()
const src = window.location.href

/** The framed page reports where it is, so a refresh or the way back opens the same screen. */
function onMessage(event: MessageEvent): void {
  if (event.origin !== window.location.origin) return
  const data: unknown = event.data
  if (typeof data !== 'object' || data === null || !('type' in data) || data.type !== ROUTE_MESSAGE)
    return
  if ('hash' in data && typeof data.hash === 'string')
    window.history.replaceState(window.history.state, '', data.hash)
}

/** The framed page changed the sign-in or left the phone view: start again from the saved data. */
function onStorage(event: StorageEvent): void {
  if (
    event.key === null ||
    event.key === 'itmatic:session-user' ||
    event.key === 'itmatic:phone-view'
  ) {
    window.location.reload()
  }
}

function leave(): void {
  session.setPhoneView(false)
  // Wait for the flag to be saved, then reload so this page shows what was done in the frame.
  window.setTimeout(() => window.location.reload(), 0)
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  window.addEventListener('storage', onStorage)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  window.removeEventListener('storage', onStorage)
})
</script>

<template>
  <div class="flex h-dvh flex-col bg-mist">
    <header class="flex items-center justify-between gap-4 border-b border-line bg-paper px-8 py-2">
      <div>
        <h1 class="font-semibold">{{ t('app.phoneViewTitle') }}</h1>
        <p class="text-sm text-ink-muted">{{ t('app.phoneViewNote') }}</p>
      </div>
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        icon="i-lucide-monitor"
        :label="t('app.fullView')"
        @click="leave"
      />
    </header>
    <main class="flex min-h-0 flex-1 items-center justify-center p-6">
      <!-- 390 by 800 px: a common phone screen, kept whole on a laptop display. -->
      <iframe
        :src="src"
        :title="t('app.phoneViewTitle')"
        class="h-full max-h-[800px] w-[390px] rounded-md border border-line-strong bg-paper shadow-lg"
      />
    </main>
  </div>
</template>
