<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { useSessionStore } from '@/stores/session'

// Stage 2: a group that matches the course and level and has a free place (E-FR01-04).
const props = defineProps<{
  enrolmentId: string
  courseId: string
  level: string | null
  waiting: boolean
}>()

const { t } = useI18n()
const directory = useDirectoryStore()
const store = useEnrolmentsStore()
const session = useSessionStore()

const groupId = ref<string | undefined>(undefined)
const error = ref('')

const options = computed(() =>
  directory.groups
    .filter(
      (g) =>
        g.branchId === session.user?.branchId &&
        g.courseId === props.courseId &&
        g.level === props.level,
    )
    .map((g) => {
      const taken = directory.studentsInGroup(g.id).length
      const places = { code: g.code, taken, capacity: g.capacity }
      const full = taken >= g.capacity
      return {
        value: g.id,
        label: t('enrolment.group.places', places),
        description: full ? t('enrolment.group.full', places) : undefined,
        disabled: full,
      }
    }),
)
const hasFreeGroup = computed(() => options.value.some((o) => !o.disabled))

function record(): void {
  if (!session.user) return
  if (!groupId.value) {
    error.value = t('enrolment.group.chooseError')
    return
  }
  const problem = store.assignGroup(props.enrolmentId, groupId.value, session.user.id)
  const group = directory.groupById(groupId.value)
  error.value = problem
    ? t('enrolment.group.full', {
        code: group?.code ?? '',
        taken: directory.studentsInGroup(groupId.value).length,
        capacity: group?.capacity ?? 0,
      })
    : ''
}
</script>

<template>
  <form class="flex max-w-xl flex-col gap-4" novalidate @submit.prevent="record">
    <UFormField v-if="options.length" :label="t('enrolment.group.choose')" :error="error || false">
      <URadioGroup v-model="groupId" :items="options" />
    </UFormField>
    <UAlert
      v-if="!hasFreeGroup"
      color="warning"
      variant="subtle"
      icon="i-lucide-info"
      :title="t('enrolment.group.none')"
    />
    <div class="flex flex-wrap gap-2">
      <UButton v-if="hasFreeGroup" type="submit" size="lg" :label="t('enrolment.group.record')" />
      <UButton
        v-if="!hasFreeGroup && !waiting"
        size="lg"
        :label="t('enrolment.group.waitingList')"
        @click="store.addToWaitingList(enrolmentId)"
      />
    </div>
  </form>
</template>
