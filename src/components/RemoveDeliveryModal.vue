<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Remover entrega"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleClose"
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
                  <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Digite o número do pedido</p>
                </div>
              </div>
              <button
                @click="handleClose"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                aria-label="Fechar"
              >
                <IconSprite name="x" size="18" />
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                  <IconSprite name="list" size="14" class="text-[#2463eb]" />
                  Número do pedido
                </label>
                <div class="relative">
                  <div
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm"
                  >
                    #
                  </div>
                  <input
                    ref="inputRef"
                    v-model="numero"
                    type="text"
                    placeholder="Ex: 1234"
                    @keyup.enter="handleRemove"
                    @input="clearError"
                    :class="[
                      'w-full py-3 pl-8 pr-10 rounded-xl font-mono text-sm transition-all focus:outline-none bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
                      numero && /^\d+$/.test(numero)
                        ? foundDelivery
                          ? 'border-emerald-300 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200'
                          : 'border-rose-300 focus:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-200'
                        : 'border-slate-200 dark:border-gray-600 focus:border-[#2463eb] focus-visible:ring-2 focus-visible:ring-[#2463eb]/20',
                    ]"
                  />
                  <div
                    v-if="numero && /^\d+$/.test(numero)"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <IconSprite name="check" size="12" :stroke-width="2.5" class="text-green-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="foundDelivery && numero"
                  class="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"
                    >
                      <IconSprite name="alert-circle" size="16" class="text-amber-700" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-800">Pedido encontrado</p>
                      <p class="text-sm text-slate-600 mt-0.5">
                        <span class="font-semibold">{{ foundDelivery.num }}</span> -
                        {{ foundDelivery.name }}
                      </p>
                      <div class="flex gap-2 mt-2">
                        <span
                          v-if="foundDelivery.ap"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                        >
                          <IconSprite name="building" size="10" />
                          Apartamento
                        </span>
                        <span
                          v-if="foundDelivery.manha"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        >
                          <IconSprite name="sun" size="10" />
                          Manhã
                        </span>
                        <span
                          v-if="foundDelivery.brinde"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                        >
                          <IconSprite name="gift" size="10" />
                          Brinde
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="numero && !foundDelivery && /^\d+$/.test(numero)"
                  class="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200"
                >
                  <div class="flex items-center gap-2 text-rose-700 text-sm">
                    <IconSprite name="alert-circle" size="16" />
                    <span>Pedido não encontrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 p-6 pt-0 border-t border-slate-200 dark:border-gray-700">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
            >
              Cancelar
            </button>
            <button
              @click="handleRemove"
              :disabled="!canRemove"
              :class="[
                'flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer',
                canRemove
                  ? 'bg-linear-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-gray-600 text-slate-400 dark:text-gray-500 cursor-not-allowed',
              ]"
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
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import type { Delivery } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'

const props = defineProps<{
  deliveries: Delivery[]
}>()

const emit = defineEmits<{
  close: []
  remove: [numero: string]
}>()

const modalRef = ref<HTMLDivElement | null>(null)
const numero = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(modalRef, handleClose)

const foundDelivery = computed(() => {
  if (!numero.value || !/^\d+$/.test(numero.value)) return null
  return props.deliveries.find((d) => d.num === numero.value)
})

const canRemove = computed(() => {
  return numero.value && /^\d+$/.test(numero.value) && foundDelivery.value !== null
})

function clearError() {
  // no-op: reatividade atualiza o border color via computed
}

function handleClose() {
  numero.value = ''
  emit('close')
}

const handleRemove = () => {
  if (canRemove.value) {
    emit('remove', numero.value)
    numero.value = ''
  }
}

onMounted(async () => {
  lockScroll()
  await nextTick()
  inputRef.value?.focus()
})

onUnmounted(() => {
  unlockScroll()
})
</script>
