<template>
  <Teleport to="body">
    <Transition name="modal-backdrop" appear>
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        aria-label="Resolver duplicata de nome"
        class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleCancel"
        @keydown.escape="handleCancel"
      >
        <Transition name="modal-content" appear>
          <div
            class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20"
          >
          <div class="relative">
            <div
              class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2463eb] via-[#1a4fc9] to-[#2463eb]"
            ></div>
            <div class="flex items-center justify-between pt-6 px-6 pb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center"
                >
                  <IconSprite name="user-search" size="20" class="text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-800">
                    Resolver duplicata de nome
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">Adicione sobrenomes para diferenciar</p>
                </div>
              </div>
              <button
                @click="handleCancel"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                aria-label="Fechar"
              >
                <IconSprite name="x" size="18" />
              </button>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <p class="text-sm text-slate-600 mb-2">
                Já existe(m) pedido(s) com o nome
                "<strong class="text-[#2463eb]">{{ nomeDuplicata }}</strong>"
              </p>
              <p class="text-xs text-slate-500">
                Posições: {{ posicoes }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1">
                Sobrenome para pedidos EXISTENTES
              </label>
              <input
                ref="existingInput"
                v-model="suffixExisting"
                type="text"
                placeholder="Ex: Silva, Santos, Oliveira"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2463eb] focus:border-transparent outline-none transition"
              />
              <p class="text-xs text-slate-500 mt-1">
                Será adicionado ao(s) pedido(s): {{ nomesExistentes }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1">
                Sobrenome para NOVO pedido
              </label>
              <input
                v-model="suffixNew"
                type="text"
                placeholder="Ex: Souza, Costa, Pereira"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2463eb] focus:border-transparent outline-none transition"
              />
              <p class="text-xs text-slate-500 mt-1">
                Será adicionado ao pedido {{ numeroEntrada }}
              </p>
            </div>

            <p v-if="erroMsg" class="text-xs text-rose-500 flex items-center gap-1">
              <IconSprite name="alert-circle" size="12" class="shrink-0" />
              {{ erroMsg }}
            </p>
          </div>

          <div class="flex gap-3 p-6 pt-0 border-t border-slate-200">
            <button
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all cursor-pointer"
              @click="handleCancel"
            >
              Cancelar
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
              @click="handleConfirm"
            >
              Confirmar e Adicionar
            </button>
          </div>
        </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import type { Delivery } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'

const props = defineProps<{
  duplicataPendente: { newEntry: Delivery; existingIndices: number[] } | null
  lista: Delivery[]
}>()

const emit = defineEmits<{
  confirm: [suffixExisting: string, suffixNew: string]
  cancel: []
}>()

const dialogRef = ref<HTMLDivElement | null>(null)
const suffixExisting = ref('')
const suffixNew = ref('')
const existingInput = ref<HTMLInputElement | null>(null)
const erroMsg = ref('')

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(dialogRef)

const nomeDuplicata = computed(() => props.duplicataPendente?.newEntry.name ?? '')
const numeroEntrada = computed(() => props.duplicataPendente?.newEntry.num ?? '')
const nomesExistentes = computed(() => {
  if (!props.duplicataPendente) return ''
  return props.duplicataPendente.existingIndices
    .map((idx) => props.lista[idx]?.name ?? '')
    .filter(Boolean)
    .join(', ')
})
const posicoes = computed(() => {
  if (!props.duplicataPendente) return ''
  return props.duplicataPendente.existingIndices.map((i) => i + 1).join(', ')
})

onMounted(async () => {
  lockScroll()
  erroMsg.value = ''
  suffixExisting.value = ''
  suffixNew.value = ''
  await nextTick()
  existingInput.value?.focus()
})

onUnmounted(() => {
  unlockScroll()
})

const handleConfirm = () => {
  const existing = suffixExisting.value.trim()
  const newSuf = suffixNew.value.trim()
  if (!existing || !newSuf) {
    erroMsg.value = 'Preencha ambos os sobrenomes.'
    return
  }
  erroMsg.value = ''
  emit('confirm', existing, newSuf)
}

const handleCancel = () => {
  emit('cancel')
}
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
