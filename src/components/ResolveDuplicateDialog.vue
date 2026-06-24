<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        aria-label="Resolver duplicata de nome"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleCancel"
      >
        <Transition name="dialog" appear>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 transition-all duration-300 transform"
          >
            <div class="relative">
              <div
                class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-500 via-orange-600 to-amber-500"
              ></div>
              <div class="flex items-center justify-between pt-6 px-6 pb-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 flex items-center justify-center"
                  >
                    <IconSprite name="user-search" size="20" class="text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-gray-100">
                      Resolver duplicata de nome
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Adicione sobrenomes para diferenciar</p>
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

          <div class="p-6 space-y-4">
            <div>
              <p class="text-sm text-slate-600 dark:text-gray-300 mb-2">
                Já existe(m) pedido(s) com o nome
                "<strong class="text-[#2463eb]">{{ nomeDuplicata }}</strong>"
              </p>
              <p class="text-xs text-slate-500 dark:text-gray-400">
                Posições: {{ posicoes }}
              </p>
            </div>
            <div>
              <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                <IconSprite name="user-search" size="14" class="text-[#2463eb]" />
                Sobrenome para pedidos EXISTENTES
              </label>
              <input
                ref="existingInput"
                v-model="suffixExisting"
                type="text"
                placeholder="Ex: Silva, Santos, Oliveira"
                @keyup.enter="handleConfirm"
                class="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl focus-visible:ring-2 focus-visible:ring-[#2463eb]/20 focus:border-[#2463eb] focus:outline-none transition-all bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              />
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Será adicionado ao(s) pedido(s): {{ nomesExistentes }}
              </p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                <IconSprite name="user" size="14" class="text-[#2463eb]" />
                Sobrenome para NOVO pedido
              </label>
              <input
                v-model="suffixNew"
                type="text"
                placeholder="Ex: Souza, Costa, Pereira"
                @keyup.enter="handleConfirm"
                class="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl focus-visible:ring-2 focus-visible:ring-[#2463eb]/20 focus:border-[#2463eb] focus:outline-none transition-all bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              />
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Será adicionado ao pedido {{ numeroEntrada }}
              </p>
            </div>

            <p v-if="erroMsg" class="text-xs text-rose-500 flex items-center gap-1">
              <IconSprite name="alert-circle" size="12" class="shrink-0" />
              {{ erroMsg }}
            </p>
          </div>

          <div class="flex gap-3 p-6 pt-0 border-t border-slate-200 dark:border-gray-700">
            <button
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
              @click="handleCancel"
            >
              Cancelar
            </button>
            <button
              :disabled="!isValid"
              :class="[
                'flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                isValid
                  ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 dark:bg-gray-600 text-slate-400 dark:text-gray-500 cursor-not-allowed',
              ]"
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
useFocusTrap(dialogRef, handleCancel)

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

const isValid = computed(() => {
  return suffixExisting.value.trim() !== '' && suffixNew.value.trim() !== ''
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

function handleConfirm() {
  const existing = suffixExisting.value.trim()
  const newSuf = suffixNew.value.trim()
  if (!existing || !newSuf) {
    erroMsg.value = 'Preencha ambos os sobrenomes.'
    return
  }
  erroMsg.value = ''
  emit('confirm', existing, newSuf)
}

function handleCancel() {
  emit('cancel')
}
</script>


