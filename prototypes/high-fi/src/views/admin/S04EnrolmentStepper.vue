<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import EnrolmentChoiceForm from '@/components/admin/EnrolmentChoiceForm.vue'
import EnrolmentContractForm from '@/components/admin/EnrolmentContractForm.vue'
import EnrolmentGroupForm from '@/components/admin/EnrolmentGroupForm.vue'
import EnrolmentLevelTestForm from '@/components/admin/EnrolmentLevelTestForm.vue'
import EnrolmentLostModal from '@/components/admin/EnrolmentLostModal.vue'
import EnrolmentStageItem from '@/components/admin/EnrolmentStageItem.vue'
import EnrolmentStageStrip from '@/components/admin/EnrolmentStageStrip.vue'
import { useFormat } from '@/composables/useFormat'
import { currentStage, STAGE_ORDER } from '@/domain/enrolment'
import { firstFeeMonth } from '@/domain/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import { useDirectoryStore } from '@/stores/directory'
import { useEnrolmentsStore } from '@/stores/enrolments'
import { ENROLMENT_STATUS_COLOUR } from '@/utils/statusColour'

const { t } = useI18n()
const format = useFormat()
const route = useRoute()
const router = useRouter()
const directory = useDirectoryStore()
const store = useEnrolmentsStore()

const enrolment = computed(() => store.enrolmentById(String(route.params.id)))
const enquiry = computed(() =>
  enrolment.value ? store.enquiryById(enrolment.value.enquiryId) : undefined,
)
const group = computed(() => directory.groupById(enrolment.value?.groupId ?? null))
const open = computed(
  () => enrolment.value?.status === 'inProgress' || enrolment.value?.status === 'waitingList',
)
const current = computed(() =>
  enrolment.value && open.value ? currentStage(enrolment.value) : null,
)
const caption = computed(() =>
  enquiry.value
    ? t('enrolment.caption', {
        course: directory.courseById(enquiry.value.courseId)?.name ?? '',
        date: format.date(enquiry.value.createdAt),
        parent: enquiry.value.parentName,
        phone: enquiry.value.parentPhone,
      })
    : undefined,
)
const feeMonth = computed(() => firstFeeMonth(enrolment.value?.studentId ?? '', store.enrolments))

const lostOpen = ref(false)
const completedOpen = ref(false)

async function backToList(): Promise<void> {
  completedOpen.value = false
  await router.push({ name: 'admin-enrolments' })
}
</script>

<template>
  <AppLayout
    :title="enquiry?.studentName ?? t('enrolments.title')"
    :caption="caption"
    :back-to="{ name: 'admin-enrolments' }"
    width="wide"
  >
    <template v-if="enrolment && open" #actions>
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        :label="t('enrolment.lost.open')"
        @click="lostOpen = true"
      />
    </template>

    <UAlert
      v-if="!enrolment || !enquiry"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('enrolment.notFound')"
    />
    <template v-else>
      <div class="flex flex-wrap items-center gap-4" aria-live="polite">
        <UBadge
          :color="ENROLMENT_STATUS_COLOUR[enrolment.status]"
          variant="subtle"
          size="lg"
          :label="t(`enrolmentStatus.${enrolment.status}`)"
        />
        <p v-if="enrolment.status === 'completed'" class="text-sm text-ink-muted">
          {{ t('enrolment.completedNote', { group: group?.code ?? '' }) }}
        </p>
        <p v-else-if="enrolment.status === 'lost'" class="text-sm text-ink-muted">
          {{
            t('enrolment.lostNote', {
              reason: t(`lostReasons.${enrolment.lostReason ?? 'other'}`).toLowerCase(),
            })
          }}
        </p>
        <p v-else-if="enrolment.status === 'waitingList'" class="text-sm text-ink-muted">
          {{ t('enrolment.waitingNote') }}
        </p>
      </div>

      <EnrolmentStageStrip class="hidden lg:grid" :stages="enrolment.stages" :current="current" />

      <ol class="divide-y divide-line overflow-hidden rounded-md border border-line bg-paper">
        <EnrolmentStageItem
          v-for="(key, index) in STAGE_ORDER"
          :key="key"
          :stage-key="key"
          :number="index + 1"
          :stage="enrolment.stages.find((s) => s.key === key)"
          :current="current === key"
        >
          <EnrolmentLevelTestForm
            v-if="key === 'levelTest'"
            :enrolment-id="enrolment.id"
            :course-id="enquiry.courseId"
          />
          <EnrolmentGroupForm
            v-else-if="key === 'group'"
            :enrolment-id="enrolment.id"
            :course-id="enquiry.courseId"
            :level="enrolment.level"
            :waiting="enrolment.status === 'waitingList'"
          />
          <EnrolmentContractForm
            v-else-if="key === 'contract'"
            :enrolment-id="enrolment.id"
            :group-code="group?.code ?? ''"
            @completed="completedOpen = true"
          />
          <EnrolmentChoiceForm
            v-else
            :key="`form-${key}`"
            :enrolment-id="enrolment.id"
            :stage-key="key"
            @declined="lostOpen = true"
          />
        </EnrolmentStageItem>
      </ol>

      <EnrolmentLostModal v-model:open="lostOpen" :enrolment-id="enrolment.id" />

      <UModal
        v-model:open="completedOpen"
        :dismissible="false"
        :close="false"
        :title="t('enrolment.completed.title')"
      >
        <template #body>
          <div class="flex flex-col gap-4">
            <p>
              {{
                t('enrolment.completed.text', {
                  name: enquiry.studentName,
                  group: group?.code ?? '',
                  fee: format.money(group?.monthlyFee ?? 0),
                })
              }}
            </p>
            <ul class="flex flex-col gap-1 text-sm text-ink-muted">
              <li>
                {{
                  t('enrolment.completed.contract', {
                    number: enrolment.contractNumber ?? '',
                    date: format.date(enrolment.contractDate ?? ''),
                  })
                }}
              </li>
              <li>
                {{
                  t('enrolment.completed.accounts', {
                    student: enquiry.studentName,
                    parent: enquiry.parentName,
                  })
                }}
              </li>
              <li v-if="feeMonth">
                {{
                  t('enrolment.completed.fee', {
                    fee: format.money(group?.monthlyFee ?? 0),
                    month: format.monthAndYear(feeMonth),
                  })
                }}
              </li>
            </ul>
          </div>
        </template>
        <template #footer>
          <UButton size="lg" class="ml-auto" :label="t('enrolment.back')" @click="backToList" />
        </template>
      </UModal>
    </template>
  </AppLayout>
</template>
