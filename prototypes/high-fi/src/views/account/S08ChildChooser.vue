<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layouts/AppLayout.vue'
import { useDirectoryStore } from '@/stores/directory'
import { useSessionStore } from '@/stores/session'

const { t } = useI18n()
const directory = useDirectoryStore()
const { user, visibleStudents } = storeToRefs(useSessionStore())

function groupLine(groupId: string | null): string {
  const group = directory.groupById(groupId)
  return group
    ? `${directory.courseById(group.courseId)?.name ?? ''} ${group.level}, ${group.code}`
    : ''
}
</script>

<template>
  <AppLayout
    :title="t('account.children.title')"
    :caption="
      t('account.children.intro', { name: user?.fullName ?? '', n: visibleStudents.length })
    "
  >
    <ul class="divide-y divide-line rounded-md border border-line bg-paper">
      <li v-for="student in visibleStudents" :key="student.id">
        <RouterLink
          :to="{ name: 'account-home', params: { studentId: student.id } }"
          class="flex min-h-16 items-center gap-4 p-4 hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inkteal-500"
        >
          <span class="min-w-0 flex-1">
            <span class="block font-semibold">{{ student.fullName }}</span>
            <span class="block text-sm text-ink-muted">{{ groupLine(student.groupId) }}</span>
          </span>
          <UIcon name="i-lucide-chevron-right" class="size-5 shrink-0 text-ink-muted" />
        </RouterLink>
      </li>
    </ul>
  </AppLayout>
</template>
