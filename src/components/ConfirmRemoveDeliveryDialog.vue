<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar remoção"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleCancel"
      >
        <Transition name="dialog" appear>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform border border-white/20 dark:border-gray-700/50"
          >
            <div class="relative">
              <div
                class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-rose-500 via-pink-600 to-rose-500"
              ></div>
              <div class="flex items-center justify-between pt-6 px-6 pb-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 flex items-center justify-center"
                  >
                    <IconSprite name="trash-2" size="20" class="text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-gray-100">Remover entrega</h3>
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Confirmação necessária</p>
                  </div>
                </div>
                <button
                  @click="handleCancel"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                  aria-label="Fechar"
                >
                  <IconSprite name="x" size="18" />
                </button>
              </div>
            </div>

            <div class="p-6">
              <p class="text-slate-700 dark:text-gray-300 mb-4">
                Deseja remover a entrega abaixo?
              </p>
              <div class="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0"
                  >
                    <IconSprite name="box" size="16" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono font-bold text-slate-800 dark:text-gray-100 text-sm">{{ delivery.num }}</span>
                      <span class="text-slate-600 dark:text-gray-300 text-sm truncate">{{ delivery.name }}
                        <template v-if="delivery.cidade"> - <strong class="text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 rounded text-xs">{{ delivery.cidade }}</strong></template>
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mt-2">
                      <span
                        v-if="delivery.ap"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      >
                        <IconSprite name="building" size="10" />
                        Apartamento
                      </span>
                      <span
                        v-if="delivery.manha"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <IconSprite name="sun-full" size="10" />
                        Manhã
                      </span>
                      <span
                        v-if="delivery.brinde"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                      >
                        <IconSprite name="gift" size="10" />
                        Brinde
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 p-6 pt-0 border-t border-slate-200 dark:border-gray-700">
              <button
                @click="handleCancel"
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
              >
                Cancelar
              </button>
              <button
                ref="confirmBtnRef"
                @click="handleConfirm"
                class="flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <IconSprite name="trash-2" size="18" />
                Remover
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
import type { Delivery } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'

defineProps<{
  delivery: Delivery
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const modalRef = ref<HTMLDivElement | null>(null)
const confirmBtnRef = ref<HTMLButtonElement | null>(null)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(modalRef, handleCancel)

onMounted(() => {
  lockScroll()
  nextTick(() => {
    confirmBtnRef.value?.focus()
  })
})
onUnmounted(() => {
  unlockScroll()
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>
