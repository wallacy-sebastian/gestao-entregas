<template>
  <Teleport to="body">
    <Transition name="modal-backdrop" appear>
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-label="Nova lista"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleCancel"
        @keydown.escape="handleCancel"
      >
        <Transition name="modal-content" appear>
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform border border-white/20"
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
                <IconSprite name="alert-circle" size="20" class="text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Nova lista</h3>
                <p class="text-xs text-slate-500 mt-0.5">Confirmar criação de lista</p>
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

        <div class="p-6">
          <p class="text-slate-700">
            Já existe uma lista com <strong>{{ listLength }}</strong> pedido(s). Deseja criar uma nova e descartar os dados atuais?
          </p>
        </div>

        <div class="flex gap-3 p-6 pt-0 border-t border-slate-200">
          <button
            ref="cancelBtnRef"
            @click="handleCancel"
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02]"
          >
            <IconSprite name="check" size="18" :stroke-width="2.5" />
            Confirmar
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

defineProps<{
  listLength: number
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const modalRef = ref<HTMLDivElement | null>(null)
const cancelBtnRef = ref<HTMLButtonElement | null>(null)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(modalRef)

onMounted(() => {
  lockScroll()
  nextTick(() => {
    cancelBtnRef.value?.focus()
  })
})
onUnmounted(() => {
  unlockScroll()
})

const handleConfirm = () => {
  emit('confirm')
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


