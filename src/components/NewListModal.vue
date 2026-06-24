<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Nova lista"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="$emit('cancel')"
      >
        <Transition name="dialog" appear>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transition-all duration-300 transform border border-white/20 dark:border-gray-700/50"
          >
            <div class="relative">
              <div
                class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2463eb] to-[#1a4fc9]"
              ></div>
              <div class="flex items-center justify-between pt-6 px-6 pb-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center"
                  >
                    <IconSprite name="calendar-plus" size="20" class="text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-gray-100">Nova lista</h3>
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Escolha a data da entrega</p>
                  </div>
                </div>
                <button
                  @click="$emit('cancel')"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                  aria-label="Fechar"
                >
                  <IconSprite name="x" size="18" />
                </button>
              </div>
            </div>

            <div class="p-6">
              <label for="new-list-date" class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Data da entrega
              </label>
              <input
                id="new-list-date"
                ref="dateInputRef"
                type="date"
                :min="minDate"
                v-model="selectedDate"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#2463eb]/30 focus:border-[#2463eb] transition-all duration-200"
              />
            </div>

            <div class="flex gap-3 p-6 pt-0 border-t border-slate-200 dark:border-gray-700">
              <button
                @click="$emit('cancel')"
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
              >
                Cancelar
              </button>
              <button
                ref="confirmBtnRef"
                :disabled="!selectedDate"
                @click="handleConfirm"
                class="flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <IconSprite name="check" size="18" />
                Criar lista
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import IconSprite from '@/components/IconSprite.vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'

const emit = defineEmits<{
  confirm: [date: Date]
  cancel: []
}>()

const modalRef = ref<HTMLDivElement | null>(null)
const confirmBtnRef = ref<HTMLButtonElement | null>(null)
const dateInputRef = ref<HTMLInputElement | null>(null)

const hoje = new Date()
const minDate = hoje.toISOString().slice(0, 10)

const selectedDate = ref(minDate)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(modalRef, () => emit('cancel'))

onMounted(() => {
  lockScroll()
  nextTick(() => {
    dateInputRef.value?.showPicker?.()
    confirmBtnRef.value?.focus()
  })
})
onUnmounted(() => {
  unlockScroll()
})

function handleConfirm() {
  if (!selectedDate.value) return
  const [year, month, day] = selectedDate.value.split('-').map(Number)
  const d = new Date(year!, month! - 1, day!)
  emit('confirm', d)
}
</script>
