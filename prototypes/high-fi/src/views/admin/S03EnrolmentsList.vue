<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import EnrolmentsTable from '@/components/admin/EnrolmentsTable.vue'
import { useEnrolmentRows } from '@/composables/useEnrolmentRows'
import AppLayout from '@/layouts/AppLayout.vue'
import { useEnrolmentsStore } from '@/stores/enrolments'
import type { EnrolmentStatus } from '@/types'

const { t } = useI18n()
const { enrolments } = storeToRefs(useEnrolmentsStore())
const toRows = useEnrolmentRows()

const STATUSES: EnrolmentStatus[] = ['inProgress', 'waitingList', 'completed', 'lost']
const status = ref<EnrolmentStatus>('inProgress')

const tabs = computed(() =>
  STATUSES.map((value) => ({
    value,
    label: t(`enrolmentStatus.${value}`),
    badge: enrolments.value.filter((e) => e.status === value).length,
  })),
)
const rows = computed(() =>
  toRows(enrolments.value.filter((e) => e.status === status.value)).sort((a, b) =>
    b.updated.localeCompare(a.updated),
  ),
)
</script>

<template>
  <AppLayout :title="t('enrolments.title')" :caption="t('enrolments.caption')" width="wide">
    <UTabs
      v-model="status"
      :items="tabs"
      :content="false"
      variant="link"
      :aria-label="t('enrolments.filter')"
      :ui="{ list: 'overflow-x-auto', trigger: 'shrink-0 sm:shrink', label: 'overflow-visible' }"
      class="w-full max-w-2xl"
    />
    <EnrolmentsTable :rows="rows" :empty="t('enrolments.empty')" />
  </AppLayout>
</template>
