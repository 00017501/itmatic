<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resetDemoData } from '@/stores/persist'

// Resetting wipes everything recorded in the demo, so it asks first (ui-design.md, States).
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()
</script>

<template>
  <UModal v-model:open="open" :title="t('app.resetTitle')" :description="t('app.resetText')">
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" :label="t('app.cancel')" @click="open = false" />
        <UButton
          color="error"
          variant="outline"
          :label="t('app.resetConfirm')"
          @click="resetDemoData"
        />
      </div>
    </template>
  </UModal>
</template>
