<template>
  <Teleport to="body">
    <Transition name="panel-backdrop" appear>
      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="fixed inset-0 z-[1100] flex items-end justify-end p-4 sm:p-6 transition-all duration-300"
        @click.self="handleClose"
        @keydown.escape="handleClose"
      >
        <Transition name="panel-content" appear>
          <div
            class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform"
          >
        <div class="relative overflow-hidden">
          <div
            class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2463eb] via-[#1a4fc9] to-[#2463eb]"
          ></div>
          <div
            class="absolute inset-0 opacity-5 bg-linear-to-r from-[#2463eb] to-[#1a4fc9]"
          />
          <div class="relative p-5 pb-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3 flex-1">
                <div
                  class="w-10 h-10 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-blue-500/25 flex items-center justify-center shrink-0 shadow-lg"
                >
                  <IconSprite name="info" size="20" class="text-white" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-lg text-slate-800 leading-tight">{{ title }}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">{{ timeStr }}</p>
                </div>
              </div>
              <button
                ref="closeBtnRef"
                @click="handleClose"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Fechar"
              >
                <IconSprite name="x" size="18" />
              </button>
            </div>
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto custom-scroll">
          <div class="p-5 pt-2">
            <div v-if="mode === 'no-list'" class="flex flex-col items-center gap-3 py-4">
              <IconSprite name="box" size="32" class="text-slate-300" :stroke-width="1.5" />
              <span class="text-slate-400">Nenhuma lista criada. Use os botões "Amanhã" ou "Depois" para iniciar uma rota.</span>
            </div>

            <div v-else-if="mode === 'no-deliveries'" class="flex flex-col items-center gap-3 py-4">
              <IconSprite name="sun" size="32" class="text-amber-400" :stroke-width="1.5" />
              <span class="text-slate-400">Nenhuma entrega programada ainda.</span>
            </div>

            <DeliveryInfoList v-else-if="mode === 'delivery-list' && deliveriesData" :deliveries-data="deliveriesData" />

            <DeliveryInfoReport v-else-if="mode === 'report' && reportStats" :report-stats="reportStats" :report-date-str="reportDateStr ?? ''" />

          </div>
        </div>

      </div>
        </Transition>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import { useFocusTrap } from '@/composables/useFocusTrap'
import type { InfoPanelMode } from '@/composables/useUIState'
import type { ReportStats, DeliveryListData } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'
import DeliveryInfoList from '@/components/DeliveryInfoList.vue'
import DeliveryInfoReport from '@/components/DeliveryInfoReport.vue'

defineProps<{
  title: string
  mode: InfoPanelMode
  deliveriesData?: DeliveryListData | null
  reportStats?: ReportStats | null
  reportDateStr?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)
const closeBtnRef = ref<HTMLButtonElement | null>(null)

const { lock: lockScroll, unlock: unlockScroll } = useBodyScrollLock()
useFocusTrap(panelRef)

const timeStr = ref('')

let timeInterval: ReturnType<typeof setInterval> | null = null

const handleClose = () => {
  emit('close')
}

onMounted(() => {
  lockScroll()
  nextTick(() => {
    closeBtnRef.value?.focus()
  })
  const update = () => {
    timeStr.value = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  update()
  timeInterval = setInterval(update, 30000)
})

onUnmounted(() => {
  unlockScroll()
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.panel-backdrop-enter-active,
.panel-backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.panel-backdrop-enter-from,
.panel-backdrop-leave-to {
  opacity: 0;
}

.panel-content-enter-active,
.panel-content-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.panel-content-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.panel-content-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
