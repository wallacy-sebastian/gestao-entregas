<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
        @click.self="handleClose"
      >
        <Transition name="panel-content" appear>
          <div
            class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform border border-white/20 dark:border-gray-700/50"
          >
            <div class="relative overflow-hidden">
              <div
                class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2463eb] via-[#1a4fc9] to-[#2463eb]"
              ></div>
              <div class="relative pt-6 px-6 pb-3">
                  <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 flex-1">
                    <div
                      class="w-10 h-10 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center shrink-0"
                    >
                      <IconSprite name="info" size="20" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-xl text-slate-800 dark:text-gray-100">{{ title }}</h3>
                      <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ timeStr }}</p>
                    </div>
                  </div>
                  <button
                    ref="closeBtnRef"
                    @click="handleClose"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
                    aria-label="Fechar"
                  >
                    <IconSprite name="x" size="18" />
                  </button>
                </div>
              </div>
            </div>

            <div class="max-h-[60vh] overflow-y-auto custom-scroll">
              <div class="p-5 pt-2">
                <DeliveryEmptyState v-if="mode === 'no-list'" compact />

                <DeliveryEmptyState v-else-if="mode === 'no-deliveries'" :has-list="true" compact />

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
import DeliveryEmptyState from '@/components/DeliveryEmptyState.vue'
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
useFocusTrap(panelRef, handleClose)

const timeStr = ref('')

let timeInterval: ReturnType<typeof setInterval> | null = null

function handleClose() {
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


