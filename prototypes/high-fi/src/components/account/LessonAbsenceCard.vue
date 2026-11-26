<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportAbsenceModal from '@/components/account/ReportAbsenceModal.vue'
import { useAbsenceLabel } from '@/composables/useAbsenceLabel'
import { useFormat } from '@/composables/useFormat'
import { hasStarted, LESSON_MINUTES } from '@/domain/lesson'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { useLessonsStore } from '@/stores/lessons'
import type { Lesson, Student } from '@/types'
import { addMinutes } from '@/utils/format'

// The next lesson with the Report absence action; used on S09 Account home and S10 Schedule.
const props = defineProps<{ lesson: Lesson; student: Student; canReport: boolean }>()

const { t } = useI18n()
const format = useFormat()
const toast = useToast()
const clock = useClockStore()
const directory = useDirectoryStore()
const lessonsStore = useLessonsStore()
const absenceLabel = useAbsenceLabel()
const modalOpen = ref(false)

const group = computed(() => directory.groupById(props.lesson.groupId))
const status = computed(() => lessonsStore.activeStatus(props.lesson.id, props.student.id))
const started = computed(() => hasStarted(props.lesson, clock.now))
const when = computed(() =>
  t('account.home.when', {
    day:
      props.lesson.date === clock.today ? t('app.today') : format.weekdayShort(props.lesson.date),
    date: format.date(props.lesson.date),
    start: props.lesson.startTime,
    end: addMinutes(props.lesson.startTime, LESSON_MINUTES),
  }),
)
const where = computed(() =>
  t('account.home.where', {
    course: directory.courseById(group.value?.courseId ?? null)?.name ?? '',
    level: group.value?.level ?? '',
    room: props.lesson.room,
    teacher: directory.userById(props.lesson.teacherId)?.fullName ?? '',
  }),
)

function withdraw(): void {
  if (!status.value) return
  lessonsStore.withdraw(status.value.id)
  toast.add({ title: t('account.absence.withdrawn'), color: 'neutral', icon: 'i-lucide-undo-2' })
}
</script>

<template>
  <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4">
    <div>
      <p class="font-semibold">{{ when }}</p>
      <p class="text-sm text-ink-muted">{{ where }} {{ t('account.home.noChanges') }}</p>
    </div>
    <div v-if="status" class="flex flex-wrap items-center gap-2">
      <UBadge
        color="warning"
        variant="subtle"
        size="lg"
        :label="t('account.home.reported', { status: absenceLabel(status) })"
      />
      <UButton
        v-if="canReport && !started"
        color="neutral"
        variant="link"
        :label="t('account.home.withdraw')"
        class="px-0"
        @click="withdraw"
      />
    </div>
    <template v-else-if="canReport && !started">
      <UButton size="xl" block :label="t('account.home.reportAbsence')" @click="modalOpen = true" />
      <p class="text-sm text-ink-muted">{{ t('account.schedule.canReport') }}</p>
    </template>
    <ReportAbsenceModal v-model:open="modalOpen" :lesson="lesson" :student="student" />
  </section>
</template>
