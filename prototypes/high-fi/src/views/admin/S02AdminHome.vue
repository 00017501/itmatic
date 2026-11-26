<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import EnrolmentsTable from '@/components/admin/EnrolmentsTable.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import EnrolmentFunnelChart from '@/components/charts/EnrolmentFunnelChart.vue'
import ProgressMeter from '@/components/charts/ProgressMeter.vue'
import { useEnrolmentRows } from '@/composables/useEnrolmentRows'
import { useFormat } from '@/composables/useFormat'
import { missingAttendance } from '@/domain/attendance'
import { enrolmentFunnel } from '@/domain/enrolment'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { useLessonsStore } from '@/stores/lessons'
import { usePaymentsStore } from '@/stores/payments'
import { useSessionStore } from '@/stores/session'

const { t } = useI18n()
const format = useFormat()
const clock = useClockStore()
const directory = useDirectoryStore()
const lessonsStore = useLessonsStore()
const { enrolments } = storeToRefs(useEnrolmentsStore())
const { user } = storeToRefs(useSessionStore())
const paymentsStore = usePaymentsStore()
const toRows = useEnrolmentRows()

const branchId = computed(() => user.value?.branchId ?? '')
const branchName = computed(() => directory.branchById(branchId.value)?.name ?? '')
const inProgress = computed(() => toRows(enrolments.value.filter((e) => e.status === 'inProgress')))
const lines = computed(() => paymentsStore.debtorLines(branchId.value, clock.month))
const totalDue = computed(() => lines.value.reduce((sum, line) => sum + line.amountDue, 0))
const collection = computed(() => paymentsStore.collectionProgress(branchId.value, clock.month))
const enrolmentsStore = useEnrolmentsStore()
const funnel = computed(() =>
  enrolmentFunnel(clock.month, enrolmentsStore.enrolments, enrolmentsStore.enquiries),
)
const missing = computed(() =>
  missingAttendance(lessonsStore.lessons, lessonsStore.records, clock.now).filter(
    (lesson) => directory.groupById(lesson.groupId)?.branchId === branchId.value,
  ),
)
const missingNotes = computed(() =>
  missing.value.map((lesson) => ({
    id: lesson.id,
    group: directory.groupById(lesson.groupId)?.code ?? '',
    time: lesson.startTime,
    date: format.date(lesson.date),
    teacher: directory.userById(lesson.teacherId)?.fullName ?? '',
  })),
)
</script>

<template>
  <AppLayout
    width="wide"
    :title="t('adminHome.title', { branch: branchName })"
    :caption="`${format.weekdayLong(clock.today)}, ${format.date(clock.today)}`"
  >
    <template #actions>
      <UButton :to="{ name: 'admin-debtors' }" size="lg" :label="t('adminHome.openDebtors')" />
    </template>

    <section
      class="grid divide-y divide-line rounded-md border border-line bg-paper lg:grid-cols-3 lg:divide-x lg:divide-y-0"
    >
      <div class="flex flex-col gap-1 p-6">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('adminHome.inProgress') }}</h2>
        <p class="text-title font-semibold">{{ inProgress.length }}</p>
        <p class="text-sm text-ink-muted">
          {{
            inProgress[0]
              ? t('adminHome.inProgressNote', {
                  name: inProgress[0].applicant,
                  stage: inProgress[0].stage,
                })
              : t('adminHome.inProgressNone')
          }}
        </p>
        <UButton
          :to="{ name: 'admin-enrolments' }"
          variant="link"
          :label="t('adminHome.viewEnrolments')"
          class="mt-1 self-start px-0"
        />
      </div>
      <div class="flex flex-col gap-1 p-6">
        <h2 class="text-sm font-semibold text-ink-muted">
          {{ t('adminHome.debtors', { month: format.monthAndYear(clock.month) }) }}
        </h2>
        <p class="text-title font-semibold">{{ format.money(totalDue) }}</p>
        <p class="text-sm text-ink-muted">
          {{
            t('adminHome.debtorsNote', {
              count: lines.length,
              date: format.date(`${clock.month}-01`),
            })
          }}
        </p>
        <UButton
          :to="{ name: 'admin-debtors' }"
          variant="link"
          :label="t('adminHome.viewDebtors')"
          class="mt-1 self-start px-0"
        />
      </div>
      <div class="flex flex-col gap-1 p-6">
        <h2 class="text-sm font-semibold text-ink-muted">{{ t('adminHome.missing') }}</h2>
        <p class="text-title font-semibold">{{ missing.length }}</p>
        <p v-if="missingNotes.length === 0" class="text-sm text-ink-muted">
          {{ t('adminHome.missingNone') }}
        </p>
        <ul v-else class="flex flex-col gap-1 text-sm text-ink-muted">
          <li v-for="note in missingNotes" :key="note.id">
            {{ t('adminHome.missingNote', note) }}
          </li>
        </ul>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4">
        <div>
          <h2 class="font-semibold">
            {{ t('adminHome.collectionTitle', { month: format.monthAndYear(clock.month) }) }}
          </h2>
          <p class="text-sm text-ink-muted">
            {{ t('adminHome.collectionTakeaway', { percent: collection.percentage }) }}
          </p>
        </div>
        <ProgressMeter
          :label="t('adminHome.collected')"
          :value="collection.collected"
          :total="collection.due"
          :caption="
            t('adminHome.collectionCaption', {
              collected: format.money(collection.collected),
              due: format.money(collection.due),
              rest: format.money(collection.due - collection.collected),
            })
          "
        />
      </section>
      <ChartCard
        :title="t('adminHome.funnelTitle')"
        :takeaway="
          t('adminHome.funnelTakeaway', {
            contracts: funnel.at(-1)?.count ?? 0,
            enquiries: funnel[0]?.count ?? 0,
          })
        "
        :label-header="t('charts.stage')"
        :value-header="t('charts.applicants')"
        :rows="
          funnel.map((step) => ({ label: t(`stages.${step.step}`), value: String(step.count) }))
        "
      >
        <EnrolmentFunnelChart :data="funnel" />
      </ChartCard>
    </div>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">{{ t('adminHome.needStep') }}</h2>
      <EnrolmentsTable :rows="inProgress" :empty="t('adminHome.needStepEmpty')" />
    </section>
  </AppLayout>
</template>
