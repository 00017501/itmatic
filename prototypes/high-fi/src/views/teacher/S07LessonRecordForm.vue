<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AttendanceControl from '@/components/teacher/AttendanceControl.vue'
import { useFormat } from '@/composables/useFormat'
import { formIsOpen, FORM_OPENS_BEFORE_MINUTES, type LessonDraft } from '@/domain/lesson'
import AppLayout from '@/layouts/AppLayout.vue'
import { useClockStore } from '@/stores/clock'
import { useDirectoryStore } from '@/stores/directory'
import { useLessonsStore } from '@/stores/lessons'
import { useSessionStore } from '@/stores/session'
import type { AbsenceStatus, AttendanceStatus } from '@/types'
import { addMinutes } from '@/utils/format'

const { t } = useI18n()
const format = useFormat()
const route = useRoute()
const router = useRouter()
const clock = useClockStore()
const directory = useDirectoryStore()
const lessonsStore = useLessonsStore()
const { offline } = storeToRefs(lessonsStore)
const { user } = storeToRefs(useSessionStore())

const lesson = computed(() => {
  const found = lessonsStore.lessonById(String(route.params.id))
  return found && found.teacherId === user.value?.id ? found : undefined
})
const group = computed(() => directory.groupById(lesson.value?.groupId ?? null))
const students = computed(() =>
  lesson.value ? directory.studentsInGroup(lesson.value.groupId) : [],
)
const isOpen = computed(() => (lesson.value ? formIsOpen(lesson.value, clock.now) : false))
const existing = lesson.value ? lessonsStore.recordFor(lesson.value.id) : undefined

/** A status reported in advance pre-fills the mark; the teacher can still change it (UC-2). */
function initialMark(studentId: string): AttendanceStatus | null {
  const saved = existing?.marks.find((m) => m.studentId === studentId)
  if (saved) return saved.status
  const advance = lesson.value ? lessonsStore.activeStatus(lesson.value.id, studentId) : undefined
  return advance ? advance.kind : null
}

const draft = reactive<LessonDraft>({
  marks: Object.fromEntries(students.value.map((s) => [s.id, initialMark(s.id)])),
  topic: existing?.topic ?? '',
  homework: existing?.homework ?? '',
  attachmentNames: existing?.attachmentNames ?? [],
})
const attachmentsText = ref(draft.attachmentNames.join(', '))
const errors = reactive({ topic: '', attachments: '' })
const notMarked = ref<string[]>([])
const notMarkedOpen = ref(false)
const savedOpen = ref(false)

const markedCount = computed(() => students.value.filter((s) => draft.marks[s.id]).length)

function badge(status: AbsenceStatus): string {
  const via =
    status.reportedVia === 'parent' ? t('teacher.lesson.viaParent') : t('teacher.lesson.viaPhone')
  const time = format.time(status.reportedAt)
  if (status.kind === 'late')
    return t('teacher.lesson.badgeLate', { minutes: status.delayMinutes ?? 0, via, time })
  const reason =
    status.reason === 'other' && status.otherText
      ? status.otherText
      : t(`absenceReasons.${status.reason ?? 'other'}`)
  return t('teacher.lesson.badgeAbsent', { reason: reason.toLowerCase(), via, time })
}

function markAllPresent(): void {
  lessonsStore.markAllPresent(draft, students.value)
}

function save(): void {
  if (!lesson.value || !user.value) return
  errors.topic = ''
  errors.attachments = ''
  draft.attachmentNames = attachmentsText.value
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
  const error = lessonsStore.save(lesson.value.id, draft, students.value, user.value.id)
  if (!error) savedOpen.value = true
  else if (error.field === 'marks') {
    notMarked.value = error.studentNames
    notMarkedOpen.value = true
  } else if (error.field === 'attachments')
    errors.attachments = t('teacher.lesson.attachmentsError')
  else errors.topic = t('teacher.lesson.topicError')
}

function markAndSave(): void {
  notMarkedOpen.value = false
  markAllPresent()
  save()
}

async function backToToday(): Promise<void> {
  savedOpen.value = false
  await router.push({ name: 'teacher-today' })
}

const savedRecord = computed(() =>
  lesson.value ? lessonsStore.recordFor(lesson.value.id) : undefined,
)
</script>

