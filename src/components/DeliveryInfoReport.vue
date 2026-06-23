<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <IconSprite name="calendar-days" size="18" class="text-[#2463eb]" />
        <span class="text-sm font-medium text-slate-600">{{ reportDateStr }}</span>
      </div>
      <button
        @click="copyReport"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white text-xs font-medium rounded-lg hover:shadow-md transition-all cursor-pointer"
      >
        <IconSprite name="copy" size="14" />
        {{ copyBtnText }}
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
        <div class="text-xs text-slate-500 mb-1">Total entregas</div>
        <div class="text-2xl font-bold text-slate-800">{{ reportStats.total }}</div>
        <div class="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <IconSprite name="box" size="12" />
          pedidos
        </div>
      </div>
      <div class="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-3">
        <div class="text-xs text-slate-500 mb-1">Manhã</div>
        <div class="text-2xl font-bold text-amber-600">{{ reportStats.manha }}</div>
        <div class="text-xs text-slate-400 mt-1">{{ percentStr(reportStats.manha) }}% do total</div>
      </div>
      <div class="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
        <div class="text-xs text-slate-500 mb-1">Apartamentos</div>
        <div class="text-2xl font-bold text-indigo-600">{{ reportStats.ap }}</div>
        <div class="text-xs text-slate-400 mt-1">{{ percentStr(reportStats.ap) }}% do total</div>
      </div>
      <div class="bg-linear-to-br from-pink-50 to-rose-50 rounded-xl p-3">
        <div class="text-xs text-slate-500 mb-1">Brindes</div>
        <div class="text-2xl font-bold text-pink-600">{{ reportStats.brinde }}</div>
        <div class="text-xs text-slate-400 mt-1">{{ percentStr(reportStats.brinde) }}% do total</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composables/useCopy'
import type { ReportStats } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'

const props = defineProps<{
  reportStats: ReportStats
  reportDateStr: string
}>()

const { copyBtnText, copyText } = useCopy('📋 Copiar relatório')

const percentStr = (count: number): string => {
  const total = props.reportStats?.total ?? 0
  return total ? String(Math.round((count / total) * 100)) : '0'
}

const copyReport = () => {
  const text = `Bom dia!\n${props.reportStats.total} entregas\n- ${props.reportStats.manha} de manhã\n- ${props.reportStats.ap} apartamentos\n- ${props.reportStats.brinde} brindes`
  copyText(text)
}
</script>
