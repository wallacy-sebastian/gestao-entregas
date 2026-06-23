<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between pb-2 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-slate-500">Total de entregas</span>
        <span class="text-2xl font-bold text-[#2463eb]">{{ deliveriesData.total }}</span>
      </div>
      <button
        @click="copyDeliveries"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white text-xs font-medium rounded-lg hover:shadow-md transition-all cursor-pointer"
      >
        <IconSprite name="copy" size="14" />
        {{ copyBtnText }}
      </button>
    </div>
    <div class="space-y-2 pr-2 custom-scroll">
      <div
        v-for="(item, idx) in deliveriesData.list"
        :key="idx"
        class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <span class="flex-shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-[#2463eb] to-[#1a4fc9] text-white text-xs font-bold flex items-center justify-center shadow-sm">{{ idx + 1 }}</span>
        <div class="flex-1">
          <div class="font-medium text-slate-800">{{ item.num }}: {{ item.name }}</div>
          <div class="flex gap-2 mt-1">
            <span v-if="item.ap" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
              <IconSprite name="building" size="10" />
              AP
            </span>
            <span v-if="item.manha" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
              <IconSprite name="sun" size="10" />
              Manhã
            </span>
            <span v-if="item.brinde" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600">
              <IconSprite name="gift" size="10" />
              Brinde
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composables/useCopy'
import type { DeliveryListData } from '@/stores/delivery'
import IconSprite from '@/components/IconSprite.vue'

const props = defineProps<{
  deliveriesData: DeliveryListData
}>()

const { copyBtnText, copyText } = useCopy()

const copyDeliveries = () => {
  const lines = props.deliveriesData.list.map((d) => `- ${d.num}: ${d.name}`).join('\n')
  const text = `Bom dia!\n${props.deliveriesData.total} entregas\n${lines}`
  copyText(text)
}
</script>
