<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ChartCard from '@/components/charts/ChartCard.vue'
import GradeProgressChart from '@/components/charts/GradeProgressChart.vue'
import { useAccountStudent } from '@/composables/useAccountStudent'
import AppLayout from '@/layouts/AppLayout.vue'
import { useGradesStore } from '@/stores/grades'
import type { GradeProgress } from '@/types'

const { t } = useI18n()
const gradesStore = useGradesStore()
const { studentId, student } = useAccountStudent()

const grades = computed(() => gradesStore.gradesFor(studentId.value))
const published = computed(() => gradesStore.visibleGrades(studentId.value))
const latest = computed(() => published.value.at(-1))
const progress = computed<GradeProgress[]>(() =>
  published.value.flatMap((g) =>
    g.score === null ? [] : [{ level: g.level, kind: g.kind, score: g.score }],
  ),
)
const trendLine = computed(() =>
  latest.value
    ? t('account.grades.takeaway', {
        level: latest.value.level,
        kind: t(`gradeKinds.${latest.value.kind}`).toLowerCase(),
        score: latest.value.score,
      })
    : '',
)
</script>

<template>
  <AppLayout :title="t('account.grades.title')" :caption="student?.fullName">
    <section class="flex flex-col gap-1 rounded-md border border-line bg-paper p-4">
      <template v-if="latest">
        <p class="text-title font-semibold">
          {{ t('account.grades.outOf', { score: latest.score }) }}
        </p>
        <p class="text-sm text-ink-muted">
          {{ latest.level }}, {{ t(`gradeKinds.${latest.kind}`).toLowerCase() }}
        </p>
      </template>
      <p v-else class="text-ink-muted">{{ t('account.grades.empty') }}</p>
    </section>

    <ChartCard
      v-if="progress.length > 1"
      :title="t('account.grades.chartTitle')"
      :takeaway="trendLine"
      :label-header="t('charts.assessment')"
      :value-header="t('charts.score')"
      :rows="
        progress.map((row) => ({
          label: `${row.level} ${t(`gradeKinds.${row.kind}`).toLowerCase()}`,
          value: String(row.score),
        }))
      "
    >
      <GradeProgressChart :data="progress" />
    </ChartCard>

    <ul v-if="grades.length" class="divide-y divide-line rounded-md border border-line bg-paper">
      <li
        v-for="grade in grades"
        :key="grade.id"
        class="flex min-h-12 items-center justify-between gap-4 px-4 py-2"
      >
        <span class="font-semibold"
          >{{ grade.level }}, {{ t(`gradeKinds.${grade.kind}`).toLowerCase() }}</span
        >
        <span v-if="grade.published && grade.score !== null" class="tabular">{{
          t('account.grades.outOf', { score: grade.score })
        }}</span>
        <UBadge
          v-else
          color="neutral"
          variant="subtle"
          size="lg"
          :label="t('account.grades.notPublished')"
        />
      </li>
    </ul>
    <p class="text-sm text-ink-muted">{{ t('account.grades.note') }}</p>
  </AppLayout>
</template>