<template>
  <AppLayout
    :title="lesson ? `${group?.code}, ${lesson.startTime}` : t('teacher.today.title')"
    :caption="
      lesson
        ? t('teacher.lesson.details', {
            course: directory.courseById(group?.courseId ?? null)?.name ?? '',
            level: group?.level ?? '',
            room: lesson.room,
            date: format.date(lesson.date),
          })
        : undefined
    "
    :back-to="{ name: 'teacher-today' }"
  >
    <UAlert
      v-if="!lesson"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('teacher.lesson.notFound')"
    />
    <UAlert
      v-else-if="!isOpen"
      color="neutral"
      variant="subtle"
      icon="i-lucide-clock"
      :title="
        t('teacher.lesson.notOpen', {
          time: addMinutes(lesson.startTime, -FORM_OPENS_BEFORE_MINUTES),
        })
      "
    />
    <form v-else id="lesson-form" class="flex flex-col gap-4" novalidate @submit.prevent="save">
      <USwitch
        :model-value="offline"
        :label="t('teacher.lesson.offlineSwitch')"
        @update:model-value="lessonsStore.setOffline($event)"
      />
      <UAlert
        v-if="offline"
        color="warning"
        variant="subtle"
        icon="i-lucide-wifi-off"
        :title="t('teacher.lesson.offlineBanner')"
      />
      <p v-if="savedRecord" class="text-sm text-ink-muted">
        {{
          savedRecord.sentAt
            ? t('teacher.lesson.sentLine', {
                recorded: format.time(savedRecord.savedAt),
                sent: format.time(savedRecord.sentAt),
              })
            : t('teacher.lesson.notSentLine', { recorded: format.time(savedRecord.savedAt) })
        }}
      </p>

      <section class="rounded-md border border-line bg-paper">
        <div class="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <h2 class="min-w-0 flex-1 font-semibold" aria-live="polite">
            {{ t('teacher.lesson.attendance', { marked: markedCount, total: students.length }) }}
          </h2>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            :label="t('teacher.lesson.markAll')"
            @click="markAllPresent"
          />
        </div>
        <ul class="divide-y divide-line">
          <li
            v-for="student in students"
            :key="student.id"
            class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center"
          >
            <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span class="font-semibold">{{ student.fullName }}</span>
              <UBadge
                v-if="lessonsStore.activeStatus(lesson.id, student.id)"
                color="warning"
                variant="subtle"
                :label="badge(lessonsStore.activeStatus(lesson.id, student.id)!)"
              />
            </div>
            <AttendanceControl
              v-model="draft.marks[student.id]!"
              :label="t('teacher.lesson.statusFor', { name: student.fullName })"
              class="w-full sm:w-72"
            />
          </li>
        </ul>
      </section>

      <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-4">
        <UFormField
          :label="t('teacher.lesson.topic')"
          :help="t('teacher.lesson.topicHint')"
          :error="errors.topic || false"
          required
        >
          <UInput v-model="draft.topic" size="xl" maxlength="200" class="w-full" />
        </UFormField>
        <UFormField :label="t('teacher.lesson.homework')" :help="t('teacher.lesson.homeworkHint')">
          <UTextarea v-model="draft.homework" size="xl" :rows="3" maxlength="1000" class="w-full" />
        </UFormField>
        <UFormField
          :label="t('teacher.lesson.attachments')"
          :help="t('teacher.lesson.attachmentsHint')"
          :error="errors.attachments || false"
        >
          <UInput v-model="attachmentsText" size="xl" placeholder="worksheet.pdf" class="w-full" />
        </UFormField>
      </section>
    </form>

    <template v-if="lesson && isOpen" #footer>
      <UButton type="submit" form="lesson-form" size="xl" block :label="t('teacher.lesson.save')" />
    </template>

    <UModal v-model:open="notMarkedOpen" :title="t('teacher.lesson.notMarkedTitle')">
      <template #body>
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="t('teacher.lesson.notMarked', { names: notMarked.join(', ') })"
        />
      </template>
      <template #footer>
        <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-center"
            :label="t('teacher.lesson.backToForm')"
            @click="notMarkedOpen = false"
          />
          <UButton
            size="lg"
            class="justify-center"
            :label="t('teacher.lesson.markAndSave')"
            @click="markAndSave"
          />
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="savedOpen"
      :dismissible="false"
      :close="false"
      :title="
        t('teacher.lesson.savedTitle', {
          time: savedRecord ? format.time(savedRecord.savedAt) : '',
        })
      "
    >
      <template #body>
        <p>
          {{
            savedRecord?.savedOffline
              ? t('teacher.lesson.savedOffline', { time: format.time(savedRecord.savedAt) })
              : t('teacher.lesson.savedText')
          }}
        </p>
      </template>
      <template #footer>
        <UButton
          size="lg"
          class="ml-auto"
          :label="t('teacher.lesson.backToToday')"
          @click="backToToday"
        />
      </template>
    </UModal>
  </AppLayout>
</template>
