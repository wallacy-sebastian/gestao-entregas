<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1300] max-w-[90%]"
      >
        <div
          class="flex items-center gap-2.5 rounded-xl py-3 px-5 shadow-2xl whitespace-nowrap"
          :class="isError ? 'bg-rose-50 border-l-4 border-l-rose-500' : 'bg-white border-l-4 border-l-[#2463eb]'"
        >
          <IconSprite v-if="isError" name="alert-circle" size="18" class="text-rose-500 shrink-0" />
          <IconSprite v-else name="info" size="18" class="text-[#2463eb] shrink-0" />
          <span
            class="font-sans text-sm font-semibold"
            :class="isError ? 'text-rose-700' : 'text-slate-700'"
          >{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useNotification } from '@/composables/useNotification'
import IconSprite from '@/components/IconSprite.vue'

const { mensagemNotificacao, tipoNotificacao } = useNotification()

const visible = ref(false)
const message = ref('')
const isError = computed(() => tipoNotificacao.value === 'error')

let timer: ReturnType<typeof setTimeout> | null = null

watch(
  mensagemNotificacao,
  (val) => {
    if (timer) clearTimeout(timer)
    if (val) {
      message.value = val
      visible.value = true
      timer = setTimeout(() => {
        visible.value = false
      }, 3200)
    } else {
      visible.value = false
    }
  },
)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
