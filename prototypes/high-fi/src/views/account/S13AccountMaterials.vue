<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStudent } from '@/composables/useAccountStudent'
import { useFormat } from '@/composables/useFormat'
import { useStudentLessons } from '@/composables/useStudentLessons'
import AppLayout from '@/layouts/AppLayout.vue'
import { useLessonsStore } from '@/stores/lessons'

const { t } = useI18n()
const format = useFormat()
const lessonsStore = useLessonsStore()
const { student } = useAccountStudent()
const { all } = useStudentLessons(student)

/** How many recent lessons the page lists. */
const SHOWN = 8
const rows = computed(() =>
  all.value
    .flatMap((lesson) => {
      const record = lessonsStore.recordFor(lesson.id)
      return record ? [{ lesson, record }] : []
    })
    .reverse()
    .slice(0, SHOWN),
)
</script>

<template>
  <AppLayout :title="t('account.materials.title')" :caption="student?.fullName">
    <p class="text-sm text-ink-muted">{{ t('account.materials.intro') }}</p>
    <p v-if="rows.length === 0" class="rounded-md border border-line bg-paper p-4 text-ink-muted">
      {{ t('account.materials.empty') }}
    </p>
    <ul v-else class="divide-y divide-line rounded-md border border-line bg-paper">
      <li v-for="row in rows" :key="row.lesson.id" class="flex flex-col gap-1 p-4">
        <p class="text-sm text-ink-muted">
          {{ format.weekdayShort(row.lesson.date) }} {{ format.date(row.lesson.date) }}
        </p>
        <p class="font-semibold">{{ row.record.topic }}</p>
        <p class="text-sm">
          {{
            row.record.homework
              ? t('account.materials.homework', { text: row.record.homework })
              : t('account.materials.noHomework')
          }}
        </p>
        <p v-if="row.record.attachmentNames.length" class="text-sm text-ink-muted">
          {{ t('account.materials.files', { names: row.record.attachmentNames.join(', ') }) }}
        </p>
      </li>
    </ul>
  </AppLayout>
</template>
