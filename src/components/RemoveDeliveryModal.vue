<template>
  <Teleport to="body">
    <Transition name="modal-backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Remover entrega"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleClose"
        @keydown.escape="handleClose"
      >
        <Transition name="modal-content" appear>
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform border border-white/20"
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
                <h3 class="text-xl font-bold text-slate-800">Remover entrega</h3>
                <p class="text-xs text-slate-500 mt-0.5">Digite o número do pedido</p>
              </div>
            </div>
            <button
              @click="handleClose"
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
              aria-label="Fechar"
            >
              <IconSprite name="x" size="18" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div
              v-if="deliveryCount === 0"
              class="flex flex-col items-center gap-3 py-6 text-center"
            >
              <IconSprite name="alert-circle" size="48" class="text-slate-300" :stroke-width="1.5" />
              <span class="text-slate-400">Nenhuma entrega cadastrada</span>
            </div>

            <div v-else>
              <label class="block text-sm font-semibold text-slate-600 mb-2">
                Número do pedido
              </label>
              <div class="relative">
                <input
                  ref="inputRef"
                  v-model="numero"
                  type="text"
                  placeholder="Ex: 1234"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2463eb] focus:ring-2 focus:ring-[#2463eb]/20 outline-none transition-all pr-10 bg-slate-50/50 hover:bg-white"
                  @keyup.enter="handleRemove"
                />
                <div
                  v-if="numero && /^\d+$/.test(numero)"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <IconSprite name="check" size="12" :stroke-width="3" class="text-green-600" />
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
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600"
                      >
                        <IconSprite name="building" size="10" />
                        AP
                      </span>
                      <span
                        v-if="foundDelivery.manha"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600"
                      >
                        <IconSprite name="sun" size="10" />
                        Manhã
                      </span>
                      <span
                        v-if="foundDelivery.brinde"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600"
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
                class="mt-4 p-3 bg-red-50 rounded-xl border border-red-200"
              >
                <div class="flex items-center gap-2 text-red-700 text-sm">
                  <IconSprite name="alert-circle" size="16" />
                  <span>Pedido não encontrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 p-6 pt-0 border-t border-slate-200">
          <button
            @click="handleClose"
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            @click="handleRemove"
            :disabled="!canRemove"
            :class="[
              'flex-1 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer',
              canRemove
                ? 'bg-linear-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed',
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
useFocusTrap(modalRef)

const deliveryCount = computed(() => props.deliveries.length)

const foundDelivery = computed(() => {
  if (!numero.value || !/^\d+$/.test(numero.value)) return null
  return props.deliveries.find((d) => d.num === numero.value)
})

const canRemove = computed(() => {
  return numero.value && /^\d+$/.test(numero.value) && foundDelivery.value !== null
})

const handleClose = () => {
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

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(5px);
}
</style>


