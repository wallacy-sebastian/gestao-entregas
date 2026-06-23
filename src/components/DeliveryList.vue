<template>
  <div
    class="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300"
  >
    <div
      class="bg-linear-to-r from-slate-50 via-white to-blue-50/50 px-6 py-4 border-b border-slate-200/80"
    >
      <div class="flex justify-between items-center flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-md shadow-blue-500/25 flex items-center justify-center"
          >
            <IconSprite name="box" size="18" class="text-white" />
          </div>
          <div>
            <h2 class="font-semibold text-lg text-slate-800">Rota ativa</h2>
            <p class="text-xs text-slate-400 mt-0.5">Entregas programadas</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="bg-linear-to-r from-[#2463eb]/10 to-[#1a4fc9]/10 py-1.5 px-3.5 rounded-full text-xs font-medium text-[#2463eb] font-mono flex items-center gap-1.5"
          >
            <IconSprite name="list" size="12" />
            <span>{{ limitBadgeText }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5" v-if="hasValidDeliveries">
      <div
        class="mb-6 p-4 rounded-xl bg-linear-to-r from-slate-50 to-blue-50/30 border border-slate-100"
      >
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <IconSprite name="calendar-days" size="18" class="text-[#2463eb]" />
            </div>
            <div>
              <div class="font-semibold text-slate-800">{{ formattedDate }}</div>
              <div class="text-xs text-slate-400">{{ diaSemana }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 text-xs font-medium text-slate-600 shadow-sm"
            >
              <IconSprite name="clock" size="12" />
              {{ filledCount }} entregas
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="(item, idx) in deliveries"
          :key="idx"
          class="group relative bg-white rounded-xl border border-slate-200 hover:border-[#2463eb]/30 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center p-3 gap-3">
            <div class="shrink-0">
              <div
                class="w-9 h-9 rounded-full bg-linear-to-br from-[#2463eb] to-[#1a4fc9] text-white font-bold text-sm flex items-center justify-center shadow-sm"
              >
                {{ idx + 1 }}
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center flex-wrap gap-2 mb-1">
                <span class="font-mono font-bold text-slate-800 text-sm">{{
                  item.num
                }}</span>
                <span class="text-slate-600 text-sm truncate">{{ item.name }}</span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-if="item.ap"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600"
                >
                  <IconSprite name="building" size="10" />
                  Apartamento
                </span>
                <span
                  v-if="item.manha"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600"
                >
                  <IconSprite name="sun" size="10" />
                  Manhã
                </span>
                <span
                  v-if="item.brinde"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-600"
                >
                  <IconSprite name="gift" size="10" />
                  Brinde
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="availableSlotsCount > 0" class="mt-4">
        <div class="flex items-center gap-2 mb-2">
          <div
            class="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent"
          ></div>
          <span class="text-xs font-medium text-slate-400 px-2">VAGAS DISPONÍVEIS</span>
          <div
            class="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent"
          ></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <div
            v-for="i in availableSlotsCount"
            :key="'slot-' + i"
            class="bg-slate-50/50 rounded-lg p-2 text-center border border-dashed border-slate-200"
          >
            <span class="text-xs text-slate-400">{{ filledCount + i }}</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-3 border-t border-slate-100">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-[#2463eb]"></span>
              {{ filledCount }} de {{ limit }} ocupadas
            </span>
            <span class="flex items-center gap-1">
              <IconSprite name="clock" size="12" />
              Última atualização: {{ lastUpdateTime }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <DeliveryEmptyState v-else :has-list="hasList" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Delivery } from '@/stores/delivery'
import { pad, formatDate, DIAS } from '@/utils/format'
import IconSprite from '@/components/IconSprite.vue'
import DeliveryEmptyState from '@/components/DeliveryEmptyState.vue'

interface Props {
  deliveries: Delivery[]
  limit: number
  date: Date | null
}

const props = defineProps<Props>()

const lastUpdateTime = ref<string>(getCurrentTime())

function getCurrentTime(): string {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const filledCount = computed<number>(() => props.deliveries.length)

const hasList = computed<boolean>(() => {
  return props.date instanceof Date && !isNaN(props.date.getTime())
})

const hasValidDeliveries = computed<boolean>(() => {
  return hasList.value && props.deliveries.length > 0
})

const availableSlotsCount = computed<number>(() => {
  if (!props.limit || props.limit <= 0) return 0
  return Math.max(0, props.limit - filledCount.value)
})

const formattedDate = computed<string>(() => {
  const d = props.date
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return 'Data não definida'
  return formatDate(d)
})

const diaSemana = computed<string>(() => {
  const d = props.date
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return ''
  return DIAS[d.getDay()] || ''
})

const limitBadgeText = computed<string>(() => {
  const total = props.limit && !isNaN(props.limit) && props.limit > 0 ? props.limit : 0
  return `${filledCount.value}/${total} entregas`
})

function updateLastUpdateTime(): void {
  lastUpdateTime.value = getCurrentTime()
}

watch(() => props.deliveries.length, () => {
  updateLastUpdateTime()
})
</script>
