<script setup lang="ts" generic="T extends string | number">
import { moveRadioChoice, radioTabIndex } from '@/composables/useRadioKeys'

// A single-choice group: choosing one option clears the others (decision 40).
const props = defineProps<{ label: string; options: { value: T; label: string }[] }>()
const model = defineModel<T | null>({ required: true })

function onKeydown(event: KeyboardEvent): void {
  moveRadioChoice(
    event,
    props.options.map((option) => option.value),
    (value) => (model.value = value),
  )
}
</script>

<template>
  <div role="radiogroup" :aria-label="label" class="flex flex-wrap gap-2" @keydown="onKeydown">
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :tabindex="radioTabIndex(option.value, index, model)"
      class="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inkteal-500"
      :class="
        model === option.value
          ? 'border-inkteal-500 bg-inkteal-100 font-semibold text-ink'
          : 'border-line-strong bg-paper text-ink hover:bg-mist'
      "
      @click="model = option.value"
    >
      <UIcon v-if="model === option.value" name="i-lucide-check" class="size-4 text-inkteal-500" />
      {{ option.label }}
    </button>
  </div>
</template>
