<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar entrega"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleClose"
      >
        <Transition name="dialog" appear>
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-300 transform"
          >
            <div class="relative">
              <div
                class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2463eb] via-[#1a4fc9] to-[#2463eb]"
              ></div>
              <div class="pt-6 px-6 pb-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center"
                  >
                    <IconSprite name="box" size="20" class="text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-gray-100">Adicionar entrega</h3>
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      Preencha os dados da nova rota
                      <span v-if="currentCount !== undefined" class="text-[#2463eb]">
                        ({{ currentCount }}/{{ maxLimit }})
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                  aria-label="Fechar"
                  @click="handleClose"
                >
                  <IconSprite name="x" size="18" />
                </button>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                  <IconSprite name="calendar" size="14" class="text-[#2463eb]" />
                  Número do pedido
                  <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <div
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm"
                  >
                    #
                  </div>
                  <input
                    ref="numInputRef"
                    type="text"
                    v-model="formData.num"
                    placeholder="Digite o número do pedido"
                    autocomplete="off"
                    @keyup.enter="handleSubmit"
                    @input="validateForm"
                    :class="[
                      'w-full py-3 pl-8 pr-4 border rounded-xl font-mono text-sm transition-all focus:outline-none bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
                      numeroError
                        ? 'border-rose-300 focus:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-200'
                        : 'border-slate-200 dark:border-gray-600 focus:border-[#2463eb] focus-visible:ring-2 focus-visible:ring-[#2463eb]/20',
                    ]"
                  />
                </div>
                <p v-if="numeroError" class="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <IconSprite name="alert-circle" size="12" class="shrink-0" />
                  {{ numeroError }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                  <IconSprite name="user" size="14" class="text-[#2463eb]" />
                  Nome do cliente
                  <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconSprite name="user-search" size="14" />
                  </div>
                  <input
                    type="text"
                     v-model="formData.name"
                    placeholder="Ex: João Silva, Maria Oliveira"
                    autocomplete="off"
                    @keyup.enter="handleSubmit"
                    @input="validateForm"
                    :class="[
                      'w-full py-3 pl-9 pr-4 border rounded-xl text-sm transition-all focus:outline-none bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
                      nomeError
                        ? 'border-rose-300 focus:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-200'
                        : 'border-slate-200 dark:border-gray-600 focus:border-[#2463eb] focus-visible:ring-2 focus-visible:ring-[#2463eb]/20',
                    ]"
                  />
                </div>
                <p v-if="nomeError" class="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <IconSprite name="alert-circle" size="12" class="shrink-0" />
                  {{ nomeError }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                  <IconSprite name="map-pin" size="14" class="text-[#2463eb]" />
                  Cidade
                  <span class="text-slate-400 dark:text-gray-500 font-normal text-xs">(opcional)</span>
                </label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconSprite name="map-pin" size="14" />
                  </div>
                  <input
                    type="text"
                    v-model="formData.cidade"
                    placeholder="Ex: São Paulo, Rio de Janeiro"
                    autocomplete="off"
                    @keyup.enter="handleSubmit"
                    class="w-full py-3 pl-9 pr-4 border border-slate-200 dark:border-gray-600 rounded-xl text-sm transition-all focus:outline-none bg-slate-50/50 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:border-[#2463eb] focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                  <IconSprite name="list" size="14" class="text-[#2463eb]" />
                  Características da entrega
                </label>
                <div class="grid grid-cols-3 gap-3 mt-1">
                    <DeliveryAttributeToggle
                    v-for="attr in atributos"
                    :key="attr.key"
                    :model-value="formData[attr.key]"
                    @update:model-value="formData[attr.key] = $event"
                    :label="attr.label"
                    :icon="attr.icon"
                    :active-class="attr.activeClass"
                    :text-active-class="attr.textActiveClass"
                    :border-color="attr.borderColor"
                    :active-bg-class="attr.activeBgClass"
                    :dark-active-bg-class="attr.darkActiveBgClass"
                    :dark-text-active-class="attr.darkTextActiveClass"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="isLimitReached"
              class="mx-6 mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200"
            >
              <p class="text-xs text-amber-700 flex items-center gap-2">
                <IconSprite name="alert-circle" size="14" class="shrink-0 text-amber-600" />
                Limite máximo de {{ maxLimit }} entregas atingido. Remova algum pedido para
                adicionar mais.
              </p>
            </div>

            <div class="flex gap-3 p-6 pt-0 border-t border-slate-200 dark:border-gray-700">
              <button
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button
                :disabled="!isFormValid || isLimitReached"
:class="[
  'flex-1 px-4 py-2.5 rounded-xl font-semibold text-white cursor-pointer transition-all duration-200 flex items-center justify-center gap-2',
  isFormValid && !isLimitReached
    ? 'bg-linear-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/40'
    : 'bg-slate-200 dark:bg-gray-600 text-slate-400 dark:text-gray-500 cursor-not-allowed',
]"
                @click="handleSubmit"
              >
                <IconSprite name="check" size="18" />
                Adicionar à rota
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { DeliveryFormData } from '@/stores/delivery'
import { validarNumero, validarNome } from '@/utils/validation'
import IconSprite from '@/components/IconSprite.vue'
import DeliveryAttributeToggle from '@/components/DeliveryAttributeToggle.vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'

interface Props {
  currentCount?: number
  maxLimit?: number
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: DeliveryFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const modalRef = ref<HTMLDivElement | null>(null)
const numInputRef = ref<HTMLInputElement | null>(null)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(modalRef, handleClose)

onMounted(() => {
  lockScroll()
  nextTick(() => {
    numInputRef.value?.focus()
  })
})
onUnmounted(() => {
  unlockScroll()
})

const formData = reactive<DeliveryFormData>({
  num: '',
  name: '',
  cidade: '',
  ap: false,
  manha: false,
  brinde: false,
})

const atributos: { key: 'ap' | 'manha' | 'brinde'; label: string; icon: string; activeClass: string; textActiveClass: string; borderColor: string; activeBgClass: string; darkActiveBgClass: string; darkTextActiveClass: string }[] = [
  { key: 'ap', label: 'Apartamento', icon: 'building', activeClass: 'bg-indigo-500 shadow-md shadow-indigo-500/25', textActiveClass: 'text-indigo-500', borderColor: '#6366f1', activeBgClass: 'bg-indigo-50/50', darkActiveBgClass: 'dark:bg-indigo-900/30', darkTextActiveClass: 'dark:text-indigo-400' },
  { key: 'manha', label: 'Manhã', icon: 'sun', activeClass: 'bg-amber-500 shadow-md shadow-amber-500/25', textActiveClass: 'text-amber-500', borderColor: '#f59e0b', activeBgClass: 'bg-amber-50/50', darkActiveBgClass: 'dark:bg-amber-900/30', darkTextActiveClass: 'dark:text-amber-400' },
  { key: 'brinde', label: 'Brinde', icon: 'gift', activeClass: 'bg-pink-500 shadow-md shadow-pink-500/25', textActiveClass: 'text-pink-500', borderColor: '#ec4899', activeBgClass: 'bg-pink-50/50', darkActiveBgClass: 'dark:bg-pink-900/30', darkTextActiveClass: 'dark:text-pink-400' },
]

const numeroError = ref<string>('')
const nomeError = ref<string>('')

const validateForm = () => {
  const numErr = formData.num ? validarNumero(formData.num) : null
  numeroError.value = numErr ?? ''

  const nomeErr = formData.name ? validarNome(formData.name) : null
  nomeError.value = nomeErr ?? ''
}

const isFormValid = computed(() => {
  return (
    formData.num.trim() !== '' &&
    !validarNumero(formData.num) &&
    formData.name.trim() !== '' &&
    !validarNome(formData.name) &&
    numeroError.value === '' &&
    nomeError.value === ''
  )
})

const isLimitReached = computed(() => {
  if (props.currentCount !== undefined && props.maxLimit !== undefined) {
    return props.currentCount >= props.maxLimit
  }
  return false
})

function handleClose() {
  emit('close')
}

const handleSubmit = () => {
  validateForm()
  if (isFormValid.value && !isLimitReached.value) {
    emit('submit', { ...formData })
  }
}
</script>


