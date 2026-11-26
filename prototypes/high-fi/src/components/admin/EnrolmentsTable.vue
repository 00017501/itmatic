<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableColumn } from '@nuxt/ui'
import type { EnrolmentRow } from '@/composables/useEnrolmentRows'
import { useFormat } from '@/composables/useFormat'
import { ENROLMENT_STATUS_COLOUR } from '@/utils/statusColour'

defineProps<{ rows: EnrolmentRow[]; empty: string }>()

const { t } = useI18n()
const format = useFormat()

const columns = computed<TableColumn<EnrolmentRow>[]>(() => [
  { accessorKey: 'applicant', header: t('enrolments.applicant') },
  { accessorKey: 'course', header: t('enrolments.course') },
  { accessorKey: 'stage', header: t('enrolments.stage') },
  { accessorKey: 'status', header: t('enrolments.status') },
  {
    accessorKey: 'updated',
    header: t('enrolments.updated'),
    meta: { class: { th: 'text-right', td: 'tabular text-right' } },
  },
  { id: 'open', header: '' },
])
</script>

<template>
  <UTable
    :data="rows"
    :columns="columns"
    :empty="empty"
    class="rounded-md border border-line bg-paper"
  >
    <template #applicant-cell="{ row }">
      <RouterLink
        :to="{ name: 'admin-enrolment', params: { id: row.original.id } }"
        class="font-semibold text-ink underline-offset-4 hover:underline"
      >
        {{ row.original.applicant }}
      </RouterLink>
    </template>
    <template #status-cell="{ row }">
      <UBadge
        :color="ENROLMENT_STATUS_COLOUR[row.original.status]"
        variant="subtle"
        :label="t(`enrolmentStatus.${row.original.status}`)"
      />
    </template>
    <template #updated-cell="{ row }">
      {{ format.date(row.original.updated) }}
    </template>
    <template #open-cell="{ row }">
      <div class="text-right">
        <UButton
          :to="{ name: 'admin-enrolment', params: { id: row.original.id } }"
          color="neutral"
          variant="outline"
          size="sm"
          :label="t('app.open')"
          :aria-label="`${t('app.open')}: ${row.original.applicant}`"
        />
      </div>
    </template>
  </UTable>
</template>
