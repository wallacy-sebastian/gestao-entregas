<template>
  <label
    class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer"
    :class="modelValue ? 'bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'"
    :style="modelValue ? `border-color: ${borderColor}` : ''"
  >
    <input type="checkbox" :checked="modelValue" class="hidden" @change="toggle" />
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
      :class="modelValue ? activeClass : 'bg-slate-100'"
    >
      <span class="text-lg" :class="modelValue ? '' : 'opacity-70'">{{ emoji }}</span>
    </div>
    <span
      class="text-xs font-medium"
      :class="modelValue ? textActiveClass : 'text-slate-500'"
    >{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label: string
  emoji: string
  activeClass: string
  textActiveClass: string
  borderColor: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle(): void {
  emit('update:modelValue', !props.modelValue)
}
</script>
