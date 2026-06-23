<template>
  <div
    class="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 p-4 md:p-5 mb-6 transition-all duration-300"
  >
    <div class="grid grid-cols-2 gap-3 md:flex md:items-center md:justify-between md:gap-4">
      <div v-for="(grupo, gi) in grupos" :key="gi" class="contents md:flex md:gap-2.5">
        <button
          v-for="(btn, bi) in grupo"
          :key="bi"
          :class="[
            'rounded-xl px-4 py-3 md:px-5 md:py-2.5 text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2',
            variantes[btn.variant],
          ]"
          @click="btn.acao"
        >
          <IconSprite :name="btn.icone" />
          <span class="hidden md:inline">{{ btn.rotulo }}</span>
          <span class="md:hidden">{{ btn.rotuloMobile || btn.rotulo }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSprite from '@/components/IconSprite.vue'

const emit = defineEmits<{
  (e: 'novo', days: number): void
  (e: 'ver-entregas'): void
  (e: 'relatorio'): void
  (e: 'remover-modal'): void
  (e: 'abrir-modal'): void
}>()

const variantes: Record<string, string> = {
  primary:
    'bg-linear-to-r from-[#2463eb] to-[#1a4fc9] text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-[#2463eb] hover:text-[#2463eb] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  danger:
    'bg-linear-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  'primary-green':
    'bg-linear-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0',
}

const grupos = [
  [
    { icone: 'calendar-plus', rotulo: 'Amanhã', acao: () => emit('novo', 1), variant: 'primary' },
    { icone: 'calendar-days', rotulo: 'Depois', acao: () => emit('novo', 2), variant: 'primary' },
  ],
  [
    { icone: 'clipboard-list', rotulo: 'Ver entregas', rotuloMobile: 'Ver', acao: () => emit('ver-entregas'), variant: 'outline' },
    { icone: 'pie-chart', rotulo: 'Relatório', acao: () => emit('relatorio'), variant: 'outline' },
  ],
  [
    { icone: 'trash-2', rotulo: 'Remover', acao: () => emit('remover-modal'), variant: 'danger' },
    { icone: 'plus-circle', rotulo: 'Adicionar', acao: () => emit('abrir-modal'), variant: 'primary-green' },
  ],
]
</script>
