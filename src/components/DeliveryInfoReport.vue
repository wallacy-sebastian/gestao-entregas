<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <IconSprite name="calendar-days" size="18" class="text-[#2463eb]" />
        <span class="text-sm font-medium text-slate-600 dark:text-gray-300">{{ reportDateStr }}</span>
      </div>
      <button
        @click="copyReport"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white text-xs font-medium rounded-xl hover:shadow-md transition-all cursor-pointer"
      >
        <IconSprite name="copy" size="14" />
        {{ copyBtnText }}
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl p-3">
        <div class="text-xs text-slate-500 dark:text-gray-400 mb-1">Total de entregas</div>
        <div class="text-2xl font-bold text-slate-800 dark:text-gray-100">{{ reportStats.total }}</div>
        <div class="text-xs text-slate-400 dark:text-gray-500 mt-1 flex items-center gap-1">
          <IconSprite name="box" size="12" />
          pedidos
        </div>
      </div>
      <div class="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-xl p-3">
        <div class="text-xs text-slate-500 dark:text-gray-400 mb-1">Manhã</div>
        <div class="text-2xl font-bold text-amber-600">{{ reportStats.manha }}</div>
        <div class="text-xs text-slate-400 dark:text-gray-500 mt-1">{{ percentStr('manha') }}% do total</div>
      </div>
      <div class="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-3">
        <div class="text-xs text-slate-500 dark:text-gray-400 mb-1">Apartamentos</div>
        <div class="text-2xl font-bold text-indigo-600">{{ reportStats.ap }}</div>
        <div class="text-xs text-slate-400 dark:text-gray-500 mt-1">{{ percentStr('ap') }}% do total</div>
      </div>
      <div class="bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40 rounded-xl p-3">
        <div class="text-xs text-slate-500 dark:text-gray-400 mb-1">Brindes</div>
        <div class="text-2xl font-bold text-pink-600">{{ reportStats.brinde }}</div>
        <div class="text-xs text-slate-400 dark:text-gray-500 mt-1">{{ percentStr('brinde') }}% do total</div>
      </div>
    </div>
    <div v-if="cidadeEntries.length" class="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-xl p-3 col-span-2">
      <div class="text-xs text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1">
        <IconSprite name="map-pin" size="12" />
        Por cidade
      </div>
      <div class="space-y-1">
        <div v-for="[cidade, count] in cidadeEntries" :key="cidade" class="flex items-center gap-2 text-sm">
          <span class="font-bold text-emerald-600 min-w-[2ch] tabular-nums">{{ count }}</span>
          <span class="text-slate-600 dark:text-gray-300">{{ cidade }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCopy } from '@/composables/useCopy'
import type { ReportStats } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'

const props = defineProps<{
  reportStats: ReportStats
  reportDateStr: string
}>()

const { copyBtnText, copyText } = useCopy('Copiar relatório')

const cidadeEntries = computed<[string, number][]>(() => {
  const cidades = props.reportStats?.cidades
  if (!cidades) return []
  return Object.entries(cidades).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})

const percentageMap = computed<{ manha: string; ap: string; brinde: string }>(() => {
  const s = props.reportStats
  const map = { manha: '0', ap: '0', brinde: '0' }
  if (!s?.total) return map
  const values = [s.manha, s.ap, s.brinde]
  const raw = values.map((v) => (v / s.total) * 100)
  const rounded = raw.map((v) => Math.round(v))
  const sum = rounded.reduce((a, b) => a + b, 0)
  if (sum !== 100 && rounded.length > 0) {
    const diff = 100 - sum
    const idx = raw.indexOf(Math.max(...raw))
    if (idx >= 0) rounded[idx]! += diff
  }
  map.manha = String(rounded[0] ?? 0)
  map.ap = String(rounded[1] ?? 0)
  map.brinde = String(rounded[2] ?? 0)
  return map
})

const percentStr = (key: 'manha' | 'ap' | 'brinde'): string => {
  if (!props.reportStats?.total) return '0'
  return percentageMap.value[key]
}

const copyReport = () => {
  let text = `Bom dia!\n${props.reportStats.total} entregas\n- ${props.reportStats.manha} de manhã\n- ${props.reportStats.ap} apartamentos\n- ${props.reportStats.brinde} brindes`
  if (cidadeEntries.value.length) {
    text += '\n' + cidadeEntries.value.map(([c, n]) => `- ${n} ${c}`).join('\n')
  }
  copyText(text)
}
</script>
